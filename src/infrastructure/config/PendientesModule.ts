import { Logger, Module } from '@nestjs/common';
import { PendientesUseCaseImpl } from '../../application/usecases/PendientesUseCaseImpl.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';
import { PendientesController } from '../controllers/PendientesController.js';
import type { PrismaService } from '../persistence/PrismaService.js';
import { InMemoryPendientesRepository } from '../repositories/InMemoryPendientesRepository.js';
import { PrismaPendientesRepository } from '../repositories/PrismaPendientesRepository.js';
import { ActivityResultModule } from './ActivityResultModule.js';
import { PENDIENTES, PENDIENTES_REPOSITORY, PRISMA } from './tokens.js';

/**
 * Cableado del semaforo de pendientes (SCRUM-97).
 *
 * Importa el modulo de resultados solo para alcanzar Prisma, como el diario.
 * Exporta el repositorio para la exportacion de datos de la cuenta.
 */
@Module({
  imports: [ActivityResultModule],
  controllers: [PendientesController],
  providers: [
    {
      provide: PENDIENTES_REPOSITORY,
      useFactory: (prisma: PrismaService | null): PendientesRepositoryPort => {
        const registro = new Logger('Persistencia');

        if (prisma === null) {
          registro.warn('Sin DATABASE_URL: los pendientes se guardan en memoria.');

          return new InMemoryPendientesRepository();
        }

        registro.log('Pendientes sobre PostgreSQL.');

        return new PrismaPendientesRepository(prisma);
      },
      inject: [PRISMA],
    },
    {
      provide: PENDIENTES,
      useFactory: (pendientes: PendientesRepositoryPort) => new PendientesUseCaseImpl(pendientes),
      inject: [PENDIENTES_REPOSITORY],
    },
  ],
  exports: [PENDIENTES_REPOSITORY],
})
export class PendientesModule {}
