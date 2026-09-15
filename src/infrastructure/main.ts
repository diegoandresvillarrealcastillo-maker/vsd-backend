import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './config/AppModule.js';
import { configurarAplicacion } from './config/aplicacion.js';
import type { Configuracion } from './config/environment.js';
import { configurarDocumentacion } from './config/openapi.js';
import { CONFIGURACION } from './config/tokens.js';

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

  configurarAplicacion(app, configuracion);
  configurarDocumentacion(app, configuracion);

  await app.listen(configuracion.puerto);

  registro.log(`VSD Health API escuchando en el puerto ${configuracion.puerto}`);
  registro.log(`Ambiente: ${configuracion.ambiente}`);

  if (!configuracion.esProduccion) {
    registro.log(`Documentacion disponible en http://localhost:${configuracion.puerto}/api/docs`);
  }
}

void arrancar();
