import { resolve } from 'node:path';
import { defineConfig } from 'prisma/config';

// Configuracion separada: nunca carga dotenv ni DIRECT_URL.
export default defineConfig({
  schema: resolve('prisma/schema.prisma'),
  migrations: { path: resolve('prisma/migrations') },
  datasource: { url: 'postgresql://qa_owner:qa_local_only@127.0.0.1:55440/vsd_qa_k6' },
});
