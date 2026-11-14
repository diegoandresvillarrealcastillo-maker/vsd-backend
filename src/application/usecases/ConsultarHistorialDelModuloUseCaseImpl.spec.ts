import { describe, expect, it, vi } from 'vitest';
import { Activity, DireccionEscala } from '../../domain/model/Activity.js';
import { Categoria } from '../../domain/model/Categoria.js';
import {
  AccountNotProvisionedError,
  InvalidHistoryPageError,
} from '../../domain/model/DomainError.js';
import {
  type FilaDelHistorial,
  LIMITE_MAXIMO_DEL_HISTORIAL,
  LIMITE_POR_OMISION_DEL_HISTORIAL,
  codificarLaPagina,
} from '../../domain/model/HistorialDelModulo.js';
import { ActivityId, CategoryId, UserId } from '../../domain/model/Identifier.js';
import { Modulo } from '../../domain/model/Preferencias.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { ConsultarHistorialDelModuloUseCaseImpl } from './ConsultarHistorialDelModuloUseCaseImpl.js';

const PERSONA = new UserId('11111111-1111-4111-8111-111111111111');

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

function fila(n: number, actividadId: string, cuando: string): FilaDelHistorial {
  return {
    id: `bbbbbbbb-bbbb-4bbb-8bbb-${String(n).padStart(12, '0')}`,
    idActividad: actividadId,
    dia: cuando.slice(0, 10),
    hechaEn: new Date(cuando),
  };
}

function armar(opciones: { filas?: readonly FilaDelHistorial[]; conCuenta?: boolean } = {}) {
  const { filas = [], conCuenta = true } = opciones;
  const historialDe = vi.fn<ActivityResultRepositoryPort['historialDe']>(() =>
    Promise.resolve(filas),
  );

  const cuentas = {
    findById: () =>
      Promise.resolve(
        conCuenta ? unaCuenta({ id: PERSONA.value, modulosActivos: [Modulo.COGNICION] }) : null,
      ),
  } as unknown as UserRepositoryPort;
  const catalogo = {
    listarCatalogo: () => Promise.resolve(CATALOGO),
  } as unknown as ActivityRepositoryPort;
  const resultados = { historialDe } as unknown as ActivityResultRepositoryPort;

  return {
    historialDe,
    casoDeUso: new ConsultarHistorialDelModuloUseCaseImpl(cuentas, catalogo, resultados),
  };
}

describe('ConsultarHistorialDelModuloUseCaseImpl (SCRUM-184)', () => {
  it('una cuenta que no existe no tiene historial', async () => {
    const { casoDeUso } = armar({ conCuenta: false });

    await expect(casoDeUso.execute({ userId: PERSONA, modulo: Modulo.BIENESTAR })).rejects.toThrow(
      AccountNotProvisionedError,
    );
  });

  it('pide solo las actividades de ese modulo', async () => {
    const { casoDeUso, historialDe } = armar();

    await casoDeUso.execute({ userId: PERSONA, modulo: Modulo.BIENESTAR });

    const [persona, actividades] = historialDe.mock.calls[0] as unknown as [
      UserId,
      ActivityId[],
      unknown,
    ];

    expect(persona.value).toBe(PERSONA.value);
    expect(actividades.map((una) => una.value)).toEqual([SUENO.id.value, MOVIMIENTO.id.value]);
  });

  it('un modulo sin actividades en el catalogo responde vacio sin preguntar a la base', async () => {
    const { casoDeUso, historialDe } = armar();

    const pagina = await casoDeUso.execute({ userId: PERSONA, modulo: Modulo.EMOCIONES });

    expect(pagina).toEqual({ hechos: [], siguiente: null });
    expect(historialDe).not.toHaveBeenCalled();
  });

  it('trae el nombre de cada actividad, el dia y la hora', async () => {
    const { casoDeUso } = armar({
      filas: [fila(1, SUENO.id.value, '2026-10-02T14:00:00.000Z')],
    });

    const pagina = await casoDeUso.execute({ userId: PERSONA, modulo: Modulo.BIENESTAR });

    expect(pagina.hechos).toEqual([
      {
        id: 'bbbbbbbb-bbbb-4bbb-8bbb-000000000001',
        actividad: { id: SUENO.id.value, nombre: 'Cómo dormiste anoche' },
        dia: '2026-10-02',
        hechaEn: new Date('2026-10-02T14:00:00.000Z'),
      },
    ]);
    expect(pagina.siguiente).toBeNull();
  });

  it('pide una fila de mas para saber si hay otra pagina, y no la devuelve', async () => {
    const filas = [
      fila(3, SUENO.id.value, '2026-10-03T10:00:00.000Z'),
      fila(2, SUENO.id.value, '2026-10-02T10:00:00.000Z'),
      fila(1, SUENO.id.value, '2026-10-01T10:00:00.000Z'),
    ];
    const { casoDeUso, historialDe } = armar({ filas });

    const pagina = await casoDeUso.execute({
      userId: PERSONA,
      modulo: Modulo.BIENESTAR,
      limite: 2,
    });

    expect(historialDe.mock.calls[0]?.[2]).toMatchObject({ limite: 3 });
    expect(pagina.hechos.map((hecho) => hecho.id)).toEqual([filas[0]?.id, filas[1]?.id]);
    // El cursor es el ultimo hecho de lo que se devolvio, no el de la fila de mas.
    expect(pagina.siguiente).toBe(
      codificarLaPagina({ hechaEn: filas[1]!.hechaEn, id: filas[1]!.id }),
    );
  });

  it('sin mas, no hay siguiente', async () => {
    const filas = [fila(1, SUENO.id.value, '2026-10-01T10:00:00.000Z')];
    const { casoDeUso } = armar({ filas });

    const pagina = await casoDeUso.execute({
      userId: PERSONA,
      modulo: Modulo.BIENESTAR,
      limite: 2,
    });

    expect(pagina.siguiente).toBeNull();
  });

  it.each([
    [undefined, LIMITE_POR_OMISION_DEL_HISTORIAL + 1],
    [5, 6],
    [10_000, LIMITE_MAXIMO_DEL_HISTORIAL + 1],
  ])('con limite %s pide %s a la base', async (limite, pedido) => {
    const { casoDeUso, historialDe } = armar();

    await casoDeUso.execute({ userId: PERSONA, modulo: Modulo.BIENESTAR, limite });

    expect(historialDe.mock.calls[0]?.[2]).toMatchObject({ limite: pedido });
  });

  it('la pagina que pidio el cliente llega a la base como cursor', async () => {
    const punto = {
      hechaEn: new Date('2026-10-02T10:00:00.000Z'),
      id: 'bbbbbbbb-bbbb-4bbb-8bbb-000000000009',
    };
    const { casoDeUso, historialDe } = armar();

    await casoDeUso.execute({
      userId: PERSONA,
      modulo: Modulo.BIENESTAR,
      pagina: codificarLaPagina(punto),
    });

    expect(historialDe.mock.calls[0]?.[2]).toMatchObject({ despuesDe: punto });
  });

  it('una pagina que no es de este sistema se rechaza, sin preguntar a la base', async () => {
    const { casoDeUso, historialDe } = armar();

    await expect(
      casoDeUso.execute({ userId: PERSONA, modulo: Modulo.BIENESTAR, pagina: 'hola-mundo' }),
    ).rejects.toThrow(InvalidHistoryPageError);
    expect(historialDe).not.toHaveBeenCalled();
  });

  it('tambien de un modulo que ya no tiene activo: es lo que la persona hizo', async () => {
    // La cuenta de prueba solo tiene activo cognicion.
    const { casoDeUso, historialDe } = armar();

    await casoDeUso.execute({ userId: PERSONA, modulo: Modulo.BIENESTAR });

    expect(historialDe).toHaveBeenCalledTimes(1);
  });

  it('una fila de una actividad que ya no esta en el catalogo no se ensena', async () => {
    const { casoDeUso } = armar({
      filas: [fila(1, 'dddddddd-dddd-4ddd-8ddd-000000000001', '2026-10-02T14:00:00.000Z')],
    });

    const pagina = await casoDeUso.execute({ userId: PERSONA, modulo: Modulo.BIENESTAR });

    expect(pagina.hechos).toEqual([]);
  });
});
