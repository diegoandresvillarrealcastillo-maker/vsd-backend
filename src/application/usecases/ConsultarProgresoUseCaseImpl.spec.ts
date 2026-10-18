import { describe, expect, it } from 'vitest';
import { Activity, DireccionEscala, type Frecuencia } from '../../domain/model/Activity.js';
import { ActivityResult } from '../../domain/model/ActivityResult.js';
import { Calendario } from '../../domain/model/Calendario.js';
import { Categoria } from '../../domain/model/Categoria.js';
import { AccountNotProvisionedError } from '../../domain/model/DomainError.js';
import { Franja } from '../../domain/model/Franja.js';
import {
  ActivityId,
  CategoryId,
  ClientOperationId,
  ResultId,
  SesionId,
  UserId,
} from '../../domain/model/Identifier.js';
import type { Motor } from '../../domain/model/Motor.js';
import { Modulo } from '../../domain/model/Preferencias.js';
import { Revision, SesionDeActividad } from '../../domain/model/SesionDeActividad.js';
import type { User } from '../../domain/model/User.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { SesionesRepositoryPort } from '../../domain/ports/out/SesionesRepositoryPort.js';
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

/**
 * Doble de las sesiones. Sin mecanicas con motor en el catalogo ni se consulta: `consultas` lo
 * demuestra.
 */
class SesionesFalsas implements SesionesRepositoryPort {
  readonly consultas: { metodo: string; actividades: string[]; hoy: string }[] = [];

  constructor(private readonly disponibles: ReadonlyMap<string, SesionDeActividad> = new Map()) {}

  porId(): Promise<SesionDeActividad | null> {
    return Promise.resolve(null);
  }

  mecanicasConSesion(
    _userId: UserId,
    actividades: readonly ActivityId[],
    hoy: string,
  ): Promise<ReadonlySet<string>> {
    this.consultas.push({
      metodo: 'mecanicasConSesion',
      actividades: actividades.map((a) => a.value),
      hoy,
    });

    return Promise.resolve(
      new Set(actividades.map((a) => a.value).filter((id) => this.disponibles.has(id))),
    );
  }

  sesionesDeHoy(
    _userId: UserId,
    actividades: readonly ActivityId[],
    hoy: string,
  ): Promise<ReadonlyMap<string, SesionDeActividad>> {
    this.consultas.push({
      metodo: 'sesionesDeHoy',
      actividades: actividades.map((a) => a.value),
      hoy,
    });

    return Promise.resolve(
      new Map(
        actividades.flatMap((a) => {
          const sesion = this.disponibles.get(a.value);

          return sesion === undefined ? [] : [[a.value, sesion] as const];
        }),
      ),
    );
  }

  titulosDe(): Promise<ReadonlyMap<string, string>> {
    return Promise.resolve(new Map());
  }
}

function armar(
  cuenta: User | null,
  resultados: ActivityResult[] = [],
  opciones: { catalogo?: Categoria[]; sesiones?: SesionesFalsas } = {},
) {
  const cuentas: UserRepositoryPort = {
    findById: () => Promise.resolve(cuenta),
    findByIdProveedorAuth: () => Promise.resolve(null),
    save: () => Promise.resolve(),
    consentimientosDe: () => Promise.resolve([]),
    borrarConTodo: () => Promise.resolve(),
    inactivarConTodo: () => Promise.resolve(),
    estaInactivadaPorProveedor: () => Promise.resolve(false),
  };
  const catalogo = {
    listarCatalogo: () => Promise.resolve(opciones.catalogo ?? CATALOGO),
  } as unknown as ActivityRepositoryPort;
  const repositorio = {
    ultimosDe: () => Promise.resolve(resultados),
  } as unknown as ActivityResultRepositoryPort;

  return new ConsultarProgresoUseCaseImpl(
    cuentas,
    catalogo,
    repositorio,
    opciones.sesiones ?? new SesionesFalsas(),
    () => AHORA,
  );
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

describe('El sendero con sesiones (ADR 0030)', () => {
  let siguiente = 0;

  function mecanica(
    frecuencia: Frecuencia = { tipo: 'diaria' },
    motor: Motor = 'secuencia',
  ): Activity {
    siguiente++;

    return Activity.create({
      id: new ActivityId(`bbbbbbbb-bbbb-4bbb-8bbb-${String(siguiente).padStart(12, '0')}`),
      nombre: `Mecánica ${siguiente}`,
      direccionEscala: DireccionEscala.SIN_PUNTAJE,
      frecuencia,
      motor,
    });
  }

  function sesionDe(deLaMecanica: Activity): SesionDeActividad {
    siguiente++;

    return SesionDeActividad.create({
      id: new SesionId(`cccccccc-cccc-4ccc-9ccc-${String(siguiente).padStart(12, '0')}`),
      idActividad: deLaMecanica.id,
      titulo: `Sesión de ${deLaMecanica.nombre}`,
      nivel: 1,
      parametros: { largo: 4 },
      publicado: true,
      revision: Revision.NO_REQUIERE,
    });
  }

  function catalogoDe(bienestar: Activity[], cognicion: Activity[] = []): Categoria[] {
    return [
      Categoria.create({
        id: new CategoryId('cccccccc-cccc-4ccc-8ccc-000000000001'),
        nombre: 'Bienestar',
        modulo: Modulo.BIENESTAR,
        actividades: bienestar,
      }),
      Categoria.create({
        id: new CategoryId('cccccccc-cccc-4ccc-8ccc-000000000002'),
        nombre: 'Cognición',
        modulo: Modulo.COGNICION,
        actividades: cognicion,
      }),
    ];
  }

  const bienestarDe = (progreso: Awaited<ReturnType<ConsultarProgresoUseCaseImpl['execute']>>) =>
    progreso.find((uno) => uno.modulo === 'bienestar')!;

  it('sin mecanicas con motor, como hoy: ni se consultan las sesiones', async () => {
    const sesiones = new SesionesFalsas();

    const progreso = await armar(CON_DOS_MODULOS, [], { sesiones }).execute(new UserId(PERSONA));

    expect(sesiones.consultas).toEqual([]);
    expect(bienestarDe(progreso).hoy.every((una) => una.sesion === undefined)).toBe(true);
    expect(bienestarDe(progreso).hoy).toHaveLength(2);
  });

  it('una mecanica con motor sale con la sesion que le toca hoy', async () => {
    const una = mecanica();
    const sesion = sesionDe(una);
    const sesiones = new SesionesFalsas(new Map([[una.id.value, sesion]]));

    const progreso = await armar(CON_DOS_MODULOS, [], {
      catalogo: catalogoDe([una]),
      sesiones,
    }).execute(new UserId(PERSONA));

    expect(bienestarDe(progreso).hoy).toEqual([{ actividad: una, hecha: false, sesion }]);
  });

  it('las sesiones se piden con el dia local de la persona (el viernes, no el sabado en UTC)', async () => {
    const una = mecanica();
    const sesiones = new SesionesFalsas(new Map([[una.id.value, sesionDe(una)]]));

    await armar(CON_DOS_MODULOS, [], { catalogo: catalogoDe([una]), sesiones }).execute(
      new UserId(PERSONA),
    );

    expect(sesiones.consultas.map((c) => c.hoy)).toEqual(['2026-10-02', '2026-10-02']);
  });

  it('una mecanica con motor y sin sesion no se ofrece, ni hoy ni como sugerida', async () => {
    const con = mecanica();
    const sin = mecanica();
    const sesiones = new SesionesFalsas(new Map([[con.id.value, sesionDe(con)]]));

    const progreso = await armar(CON_DOS_MODULOS, [], {
      catalogo: catalogoDe([con, sin]),
      sesiones,
    }).execute(new UserId(PERSONA));

    expect(bienestarDe(progreso).hoy.map((una) => una.actividad.id.value)).toEqual([con.id.value]);
    expect(bienestarDe(progreso).sugeridas).toEqual([]);
  });

  it('una mecanica sugerida tambien trae su sesion: se puede hacer', async () => {
    const diaria = mecanica();
    const semanalOtroDia = mecanica({ tipo: 'semanal', dias: [1] });
    const sesiones = new SesionesFalsas(
      new Map([
        [diaria.id.value, sesionDe(diaria)],
        [semanalOtroDia.id.value, sesionDe(semanalOtroDia)],
      ]),
    );

    const progreso = await armar(CON_DOS_MODULOS, [], {
      catalogo: catalogoDe([diaria, semanalOtroDia]),
      sesiones,
    }).execute(new UserId(PERSONA));

    expect(bienestarDe(progreso).sugeridas.map((una) => una.sesion?.idActividad.value)).toEqual([
      semanalOtroDia.id.value,
    ]);
  });

  it('con seis rotativas ofrece tres y pide la sesion solo de esas tres', async () => {
    const seis = Array.from({ length: 6 }, () => mecanica({ tipo: 'rotativa' }));
    const sesiones = new SesionesFalsas(new Map(seis.map((una) => [una.id.value, sesionDe(una)])));

    const progreso = await armar(CON_DOS_MODULOS, [], {
      catalogo: catalogoDe(seis),
      sesiones,
    }).execute(new UserId(PERSONA));

    const ofrecidas = bienestarDe(progreso).hoy.map((una) => una.actividad.id.value);
    const pedidas = sesiones.consultas.find((c) => c.metodo === 'sesionesDeHoy')!.actividades;

    expect(ofrecidas).toHaveLength(3);
    expect([...pedidas].sort()).toEqual([...ofrecidas].sort());
    // Y la comprobacion de que tienen sesion sale de las seis, en una sola consulta.
    expect(
      sesiones.consultas.find((c) => c.metodo === 'mecanicasConSesion')!.actividades,
    ).toHaveLength(6);
  });

  it('solo se consultan las mecanicas de los modulos que la persona tiene activos', async () => {
    const deBienestar = mecanica();
    const deCognicion = mecanica();
    const sesiones = new SesionesFalsas(
      new Map([
        [deBienestar.id.value, sesionDe(deBienestar)],
        [deCognicion.id.value, sesionDe(deCognicion)],
      ]),
    );
    const soloBienestar = unaCuenta().conPreferencias({ modulosActivos: ['bienestar'] });

    await armar(soloBienestar, [], {
      catalogo: catalogoDe([deBienestar], [deCognicion]),
      sesiones,
    }).execute(new UserId(PERSONA));

    for (const consulta of sesiones.consultas) {
      expect(consulta.actividades).toEqual([deBienestar.id.value]);
    }
  });

  it('las actividades sin motor salen igual y sin sesion, junto a las que si la tienen', async () => {
    const con = mecanica();
    const sesion = sesionDe(con);
    const sesiones = new SesionesFalsas(new Map([[con.id.value, sesion]]));

    const progreso = await armar(CON_DOS_MODULOS, [], {
      catalogo: catalogoDe([SUENO, con]),
      sesiones,
    }).execute(new UserId(PERSONA));

    expect(bienestarDe(progreso).hoy).toEqual([
      { actividad: SUENO, hecha: false },
      { actividad: con, hecha: false, sesion },
    ]);
  });
});

describe('La franja del dia, con la hora de la persona (SCRUM-221)', () => {
  const ANTES_DE_DORMIR = Activity.create({
    id: new ActivityId('aaaaaaaa-aaaa-4aaa-8aaa-0000000000f1'),
    nombre: 'Antes de dormir',
    direccionEscala: DireccionEscala.SIN_PUNTAJE,
    franja: Franja.NOCHE,
  });
  const catalogoConNoche = [
    Categoria.create({
      id: new CategoryId('cccccccc-cccc-4ccc-8ccc-0000000000f1'),
      nombre: 'Bienestar',
      modulo: Modulo.BIENESTAR,
      actividades: [SUENO, ANTES_DE_DORMIR],
    }),
  ];

  async function deHoy(cuenta: User) {
    const progreso = await armar(cuenta, [], { catalogo: catalogoConNoche }).execute(
      new UserId(PERSONA),
    );

    return progreso.flatMap((uno) => uno.hoy.map((una) => una.actividad.nombre));
  }

  const SOLO_BIENESTAR = unaCuenta().conPreferencias({ modulosActivos: ['bienestar'] });

  it('a las 9 p. m. en Bogota es de noche: se ofrece', async () => {
    expect(await deHoy(SOLO_BIENESTAR)).toContain('Antes de dormir');
  });

  it('la misma hora en Tokio son las 11 de la manana: no se ofrece, y lo demas si', async () => {
    const enTokio = SOLO_BIENESTAR.conZonaHoraria('Asia/Tokyo');

    expect(await deHoy(enTokio)).toEqual(['Cómo dormiste anoche']);
  });
});
