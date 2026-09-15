import 'reflect-metadata';

import { ConsoleLogger, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './config/AppModule.js';
import { configurarAplicacion } from './config/aplicacion.js';
import { Ambiente, type Configuracion } from './config/environment.js';
import { configurarDocumentacion } from './config/openapi.js';
import { CONFIGURACION } from './config/tokens.js';

/** Reconoce el error de Node cuando el puerto ya esta ocupado. */
function esPuertoOcupado(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error
    ? error.code === 'EADDRINUSE'
    : false;
}

/**
 * Arranque de la API de VSD Health.
 *
 * Deliberadamente corto: la configuracion de la aplicacion vive en
 * `aplicacion.ts` para que las pruebas de integracion puedan levantar la
 * aplicacion exactamente igual que aqui.
 */
async function arrancar(): Promise<void> {
  const registro = new Logger('Arranque');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

  const configuracion = app.get<Configuracion>(CONFIGURACION);

  // Fuera de local se escribe JSON de una linea por evento. Render y cualquier
  // otro proveedor recogen la salida estandar y la indexan, y con texto suelto
  // y codigos de color no hay forma de filtrar por estado o por ruta cuando
  // hace falta buscar algo. En local se deja el formato legible de siempre.
  if (configuracion.ambiente !== Ambiente.DESARROLLO) {
    app.useLogger(new ConsoleLogger({ json: true, colors: false, compact: true }));
  }

  configurarAplicacion(app, configuracion);
  configurarDocumentacion(app, configuracion);

  try {
    await app.listen(configuracion.puerto);
  } catch (error) {
    if (esPuertoOcupado(error)) {
      // El arranque se crea con bufferLogs, que retiene los registros hasta
      // que la aplicacion queda en pie. Aqui no va a quedar, asi que hay que
      // vaciarlos a mano o el mensaje no llega a imprimirse nunca.
      app.flushLogs();

      registro.error(`El puerto ${configuracion.puerto} ya esta en uso.`);
      registro.error('Casi siempre es una ejecucion anterior que quedo viva.');
      registro.error('En Windows, para ver quien lo ocupa y cerrarlo:');
      registro.error(`  netstat -ano | findstr :${configuracion.puerto}`);
      registro.error('  taskkill /PID <el numero de la ultima columna> /F');
      registro.error('O cambia PORT en tu archivo .env para usar otro puerto.');

      process.exit(1);
    }

    throw error;
  }

  registro.log(`VSD Health API escuchando en el puerto ${configuracion.puerto}`);
  registro.log(`Ambiente: ${configuracion.ambiente}`);

  if (!configuracion.esProduccion) {
    registro.log(`Documentacion disponible en http://localhost:${configuracion.puerto}/api/docs`);
  }
}

void arrancar();
