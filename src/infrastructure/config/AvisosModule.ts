import { Logger, Module } from '@nestjs/common';
import { AvisosUseCaseImpl } from '../../application/usecases/AvisosUseCaseImpl.js';
import { RevisarAvisosUseCaseImpl } from '../../application/usecases/RevisarAvisosUseCaseImpl.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';
import type { EnviadorDePushPort } from '../../domain/ports/out/EnviadorDePushPort.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';
import { RelojDeAvisos } from '../avisos/RelojDeAvisos.js';
import { WebPushEnviador } from '../avisos/WebPushEnviador.js';
import { NotificacionesController } from '../controllers/NotificacionesController.js';
import type { PrismaService } from '../persistence/PrismaService.js';
import { InMemoryAvisosRepository } from '../repositories/InMemoryAvisosRepository.js';
import { PrismaAvisosRepository } from '../repositories/PrismaAvisosRepository.js';
import { ActivityResultModule } from './ActivityResultModule.js';
import type { Configuracion } from './environment.js';
import { PendientesModule } from './PendientesModule.js';
import {
  ACTIVITY_RESULT_REPOSITORY,
  AVISOS,
  AVISOS_REPOSITORY,
  CONFIGURACION,
  ENVIADOR_PUSH,
  PENDIENTES_REPOSITORY,
  PRISMA,
  REVISAR_AVISOS,
} from './tokens.js';

/**
 * Cableado de los avisos por Web Push (SCRUM-102).
 *
 * Importa los pendientes y los resultados para decidir que dice cada aviso:
 * cuantos pendientes hay, y si ya se hizo una actividad hoy.
 */
@Module({
  imports: [ActivityResultModule, PendientesModule],
  controllers: [NotificacionesController],
  providers: [
    {
      provide: AVISOS_REPOSITORY,
      useFactory: (prisma: PrismaService | null): AvisosRepositoryPort => {
        if (prisma === null) {
          new Logger('Persistencia').warn('Sin DATABASE_URL: los avisos se guardan en memoria.');

          return new InMemoryAvisosRepository();
        }

        return new PrismaAvisosRepository(prisma);
      },
      inject: [PRISMA],
    },
    {
      provide: ENVIADOR_PUSH,
      useFactory: (configuracion: Configuracion): EnviadorDePushPort =>
        new WebPushEnviador(configuracion.vapid),
      inject: [CONFIGURACION],
    },
    {
      provide: AVISOS,
      useFactory: (avisos: AvisosRepositoryPort, enviador: EnviadorDePushPort) =>
        new AvisosUseCaseImpl(avisos, enviador),
      inject: [AVISOS_REPOSITORY, ENVIADOR_PUSH],
    },
    {
      provide: REVISAR_AVISOS,
      useFactory: (
        avisos: AvisosRepositoryPort,
        enviador: EnviadorDePushPort,
        pendientes: PendientesRepositoryPort,
        resultados: ActivityResultRepositoryPort,
      ) => {
        const registro = new Logger('Avisos');

        return new RevisarAvisosUseCaseImpl(avisos, enviador, pendientes, resultados, {
          // Que fallo y de que clase de aviso; nunca de quien.
          fallo: (tipo, error) =>
            registro.warn(
              `Un aviso de ${tipo} no salio: ${error instanceof Error ? error.message : 'error desconocido'}`,
            ),
        });
      },
      inject: [AVISOS_REPOSITORY, ENVIADOR_PUSH, PENDIENTES_REPOSITORY, ACTIVITY_RESULT_REPOSITORY],
    },
    RelojDeAvisos,
  ],
  // Para la exportacion de datos de la cuenta.
  exports: [AVISOS_REPOSITORY],
})
export class AvisosModule {}
