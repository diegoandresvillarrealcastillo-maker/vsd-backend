import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HealthController } from '../controllers/HealthController.js';
import { DomainExceptionFilter } from '../filters/DomainExceptionFilter.js';
import { InterceptorDeLimitePorCuenta } from '../limites/LimitePorCuenta.js';
import { RequestLoggingInterceptor } from '../logging/RequestLoggingInterceptor.js';
import { ActivityResultModule } from './ActivityResultModule.js';
import { AsistenteModule } from './AsistenteModule.js';
import { AutenticacionModule } from './AutenticacionModule.js';
import { AvisosModule } from './AvisosModule.js';
import { ConfiguracionModule } from './ConfiguracionModule.js';
import { DiarioModule } from './DiarioModule.js';
import { PendientesModule } from './PendientesModule.js';
import { ProgresoModule } from './ProgresoModule.js';
import { SeguridadModule } from './SeguridadModule.js';
import { UsuariosModule } from './UsuariosModule.js';

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
    // El registro de seguridad lo usan los guardias, el filtro de errores y la
    // cuenta, asi que se declara antes que todos ellos.
    SeguridadModule,
    // Antes que los modulos con rutas: el guardia que registra se aplica a
    // todas ellas.
    AutenticacionModule,
    ActivityResultModule,
    UsuariosModule,
    ProgresoModule,
    DiarioModule,
    PendientesModule,
    AvisosModule,
    AsistenteModule,
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
    {
      // Los topes por cuenta de las rutas que cuestan (S-03 de la auditoria 360).
      // Es un interceptor porque necesita la identidad ya verificada, y esa existe
      // despues de los guardias.
      provide: APP_INTERCEPTOR,
      useClass: InterceptorDeLimitePorCuenta,
    },
  ],
})
export class AppModule {}
