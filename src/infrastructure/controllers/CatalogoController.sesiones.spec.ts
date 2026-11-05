import { describe, expect, it, vi } from 'vitest';

import type { ConsultarCatalogoUseCase } from '../../domain/ports/in/ConsultarCatalogoUseCase.js';
import type { PrismaService } from '../persistence/PrismaService.js';
import { CatalogoController } from './CatalogoController.js';

const ID = '11111111-1111-4111-8111-111111111111';

function controlador() {
  const findMany = vi.fn();
  const findFirst = vi.fn();
  const prisma = { sesionDeActividad: { findMany, findFirst } } as unknown as PrismaService;
  const catalogo = { ejecutar: vi.fn() } as unknown as ConsultarCatalogoUseCase;
  return { instancia: new CatalogoController(catalogo, prisma), findMany, findFirst };
}

describe('Catálogo de sesiones publicadas (SCRUM-322)', () => {
  it('solo consulta sesiones publicadas de actividades activas del módulo pedido', async () => {
    const { instancia, findMany } = controlador();
    findMany.mockResolvedValue([
      {
        id: ID,
        idActividad: ID,
        titulo: 'Pausa consciente',
        nivel: 1,
        actividad: { nombre: 'Respirar' },
      },
    ]);

    expect(await instancia.sesionesPublicadas('bienestar')).toEqual([
      {
        id: ID,
        idActividad: ID,
        titulo: 'Pausa consciente',
        nivel: 1,
        actividad: 'Respirar',
      },
    ]);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { publicado: true, actividad: { estado: true, categoria: { modulo: 'bienestar' } } },
      }),
    );
    expect(await instancia.sesionesPublicadas('inexistente')).toEqual([]);
    expect(findMany).toHaveBeenCalledTimes(1);
  });

  it('rechaza identificadores inválidos y solo busca contenido publicado', async () => {
    const { instancia, findFirst } = controlador();
    expect(await instancia.sesionPublicada('no-es-uuid')).toBeNull();
    expect(findFirst).not.toHaveBeenCalled();
    findFirst.mockResolvedValue(null);
    expect(await instancia.sesionPublicada(ID)).toBeNull();
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: ID, publicado: true, actividad: { estado: true } },
      }),
    );
  });
});
