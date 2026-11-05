import { describe, expect, it, vi } from 'vitest';
import type { User } from '../../domain/model/User.js';
import type { ConsultarHistorialDelModuloUseCase } from '../../domain/ports/in/ConsultarHistorialDelModuloUseCase.js';
import type { ConsultarProgresoUseCase } from '../../domain/ports/in/ConsultarProgresoUseCase.js';
import type { PrismaService } from '../persistence/PrismaService.js';
import { ProgresoController } from './ProgresoController.js';

const ID = '11111111-1111-4111-8111-111111111111';
const cuenta = { id: { value: ID } } as User;
const progreso = {} as ConsultarProgresoUseCase;
const historial = {} as ConsultarHistorialDelModuloUseCase;

describe('sesiones hechas del sendero', () => {
  it('devuelve vacío cuando no hay PostgreSQL', async () => {
    const controlador = new ProgresoController(progreso, historial, null);
    await expect(controlador.sesionesHechas({ modulo: 'bienestar' }, cuenta)).resolves.toEqual([]);
  });

  it('consulta solo los resultados de la persona bajo su contexto RLS y omite sesiones nulas', async () => {
    const buscar = vi
      .fn()
      .mockResolvedValue([
        { idSesion: '22222222-2222-4222-8222-222222222222' },
        { idSesion: null },
      ]);
    const comoUsuario = vi.fn(async (_id: string, consultar: (cliente: unknown) => unknown) =>
      consultar({ resultado: { findMany: buscar } }),
    );
    const controlador = new ProgresoController(progreso, historial, {
      comoUsuario,
    } as unknown as PrismaService);

    await expect(controlador.sesionesHechas({ modulo: 'cognicion' }, cuenta)).resolves.toEqual([
      '22222222-2222-4222-8222-222222222222',
    ]);
    expect(comoUsuario).toHaveBeenCalledWith(ID, expect.any(Function));
    expect(buscar).toHaveBeenCalledWith({
      where: {
        idUsuario: ID,
        idSesion: { not: null },
        actividad: { categoria: { modulo: 'cognicion' } },
      },
      select: { idSesion: true },
      distinct: ['idSesion'],
    });
  });
});
