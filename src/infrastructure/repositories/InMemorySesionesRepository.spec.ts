import { randomUUID } from 'node:crypto';
import { describe } from 'vitest';
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
