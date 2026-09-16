import { Global, Module } from '@nestjs/common';
import { type Configuracion, validarConfiguracion } from './environment.js';
import { CONFIGURACION } from './tokens.js';

/**
 * Configuracion del servicio, disponible en toda la aplicacion.
 *
 * Vive en su propio modulo porque ahora la necesitan varios: el arranque, para
 * el puerto y CORS, y el cableado de persistencia, para decidir si hay base de
 * datos. En NestJS los proveedores no bajan solos a los modulos hijos, asi que
 * o se exporta o se declara global. Se elige global: la configuracion es una
 * sola para todo el proceso y pasarla modulo a modulo seria ceremonia sin
 * ganancia.
 *
 * Es el unico punto del proyecto que lee `process.env`. Si la configuracion no
 * es valida, esto lanza durante el arranque y el servicio no llega a aceptar
 * peticiones. Es lo que queremos: mejor no arrancar que arrancar a medias y
 * fallar mas tarde con un error confuso.
 */
@Global()
@Module({
  providers: [
    {
      provide: CONFIGURACION,
      useFactory: (): Configuracion => validarConfiguracion(process.env),
    },
  ],
  exports: [CONFIGURACION],
})
export class ConfiguracionModule {}
