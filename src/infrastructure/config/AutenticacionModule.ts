import { Global, Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import type { RegistroDeSeguridadPort } from '../../domain/ports/out/RegistroDeSeguridadPort.js';
import { GuardiaDeSesion } from '../auth/GuardiaDeSesion.js';
import { VerificadorDeIdentidad } from '../auth/VerificadorDeIdentidad.js';
import type { Configuracion } from './environment.js';
import { CONFIGURACION, REGISTRO_DE_SEGURIDAD } from './tokens.js';

/**
 * Quien es quien: verificacion del token en cada peticion.
 *
 * El guardia se registra con `APP_GUARD`, que lo aplica a **toda** la API de
 * una vez. Es la diferencia entre "las rutas protegidas son las que alguien se
 * acordo de decorar" y "las rutas abiertas son las que alguien decidio abrir",
 * y solo la segunda se puede revisar leyendo una lista corta.
 *
 * El modulo es global porque el guardia lo es: no tendria sentido importarlo
 * modulo a modulo cuando se aplica a todos.
 */
@Global()
@Module({
  providers: [
    {
      provide: VerificadorDeIdentidad,
      useFactory: (configuracion: Configuracion) =>
        new VerificadorDeIdentidad(configuracion.urlDeSupabase),
      inject: [CONFIGURACION],
    },
    {
      provide: APP_GUARD,
      useFactory: (
        verificador: VerificadorDeIdentidad,
        reflector: Reflector,
        seguridad: RegistroDeSeguridadPort,
      ) => new GuardiaDeSesion(verificador, reflector, seguridad),
      inject: [VerificadorDeIdentidad, Reflector, REGISTRO_DE_SEGURIDAD],
    },
  ],
  exports: [VerificadorDeIdentidad],
})
export class AutenticacionModule {}
