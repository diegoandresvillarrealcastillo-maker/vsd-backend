import { describe, expect, it, vi } from 'vitest';
import { Activity, DireccionEscala } from '../../domain/model/Activity.js';
import { Categoria } from '../../domain/model/Categoria.js';
import { AccountNotProvisionedError } from '../../domain/model/DomainError.js';
import { ActivityId, CategoryId, UserId } from '../../domain/model/Identifier.js';
import { RecursoApoyo } from '../../domain/model/RecursoApoyo.js';
import type { User } from '../../domain/model/User.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { ConsultarAcompanamientoUseCaseImpl } from './ConsultarAcompanamientoUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';
const MEMORIA = '33333333-3333-4333-a333-333333333331';
const CARGA = '33333333-3333-4333-a333-333333333332';

// Viernes 2 de octubre de 2026, a las 9 p. m. en Bogota: ya es sabado 3 en UTC.
const NOCHE_DEL_VIERNES = new Date('2026-10-03T02:00:00.000Z');

const LINEA_NACIONAL = RecursoApoyo.create({
  id: '0192c0de-0000-4000-8000-000000000192',
  titulo: 'Línea 192, opción 4',
  tipo: 'contacto',
  cobertura: 'nacional',
  pais: 'CO',
  fuente: 'https://www.minsalud.gov.co',
  verificadoEl: '2026-10-01',
});
const LINEA_DE_BOGOTA = RecursoApoyo.create({
  id: '0106c0de-0000-4000-8000-000000000106',
  titulo: 'Línea 106',
  tipo: 'contacto',
  cobertura: 'bogota',
  pais: 'CO',
  fuente: 'https://www.minsalud.gov.co',
  verificadoEl: '2026-10-01',
});

/** Una cuenta que SI dio su permiso: sin el, el acompanamiento no mira nada (ADR 0034, pregunta 3). */
function conPermiso(): User {
  return unaCuenta().conPreferencias({ acompanamientoPorDias: true });
}

/** Un catalogo con una actividad de cognicion (mayor es mejor) y una de carga (mayor requiere atencion). */
function catalogo(): readonly Categoria[] {
  return [
    Categoria.create({
      id: new CategoryId('44444444-4444-4444-8444-444444444441'),
      nombre: 'Cognición',
      actividades: [
        Activity.create({
          id: new ActivityId(MEMORIA),
          nombre: 'Memoria',
          direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
          puntajeMaximo: 10,
        }),
      ],
    }),
    Categoria.create({
      id: new CategoryId('44444444-4444-4444-8444-444444444442'),
      nombre: 'Emociones',
      actividades: [
        Activity.create({
          id: new ActivityId(CARGA),
          nombre: 'Carga mental',
          direccionEscala: DireccionEscala.MAYOR_REQUIERE_ATENCION,
          puntajeMaximo: 10,
        }),
      ],
    }),
  ];
}

/**
 * `dias` son los dias con atencion; `actividad`, los dias con cualquier resultado (por omision, los
 * mismos: toda la actividad fue con atencion).
 */
function armar(
  cuenta: User | null,
  dias: readonly string[],
  ahora: Date = NOCHE_DEL_VIERNES,
  actividad: readonly string[] = dias,
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
  const diasConAtencion = vi.fn(() => Promise.resolve(dias));
  const diasConActividad = vi.fn(() => Promise.resolve(actividad));
  const resultados = {
    diasConAtencion,
    diasConActividad,
  } as unknown as ActivityResultRepositoryPort;
  const lineasDeAtencion = vi.fn(() => Promise.resolve([LINEA_DE_BOGOTA, LINEA_NACIONAL]));
  const recursos = { lineasDeAtencion } as unknown as RecursoApoyoRepositoryPort;
  const actividades = {
    listarCatalogo: () => Promise.resolve(catalogo()),
  } as unknown as ActivityRepositoryPort;

  return {
    caso: new ConsultarAcompanamientoUseCaseImpl(
      cuentas,
      resultados,
      recursos,
      actividades,
      () => ahora,
    ),
    diasConAtencion,
    diasConActividad,
    lineasDeAtencion,
  };
}

describe('ConsultarAcompanamientoUseCaseImpl (SCRUM-177)', () => {
  it('sin cuenta falla como el resto de lo que pide una cuenta', async () => {
    await expect(armar(null, []).caso.execute(new UserId(PERSONA))).rejects.toBeInstanceOf(
      AccountNotProvisionedError,
    );
  });

  it('sin el permiso de la persona no mira nada: ninguno, sin leer resultados ni lineas', async () => {
    // Siete dias seguidos con atencion, que con permiso serian criticos.
    const { caso, diasConAtencion, diasConActividad, lineasDeAtencion } = armar(unaCuenta(), [
      '2026-09-26',
      '2026-09-27',
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
    ]);

    expect(await caso.execute(new UserId(PERSONA))).toEqual({
      nivel: 'ninguno',
      abandono: 'ninguno',
      lineasDeAtencion: [],
    });
    expect(diasConAtencion).not.toHaveBeenCalled();
    expect(diasConActividad).not.toHaveBeenCalled();
    expect(lineasDeAtencion).not.toHaveBeenCalled();
  });

  it('solo mira las actividades de «mayor requiere atencion»: la de cognicion no cuenta', async () => {
    const { caso, diasConAtencion } = armar(conPermiso(), []);

    await caso.execute(new UserId(PERSONA));

    expect(diasConAtencion).toHaveBeenCalledTimes(1);
    const [id, actividades] = diasConAtencion.mock.calls[0] as unknown as [UserId, ActivityId[]];

    expect(id.value).toBe(PERSONA);
    expect(actividades.map((actividad) => actividad.value)).toEqual([CARGA]);
  });

  it('sin dias con atencion, ninguno y ninguna linea', async () => {
    const { caso, lineasDeAtencion } = armar(conPermiso(), []);

    expect(await caso.execute(new UserId(PERSONA))).toEqual({
      nivel: 'ninguno',
      abandono: 'ninguno',
      lineasDeAtencion: [],
    });
    expect(lineasDeAtencion).not.toHaveBeenCalled();
  });

  it('a los 3 dias seguidos, moderado, sin lineas: se ofrece hablarlo, no se llena de numeros', async () => {
    const { caso, lineasDeAtencion } = armar(conPermiso(), [
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
    ]);

    expect(await caso.execute(new UserId(PERSONA))).toEqual({
      nivel: 'moderado',
      abandono: 'ninguno',
      lineasDeAtencion: [],
    });
    expect(lineasDeAtencion).not.toHaveBeenCalled();
  });

  it('a los 7 dias seguidos, critico, con las lineas de su pais ordenadas por alcance', async () => {
    const { caso, lineasDeAtencion } = armar(conPermiso(), [
      '2026-09-26',
      '2026-09-27',
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
    ]);

    const acompanamiento = await caso.execute(new UserId(PERSONA));

    expect(acompanamiento.nivel).toBe('critico');
    // Lo nacional primero: la 106 solo contesta desde Bogota.
    expect(acompanamiento.lineasDeAtencion.map((linea) => linea.id)).toEqual([
      LINEA_NACIONAL.id,
      LINEA_DE_BOGOTA.id,
    ]);
    expect(lineasDeAtencion).toHaveBeenCalledWith('CO');
  });

  it('en una zona sin pais con lineas verificadas pide el directorio, nunca el numero de otro pais', async () => {
    const { caso, lineasDeAtencion } = armar(conPermiso().conZonaHoraria('Pacific/Auckland'), [
      '2026-09-26',
      '2026-09-27',
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
    ]);

    await caso.execute(new UserId(PERSONA));

    expect(lineasDeAtencion).toHaveBeenCalledWith(undefined);
  });

  it('«hoy» es el dia de la persona: a las 9 p. m. del viernes todavia es viernes', async () => {
    // En UTC ya es sabado 3. Con ese «hoy», la cadena de 3 dias que termina el viernes seria
    // «de antes de ayer» y no contaria.
    const { caso } = armar(conPermiso(), ['2026-09-30', '2026-10-01', '2026-10-02']);

    expect((await caso.execute(new UserId(PERSONA))).nivel).toBe('moderado');
  });

  it('sin atencion hoy, la cadena de ayer sigue en pie', async () => {
    const sabadoPorLaManana = new Date('2026-10-03T14:00:00.000Z');
    const { caso } = armar(
      conPermiso(),
      ['2026-09-30', '2026-10-01', '2026-10-02'],
      sabadoPorLaManana,
    );

    expect((await caso.execute(new UserId(PERSONA))).nivel).toBe('moderado');
  });

  it('una cadena rota hace dias ya no ofrece nada', async () => {
    const { caso } = armar(
      conPermiso(),
      ['2026-09-30', '2026-10-01', '2026-10-02'],
      new Date('2026-10-08T15:00:00.000Z'),
    );

    expect((await caso.execute(new UserId(PERSONA))).nivel).toBe('ninguno');
  });

  describe('el abandono (SCRUM-256)', () => {
    // Atencion el 27, 28 y 29 de septiembre; hoy es viernes 2 de octubre: 3 dias sin registrar.
    const TRES_DIAS_MAL = ['2026-09-27', '2026-09-28', '2026-09-29'];

    it('tras 3 dias con atencion y 3 sin registrar nada: abandono moderado, sin lineas', async () => {
      const { caso, lineasDeAtencion } = armar(conPermiso(), TRES_DIAS_MAL);

      expect(await caso.execute(new UserId(PERSONA))).toEqual({
        nivel: 'ninguno',
        abandono: 'moderado',
        lineasDeAtencion: [],
      });
      expect(lineasDeAtencion).not.toHaveBeenCalled();
    });

    it('tras 7 dias con atencion: abandono critico, con las lineas de su pais', async () => {
      const { caso, lineasDeAtencion } = armar(conPermiso(), [
        '2026-09-23',
        '2026-09-24',
        '2026-09-25',
        '2026-09-26',
        '2026-09-27',
        '2026-09-28',
        '2026-09-29',
      ]);

      const acompanamiento = await caso.execute(new UserId(PERSONA));

      expect(acompanamiento.nivel).toBe('ninguno');
      expect(acompanamiento.abandono).toBe('critico');
      expect(acompanamiento.lineasDeAtencion.map((linea) => linea.id)).toEqual([
        LINEA_NACIONAL.id,
        LINEA_DE_BOGOTA.id,
      ]);
      expect(lineasDeAtencion).toHaveBeenCalledWith('CO');
    });

    it('sin el permiso no hay abandono ni se lee un solo resultado', async () => {
      const { caso, diasConAtencion, diasConActividad } = armar(unaCuenta(), TRES_DIAS_MAL);

      expect((await caso.execute(new UserId(PERSONA))).abandono).toBe('ninguno');
      expect(diasConAtencion).not.toHaveBeenCalled();
      expect(diasConActividad).not.toHaveBeenCalled();
    });

    it('con la cadena en pie no hay abandono ni se pregunta por la actividad', async () => {
      const { caso, diasConActividad } = armar(conPermiso(), [
        '2026-09-30',
        '2026-10-01',
        '2026-10-02',
      ]);

      const acompanamiento = await caso.execute(new UserId(PERSONA));

      expect(acompanamiento.nivel).toBe('moderado');
      expect(acompanamiento.abandono).toBe('ninguno');
      expect(diasConActividad).not.toHaveBeenCalled();
    });

    it('si despues de la mala racha hizo algo que no requirio atencion, no hay abandono', async () => {
      const { caso } = armar(conPermiso(), TRES_DIAS_MAL, NOCHE_DEL_VIERNES, [
        ...TRES_DIAS_MAL,
        '2026-09-30',
      ]);

      expect((await caso.execute(new UserId(PERSONA))).abandono).toBe('ninguno');
    });

    it('«hoy» es el dia de la persona: el abandono se cuenta en su calendario, no en UTC', async () => {
      // Viernes 2, 9 p. m. en Bogota (sabado 3 en UTC). Con el 30 como ultimo dia son 2 en
      // Bogota (todavia nada) y 3 en UTC (avisaria de mas).
      const { caso } = armar(conPermiso(), ['2026-09-28', '2026-09-29', '2026-09-30']);

      expect((await caso.execute(new UserId(PERSONA))).abandono).toBe('ninguno');
    });
  });
});
