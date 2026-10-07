import { Logger, Module } from '@nestjs/common';
import { ConsultarDiarioUseCaseImpl } from '../../application/usecases/ConsultarDiarioUseCaseImpl.js';
import { EditarAnotacionUseCaseImpl } from '../../application/usecases/EditarAnotacionUseCaseImpl.js';
import { EscribirEnElDiarioUseCaseImpl } from '../../application/usecases/EscribirEnElDiarioUseCaseImpl.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import { DiarioController } from '../controllers/DiarioController.js';
import type { PrismaService } from '../persistence/PrismaService.js';
import { InMemoryDiarioRepository } from '../repositories/InMemoryDiarioRepository.js';
import { PrismaDiarioRepository } from '../repositories/PrismaDiarioRepository.js';
import { ActivityResultModule } from './ActivityResultModule.js';
import {
  CONSULTAR_DIARIO,
  DIARIO_REPOSITORY,
  EDITAR_ANOTACION,
  ESCRIBIR_EN_EL_DIARIO,
  PRISMA,
  RECURSO_APOYO_REPOSITORY,
} from './tokens.js';

/**
 * Cableado del diario (SCRUM-95).
 *
 * El repositorio vivia en el modulo de cuentas, que lo usaba solo para la
 * exportacion de datos. Ahora el diario tiene sus rutas y su modulo, y es el
 * de cuentas el que lo importa de aqui.
 *
 * Importa el de resultados para alcanzar Prisma y las lineas de atencion: una
 * anotacion con una senal de riesgo las devuelve igual que un resultado.
 */
@Module({
  imports: [ActivityResultModule],
  controllers: [DiarioController],
  providers: [
    {
      provide: DIARIO_REPOSITORY,
      useFactory: (prisma: PrismaService | null): DiarioRepositoryPort => {
        const registro = new Logger('Persistencia');

        if (prisma === null) {
          registro.warn('Sin DATABASE_URL: el diario se guarda en memoria.');

          return new InMemoryDiarioRepository();
        }

        registro.log('Diario sobre PostgreSQL.');

        return new PrismaDiarioRepository(prisma);
      },
      inject: [PRISMA],
    },
    {
      provide: CONSULTAR_DIARIO,
      useFactory: (diario: DiarioRepositoryPort) => new ConsultarDiarioUseCaseImpl(diario),
      inject: [DIARIO_REPOSITORY],
    },
    {
      provide: ESCRIBIR_EN_EL_DIARIO,
      useFactory: (diario: DiarioRepositoryPort, recursos: RecursoApoyoRepositoryPort) =>
        new EscribirEnElDiarioUseCaseImpl(diario, recursos),
      inject: [DIARIO_REPOSITORY, RECURSO_APOYO_REPOSITORY],
    },
    {
      provide: EDITAR_ANOTACION,
      useFactory: (diario: DiarioRepositoryPort, recursos: RecursoApoyoRepositoryPort) =>
        new EditarAnotacionUseCaseImpl(diario, recursos),
      inject: [DIARIO_REPOSITORY, RECURSO_APOYO_REPOSITORY],
    },
  ],
  exports: [DIARIO_REPOSITORY],
})
export class DiarioModule {}
