import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HealthController } from '../controllers/HealthController.js';
import { DomainExceptionFilter } from '../filters/DomainExceptionFilter.js';
import { RequestLoggingInterceptor } from '../logging/RequestLoggingInterceptor.js';
import { ActivityResultModule } from './ActivityResultModule.js';
import { type Configuracion, validarConfiguracion } from './environment.js';
import { CONFIGURACION } from './tokens.js';

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
    ActivityResultModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      // Unico punto del proyecto que lee process.env. Si la configuracion no
      // es valida, esto lanza durante el arranque y el servicio no llega a
      // aceptar peticiones. Es lo que queremos: es mejor no arrancar que
      // arrancar a medias y fallar mas tarde con un error confuso.
      provide: CONFIGURACION,
      useFactory: (): Configuracion => validarConfiguracion(process.env),
    },
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
