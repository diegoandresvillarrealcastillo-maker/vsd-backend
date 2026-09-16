import { Logger, Module } from '@nestjs/common';
import { ActivityResultService } from '../../application/services/ActivityResultService.js';
import { RegisterActivityResultUseCaseImpl } from '../../application/usecases/RegisterActivityResultUseCaseImpl.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import { ActivityResultController } from '../controllers/ActivityResultController.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { InMemoryActivityRepository } from '../repositories/InMemoryActivityRepository.js';
import { InMemoryActivityResultRepository } from '../repositories/InMemoryActivityResultRepository.js';
import { PrismaActivityRepository } from '../repositories/PrismaActivityRepository.js';
import { PrismaActivityResultRepository } from '../repositories/PrismaActivityResultRepository.js';
import type { Configuracion } from './environment.js';
import {
  ACTIVITY_REPOSITORY,
  ACTIVITY_RESULT_REPOSITORY,
  CONFIGURACION,
  PRISMA,
} from './tokens.js';

/**
 * Cableado de dependencias de los resultados de actividad.
 *
 * Fijate en lo que NO ocurre aqui: ni el caso de uso ni el servicio llevan un
 * solo decorador de NestJS. Son clases de TypeScript corriente que se
 * construyen con `useFactory`. Por eso siguen siendo ejecutables y probables
 * sin framework, que es todo el sentido del ADR 0006.
 *
 * ## Que adaptador se usa
 *
 * Lo decide la configuracion, no el codigo de negocio. Si hay `DATABASE_URL`
 * se usa PostgreSQL; si no, el adaptador en memoria.
 *
 * Esa eleccion **no puede pasar desapercibida en produccion**, asi que la
 * configuracion no deja arrancar sin base de datos en preproduccion ni en
 * produccion. Guardar en memoria ahi seria perder resultados de personas
 * reales sin que nadie se entere hasta que alguien pregunte por su historial.
 *
 * Y se anota en el registro cual quedo activo: una linea al arrancar ahorra
 * horas de buscar por que los datos no aparecen.
 */
@Module({
  controllers: [ActivityResultController],
  providers: [
    {
      provide: PRISMA,
      useFactory: (configuracion: Configuracion): PrismaService | null =>
        configuracion.urlBaseDeDatos === undefined
          ? null
          : new PrismaService(configuracion.urlBaseDeDatos),
      inject: [CONFIGURACION],
    },
    {
      provide: ACTIVITY_RESULT_REPOSITORY,
      useFactory: (prisma: PrismaService | null, actividades: ActivityRepositoryPort) => {
        const registro = new Logger('Persistencia');

        if (prisma === null) {
          registro.warn('Sin DATABASE_URL: los resultados se guardan en memoria.');

          return new InMemoryActivityResultRepository();
        }

        registro.log('Resultados sobre PostgreSQL.');

        return new PrismaActivityResultRepository(prisma, actividades);
      },
      inject: [PRISMA, ACTIVITY_REPOSITORY],
    },
    {
      provide: ACTIVITY_REPOSITORY,
      useFactory: (prisma: PrismaService | null): ActivityRepositoryPort =>
        prisma === null ? new InMemoryActivityRepository() : new PrismaActivityRepository(prisma),
      inject: [PRISMA],
    },
    {
      provide: RegisterActivityResultUseCaseImpl,
      useFactory: (
        repositorio: ActivityResultRepositoryPort,
        actividades: ActivityRepositoryPort,
      ) => new RegisterActivityResultUseCaseImpl(repositorio, actividades),
      inject: [ACTIVITY_RESULT_REPOSITORY, ACTIVITY_REPOSITORY],
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
