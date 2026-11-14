import { beforeEach, describe, expect, it } from 'vitest';
import { ActivityResult } from '../../domain/model/ActivityResult.js';
import { ActivityId, ClientOperationId, ResultId, UserId } from '../../domain/model/Identifier.js';
import { InMemoryActivityResultRepository } from './InMemoryActivityResultRepository.js';

/**
 * El historial por modulo en el adaptador en memoria (SCRUM-184).
 *
 * Las mismas garantias que prueba el de PostgreSQL: solo de esa persona, solo de esas
 * actividades, del mas reciente al mas antiguo, y la pagina siguiente empieza justo despues
 * del cursor, sin repetir ni saltar nada aunque dos hechos tengan la misma hora.
 */
const USUARIO = '11111111-1111-4111-8111-111111111111';
const OTRO_USUARIO = '22222222-2222-4222-9222-222222222222';
const SUENO = '33333333-3333-4333-a333-000000000001';
const MEMORIA = '33333333-3333-4333-a333-000000000002';

let contador = 0;

function hecho(opciones: {
  actividad: string;
  cuando: string;
  usuario?: string;
  dia?: string;
  id?: string;
}): ActivityResult {
  contador += 1;
  const sufijo = String(contador).padStart(12, '0');

  return ActivityResult.create({
    id: new ResultId(opciones.id ?? `55555555-5555-4555-8555-${sufijo}`),
    userId: new UserId(opciones.usuario ?? USUARIO),
    activityId: new ActivityId(opciones.actividad),
    clientOperationId: new ClientOperationId(`44444444-4444-4444-b444-${sufijo}`),
    completedAt: new Date(opciones.cuando),
    dia: opciones.dia ?? opciones.cuando.slice(0, 10),
  });
}

describe('InMemoryActivityResultRepository.historialDe (SCRUM-184)', () => {
  let repositorio: InMemoryActivityResultRepository;

  beforeEach(() => {
    repositorio = new InMemoryActivityResultRepository();
    contador = 0;
  });

  it('devuelve lo de esa persona y de esas actividades, del mas reciente al mas antiguo', async () => {
    await repositorio.save(hecho({ actividad: SUENO, cuando: '2026-10-01T12:00:00.000Z' }));
    await repositorio.save(hecho({ actividad: SUENO, cuando: '2026-10-02T12:00:00.000Z' }));
    await repositorio.save(hecho({ actividad: MEMORIA, cuando: '2026-10-03T12:00:00.000Z' }));
    await repositorio.save(
      hecho({ actividad: SUENO, cuando: '2026-10-04T12:00:00.000Z', usuario: OTRO_USUARIO }),
    );

    const filas = await repositorio.historialDe(new UserId(USUARIO), [new ActivityId(SUENO)], {
      limite: 10,
    });

    expect(filas.map((fila) => fila.hechaEn.toISOString())).toEqual([
      '2026-10-02T12:00:00.000Z',
      '2026-10-01T12:00:00.000Z',
    ]);
    expect(filas.every((fila) => fila.idActividad === SUENO)).toBe(true);
  });

  it('trae el dia guardado, no el que saldria de la hora', async () => {
    // 01:00 UTC del 15 es la noche del 14 en Colombia.
    await repositorio.save(
      hecho({ actividad: SUENO, cuando: '2026-09-15T01:00:00.000Z', dia: '2026-09-14' }),
    );

    const [fila] = await repositorio.historialDe(new UserId(USUARIO), [new ActivityId(SUENO)], {
      limite: 10,
    });

    expect(fila?.dia).toBe('2026-09-14');
  });

  it('respeta el limite', async () => {
    for (let i = 1; i <= 5; i += 1) {
      await repositorio.save(
        hecho({ actividad: SUENO, cuando: `2026-10-0${String(i)}T12:00:00.000Z` }),
      );
    }

    const filas = await repositorio.historialDe(new UserId(USUARIO), [new ActivityId(SUENO)], {
      limite: 2,
    });

    expect(filas).toHaveLength(2);
  });

  it('la pagina siguiente empieza justo despues del cursor', async () => {
    for (let i = 1; i <= 5; i += 1) {
      await repositorio.save(
        hecho({ actividad: SUENO, cuando: `2026-10-0${String(i)}T12:00:00.000Z` }),
      );
    }

    const primera = await repositorio.historialDe(new UserId(USUARIO), [new ActivityId(SUENO)], {
      limite: 2,
    });
    const ultima = primera.at(-1);

    const segunda = await repositorio.historialDe(new UserId(USUARIO), [new ActivityId(SUENO)], {
      limite: 2,
      despuesDe: { hechaEn: ultima!.hechaEn, id: ultima!.id },
    });

    expect(primera.map((fila) => fila.hechaEn.toISOString().slice(0, 10))).toEqual([
      '2026-10-05',
      '2026-10-04',
    ]);
    expect(segunda.map((fila) => fila.hechaEn.toISOString().slice(0, 10))).toEqual([
      '2026-10-03',
      '2026-10-02',
    ]);
  });

  it('dos hechos a la misma hora no se repiten ni se saltan entre paginas', async () => {
    const misma = '2026-10-02T12:00:00.000Z';

    for (const sufijo of ['a', 'b', 'c', 'd']) {
      await repositorio.save(
        hecho({
          actividad: SUENO,
          cuando: misma,
          id: `55555555-5555-4555-8555-00000000000${sufijo}`,
        }),
      );
    }

    const vistos: string[] = [];
    let despuesDe: { hechaEn: Date; id: string } | undefined;

    for (let pagina = 0; pagina < 5; pagina += 1) {
      const filas = await repositorio.historialDe(new UserId(USUARIO), [new ActivityId(SUENO)], {
        limite: 3,
        ...(despuesDe === undefined ? {} : { despuesDe }),
      });

      if (filas.length === 0) {
        break;
      }

      vistos.push(...filas.map((fila) => fila.id));
      const ultima = filas.at(-1)!;

      despuesDe = { hechaEn: ultima.hechaEn, id: ultima.id };
    }

    expect(vistos).toHaveLength(4);
    expect(new Set(vistos).size).toBe(4);
  });

  it('sin actividades pedidas, no hay nada', async () => {
    await repositorio.save(hecho({ actividad: SUENO, cuando: '2026-10-01T12:00:00.000Z' }));

    await expect(repositorio.historialDe(new UserId(USUARIO), [], { limite: 10 })).resolves.toEqual(
      [],
    );
  });
});
