import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/infrastructure/config/**'],
      // El umbral se exige donde la cobertura significa algo: domain/ y
      // application/ son las capas con logica. infrastructure/ es cableado,
      // y pedirle el mismo porcentaje empuja a escribir pruebas sin valor.
      thresholds: {
        'src/domain/**': { statements: 80, branches: 80, functions: 80, lines: 80 },
        'src/application/**': { statements: 80, branches: 80, functions: 80, lines: 80 },
      },
    },
  },
});
