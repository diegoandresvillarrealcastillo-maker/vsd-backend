import { Module } from '@nestjs/common';
import { ConsultarAcompanamientoUseCaseImpl } from '../../application/usecases/ConsultarAcompanamientoUseCaseImpl.js';
import { ConsultarHistorialDelModuloUseCaseImpl } from '../../application/usecases/ConsultarHistorialDelModuloUseCaseImpl.js';
import { ConsultarProgresoUseCaseImpl } from '../../application/usecases/ConsultarProgresoUseCaseImpl.js';
import { ConsultarRachaUseCaseImpl } from '../../application/usecases/ConsultarRachaUseCaseImpl.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import type { SesionesRepositoryPort } from '../../domain/ports/out/SesionesRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { AcompanamientoController } from '../controllers/AcompanamientoController.js';
import { ProgresoController } from '../controllers/ProgresoController.js';
import { RachaController } from '../controllers/RachaController.js';
import { ActivityResultModule } from './ActivityResultModule.js';
import {
  ACTIVITY_REPOSITORY,
  ACTIVITY_RESULT_REPOSITORY,
  CONSULTAR_ACOMPANAMIENTO,
  CONSULTAR_HISTORIAL_DEL_MODULO,
  CONSULTAR_PROGRESO,
  CONSULTAR_RACHA,
  RECURSO_APOYO_REPOSITORY,
  SESIONES_REPOSITORY,
  USER_REPOSITORY,
} from './tokens.js';
import { UsuariosModule } from './UsuariosModule.js';

/**
 * Cableado del sendero por modulo (SCRUM-91).
 *
 * Vive aparte porque cruza dos cosas que no tienen por que conocerse: quien es
 * la persona, con sus modulos activos, y lo que hizo. Este modulo las junta y
 * ninguna de las dos depende de el.
 */
@Module({
  imports: [ActivityResultModule, UsuariosModule],
  controllers: [ProgresoController, RachaController, AcompanamientoController],
  providers: [
    {
      provide: CONSULTAR_PROGRESO,
      useFactory: (
        cuentas: UserRepositoryPort,
        catalogo: ActivityRepositoryPort,
        resultados: ActivityResultRepositoryPort,
        sesiones: SesionesRepositoryPort,
      ) => new ConsultarProgresoUseCaseImpl(cuentas, catalogo, resultados, sesiones),
      inject: [
        USER_REPOSITORY,
        ACTIVITY_REPOSITORY,
        ACTIVITY_RESULT_REPOSITORY,
        SESIONES_REPOSITORY,
      ],
    },
    {
      provide: CONSULTAR_HISTORIAL_DEL_MODULO,
      useFactory: (
        cuentas: UserRepositoryPort,
        catalogo: ActivityRepositoryPort,
        resultados: ActivityResultRepositoryPort,
      ) => new ConsultarHistorialDelModuloUseCaseImpl(cuentas, catalogo, resultados),
      inject: [USER_REPOSITORY, ACTIVITY_REPOSITORY, ACTIVITY_RESULT_REPOSITORY],
    },
    {
      provide: CONSULTAR_RACHA,
      useFactory: (cuentas: UserRepositoryPort, resultados: ActivityResultRepositoryPort) =>
        new ConsultarRachaUseCaseImpl(cuentas, resultados),
      inject: [USER_REPOSITORY, ACTIVITY_RESULT_REPOSITORY],
    },
    {
      provide: CONSULTAR_ACOMPANAMIENTO,
      useFactory: (
        cuentas: UserRepositoryPort,
        resultados: ActivityResultRepositoryPort,
        recursos: RecursoApoyoRepositoryPort,
        actividades: ActivityRepositoryPort,
      ) => new ConsultarAcompanamientoUseCaseImpl(cuentas, resultados, recursos, actividades),
      inject: [
        USER_REPOSITORY,
        ACTIVITY_RESULT_REPOSITORY,
        RECURSO_APOYO_REPOSITORY,
        ACTIVITY_REPOSITORY,
      ],
    },
  ],
})
export class ProgresoModule {}
