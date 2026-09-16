import { Logger, Module } from '@nestjs/common';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import { AsistentePorReglas } from '../asistente/AsistentePorReglas.js';
import { AsistenteController } from '../controllers/AsistenteController.js';
import type { PrismaService } from '../persistence/PrismaService.js';
import { InMemoryRecursoApoyoRepository } from '../repositories/InMemoryRecursoApoyoRepository.js';
import { PrismaRecursoApoyoRepository } from '../repositories/PrismaRecursoApoyoRepository.js';
import { ActivityResultModule } from './ActivityResultModule.js';
import {
  ACTIVITY_RESULT_REPOSITORY,
  ASISTENTE,
  PRISMA,
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
 */
@Module({
  imports: [ActivityResultModule],
  controllers: [AsistenteController],
  providers: [
    {
      provide: RECURSO_APOYO_REPOSITORY,
      useFactory: (prisma: PrismaService | null): RecursoApoyoRepositoryPort => {
        const registro = new Logger('Asistente');

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
      provide: ASISTENTE,
      useFactory: (
        recursos: RecursoApoyoRepositoryPort,
        resultados: ActivityResultRepositoryPort,
      ) => new AsistentePorReglas(recursos, resultados),
      inject: [RECURSO_APOYO_REPOSITORY, ACTIVITY_RESULT_REPOSITORY],
    },
  ],
})
export class AsistenteModule {}
