import { Logger, Module } from '@nestjs/common';
import { ActivityResultService } from '../../application/services/ActivityResultService.js';
import { ConsultarCatalogoUseCaseImpl } from '../../application/usecases/ConsultarCatalogoUseCaseImpl.js';
import { RegisterActivityResultUseCaseImpl } from '../../application/usecases/RegisterActivityResultUseCaseImpl.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import { ActivityResultController } from '../controllers/ActivityResultController.js';
import { CatalogoController } from '../controllers/CatalogoController.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { InMemoryActivityRepository } from '../repositories/InMemoryActivityRepository.js';
import { InMemoryActivityResultRepository } from '../repositories/InMemoryActivityResultRepository.js';
import { InMemoryRecursoApoyoRepository } from '../repositories/InMemoryRecursoApoyoRepository.js';
import { PrismaActivityRepository } from '../repositories/PrismaActivityRepository.js';
import { PrismaActivityResultRepository } from '../repositories/PrismaActivityResultRepository.js';
import { PrismaRecursoApoyoRepository } from '../repositories/PrismaRecursoApoyoRepository.js';
import { Ambiente, type Configuracion } from './environment.js';
import {
  ACTIVITY_REPOSITORY,
  ACTIVITY_RESULT_REPOSITORY,
  CONFIGURACION,
  CONSULTAR_CATALOGO,
  PRISMA,
  RECURSO_APOYO_REPOSITORY,
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
  controllers: [ActivityResultController, CatalogoController],
  providers: [
    {
      provide: PRISMA,
      useFactory: (configuracion: Configuracion): PrismaService | null =>
        configuracion.urlBaseDeDatos === undefined
          ? null
          : new PrismaService(
              configuracion.urlBaseDeDatos,
              // Fuera de desarrollo, una conexion que se salte las politicas
              // de aislamiento impide arrancar. Es preferible un servicio
              // caido y evidente a uno en pie que ya no protege nada.
              configuracion.ambiente !== Ambiente.DESARROLLO,
            ),
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
      // Vive aqui y no en el modulo del asistente porque ahora lo usan los dos:
      // registrar un resultado que sugiere apoyo devuelve las lineas de
      // atencion (SCRUM-94). El asistente lo recibe importando este modulo.
      provide: RECURSO_APOYO_REPOSITORY,
      useFactory: (prisma: PrismaService | null): RecursoApoyoRepositoryPort => {
        const registro = new Logger('Recursos');

        if (prisma === null) {
          // No es un juego de datos falsos: el adaptador en memoria trae las
          // mismas lineas de atencion que la base. Un asistente que en local
          // responde con telefonos inventados no se puede revisar antes de
          // publicarlo.
          registro.warn('Sin DATABASE_URL: los recursos de apoyo salen del catalogo en memoria.');

          return new InMemoryRecursoApoyoRepository();
        }

        registro.log('Recursos de apoyo sobre PostgreSQL.');

        return new PrismaRecursoApoyoRepository(prisma);
      },
      inject: [PRISMA],
    },
    {
      provide: RegisterActivityResultUseCaseImpl,
      useFactory: (
        repositorio: ActivityResultRepositoryPort,
        actividades: ActivityRepositoryPort,
        recursos: RecursoApoyoRepositoryPort,
      ) => new RegisterActivityResultUseCaseImpl(repositorio, actividades, recursos),
      inject: [ACTIVITY_RESULT_REPOSITORY, ACTIVITY_REPOSITORY, RECURSO_APOYO_REPOSITORY],
    },
    {
      provide: ActivityResultService,
      useFactory: (casoDeUso: RegisterActivityResultUseCaseImpl) =>
        new ActivityResultService(casoDeUso),
      inject: [RegisterActivityResultUseCaseImpl],
    },
    {
      provide: CONSULTAR_CATALOGO,
      useFactory: (actividades: ActivityRepositoryPort) =>
        new ConsultarCatalogoUseCaseImpl(actividades),
      inject: [ACTIVITY_REPOSITORY],
    },
  ],
  exports: [ACTIVITY_RESULT_REPOSITORY, ACTIVITY_REPOSITORY, RECURSO_APOYO_REPOSITORY, PRISMA],
})
export class ActivityResultModule {}
