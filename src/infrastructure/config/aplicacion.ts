import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import {
  CABECERA_DE_PETICION,
  identificadorDePeticion,
} from '../logging/identificadorDePeticion.js';
import type { Configuracion } from './environment.js';

/** Peticiones permitidas por direccion IP dentro de la ventana. */
export const LIMITE_DE_PETICIONES = 120;
export const VENTANA_DEL_LIMITE_MS = 60_000;

/**
 * Aplica a la aplicacion todo lo que no son rutas: protecciones, validacion
 * de entrada y politica de origenes.
 *
 * Vive aparte de `main.ts` a proposito, para que **las pruebas de integracion
 * levanten la aplicacion con exactamente la misma configuracion que
 * produccion**. Si el arranque real y el de las pruebas divergieran, las
 * pruebas dejarian de demostrar nada sobre el comportamiento real.
 *
 * El orden importa: primero las protecciones, despues la validacion.
 */
export function configurarAplicacion(
  app: NestExpressApplication,
  configuracion: Configuracion,
): void {
  // No anunciar la tecnologia del servidor. Es un dato gratis para quien
  // busque vulnerabilidades conocidas de una version concreta.
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  // Lo primero de la cadena, antes incluso del limite de peticiones, para que
  // hasta un 429 salga con su identificador. Un error sin identificador es
  // justamente el que nadie puede rastrear despues.
  app.use(identificadorDePeticion());

  // Cabeceras de seguridad: evita el sniffing de tipo de contenido, el
  // encuadre de la API en marcos ajenos y la fuga del referente.
  app.use(helmet());

  // Limite por direccion IP. Es imperfecto, porque varias personas detras del
  // mismo enrutador comparten direccion, pero es lo que se puede hacer sin
  // usuarios autenticados. En el Ciclo 5, con identidad, podra aplicarse
  // tambien por cuenta.
  app.use(
    rateLimit({
      windowMs: VENTANA_DEL_LIMITE_MS,
      limit: LIMITE_DE_PETICIONES,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: {
        codigo: 'DEMASIADAS_PETICIONES',
        mensaje: 'Has hecho demasiadas peticiones. Espera un momento.',
      },
    }),
  );

  app.enableCors({
    // Se copia porque enableCors espera un arreglo mutable.
    origin: [...configuracion.origenesAutorizados],
    credentials: true,

    // Sin esto el navegador **no deja leer** la cabecera desde otro origen,
    // aunque el servidor la envie. Es un detalle que se olvida con facilidad y
    // cuyo sintoma es confuso: la cabecera esta en la respuesta si se mira con
    // curl, y `headers.get` devuelve null en el navegador.
    exposedHeaders: [CABECERA_DE_PETICION],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // Descarta lo que no este declarado en el DTO...
      whitelist: true,
      // ...y ademas lo rechaza, en lugar de ignorarlo en silencio. Un campo
      // inesperado suele significar que el cliente y la API no coinciden, y
      // es mejor enterarse con un 400 que con datos perdidos sin aviso.
      // Tambien frena la asignacion masiva: enviar un campo que no existe en
      // el DTO, como "esAdministrador", se rechaza en lugar de colarse.
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );
}
