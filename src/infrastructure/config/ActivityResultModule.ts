import { Module } from '@nestjs/common';
import { ActivityResultService } from '../../application/services/ActivityResultService.js';
import { RegisterActivityResultUseCaseImpl } from '../../application/usecases/RegisterActivityResultUseCaseImpl.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import { ActivityResultController } from '../controllers/ActivityResultController.js';
import { InMemoryActivityResultRepository } from '../repositories/InMemoryActivityResultRepository.js';
import { ACTIVITY_RESULT_REPOSITORY } from './tokens.js';

/**
 * Cableado de dependencias de los resultados de actividad.
 *
 * Sustituye al cableado manual de ApplicationConfig para todo lo que pasa por
 * HTTP. Hace exactamente lo mismo, de forma declarativa.
 *
 * Fijate en lo que NO ocurre aqui: ni el caso de uso ni el servicio llevan un
 * solo decorador de NestJS. Son clases de TypeScript corriente que se
 * construyen con `useFactory`. Por eso siguen siendo ejecutables y probables
 * sin framework, que es todo el sentido del ADR 0006.
 *
 * El dia que llegue Prisma en el Ciclo 4, lo unico que cambia es la linea que
 * decide quien implementa ACTIVITY_RESULT_REPOSITORY.
 */
@Module({
  controllers: [ActivityResultController],
  providers: [
    {
      provide: ACTIVITY_RESULT_REPOSITORY,
      useClass: InMemoryActivityResultRepository,
    },
    {
      provide: RegisterActivityResultUseCaseImpl,
      useFactory: (repositorio: ActivityResultRepositoryPort) =>
        new RegisterActivityResultUseCaseImpl(repositorio),
      inject: [ACTIVITY_RESULT_REPOSITORY],
    },
    {
      provide: ActivityResultService,
      useFactory: (casoDeUso: RegisterActivityResultUseCaseImpl) =>
        new ActivityResultService(casoDeUso),
      inject: [RegisterActivityResultUseCaseImpl],
    },
  ],
})
export class ActivityResultModule {}
