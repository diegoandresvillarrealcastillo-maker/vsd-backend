import 'reflect-metadata';

import { writeFileSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule.js';
import { construirDocumento } from './openapi.js';

/**
 * Genera openapi.json sin levantar el servidor.
 *
 * Lo usa el guion `npm run openapi`. El archivo resultante es el que consumira
 * el frontend en el Ciclo 6 para generar sus tipos, y el que permite revisar
 * en un Pull Request si un cambio rompe el contrato con el cliente.
 */
async function generar(): Promise<void> {
  // Valores minimos para que la configuracion valide: este guion no atiende
  // peticiones, solo necesita que el modulo se pueda construir.
  process.env.CORS_ORIGIN ??= 'http://localhost:5173';

  const app = await NestFactory.create(AppModule, { logger: false });

  await app.init();

  writeFileSync('openapi.json', JSON.stringify(construirDocumento(app), null, 2) + '\n', 'utf8');

  await app.close();

  console.log('openapi.json generado.');
}

void generar();
