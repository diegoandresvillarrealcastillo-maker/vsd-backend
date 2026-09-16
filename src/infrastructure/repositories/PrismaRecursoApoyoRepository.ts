import type { RecursoApoyo as FilaDeRecurso } from '@prisma/client';
import { RecursoApoyo, TipoDeRecurso } from '../../domain/model/RecursoApoyo.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import type { PrismaService } from '../persistence/PrismaService.js';

/**
 * La base de conocimiento del asistente, leida de PostgreSQL.
 *
 * No abre sesion de persona: `recurso_apoyo` es catalogo y su politica de
 * lectura esta abierta a cualquier sesion. Escribirlo si exige el rol
 * administrador, y eso lo impone la base, no este adaptador.
 */
export class PrismaRecursoApoyoRepository implements RecursoApoyoRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async lineasDeAtencion(): Promise<readonly RecursoApoyo[]> {
    const filas = await this.prisma.recursoApoyo.findMany({
      where: { tipo: TipoDeRecurso.CONTACTO },
    });

    return RecursoApoyo.ordenarPorAlcance(filas.map((fila) => this.aDominio(fila)));
  }

  async porTema(tema: string): Promise<readonly RecursoApoyo[]> {
    const filas = await this.prisma.recursoApoyo.findMany({ where: { tema } });

    return RecursoApoyo.ordenarPorAlcance(filas.map((fila) => this.aDominio(fila)));
  }

  private aDominio(fila: FilaDeRecurso): RecursoApoyo {
    return RecursoApoyo.create({
      id: fila.id,
      titulo: fila.titulo,
      descripcion: fila.descripcion ?? undefined,
      tipo: fila.tipo,
      tema: fila.tema ?? undefined,
      cobertura: fila.cobertura ?? undefined,
      enlace: fila.enlace ?? undefined,
    });
  }
}
