import { describe, expect, it } from 'vitest';
import { DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { ClientOperationId, EntradaId, UserId } from '../../domain/model/Identifier.js';
import { DiarioDePrueba } from '../../pruebas/diarioDePrueba.js';
import { ConsultarCartasEnEsperaUseCaseImpl } from './ConsultarCartasEnEsperaUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA = '22222222-2222-4222-9222-222222222222';

let contador = 0;
function guardar(
  diario: DiarioDePrueba,
  dia: string,
  extra: { dueno?: string; cartaAManana?: boolean; cartaAbiertaEn?: Date } = {},
): string {
  contador += 1;
  const id = '33333333-3333-4333-a333-' + String(contador).padStart(12, '0');
  const escrita = new Date(`${dia}T15:00:00.000Z`);
  const { dueno = PERSONA, cartaAManana = true, cartaAbiertaEn } = extra;

  diario.agregar(
    EntradaDeDiario.guardada({
      id: new EntradaId(id),
      userId: new UserId(dueno),
      clientOperationId: new ClientOperationId('44444444-4444-4444-b444-' + id.slice(-12)),
      dia,
      documento: DocumentoDelDiario.desdeTextoPlano('Un texto que no debe salir'),
      cartaAManana,
      cartaAbiertaEn,
      version: 1,
      creadaEn: escrita,
      editadaEn: escrita,
    }),
  );

  return id;
}

// 10 a. m. del 10 de octubre en Bogota.
const AHORA = new Date('2026-10-10T15:00:00.000Z');

function armar(ahora: Date = AHORA) {
  const diario = new DiarioDePrueba();

  return {
    diario,
    consultar: (persona = PERSONA, zonaHoraria = 'America/Bogota') =>
      new ConsultarCartasEnEsperaUseCaseImpl(diario, () => ahora).execute({
        userId: persona,
        zonaHoraria,
      }),
  };
}

describe('ConsultarCartasEnEsperaUseCaseImpl (SCRUM-230)', () => {
  it('ofrece la de ayer, sin su texto', async () => {
    const { diario, consultar } = armar();
    const id = guardar(diario, '2026-10-09');

    const cartas = await consultar();

    expect(cartas).toEqual([{ id: new EntradaId(id), dia: '2026-10-09' }]);
    expect(JSON.stringify(cartas)).not.toContain('Un texto que no debe salir');
  });

  it('la de hoy todavia no: aparece manana y hoy no', async () => {
    const { diario, consultar } = armar();

    guardar(diario, '2026-10-10');

    expect(await consultar()).toEqual([]);
  });

  it('una carta de hace varios dias sigue esperando, hasta una semana', async () => {
    const { diario, consultar } = armar();
    const id = guardar(diario, '2026-10-03');

    expect((await consultar()).map((carta) => carta.id.value)).toEqual([id]);
  });

  it('pasada la semana ya no se ofrece: vuelve al diario como cualquier anotacion', async () => {
    const { diario, consultar } = armar();

    guardar(diario, '2026-10-02');

    expect(await consultar()).toEqual([]);
  });

  it('la mas reciente va primero', async () => {
    const { diario, consultar } = armar();
    const vieja = guardar(diario, '2026-10-05');
    const reciente = guardar(diario, '2026-10-09');

    expect((await consultar()).map((carta) => carta.id.value)).toEqual([reciente, vieja]);
  });

  it('no ofrece las abiertas, ni las anotaciones corrientes, ni las de otra persona', async () => {
    const { diario, consultar } = armar();

    guardar(diario, '2026-10-09', { cartaAbiertaEn: new Date('2026-10-10T13:00:00.000Z') });
    guardar(diario, '2026-10-09', { cartaAManana: false });
    guardar(diario, '2026-10-09', { dueno: OTRA });

    expect(await consultar()).toEqual([]);
  });

  it('el dia es el de la persona: 9 p. m. en Bogota ya es el dia siguiente en Madrid', async () => {
    // 9 p. m. del 9 de octubre en Bogota = 4 a. m. del 10 en Madrid.
    const { diario, consultar } = armar(new Date('2026-10-10T02:00:00.000Z'));

    guardar(diario, '2026-10-09');

    expect(await consultar(PERSONA, 'America/Bogota')).toEqual([]);
    expect(await consultar(PERSONA, 'Europe/Madrid')).toHaveLength(1);
  });
});
