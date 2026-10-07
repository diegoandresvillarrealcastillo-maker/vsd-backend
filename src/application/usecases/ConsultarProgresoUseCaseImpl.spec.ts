import { describe, expect, it } from 'vitest';
import { Activity, DireccionEscala } from '../../domain/model/Activity.js';
import { ActivityResult } from '../../domain/model/ActivityResult.js';
import { Calendario } from '../../domain/model/Calendario.js';
import { Categoria } from '../../domain/model/Categoria.js';
import { AccountNotProvisionedError } from '../../domain/model/DomainError.js';
import {
  ActivityId,
  CategoryId,
  ClientOperationId,
  ResultId,
  UserId,
} from '../../domain/model/Identifier.js';
import { Modulo } from '../../domain/model/Preferencias.js';
import type { User } from '../../domain/model/User.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { ConsultarProgresoUseCaseImpl } from './ConsultarProgresoUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';

// Viernes 2 de octubre de 2026, a las 9 p. m. en Bogota: ya es sabado en UTC.
const AHORA = new Date('2026-10-03T02:00:00.000Z');

function actividad(id: string, nombre: string): Activity {
  return Activity.create({
    id: new ActivityId(id),
    nombre,
    direccionEscala: DireccionEscala.SIN_PUNTAJE,
  });
}

const SUENO = actividad('aaaaaaaa-aaaa-4aaa-8aaa-000000000001', 'Cómo dormiste anoche');
const MOVIMIENTO = actividad('aaaaaaaa-aaaa-4aaa-8aaa-000000000002', 'Movimiento del día');
const MEMORIA = actividad('aaaaaaaa-aaaa-4aaa-8aaa-000000000003', 'Parejas');

const CATALOGO = [
  Categoria.create({
    id: new CategoryId('cccccccc-cccc-4ccc-8ccc-000000000001'),
    nombre: 'Bienestar',
    modulo: Modulo.BIENESTAR,
    actividades: [SUENO, MOVIMIENTO],
  }),
  Categoria.create({
    id: new CategoryId('cccccccc-cccc-4ccc-8ccc-000000000002'),
    nombre: 'Cognición',
    modulo: Modulo.COGNICION,
    actividades: [MEMORIA],
  }),
];

let operacion = 0;

function resultado(cual: Activity, cuando: string): ActivityResult {
  operacion++;

  return ActivityResult.create(
    {
      id: new ResultId(`dddddddd-dddd-4ddd-8ddd-${String(operacion).padStart(12, '0')}`),
      userId: new UserId(PERSONA),
      activityId: cual.id,
      clientOperationId: new ClientOperationId(
        `eeeeeeee-eeee-4eee-8eee-${String(operacion).padStart(12, '0')}`,
      ),
      completedAt: new Date(cuando),
      // El dia que se guardo al registrarlo: el de Bogota, como antes.
      dia: new Calendario().diaDe(new Date(cuando)),
    },
    AHORA,
  );
}

function armar(cuenta: User | null, resultados: ActivityResult[] = []) {
  const cuentas: UserRepositoryPort = {
    findById: () => Promise.resolve(cuenta),
    findByIdProveedorAuth: () => Promise.resolve(null),
    save: () => Promise.resolve(),
    borrarConTodo: () => Promise.resolve(),
  };
  const catalogo = {
    listarCatalogo: () => Promise.resolve(CATALOGO),
  } as unknown as ActivityRepositoryPort;
  const repositorio = {
    ultimosDe: () => Promise.resolve(resultados),
  } as unknown as ActivityResultRepositoryPort;

  return new ConsultarProgresoUseCaseImpl(cuentas, catalogo, repositorio, () => AHORA);
}

const CON_DOS_MODULOS = unaCuenta().conPreferencias({ modulosActivos: ['bienestar', 'cognicion'] });

describe('ConsultarProgresoUseCaseImpl', () => {
  it('solo devuelve los modulos activos, en orden', async () => {
    const progreso = await armar(CON_DOS_MODULOS).execute(new UserId(PERSONA));

    expect(progreso.map((uno) => uno.modulo)).toEqual(['cognicion', 'bienestar']);
  });

  it('sin modulos elegidos devuelve una lista vacia', async () => {
    await expect(armar(unaCuenta()).execute(new UserId(PERSONA))).resolves.toEqual([]);
  });

  it('cuenta cada resultado en el modulo de su actividad', async () => {
    const progreso = await armar(CON_DOS_MODULOS, [
      resultado(SUENO, '2026-10-02T12:00:00.000Z'),
      resultado(MEMORIA, '2026-10-01T12:00:00.000Z'),
      resultado(MEMORIA, '2026-09-30T12:00:00.000Z'),
    ]).execute(new UserId(PERSONA));

    const porModulo = Object.fromEntries(progreso.map((uno) => [uno.modulo, uno.sesiones]));

    expect(porModulo).toEqual({ cognicion: 2, bienestar: 1 });
  });

  it('el dia es el de Colombia: algo hecho a las 8 p. m. cuenta como de hoy', async () => {
    // 01:00 UTC del sabado son las 8 p. m. del viernes en Bogota.
    const progreso = await armar(CON_DOS_MODULOS, [
      resultado(MOVIMIENTO, '2026-10-03T01:00:00.000Z'),
    ]).execute(new UserId(PERSONA));

    const bienestar = progreso.find((uno) => uno.modulo === 'bienestar');

    expect(bienestar?.hoy.map((una) => [una.actividad.nombre, una.hecha])).toEqual([
      ['Cómo dormiste anoche', false],
      ['Movimiento del día', true],
    ]);
  });

  it('un resultado de una actividad que ya no esta en el catalogo no cuenta', async () => {
    const retirada = actividad('aaaaaaaa-aaaa-4aaa-8aaa-000000000099', 'Retirada');

    const progreso = await armar(CON_DOS_MODULOS, [
      resultado(retirada, '2026-10-02T12:00:00.000Z'),
    ]).execute(new UserId(PERSONA));

    expect(progreso.every((uno) => uno.sesiones === 0)).toBe(true);
  });

  it('sin cuenta no hay progreso', async () => {
    await expect(armar(null).execute(new UserId(PERSONA))).rejects.toThrow(
      AccountNotProvisionedError,
    );
  });
});

describe('El progreso en la zona de la persona (SCRUM-123)', () => {
  /** Un resultado de "Movimiento del dia" con el dia que se guardo al registrarlo. */
  function hecho(dia: string): ActivityResult {
    return ActivityResult.create(
      {
        id: new ResultId('dddddddd-dddd-4ddd-8ddd-00000000f001'),
        userId: new UserId(PERSONA),
        activityId: MOVIMIENTO.id,
        clientOperationId: new ClientOperationId('eeeeeeee-eeee-4eee-8eee-00000000f001'),
        completedAt: new Date('2026-10-03T01:00:00Z'),
        dia,
      },
      AHORA,
    );
  }

  async function movimientoDeHoy(cuenta: User, resultados: ActivityResult[]) {
    const progreso = await armar(cuenta, resultados).execute(new UserId(PERSONA));
    const bienestar = progreso.find((uno) => uno.modulo === 'bienestar');

    return {
      sesiones: bienestar?.sesiones,
      hecha: bienestar?.hoy.find((una) => una.actividad.nombre === 'Movimiento del día')?.hecha,
    };
  }

  it('el "hoy" es el de la zona de la cuenta', async () => {
    // AHORA es el 2 de octubre en Bogota y ya el 3 en Tokio. Un resultado del
    // dia 3 es de hoy para quien esta en Tokio, y de manana para quien esta en
    // Bogota.
    const delTres = [hecho('2026-10-03')];

    expect(await movimientoDeHoy(CON_DOS_MODULOS, delTres)).toEqual({ sesiones: 1, hecha: false });
    expect(await movimientoDeHoy(CON_DOS_MODULOS.conZonaHoraria('Asia/Tokyo'), delTres)).toEqual({
      sesiones: 1,
      hecha: true,
    });
  });

  it('viajar no mueve el dia de lo que ya se hizo: cada resultado trae el suyo', async () => {
    // Hecho a las 8 p. m. del 2 en Bogota y registrado con ese dia. Si el dia
    // se recalculara con la zona de hoy, desde Tokio caeria en el 3 y contaria
    // como hecho hoy: una racha ganada otro dia pasaria por de hoy.
    const delDos = [hecho('2026-10-02')];

    expect(await movimientoDeHoy(CON_DOS_MODULOS, delDos)).toEqual({ sesiones: 1, hecha: true });

    // En Tokio ya es el 3: lo del 2 sigue contando como una sesion, pero no
    // como hecho hoy.
    expect(await movimientoDeHoy(CON_DOS_MODULOS.conZonaHoraria('Asia/Tokyo'), delDos)).toEqual({
      sesiones: 1,
      hecha: false,
    });
  });
});
