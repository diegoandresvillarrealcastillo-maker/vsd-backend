import { randomBytes } from 'node:crypto';
import { Global, Logger, Module } from '@nestjs/common';
import type { RegistroDeSeguridadPort } from '../../domain/ports/out/RegistroDeSeguridadPort.js';
import { EnvioHttpDeEventos } from '../seguridad/EnvioHttpDeEventos.js';
import { crearHuellaDeIp } from '../seguridad/huellaDeIp.js';
import {
  RegistroDeSeguridadEnSalida,
  RegistroDeSeguridadNulo,
} from '../seguridad/RegistroDeSeguridadEnSalida.js';
import { Ambiente, type Configuracion } from './environment.js';
import { CONFIGURACION, REGISTRO_DE_SEGURIDAD } from './tokens.js';

/**
 * Arma el registro de seguridad segun la configuracion (SCRUM-163).
 *
 * - **Pruebas**: no escribe nada. Las suites que quieren ver los eventos
 *   reemplazan este proveedor por uno que los guarde.
 * - **Lo demas**: una linea JSON por evento en la salida estandar y, si una
 *   persona configuro un servicio externo, una copia por HTTP.
 *
 * Sin `REGISTRO_SEGURIDAD_CLAVE_IP` la huella de las IP usa una clave al azar por
 * arranque: sirve para comparar eventos dentro de un mismo despliegue, no entre
 * despliegues. Se dice una vez al arrancar para que nadie lo descubra tarde.
 */
export function crearElRegistroDeSeguridad(configuracion: Configuracion): RegistroDeSeguridadPort {
  if (configuracion.ambiente === Ambiente.PRUEBAS) {
    return new RegistroDeSeguridadNulo();
  }

  const { envio, claveDeIp } = configuracion.registroDeSeguridad;
  const registro = new Logger('RegistroDeSeguridad');

  if (claveDeIp === undefined) {
    registro.warn(
      'Sin REGISTRO_SEGURIDAD_CLAVE_IP: las huellas de IP solo se pueden comparar dentro de este arranque.',
    );
  }

  const copia =
    envio === undefined
      ? undefined
      : new EnvioHttpDeEventos(envio.url, envio.token, {
          ...(envio.cabecera === undefined ? {} : { cabecera: envio.cabecera }),
        });

  copia?.iniciar();

  return new RegistroDeSeguridadEnSalida({
    ambiente: configuracion.ambiente,
    huellaDeIp: crearHuellaDeIp(claveDeIp ?? randomBytes(32)),
    ...(copia === undefined ? {} : { copiarA: copia }),
  });
}

/**
 * El registro de seguridad, disponible en toda la aplicacion.
 *
 * Es global por la misma razon que el guardia de sesion: lo necesitan los
 * guardias, el filtro de errores y los controladores, y pasarlo modulo a modulo
 * seria ceremonia.
 */
@Global()
@Module({
  providers: [
    {
      provide: REGISTRO_DE_SEGURIDAD,
      useFactory: crearElRegistroDeSeguridad,
      inject: [CONFIGURACION],
    },
  ],
  exports: [REGISTRO_DE_SEGURIDAD],
})
export class SeguridadModule {}
