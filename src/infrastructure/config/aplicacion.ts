import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { json, type NextFunction, type Request, type Response } from 'express';
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
 * Tamano maximo del cuerpo en el diario (SCRUM-95).
 *
 * El resto de la API se queda en los 100 KB por defecto. El diario necesita
 * mas por los diagramas, que pesan mucho mas que el texto; el dominio pone
 * los limites finos de cada parte.
 */
export const LIMITE_DEL_CUERPO_DEL_DIARIO = '1mb';

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

  // Solo para el diario, y antes del lector general que NestJS registra al
  // iniciar: este lee el cuerpo, y el general ve que ya esta leido y no lo
  // vuelve a leer con su limite.
  //
  // Va envuelto en una funcion con nombre propio a proposito. NestJS decide si
  // registra su lector general buscando una capa llamada `jsonParser`, y si
  // este se llamara asi, creeria que ya hay uno y dejaria sin leer el cuerpo
  // de todas las demas rutas.
  const lectorDelDiario = json({ limit: LIMITE_DEL_CUERPO_DEL_DIARIO });

  app.use(
    '/api/diario',
    function leerCuerpoDelDiario(peticion: Request, respuesta: Response, siguiente: NextFunction) {
      lectorDelDiario(peticion, respuesta, siguiente);
    },
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
