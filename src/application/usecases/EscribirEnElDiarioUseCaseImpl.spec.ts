import { describe, expect, it } from 'vitest';
import {
  FutureJournalDayError,
  InvalidIdentifierError,
  InvalidJournalEntryError,
} from '../../domain/model/DomainError.js';
import { EntradaId, UserId } from '../../domain/model/Identifier.js';
import { DiarioDePrueba, documentoCon, LineasDePrueba } from '../../pruebas/diarioDePrueba.js';
import { EscribirEnElDiarioUseCaseImpl } from './EscribirEnElDiarioUseCaseImpl.js';

const ZONA = 'America/Bogota';
const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA = '22222222-2222-4222-9222-222222222222';
// 9 p. m. del 2 de octubre en Bogota, que en UTC ya es el 3.
const AHORA = new Date('2026-10-03T02:00:00.000Z');

let contador = 0;
function operacion(): string {
  contador += 1;

  return '44444444-4444-4444-b444-' + String(contador).padStart(12, '0');
}

function armar(ahora: Date = AHORA) {
  const diario = new DiarioDePrueba();
  const lineas = new LineasDePrueba();
  let ids = 0;
  const casoDeUso = new EscribirEnElDiarioUseCaseImpl(
    diario,
    lineas,
    () => {
      ids += 1;

      return new EntradaId('33333333-3333-4333-a333-' + String(ids).padStart(12, '0'));
    },
    () => ahora,
  );

  return { diario, lineas, casoDeUso };
}

describe('EscribirEnElDiarioUseCaseImpl', () => {
  it('sin dia, la anotacion es de hoy en Colombia, no en UTC', async () => {
    const { casoDeUso } = armar();

    const { entrada } = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: ZONA,
      conRecomendaciones: false,
      clientOperationId: operacion(),
      contenido: documentoCon('Cene con mi familia'),
    });

    expect(entrada.dia).toBe('2026-10-02');
    expect(entrada.creadaEn).toEqual(AHORA);
  });

  it('sin dia, la anotacion es de hoy en la zona de quien la escribe (SCRUM-123)', async () => {
    const { casoDeUso } = armar();

    // El mismo instante: 9 p. m. del 2 de octubre en Bogota, 4 a. m. del 3 en
    // Madrid y 11 a. m. del 3 en Tokio.
    const bogota = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: 'America/Bogota',
      conRecomendaciones: false,
      clientOperationId: operacion(),
      contenido: documentoCon('desde Bogota'),
    });
    const madrid = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: 'Europe/Madrid',
      conRecomendaciones: false,
      clientOperationId: operacion(),
      contenido: documentoCon('desde Madrid'),
    });
    const tokio = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: 'Asia/Tokyo',
      conRecomendaciones: false,
      clientOperationId: operacion(),
      contenido: documentoCon('desde Tokio'),
    });

    expect(bogota.entrada.dia).toBe('2026-10-02');
    expect(madrid.entrada.dia).toBe('2026-10-03');
    expect(tokio.entrada.dia).toBe('2026-10-03');
  });

  it('un dia de manana en Bogota sigue siendo futuro, pero hoy en Madrid no lo es', async () => {
    const { casoDeUso } = armar();

    await expect(
      casoDeUso.execute({
        userId: PERSONA,
        zonaHoraria: 'America/Bogota',
        conRecomendaciones: false,
        clientOperationId: operacion(),
        dia: '2026-10-03',
        contenido: documentoCon('adelantada'),
      }),
    ).rejects.toThrow(FutureJournalDayError);

    const { entrada } = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: 'Europe/Madrid',
      conRecomendaciones: false,
      clientOperationId: operacion(),
      dia: '2026-10-03',
      contenido: documentoCon('ya es 3 en Madrid'),
    });

    expect(entrada.dia).toBe('2026-10-03');
  });

  it('se puede escribir en un dia pasado, con la hora real de creacion', async () => {
    const { casoDeUso } = armar();

    const { entrada } = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: ZONA,
      conRecomendaciones: false,
      clientOperationId: operacion(),
      dia: '2026-09-28',
      contenido: documentoCon('Me acorde de algo del domingo'),
    });

    expect(entrada.dia).toBe('2026-09-28');
    expect(entrada.creadaEn).toEqual(AHORA);
  });

  describe('La hora del dispositivo (SCRUM-144)', () => {
    // 9 p. m. del 2 de octubre en Bogota. El dispositivo escribio a las 9 a. m. de ese
    // dia, sin conexion, y la anotacion llega doce horas despues.
    const NUEVE_AM = '2026-10-02T14:00:00.000Z';
    const peticion = (extra: Record<string, unknown> = {}) => ({
      userId: PERSONA,
      zonaHoraria: ZONA,
      conRecomendaciones: false,
      clientOperationId: operacion(),
      contenido: documentoCon('Escrita sin conexion'),
      ...extra,
    });

    it('escrita a las 9:00 y recibida doce horas despues, la anotacion muestra las 9:00', async () => {
      const { casoDeUso } = armar();

      const { entrada } = await casoDeUso.execute(peticion({ escritaEn: NUEVE_AM }));

      expect(entrada.creadaEn).toEqual(new Date(NUEVE_AM));
      expect(entrada.editadaEn).toEqual(new Date(NUEVE_AM));
      expect(entrada.dia).toBe('2026-10-02');
    });

    it('y se puede corregir hasta una hora despues de las 9:00, no de cuando llego', async () => {
      const { casoDeUso } = armar();

      const { entrada } = await casoDeUso.execute(peticion({ escritaEn: NUEVE_AM }));

      expect(entrada.editableHasta()).toEqual(new Date('2026-10-02T15:00:00.000Z'));
    });

    it('sin la hora del dispositivo, es la del servidor, como siempre', async () => {
      const { casoDeUso } = armar();

      const { entrada } = await casoDeUso.execute(peticion());

      expect(entrada.creadaEn).toEqual(AHORA);
    });

    it.each([
      ['mal formada', 'ayer'],
      ['un numero', 1_790_000_000_000],
      ['un objeto', {}],
      ['nula', null],
      ['sin desplazamiento horario', '2026-10-02T14:00:00'],
      ['un dia que no existe', '2026-02-30T14:00:00Z'],
      ['en el futuro', '2026-10-03T03:00:00Z'],
      ['de hace mas de 30 dias', '2026-08-01T14:00:00Z'],
    ])('si es %s, se ignora y se usa la del servidor, sin error', async (_motivo, hora) => {
      const { casoDeUso } = armar();

      const { entrada } = await casoDeUso.execute(peticion({ escritaEn: hora }));

      expect(entrada.creadaEn).toEqual(AHORA);
      expect(entrada.editadaEn).toEqual(AHORA);
    });

    it('una hora de hace 30 dias se respeta y de hace 30 dias y un milisegundo, no', async () => {
      const { casoDeUso } = armar();
      const limite = new Date(AHORA.getTime() - 30 * 24 * 60 * 60 * 1000);

      const justo = await casoDeUso.execute(
        peticion({ dia: '2026-09-02', escritaEn: limite.toISOString() }),
      );
      const pasado = await casoDeUso.execute(
        peticion({ dia: '2026-09-02', escritaEn: new Date(limite.getTime() - 1).toISOString() }),
      );

      expect(justo.entrada.creadaEn).toEqual(limite);
      expect(pasado.entrada.creadaEn).toEqual(AHORA);
    });

    it('un reloj adelantado unos minutos queda en "ahora", no en el futuro', async () => {
      const { casoDeUso } = armar();
      const adelantada = new Date(AHORA.getTime() + 3 * 60_000).toISOString();

      const { entrada } = await casoDeUso.execute(peticion({ escritaEn: adelantada }));

      expect(entrada.creadaEn).toEqual(AHORA);
    });

    it('nunca antes de que empiece el dia de la anotacion, en el calendario de quien la escribe', async () => {
      const { casoDeUso } = armar();
      // La medianoche del 2 de octubre en Bogota (UTC-5) es a las 05:00 UTC.
      const antes = await casoDeUso.execute(
        peticion({ dia: '2026-10-02', escritaEn: '2026-10-02T04:59:59.999Z' }),
      );
      const justo = await casoDeUso.execute(
        peticion({ dia: '2026-10-02', escritaEn: '2026-10-02T05:00:00.000Z' }),
      );

      expect(antes.entrada.creadaEn).toEqual(AHORA);
      expect(justo.entrada.creadaEn).toEqual(new Date('2026-10-02T05:00:00.000Z'));
    });

    it('el comienzo del dia es el de la zona de la persona, no el de Colombia', async () => {
      const { casoDeUso } = armar();
      // En Tokio (UTC+9) el 3 de octubre empieza el 2 a las 15:00 UTC, y ya es 3 alli.
      const antes = await casoDeUso.execute(
        peticion({
          zonaHoraria: 'Asia/Tokyo',
          dia: '2026-10-03',
          escritaEn: '2026-10-02T14:59:59.999Z',
        }),
      );
      const justo = await casoDeUso.execute(
        peticion({
          zonaHoraria: 'Asia/Tokyo',
          dia: '2026-10-03',
          escritaEn: '2026-10-02T15:00:00.000Z',
        }),
      );

      expect(antes.entrada.creadaEn).toEqual(AHORA);
      expect(justo.entrada.creadaEn).toEqual(new Date('2026-10-02T15:00:00.000Z'));
    });

    it('para un dia pasado, la hora puede ser cualquiera desde el comienzo de ese dia', async () => {
      const { casoDeUso } = armar();

      const { entrada } = await casoDeUso.execute(
        peticion({ dia: '2026-09-28', escritaEn: '2026-10-02T20:00:00Z' }),
      );

      expect(entrada.dia).toBe('2026-09-28');
      expect(entrada.creadaEn).toEqual(new Date('2026-10-02T20:00:00Z'));
    });

    it('un reintento devuelve lo que ya se guardo, con la hora de entonces', async () => {
      const { casoDeUso } = armar();
      const primera = peticion({ escritaEn: NUEVE_AM });

      await casoDeUso.execute(primera);
      const reintento = await casoDeUso.execute({
        ...primera,
        escritaEn: '2026-10-02T20:00:00.000Z',
      });

      expect(reintento.entrada.creadaEn).toEqual(new Date(NUEVE_AM));
    });

    it('un dia que no es una fecha real sigue rechazandose con su error, tenga hora o no', async () => {
      const { casoDeUso } = armar();

      await expect(
        casoDeUso.execute(peticion({ dia: '2026-02-30', escritaEn: NUEVE_AM })),
      ).rejects.toThrow(InvalidJournalEntryError);
      await expect(
        casoDeUso.execute(peticion({ dia: 'manana', escritaEn: NUEVE_AM })),
      ).rejects.toThrow(InvalidJournalEntryError);
    });

    it('un dia futuro sigue rechazandose aunque la hora sirva', async () => {
      const { casoDeUso } = armar();

      await expect(
        casoDeUso.execute(peticion({ dia: '2026-10-05', escritaEn: NUEVE_AM })),
      ).rejects.toThrow(FutureJournalDayError);
    });
  });

  it('en un dia futuro no', async () => {
    const { casoDeUso, diario } = armar();

    await expect(
      casoDeUso.execute({
        userId: PERSONA,
        zonaHoraria: ZONA,
        conRecomendaciones: false,
        clientOperationId: operacion(),
        dia: '2026-10-03',
        contenido: documentoCon('Manana'),
      }),
    ).rejects.toThrow(FutureJournalDayError);
    expect(await diario.todasDe(new UserId(PERSONA))).toHaveLength(0);
  });

  it('el mismo clientOperationId devuelve la misma anotacion, sin duplicarla', async () => {
    const { casoDeUso, diario } = armar();
    const op = operacion();

    const primera = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: ZONA,
      conRecomendaciones: false,
      clientOperationId: op,
      contenido: documentoCon('Una vez'),
    });
    const segunda = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: ZONA,
      conRecomendaciones: false,
      clientOperationId: op,
      contenido: documentoCon('Una vez'),
    });

    expect(segunda.entrada.id.equals(primera.entrada.id)).toBe(true);
    expect(await diario.todasDe(new UserId(PERSONA))).toHaveLength(1);
  });

  it('la operacion es por persona: la misma clave de otra crea la suya', async () => {
    const { casoDeUso, diario } = armar();
    const op = operacion();

    await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: ZONA,
      conRecomendaciones: false,
      clientOperationId: op,
      contenido: documentoCon('A'),
    });
    await casoDeUso.execute({
      userId: OTRA,
      zonaHoraria: ZONA,
      conRecomendaciones: false,
      clientOperationId: op,
      contenido: documentoCon('B'),
    });

    expect(await diario.todasDe(new UserId(OTRA))).toHaveLength(1);
  });

  it('sin senal de riesgo no hay lineas, y ni se consultan', async () => {
    const { casoDeUso, lineas } = armar();

    const guardada = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: ZONA,
      conRecomendaciones: false,
      clientOperationId: operacion(),
      contenido: documentoCon('Un dia tranquilo'),
    });

    expect(guardada.sugiereAcompanamiento).toBe(false);
    expect(guardada.lineasDeAtencion).toEqual([]);
    expect(lineas.consultas).toBe(0);
  });

  it('sin permiso, el diario no se lee: ni sugerencia ni lineas, aunque haya una senal', async () => {
    // La decision de Diego (SCRUM-108): nadie se mete en el diario de nadie.
    const { casoDeUso, lineas } = armar();

    const guardada = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: ZONA,
      conRecomendaciones: false,
      clientOperationId: operacion(),
      contenido: documentoCon('Hoy pense que no quiero seguir viviendo'),
    });

    expect(guardada.sugiereAcompanamiento).toBe(false);
    expect(guardada.lineasDeAtencion).toEqual([]);
    expect(lineas.consultas).toBe(0);
  });

  describe('el reloj del dispositivo, pasada la medianoche (SCRUM-133)', () => {
    // El dia lo elige el dispositivo con su reloj. Sin conexion, uno adelantado
    // unos minutos diria que ya es manana: eso no puede dejar la anotacion
    // rechazada para siempre. Pero tampoco abre la puerta a un dia de verdad
    // futuro.
    const dos = (hora: string): Date => new Date(`2026-10-03T${hora}:00.000Z`);

    function escribir(
      casoDeUso: EscribirEnElDiarioUseCaseImpl,
      dia: string,
    ): ReturnType<EscribirEnElDiarioUseCaseImpl['execute']> {
      return casoDeUso.execute({
        userId: PERSONA,
        zonaHoraria: ZONA,
        conRecomendaciones: false,
        clientOperationId: operacion(),
        dia,
        contenido: documentoCon('escrita sin conexion'),
      });
    }

    it('a las 23:58 en Bogota, un dispositivo que ya marca el dia siguiente se acepta', async () => {
      // 23:58 del 2 en Bogota (UTC-5) es 04:58 del 3 en UTC. Con cinco minutos
      // de tolerancia el servidor admite hasta las 00:03 del 3.
      const { casoDeUso } = armar(dos('04:58'));

      const { entrada } = await escribir(casoDeUso, '2026-10-03');

      expect(entrada.dia).toBe('2026-10-03');
    });

    it('a las 23:54 no: cinco minutos de tolerancia no alcanzan para llegar al dia siguiente', async () => {
      const { casoDeUso, diario } = armar(dos('04:54'));

      await expect(escribir(casoDeUso, '2026-10-03')).rejects.toThrow(FutureJournalDayError);
      expect(await diario.todasDe(new UserId(PERSONA))).toHaveLength(0);
    });

    it('a las 23:55 justo si: el limite exacto se admite', async () => {
      const { casoDeUso } = armar(dos('04:55'));

      const { entrada } = await escribir(casoDeUso, '2026-10-03');

      expect(entrada.dia).toBe('2026-10-03');
    });

    it('nunca se admiten dos dias adelante', async () => {
      const { casoDeUso } = armar(dos('04:58'));

      await expect(escribir(casoDeUso, '2026-10-04')).rejects.toThrow(FutureJournalDayError);
    });

    it('sin indicar el dia, sigue siendo hoy en la zona de la persona', async () => {
      const { casoDeUso } = armar(dos('04:58'));

      const { entrada } = await casoDeUso.execute({
        userId: PERSONA,
        zonaHoraria: ZONA,
        conRecomendaciones: false,
        clientOperationId: operacion(),
        contenido: documentoCon('sin dia'),
      });

      expect(entrada.dia).toBe('2026-10-02');
    });
  });

  describe('las lineas son las del pais de la zona de quien escribe (SCRUM-124)', () => {
    const SENAL = 'Hoy pense que no quiero seguir viviendo';

    it.each([
      ['America/Bogota', 'CO'],
      ['America/Mexico_City', 'MX'],
      ['Europe/Madrid', 'ES'],
      ['America/New_York', 'US'],
      ['America/Lima', undefined],
      ['Asia/Tokyo', undefined],
    ])('%s pide las de %s', async (zonaHoraria, pais) => {
      const { casoDeUso, lineas } = armar();

      await casoDeUso.execute({
        userId: PERSONA,
        zonaHoraria,
        conRecomendaciones: true,
        clientOperationId: operacion(),
        contenido: documentoCon(SENAL),
      });

      expect(lineas.paises).toEqual([pais]);
    });

    it('un reintento las pide igual: quien repite ve lo mismo que la primera vez', async () => {
      const { casoDeUso, lineas } = armar();
      const orden = {
        userId: PERSONA,
        zonaHoraria: 'Europe/Madrid',
        conRecomendaciones: true,
        clientOperationId: operacion(),
        contenido: documentoCon(SENAL),
      };

      await casoDeUso.execute(orden);
      await casoDeUso.execute(orden);

      expect(lineas.paises).toEqual(['ES', 'ES']);
    });
  });

  it('con permiso, una senal de riesgo trae las lineas, la nacional primero', async () => {
    const { casoDeUso } = armar();

    const guardada = await casoDeUso.execute({
      userId: PERSONA,
      zonaHoraria: ZONA,
      conRecomendaciones: true,
      clientOperationId: operacion(),
      contenido: documentoCon('Hoy pense que no quiero seguir viviendo'),
    });

    expect(guardada.sugiereAcompanamiento).toBe(true);
    expect(guardada.lineasDeAtencion.map((linea) => linea.id)).toEqual(['linea-192', 'linea-106']);
  });

  it('el reintento de una anotacion con senal vuelve a traer las lineas', async () => {
    const { casoDeUso } = armar();
    const op = operacion();
    const peticion = {
      userId: PERSONA,
      zonaHoraria: ZONA,
      conRecomendaciones: true,
      clientOperationId: op,
      contenido: documentoCon('ya no puedo mas'),
    };

    await casoDeUso.execute(peticion);
    const reintento = await casoDeUso.execute(peticion);

    expect(reintento.sugiereAcompanamiento).toBe(true);
    expect(reintento.lineasDeAtencion).toHaveLength(2);
  });

  it('un contenido que no es un documento no se guarda', async () => {
    const { casoDeUso, diario } = armar();

    await expect(
      casoDeUso.execute({
        userId: PERSONA,
        zonaHoraria: ZONA,
        conRecomendaciones: false,
        clientOperationId: operacion(),
        contenido: '<p>hola</p>',
      }),
    ).rejects.toThrow(InvalidJournalEntryError);
    expect(await diario.todasDe(new UserId(PERSONA))).toHaveLength(0);
  });

  it('una operacion mal formada se rechaza antes de buscar nada', async () => {
    const { casoDeUso } = armar();

    await expect(
      casoDeUso.execute({
        userId: PERSONA,
        zonaHoraria: ZONA,
        conRecomendaciones: false,
        clientOperationId: 'no-es-un-uuid',
        contenido: documentoCon('x'),
      }),
    ).rejects.toThrow(InvalidIdentifierError);
  });
});
