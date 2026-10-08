import { Module } from '@nestjs/common';
import { ConsultarLasReglasLocalesUseCaseImpl } from '../../application/usecases/ConsultarLasReglasLocalesUseCaseImpl.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import { AsistentePorReglas } from '../asistente/AsistentePorReglas.js';
import { AsistenteController } from '../controllers/AsistenteController.js';
import { ReglasLocalesDelAsistenteController } from '../controllers/ReglasLocalesDelAsistenteController.js';
import { ActivityResultModule } from './ActivityResultModule.js';
import {
  ACTIVITY_RESULT_REPOSITORY,
  ASISTENTE,
  CONSULTAR_REGLAS_LOCALES,
  RECURSO_APOYO_REPOSITORY,
} from './tokens.js';

/**
 * Cableado de VSD IA.
 *
 * Lo unico que decide este modulo es **cual** adaptador se entrega. Hoy solo
 * hay uno, el de reglas. En la Fase 2 habra un segundo que usa un modelo de
 * lenguaje, y sera aqui, en una linea, donde se elija entre los dos.
 *
 * El de reglas no se retira ese dia: queda como respaldo. Un modelo necesita
 * conexion y el RF9 dice que la aplicacion funciona sin ella.
 *
 * Los recursos de apoyo los provee `ActivityResultModule` desde SCRUM-94: los
 * resultados tambien devuelven las lineas de atencion, y asi las dos partes
 * leen la misma base de conocimiento.
 *
 * Desde SCRUM-141 tambien publica esas reglas (`ReglasLocalesDelAsistente`),
 * para que el dispositivo responda lo basico sin conexion. Se arman con los
 * mismos datos y la misma tabla de recursos que lee el asistente.
 */
@Module({
  imports: [ActivityResultModule],
  controllers: [AsistenteController, ReglasLocalesDelAsistenteController],
  providers: [
    {
      provide: ASISTENTE,
      useFactory: (
        recursos: RecursoApoyoRepositoryPort,
        resultados: ActivityResultRepositoryPort,
      ) => new AsistentePorReglas(recursos, resultados),
      inject: [RECURSO_APOYO_REPOSITORY, ACTIVITY_RESULT_REPOSITORY],
    },
    {
      provide: CONSULTAR_REGLAS_LOCALES,
      useFactory: (recursos: RecursoApoyoRepositoryPort) =>
        new ConsultarLasReglasLocalesUseCaseImpl(recursos),
      inject: [RECURSO_APOYO_REPOSITORY],
    },
  ],
})
export class AsistenteModule {}
