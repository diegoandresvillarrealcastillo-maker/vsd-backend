import { resolve } from 'node:path';
import { defineConfig } from 'prisma/config';

// Configuracion separada: nunca carga dotenv ni DIRECT_URL.
const port = Number(process.env.VSD_QA_PG_PORT ?? '55440');

export default defineConfig({
  schema: resolve('prisma/schema.prisma'),
  migrations: { path: resolve('prisma/migrations') },
  datasource: { url: `postgresql://qa_owner:qa_local_only@127.0.0.1:${port}/vsd_qa_k6` },
});
