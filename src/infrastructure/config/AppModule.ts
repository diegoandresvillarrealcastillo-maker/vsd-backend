import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HealthController } from '../controllers/HealthController.js';
import { DomainExceptionFilter } from '../filters/DomainExceptionFilter.js';
import { RequestLoggingInterceptor } from '../logging/RequestLoggingInterceptor.js';
import { ActivityResultModule } from './ActivityResultModule.js';
import { ConfiguracionModule } from './ConfiguracionModule.js';

/**
 * Modulo raiz de la API.
 *
 * Es el punto donde el framework se encuentra con la aplicacion. Todo lo que
 * hay aqui es infraestructura: configuracion, transporte HTTP, registro de
 * eventos y traduccion de errores. Ninguna regla de negocio.
 */
@Module({
  imports: [
    // Carga el archivo .env a las variables de entorno del proceso. La
    // validacion la hace el proveedor de abajo.
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ConfiguracionModule,
    ActivityResultModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
  ],
})
export class AppModule {}
