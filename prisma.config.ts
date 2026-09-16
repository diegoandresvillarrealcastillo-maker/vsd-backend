import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * Configuracion de las herramientas de Prisma.
 *
 * Desde Prisma 7 las URL de conexion salieron de `schema.prisma`. Aqui vive
 * la que usan las migraciones, y la de la aplicacion la recibe el cliente a
 * traves de un adaptador.
 *
 * Las migraciones usan `DIRECT_URL`, la conexion directa en el puerto 5432,
 * y no la agrupada: el pooler en modo transaccion no admite las sentencias
 * que una migracion necesita.
 *
 * Ninguna credencial vive en este archivo. Salen del entorno, y `.env` esta
 * ignorado por Git.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_URL'),
  },
});
