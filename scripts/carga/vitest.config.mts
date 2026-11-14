import { defineConfig } from 'vitest/config';

export default defineConfig({
  envDir: false,
  test: {
    include: ['scripts/carga/servidor-local.spec.ts'],
    environment: 'node',
    maxWorkers: 1,
    testTimeout: 900_000,
  },
});
