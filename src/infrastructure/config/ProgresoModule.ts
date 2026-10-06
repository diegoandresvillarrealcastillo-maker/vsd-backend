import { Module } from '@nestjs/common';
import { ConsultarProgresoUseCaseImpl } from '../../application/usecases/ConsultarProgresoUseCaseImpl.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { ProgresoController } from '../controllers/ProgresoController.js';
import { ActivityResultModule } from './ActivityResultModule.js';
import {
  ACTIVITY_REPOSITORY,
  ACTIVITY_RESULT_REPOSITORY,
  CONSULTAR_PROGRESO,
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
  controllers: [ProgresoController],
  providers: [
    {
      provide: CONSULTAR_PROGRESO,
      useFactory: (
        cuentas: UserRepositoryPort,
        catalogo: ActivityRepositoryPort,
        resultados: ActivityResultRepositoryPort,
      ) => new ConsultarProgresoUseCaseImpl(cuentas, catalogo, resultados),
      inject: [USER_REPOSITORY, ACTIVITY_REPOSITORY, ACTIVITY_RESULT_REPOSITORY],
    },
  ],
})
export class ProgresoModule {}
