import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { ActivityResult } from '../../domain/model/ActivityResult.js';
import {
  ActivityId,
  ClientOperationId,
  ResultId,
  SesionId,
  UserId,
} from '../../domain/model/Identifier.js';
import { Revision, SesionDeActividad } from '../../domain/model/SesionDeActividad.js';
import { type BancoDeSesiones, contratoDeSesiones } from '../../pruebas/contratoDeSesiones.js';
import { InMemoryActivityResultRepository } from './InMemoryActivityResultRepository.js';
import { InMemorySesionesRepository } from './InMemorySesionesRepository.js';

function nueva(
  mecanica: ActivityId,
  opciones: { publicado?: boolean; titulo?: string } = {},
): SesionDeActividad {
  return SesionDeActividad.create({
    id: new SesionId(randomUUID()),
    idActividad: mecanica,
    titulo: opciones.titulo ?? 'Una sesión',
    nivel: 2,
    parametros: { largo: 4, pasos: ['uno', 'dos'] },
    publicado: opciones.publicado ?? true,
    revision: Revision.NO_REQUIERE,
  });
}

function abrir(): Promise<BancoDeSesiones> {
  const resultados = new InMemoryActivityResultRepository();
  const repositorio = new InMemorySesionesRepository(resultados);

  return Promise.resolve({
    repositorio,
    mecanicaNueva: () => Promise.resolve(new ActivityId(randomUUID())),
    personaNueva: () => Promise.resolve(randomUUID()),
    sembrar: (sesiones) => {
      repositorio.agregar(...sesiones);

      return Promise.resolve();
    },
    hacer: async (persona, sesion, dia, hechaEn = new Date(`${dia}T12:00:00Z`)) => {
      await resultados.save(
        ActivityResult.create(
          {
            id: new ResultId(randomUUID()),
            userId: new UserId(persona),
            activityId: sesion.idActividad,
            clientOperationId: new ClientOperationId(randomUUID()),
            completedAt: hechaEn,
            dia,
            sessionId: sesion.id,
          },
          // Los dias de la prueba estan en el pasado o en el futuro cercano: la fecha no se valida.
          new Date('2100-01-01T00:00:00Z'),
        ),
      );
    },
    cerrar: () => Promise.resolve(),
  });
}

describe('InMemorySesionesRepository cumple el contrato de las sesiones', () => {
  contratoDeSesiones(abrir, nueva);
});

/**
 * Lo que el contrato no puede pedir porque solo este adaptador lo tiene: el contrato siembra con
 * `agregar`, nunca con el constructor ni con un identificador repetido, y registra siempre lo hecho
 * con su sesion.
 */
describe('InMemorySesionesRepository, lo propio del adaptador', () => {
  const HOY = '2026-10-16';

  it('las sesiones con las que nace son su contenido de partida', async () => {
    const mecanica = new ActivityId(randomUUID());
    const una = nueva(mecanica, { titulo: 'Una' });
    const otra = nueva(mecanica, { titulo: 'Otra' });
    const repositorio = new InMemorySesionesRepository(new InMemoryActivityResultRepository(), [
      una,
      otra,
    ]);

    expect(await repositorio.porId(una.id)).toBe(una);
    expect(await repositorio.porId(otra.id)).toBe(otra);
    expect(await repositorio.titulosDe([una.id, otra.id])).toEqual(
      new Map([
        [una.id.value, 'Una'],
        [otra.id.value, 'Otra'],
      ]),
    );
  });

  it('una sesion con el mismo identificador reemplaza a la anterior', async () => {
    const mecanica = new ActivityId(randomUUID());
    const persona = new UserId(randomUUID());
    const repositorio = new InMemorySesionesRepository(new InMemoryActivityResultRepository());
    const primera = nueva(mecanica, { titulo: 'Primera' });
    const retirada = SesionDeActividad.create({
      id: primera.id,
      idActividad: mecanica,
      titulo: 'Retirada',
      nivel: 2,
      parametros: { largo: 4, pasos: ['uno', 'dos'] },
      publicado: false,
      revision: Revision.NO_REQUIERE,
    });

    repositorio.agregar(primera);
    expect((await repositorio.sesionesDeHoy(persona, [mecanica], HOY)).get(mecanica.value)).toBe(
      primera,
    );

    repositorio.agregar(retirada);

    expect(await repositorio.porId(primera.id)).toBe(retirada);
    expect(await repositorio.titulosDe([primera.id])).toEqual(
      new Map([[primera.id.value, 'Retirada']]),
    );
    expect((await repositorio.sesionesDeHoy(persona, [mecanica], HOY)).size).toBe(0);
  });

  it('lo que la persona hizo sin sesion no cuenta como una sesion hecha', async () => {
    const resultados = new InMemoryActivityResultRepository();
    const repositorio = new InMemorySesionesRepository(resultados);
    const mecanica = new ActivityId(randomUUID());
    const persona = new UserId(randomUUID());

    repositorio.agregar(nueva(mecanica), nueva(mecanica), nueva(mecanica));

    const antes = (await repositorio.sesionesDeHoy(persona, [mecanica], HOY)).get(mecanica.value);

    await resultados.save(
      ActivityResult.create(
        {
          id: new ResultId(randomUUID()),
          userId: persona,
          activityId: mecanica,
          clientOperationId: new ClientOperationId(randomUUID()),
          completedAt: new Date(`${HOY}T12:00:00Z`),
          dia: HOY,
        },
        new Date('2100-01-01T00:00:00Z'),
      ),
    );

    const despues = (await repositorio.sesionesDeHoy(persona, [mecanica], HOY)).get(mecanica.value);

    expect(antes).toBeDefined();
    expect(despues).toBe(antes);
  });
});
