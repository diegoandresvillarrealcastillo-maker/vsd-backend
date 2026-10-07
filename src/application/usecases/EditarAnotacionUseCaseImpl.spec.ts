import { describe, expect, it } from 'vitest';
import { DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import {
  EditWindowClosedError,
  JournalEntryNotFoundError,
  StaleJournalEntryError,
} from '../../domain/model/DomainError.js';
import { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { ClientOperationId, EntradaId, UserId } from '../../domain/model/Identifier.js';
import { DiarioDePrueba, documentoCon, LineasDePrueba } from '../../pruebas/diarioDePrueba.js';
import { EditarAnotacionUseCaseImpl } from './EditarAnotacionUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA = '22222222-2222-4222-9222-222222222222';
const ENTRADA = '33333333-3333-4333-a333-333333333333';
const ESCRITA = new Date('2026-10-03T15:00:00.000Z');

function minutosDespues(minutos: number): Date {
  return new Date(ESCRITA.getTime() + minutos * 60_000);
}

/** Un diario con una anotacion escrita a las 10 a. m. y un reloj que se puede mover. */
function armar() {
  const diario = new DiarioDePrueba();
  const reloj = { ahora: minutosDespues(10) };

  diario.agregar(
    EntradaDeDiario.guardada({
      id: new EntradaId(ENTRADA),
      userId: new UserId(PERSONA),
      clientOperationId: new ClientOperationId('44444444-4444-4444-b444-000000000001'),
      dia: '2026-10-03',
      titulo: 'Sabado',
      documento: DocumentoDelDiario.desdeTextoPlano('Desayune temprano'),
      version: 1,
      creadaEn: ESCRITA,
      editadaEn: ESCRITA,
    }),
  );

  const lineas = new LineasDePrueba();
  const casoDeUso = new EditarAnotacionUseCaseImpl(diario, lineas, () => reloj.ahora);

  return { diario, reloj, casoDeUso, lineas };
}

describe('EditarAnotacionUseCaseImpl', () => {
  it('dentro de la hora, guarda la correccion y sube la version', async () => {
    const { casoDeUso, diario } = armar();

    const { entrada } = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: 'America/Bogota',
      conRecomendaciones: false,
      entradaId: ENTRADA,
      version: 1,
      contenido: documentoCon('Desayune temprano y sali a caminar'),
    });

    expect(entrada.version).toBe(2);
    expect(entrada.titulo).toBe('Sabado');

    const guardada = await diario.porId(new UserId(PERSONA), new EntradaId(ENTRADA));

    expect(guardada?.documento.textoPlano()).toBe('Desayune temprano y sali a caminar');
  });

  describe('La hora del dispositivo (SCRUM-144)', () => {
    const peticion = (extra: Record<string, unknown> = {}) => ({
      userId: PERSONA,
      zonaHoraria: 'America/Bogota',
      conRecomendaciones: false,
      entradaId: ENTRADA,
      version: 1,
      contenido: documentoCon('Corregida sin conexion'),
      ...extra,
    });

    it('corregida a la media hora y recibida cinco horas despues, se aplica como correccion', async () => {
      const { casoDeUso, diario, reloj } = armar();

      reloj.ahora = minutosDespues(5 * 60);

      const { entrada } = await casoDeUso.execute(
        peticion({ editadaEn: minutosDespues(30).toISOString() }),
      );

      expect(entrada.version).toBe(2);
      expect(entrada.editadaEn).toEqual(minutosDespues(30));
      expect(entrada.creadaEn).toEqual(ESCRITA);

      const guardada = await diario.porId(new UserId(PERSONA), new EntradaId(ENTRADA));

      expect(guardada?.documento.textoPlano()).toBe('Corregida sin conexion');
    });

    it('hecha pasada la hora, no se aplica, llegue cuando llegue', async () => {
      const { casoDeUso, diario, reloj } = armar();

      reloj.ahora = minutosDespues(5 * 60);

      await expect(
        casoDeUso.execute(peticion({ editadaEn: minutosDespues(61).toISOString() })),
      ).rejects.toThrow(EditWindowClosedError);

      expect((await diario.porId(new UserId(PERSONA), new EntradaId(ENTRADA)))?.version).toBe(1);
    });

    it('el limite es exacto: a los 60 minutos ya no, un segundo antes si', async () => {
      const { casoDeUso, reloj } = armar();

      reloj.ahora = minutosDespues(5 * 60);

      await expect(
        casoDeUso.execute(peticion({ editadaEn: minutosDespues(60).toISOString() })),
      ).rejects.toThrow(EditWindowClosedError);

      const dentro = await casoDeUso.execute(
        peticion({ editadaEn: new Date(minutosDespues(60).getTime() - 1000).toISOString() }),
      );

      expect(dentro.entrada.version).toBe(2);
    });

    it('sin la hora del dispositivo se mide con la del servidor, como siempre', async () => {
      const { casoDeUso, reloj } = armar();

      reloj.ahora = minutosDespues(61);

      await expect(casoDeUso.execute(peticion())).rejects.toThrow(EditWindowClosedError);
    });

    it.each([
      ['mal formada', 'hace un rato'],
      ['un numero', 1_790_000_000_000],
      ['sin desplazamiento horario', '2026-10-03T15:30:00'],
      ['nula', null],
    ])('si es %s, se ignora y se usa la del servidor, sin error', async (_motivo, hora) => {
      const { casoDeUso, reloj } = armar();

      // Con el servidor dentro de la hora, se aplica con la hora del servidor.
      const { entrada } = await casoDeUso.execute(peticion({ editadaEn: hora }));

      expect(entrada.editadaEn).toEqual(reloj.ahora);

      // Con el servidor fuera de la hora, no hay con que salvarla.
      reloj.ahora = minutosDespues(61);

      await expect(casoDeUso.execute(peticion({ editadaEn: hora, version: 2 }))).rejects.toThrow(
        EditWindowClosedError,
      );
    });

    it('una hora en el futuro no alarga el plazo: se usa la del servidor', async () => {
      const { casoDeUso, reloj } = armar();

      reloj.ahora = minutosDespues(61);

      await expect(
        casoDeUso.execute(peticion({ editadaEn: minutosDespues(70).toISOString() })),
      ).rejects.toThrow(EditWindowClosedError);
    });

    it('un reloj adelantado unos minutos queda en "ahora"', async () => {
      const { casoDeUso, reloj } = armar();
      const adelantada = new Date(reloj.ahora.getTime() + 3 * 60_000).toISOString();

      const { entrada } = await casoDeUso.execute(peticion({ editadaEn: adelantada }));

      expect(entrada.editadaEn).toEqual(reloj.ahora);
    });

    it('no puede ser anterior a cuando se escribio la anotacion: se usa la del servidor', async () => {
      const { casoDeUso, reloj } = armar();

      const { entrada } = await casoDeUso.execute(
        peticion({ editadaEn: minutosDespues(-1).toISOString() }),
      );

      expect(entrada.editadaEn).toEqual(reloj.ahora);
    });

    it('justo cuando se escribio si vale', async () => {
      const { casoDeUso, reloj } = armar();

      reloj.ahora = minutosDespues(5 * 60);

      const { entrada } = await casoDeUso.execute(peticion({ editadaEn: ESCRITA.toISOString() }));

      expect(entrada.editadaEn).toEqual(ESCRITA);
    });

    it('una hora de hace mas de 30 dias se ignora', async () => {
      const { casoDeUso, reloj } = armar();

      // El servidor la ve 40 dias despues: la hora del dispositivo, aunque dentro de
      // la hora de la anotacion, es demasiado antigua para creerla.
      reloj.ahora = new Date(ESCRITA.getTime() + 40 * 24 * 60 * 60_000);

      await expect(
        casoDeUso.execute(peticion({ editadaEn: minutosDespues(30).toISOString() })),
      ).rejects.toThrow(EditWindowClosedError);
    });

    it('la hora de la edicion no va hacia atras aunque el otro dispositivo tenga el reloj atrasado', async () => {
      const { casoDeUso, reloj } = armar();

      reloj.ahora = minutosDespues(5 * 60);
      await casoDeUso.execute(peticion({ editadaEn: minutosDespues(30).toISOString() }));

      const { entrada } = await casoDeUso.execute(
        peticion({ version: 2, editadaEn: minutosDespues(10).toISOString() }),
      );

      expect(entrada.version).toBe(3);
      expect(entrada.editadaEn).toEqual(minutosDespues(30));
    });
  });

  it('pasada la hora responde fuera de plazo y no toca nada', async () => {
    const { casoDeUso, diario, reloj } = armar();
    reloj.ahora = minutosDespues(61);

    await expect(
      casoDeUso.execute({
        userId: PERSONA,
        zonaHoraria: 'America/Bogota',
        conRecomendaciones: false,
        entradaId: ENTRADA,
        version: 1,
        contenido: documentoCon('Algo que llego tarde'),
      }),
    ).rejects.toThrow(EditWindowClosedError);

    const guardada = await diario.porId(new UserId(PERSONA), new EntradaId(ENTRADA));

    expect(guardada?.version).toBe(1);
    expect(guardada?.documento.textoPlano()).toBe('Desayune temprano');
  });

  it('con una version vieja responde desactualizada y no pisa la otra edicion', async () => {
    const { casoDeUso, diario } = armar();

    await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: 'America/Bogota',
      conRecomendaciones: false,
      entradaId: ENTRADA,
      version: 1,
      contenido: documentoCon('Desde el celular'),
    });

    await expect(
      casoDeUso.execute({
        userId: PERSONA,
        zonaHoraria: 'America/Bogota',
        conRecomendaciones: false,
        entradaId: ENTRADA,
        version: 1,
        contenido: documentoCon('Desde el computador'),
      }),
    ).rejects.toThrow(StaleJournalEntryError);

    const guardada = await diario.porId(new UserId(PERSONA), new EntradaId(ENTRADA));

    expect(guardada?.documento.textoPlano()).toBe('Desde el celular');
  });

  it('la anotacion de otra persona responde igual que una que no existe', async () => {
    const { casoDeUso } = armar();

    await expect(
      casoDeUso.execute({
        userId: OTRA,
        zonaHoraria: 'America/Bogota',
        conRecomendaciones: false,
        entradaId: ENTRADA,
        version: 1,
        contenido: documentoCon('Intento'),
      }),
    ).rejects.toThrow(JournalEntryNotFoundError);
  });

  it('si la base no la deja pasar con la misma version, es que paso la hora', async () => {
    // El reloj de la API todavia la ve dentro de plazo, pero la base, que es
    // quien manda, ya no: devuelve que no guardo nada.
    const { casoDeUso, diario } = armar();
    diario.guardarEdicion = () => Promise.resolve(null);

    await expect(
      casoDeUso.execute({
        userId: PERSONA,
        zonaHoraria: 'America/Bogota',
        conRecomendaciones: false,
        entradaId: ENTRADA,
        version: 1,
        contenido: documentoCon('Justo en el limite'),
      }),
    ).rejects.toThrow(EditWindowClosedError);
  });

  it('con permiso, una correccion con una senal de riesgo trae las lineas', async () => {
    const { casoDeUso } = armar();

    const guardada = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: 'America/Bogota',
      conRecomendaciones: true,
      entradaId: ENTRADA,
      version: 1,
      titulo: 'No aguanto mas',
    });

    expect(guardada.sugiereAcompanamiento).toBe(true);
    expect(guardada.lineasDeAtencion[0]?.id).toBe('linea-192');
  });

  it.each([
    ['America/Bogota', 'CO'],
    ['Europe/Madrid', 'ES'],
    ['America/Lima', undefined],
  ])(
    'las lineas son las del pais de la zona de quien corrige: %s pide las de %s (SCRUM-124)',
    async (zonaHoraria, pais) => {
      const { casoDeUso, lineas } = armar();

      await casoDeUso.execute({
        userId: PERSONA,
        zonaHoraria,
        conRecomendaciones: true,
        entradaId: ENTRADA,
        version: 1,
        titulo: 'No aguanto mas',
      });

      expect(lineas.paises).toEqual([pais]);
    },
  );

  it('sin permiso, la correccion no se lee', async () => {
    const { casoDeUso } = armar();

    const guardada = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: 'America/Bogota',
      conRecomendaciones: false,
      entradaId: ENTRADA,
      version: 1,
      titulo: 'No aguanto mas',
    });

    expect(guardada.sugiereAcompanamiento).toBe(false);
    expect(guardada.lineasDeAtencion).toEqual([]);
  });

  it('adjuntos null quita los diagramas', async () => {
    const { casoDeUso } = armar();

    const { entrada } = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: 'America/Bogota',
      conRecomendaciones: false,
      entradaId: ENTRADA,
      version: 1,
      adjuntos: null,
    });

    expect(entrada.adjuntos).toEqual([]);
  });
});
