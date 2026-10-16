import { describe, expect, it } from 'vitest';
import {
  AccountNotProvisionedError,
  FileStorageUnavailableError,
} from '../../domain/model/DomainError.js';
import { ActivityResult } from '../../domain/model/ActivityResult.js';
import { DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import {
  ActivityId,
  ClientOperationId,
  EntradaId,
  PendienteId,
  ResultId,
  SesionId,
  UserId,
} from '../../domain/model/Identifier.js';
import { Pendiente } from '../../domain/model/Pendiente.js';
import type { User } from '../../domain/model/User.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { DatoCuriosoRepositoryPort } from '../../domain/ports/out/DatoCuriosoRepositoryPort.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';
import type { AlmacenPersonalPort } from '../../domain/ports/out/AlmacenPersonalPort.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';
import type { SesionesRepositoryPort } from '../../domain/ports/out/SesionesRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { AlmacenDoble } from '../../pruebas/almacenDePrueba.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { PNG_REAL_DE_8_X_6 } from '../../pruebas/fotosDePrueba.js';
import { ExportarDatosUseCaseImpl } from './ExportarDatosUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';
const AHORA = new Date('2026-10-02T15:00:00.000Z');
const ENTRADA = EntradaDeDiario.guardada({
  id: new EntradaId('33333333-3333-4333-a333-333333333333'),
  userId: new UserId(PERSONA),
  clientOperationId: new ClientOperationId('44444444-4444-4444-a444-444444444444'),
  dia: '2026-10-02',
  documento: DocumentoDelDiario.desdeTextoPlano('Hoy dormi mejor'),
  version: 1,
  creadaEn: AHORA,
  editadaEn: AHORA,
});
const PENDIENTE = Pendiente.nuevo(
  {
    id: new PendienteId('55555555-5555-4555-a555-555555555555'),
    userId: new UserId(PERSONA),
    clientOperationId: new ClientOperationId('66666666-6666-4666-a666-666666666666'),
    texto: 'Pagar la matricula',
    nivel: 'urgente',
  },
  AHORA,
);

const DATO = {
  id: '77777777-7777-4777-a777-777777777777',
  texto: 'Los pulpos tienen tres corazones.',
  tema: 'animales',
};

/** Arma el caso de uso con dobles que anotan por quien les preguntaron. */
function armar(
  cuenta: User | null,
  fotos: AlmacenPersonalPort = new AlmacenDoble(),
  mascotas: AlmacenPersonalPort = new AlmacenDoble(),
  conDatoCurioso = true,
  conResultados: readonly ActivityResult[] = [],
  titulosDeSesiones: Readonly<Record<string, string>> = {},
) {
  const preguntas: {
    resultados?: string;
    desde?: Date;
    diario?: string;
    pendientes?: string;
    titulosDe?: string[][];
  } = {};

  const cuentas: UserRepositoryPort = {
    findById: () => Promise.resolve(cuenta),
    findByIdProveedorAuth: () => Promise.resolve(null),
    save: () => Promise.resolve(),
    consentimientosDe: () => Promise.resolve([]),
    borrarConTodo: () => Promise.resolve(),
    inactivarConTodo: () => Promise.resolve(),
    estaInactivadaPorProveedor: () => Promise.resolve(false),
  };

  const resultados = {
    ultimosDe: (id: UserId, desde: Date) => {
      preguntas.resultados = id.value;
      preguntas.desde = desde;

      return Promise.resolve(conResultados);
    },
  } as unknown as ActivityResultRepositoryPort;

  const sesiones = {
    titulosDe: (ids: readonly SesionId[]) => {
      preguntas.titulosDe = [...(preguntas.titulosDe ?? []), ids.map((id) => id.value)];

      return Promise.resolve(
        new Map(
          ids.flatMap((id) =>
            id.value in titulosDeSesiones
              ? [[id.value, titulosDeSesiones[id.value]!] as const]
              : [],
          ),
        ),
      );
    },
  } as unknown as SesionesRepositoryPort;

  const diario = {
    todasDe: (id: UserId) => {
      preguntas.diario = id.value;

      return Promise.resolve([ENTRADA]);
    },
  } as unknown as DiarioRepositoryPort;

  const pendientes = {
    todosDe: (id: UserId) => {
      preguntas.pendientes = id.value;

      return Promise.resolve([PENDIENTE]);
    },
  } as unknown as PendientesRepositoryPort;

  const avisos = {
    preferenciasDe: (id: UserId) =>
      Promise.resolve({ userId: id, minutoSemaforo: 480, minutoRacha: null }),
    suscripcionesDe: () =>
      Promise.resolve([{ endpoint: 'https://push.example.com/a', p256dh: 'p', auth: 'a' }]),
  } as unknown as AvisosRepositoryPort;

  const datosCuriosos = {
    cursorDe: () =>
      Promise.resolve(conDatoCurioso ? { idDato: DATO.id, clave: 7n, dia: '2026-10-12' } : null),
    porId: () => Promise.resolve(conDatoCurioso ? DATO : null),
  } as unknown as DatoCuriosoRepositoryPort;

  return {
    preguntas,
    casoDeUso: new ExportarDatosUseCaseImpl(
      cuentas,
      resultados,
      diario,
      pendientes,
      avisos,
      fotos,
      mascotas,
      datosCuriosos,
      sesiones,
      () => AHORA,
    ),
  };
}

describe('ExportarDatosUseCaseImpl', () => {
  it('reune la cuenta, los resultados y el diario', async () => {
    const { casoDeUso } = armar(unaCuenta());

    const datos = await casoDeUso.execute(new UserId(PERSONA));

    expect(datos.cuenta.id.value).toBe(PERSONA);
    expect(datos.resultados).toEqual([]);
    expect(datos.entradasDeDiario).toEqual([ENTRADA]);
    expect(datos.pendientes).toEqual([PENDIENTE]);
    expect(datos.generadoEn).toEqual(AHORA);
  });

  it('incluye las horas de los avisos y en cuantos navegadores, sin sus claves (SCRUM-102)', async () => {
    const { casoDeUso } = armar(unaCuenta());

    const datos = await casoDeUso.execute(new UserId(PERSONA));

    expect(datos.avisos).toEqual({
      preferencias: { userId: new UserId(PERSONA), minutoSemaforo: 480, minutoRacha: null },
      navegadores: 1,
    });
    expect(JSON.stringify(datos.avisos)).not.toContain('push.example.com');
  });

  it('pregunta por la misma persona en cada repositorio', async () => {
    const { casoDeUso, preguntas } = armar(unaCuenta());

    await casoDeUso.execute(new UserId(PERSONA));

    expect(preguntas.resultados).toBe(PERSONA);
    expect(preguntas.diario).toBe(PERSONA);
    expect(preguntas.pendientes).toBe(PERSONA);
  });

  it('exporta los resultados desde siempre, no solo los recientes', async () => {
    const { casoDeUso, preguntas } = armar(unaCuenta());

    await casoDeUso.execute(new UserId(PERSONA));

    expect(preguntas.desde?.getTime()).toBe(0);
  });

  it('sin cuenta no hay nada que exportar', async () => {
    const { casoDeUso } = armar(null);

    await expect(casoDeUso.execute(new UserId(PERSONA))).rejects.toThrow(
      AccountNotProvisionedError,
    );
  });

  describe('la foto de perfil (SCRUM-120)', () => {
    const GUARDADA_EL = new Date('2026-10-09T15:30:00.123Z');

    it('sin foto, sale null y ni se pregunta al almacenamiento', async () => {
      const preguntas: string[] = [];
      const fotos: AlmacenPersonalPort = {
        guardar: () => Promise.resolve(),
        leer: (persona) => {
          preguntas.push(persona.value);

          return Promise.resolve(undefined);
        },
        borrar: () => Promise.resolve(),
      };

      const datos = await armar(unaCuenta(), fotos).casoDeUso.execute(new UserId(PERSONA));

      expect(datos.foto).toBeNull();
      expect(preguntas).toEqual([]);
    });

    it('con foto, sale el archivo tal como se guardo, con su tipo y su fecha', async () => {
      const fotos = new AlmacenDoble();

      await fotos.guardar(new UserId(PERSONA), { contenido: PNG_REAL_DE_8_X_6, tipo: 'image/png' });

      const datos = await armar(
        unaCuenta({ fotoActualizadaEl: GUARDADA_EL }),
        fotos,
      ).casoDeUso.execute(new UserId(PERSONA));

      expect(datos.foto).toEqual({
        contenido: PNG_REAL_DE_8_X_6,
        tipo: 'image/png',
        actualizadaEl: GUARDADA_EL,
      });
    });

    it('pregunta por la misma persona que exporta', async () => {
      const preguntas: string[] = [];
      const fotos: AlmacenPersonalPort = {
        guardar: () => Promise.resolve(),
        leer: (persona) => {
          preguntas.push(persona.value);

          return Promise.resolve({ contenido: PNG_REAL_DE_8_X_6, tipo: 'image/png' });
        },
        borrar: () => Promise.resolve(),
      };

      await armar(unaCuenta({ fotoActualizadaEl: GUARDADA_EL }), fotos).casoDeUso.execute(
        new UserId(PERSONA),
      );

      expect(preguntas).toEqual([PERSONA]);
    });

    it('con la marca pero sin el archivo, sale null', async () => {
      const datos = await armar(unaCuenta({ fotoActualizadaEl: GUARDADA_EL })).casoDeUso.execute(
        new UserId(PERSONA),
      );

      expect(datos.foto).toBeNull();
    });

    it('si el almacenamiento falla, la exportacion falla: no sale «todo» con una parte callada', async () => {
      const fotos: AlmacenPersonalPort = {
        guardar: () => Promise.resolve(),
        leer: () => Promise.reject(new Error('Storage no respondio')),
        borrar: () => Promise.resolve(),
      };

      await expect(
        armar(unaCuenta({ fotoActualizadaEl: GUARDADA_EL }), fotos).casoDeUso.execute(
          new UserId(PERSONA),
        ),
      ).rejects.toThrow(FileStorageUnavailableError);
    });
  });
});

describe('la mascota propia (SCRUM-122)', () => {
  const GUARDADA_EL = new Date('2026-10-12T09:00:00.000Z');
  const SVG = {
    contenido: new TextEncoder().encode(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>',
    ),
    tipo: 'image/svg+xml',
  };

  it('sin mascota propia, sale null y ni se pregunta al almacenamiento', async () => {
    const mascotas = new AlmacenDoble();

    const datos = await armar(unaCuenta(), new AlmacenDoble(), mascotas).casoDeUso.execute(
      new UserId(PERSONA),
    );

    expect(datos.mascotaPropia).toBeNull();
    expect(mascotas.llamadas).toEqual([]);
  });

  it('con mascota propia, sale el SVG tal como se guardo, con su tipo y su fecha', async () => {
    const mascotas = new AlmacenDoble();

    await mascotas.guardar(new UserId(PERSONA), SVG);

    const datos = await armar(
      unaCuenta({ mascotaPropiaActualizadaEl: GUARDADA_EL }),
      new AlmacenDoble(),
      mascotas,
    ).casoDeUso.execute(new UserId(PERSONA));

    expect(datos.mascotaPropia).toEqual({ ...SVG, actualizadaEl: GUARDADA_EL });
  });

  it('cada archivo sale de su almacen: la foto no es la mascota ni al reves', async () => {
    const fotos = new AlmacenDoble();
    const mascotas = new AlmacenDoble();
    const foto = { contenido: new Uint8Array([1, 2, 3]), tipo: 'image/png' };

    await fotos.guardar(new UserId(PERSONA), foto);
    await mascotas.guardar(new UserId(PERSONA), SVG);

    const datos = await armar(
      unaCuenta({ fotoActualizadaEl: GUARDADA_EL, mascotaPropiaActualizadaEl: GUARDADA_EL }),
      fotos,
      mascotas,
    ).casoDeUso.execute(new UserId(PERSONA));

    expect(datos.foto?.tipo).toBe('image/png');
    expect(datos.mascotaPropia?.tipo).toBe('image/svg+xml');
  });

  it('solo se pregunta por lo que la cuenta dice que tiene', async () => {
    const fotos = new AlmacenDoble();
    const mascotas = new AlmacenDoble();

    await armar(
      unaCuenta({ mascotaPropiaActualizadaEl: GUARDADA_EL }),
      fotos,
      mascotas,
    ).casoDeUso.execute(new UserId(PERSONA));

    expect(fotos.llamadas).toEqual([]);
    expect(mascotas.llamadas).toEqual(['leer']);
  });

  it('con la marca pero sin el archivo, sale null', async () => {
    const datos = await armar(
      unaCuenta({ mascotaPropiaActualizadaEl: GUARDADA_EL }),
    ).casoDeUso.execute(new UserId(PERSONA));

    expect(datos.mascotaPropia).toBeNull();
  });

  it('si el almacenamiento falla, la exportacion falla: no sale «todo» con una parte callada', async () => {
    const mascotas = new AlmacenDoble();

    mascotas.falla = true;

    await expect(
      armar(
        unaCuenta({ mascotaPropiaActualizadaEl: GUARDADA_EL }),
        new AlmacenDoble(),
        mascotas,
      ).casoDeUso.execute(new UserId(PERSONA)),
    ).rejects.toThrow(FileStorageUnavailableError);
  });

  describe('el dato curioso (SCRUM-185)', () => {
    it('incluye el ultimo que se le dio, con su texto y el dia, no su identificador', async () => {
      const { casoDeUso } = armar(unaCuenta());

      const datos = await casoDeUso.execute(new UserId(PERSONA));

      expect(datos.datoCurioso).toEqual({
        dia: '2026-10-12',
        texto: 'Los pulpos tienen tres corazones.',
      });
    });

    it('si todavia no se le dio ninguno, es nulo', async () => {
      const { casoDeUso } = armar(unaCuenta(), new AlmacenDoble(), new AlmacenDoble(), false);

      const datos = await casoDeUso.execute(new UserId(PERSONA));

      expect(datos.datoCurioso).toBeNull();
    });
  });
});

describe('ExportarDatosUseCaseImpl: las sesiones que se hicieron (ADR 0030)', () => {
  const SESION_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const SESION_B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  let n = 0;

  function resultado(sesion?: string): ActivityResult {
    n++;

    return ActivityResult.create(
      {
        id: new ResultId(`dddddddd-dddd-4ddd-8ddd-${String(n).padStart(12, '0')}`),
        userId: new UserId(PERSONA),
        activityId: new ActivityId('33333333-3333-4333-a333-333333333333'),
        clientOperationId: new ClientOperationId(
          `eeeeeeee-eeee-4eee-8eee-${String(n).padStart(12, '0')}`,
        ),
        completedAt: new Date('2026-10-01T12:00:00.000Z'),
        dia: '2026-10-01',
        sessionId: sesion === undefined ? undefined : new SesionId(sesion),
      },
      AHORA,
    );
  }

  it('sin ninguna sesion en los resultados, no se pregunta por titulos', async () => {
    const { casoDeUso, preguntas } = armar(unaCuenta(), undefined, undefined, true, [
      resultado(),
      resultado(),
    ]);

    const datos = await casoDeUso.execute(new UserId(PERSONA));

    expect(preguntas.titulosDe).toBeUndefined();
    expect(datos.titulosDeSesiones.size).toBe(0);
  });

  it('trae el titulo de cada sesion distinta, una sola vez cada una', async () => {
    const { casoDeUso, preguntas } = armar(
      unaCuenta(),
      undefined,
      undefined,
      true,
      [resultado(SESION_A), resultado(SESION_B), resultado(SESION_A), resultado()],
      { [SESION_A]: 'Respiración 4-6', [SESION_B]: 'Tres colores' },
    );

    const datos = await casoDeUso.execute(new UserId(PERSONA));

    expect(preguntas.titulosDe).toEqual([[SESION_A, SESION_B]]);
    expect(Object.fromEntries(datos.titulosDeSesiones)).toEqual({
      [SESION_A]: 'Respiración 4-6',
      [SESION_B]: 'Tres colores',
    });
    expect(datos.resultados).toHaveLength(4);
  });
});
