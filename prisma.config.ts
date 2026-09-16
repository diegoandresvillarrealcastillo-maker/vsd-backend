import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Configuracion de las herramientas de Prisma.
 *
 * Desde Prisma 7 las URL de conexion salieron de `schema.prisma`. Aqui vive la
 * que usan las migraciones, y la de la aplicacion la recibe el cliente a
 * traves de un adaptador.
 *
 * Las migraciones usan `DIRECT_URL`, la conexion directa en el puerto 5432, y
 * no la agrupada: el pooler en modo transaccion no admite las sentencias que
 * una migracion necesita.
 *
 * ## Por que la URL no se exige aqui
 *
 * `prisma generate` **no se conecta a nada**: solo lee el esquema y escribe el
 * cliente. Quien necesita conexion es `prisma migrate`.
 *
 * Si esta linea usara el ayudante `env()` de Prisma, la variable seria
 * obligatoria para cargar el archivo, y entonces generar el cliente fallaria
 * en cualquier sitio sin `.env`. El CI es exactamente ese sitio: instala las
 * dependencias, genera el cliente y compila, sin base de datos ni ganas de
 * tenerla.
 *
 * Con la cadena vacia, generar funciona y migrar falla diciendo que no hay
 * conexion, que es la verdad.
 *
 * Ninguna credencial vive en este archivo: salen del entorno, y `.env` esta
 * ignorado por Git.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env['DIRECT_URL'] ?? '',
  },
});
