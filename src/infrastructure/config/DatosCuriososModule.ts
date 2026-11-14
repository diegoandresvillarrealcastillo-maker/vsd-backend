import { Logger, Module } from '@nestjs/common';
import { ConsultarDatoCuriosoUseCaseImpl } from '../../application/usecases/ConsultarDatoCuriosoUseCaseImpl.js';
import type { DatoCuriosoRepositoryPort } from '../../domain/ports/out/DatoCuriosoRepositoryPort.js';
import { DatosCuriososController } from '../controllers/DatosCuriososController.js';
import type { PrismaService } from '../persistence/PrismaService.js';
import { InMemoryDatoCuriosoRepository } from '../repositories/InMemoryDatoCuriosoRepository.js';
import { PrismaDatoCuriosoRepository } from '../repositories/PrismaDatoCuriosoRepository.js';
import { ActivityResultModule } from './ActivityResultModule.js';
import { CONSULTAR_DATO_CURIOSO, DATO_CURIOSO_REPOSITORY, PRISMA } from './tokens.js';

/**
 * Cableado de los datos curiosos del dia (SCRUM-185, ADR 0025).
 *
 * Importa el modulo de resultados solo para alcanzar Prisma, como el semaforo y el diario. No
 * depende de `UsuariosModule`: el caso de uso recibe la cuenta ya cargada por el guardia, y
 * asi la exportacion de datos, que vive alla, puede importar este modulo sin un ciclo.
 */
@Module({
  imports: [ActivityResultModule],
  controllers: [DatosCuriososController],
  providers: [
    {
      provide: DATO_CURIOSO_REPOSITORY,
      useFactory: (prisma: PrismaService | null): DatoCuriosoRepositoryPort => {
        const registro = new Logger('Persistencia');

        if (prisma === null) {
          registro.warn('Sin DATABASE_URL: los datos curiosos salen de una lista de ejemplo.');

          return new InMemoryDatoCuriosoRepository();
        }

        registro.log('Datos curiosos sobre PostgreSQL.');

        return new PrismaDatoCuriosoRepository(prisma);
      },
      inject: [PRISMA],
    },
    {
      provide: CONSULTAR_DATO_CURIOSO,
      useFactory: (datos: DatoCuriosoRepositoryPort) => new ConsultarDatoCuriosoUseCaseImpl(datos),
      inject: [DATO_CURIOSO_REPOSITORY],
    },
  ],
  exports: [DATO_CURIOSO_REPOSITORY],
})
export class DatosCuriososModule {}
