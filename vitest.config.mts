import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Los guiones de `scripts/` que deciden algo (SCRUM-155) tienen su prueba al lado.
    include: ['src/**/*.spec.ts', 'scripts/**/*.spec.mjs'],
    // En equipos con muchos nucleos Vitest podia abrir mas de 160 workers y saturar la base
    // local; las pruebas con Prisma agotaban sus transacciones y vencian aunque aisladas pasaran.
    maxWorkers: 8,
    // Pruebas que levantan servidores HTTP pasan de 5 s cuando coinciden con el trabajo de Prisma.
    // El timeout mayor evita falsos negativos por CPU saturada; no cambia sus aserciones.
    testTimeout: 15_000,
    // Los `beforeAll` de las pruebas de integracion levantan la aplicacion y preparan la base, y con
    // la suite completa corriendo en paralelo pasaban los 10 s por omision sin que nada estuviera
    // roto (SCRUM-265). Una base caida sigue fallando, solo que a los 30 s en lugar de a los 10.
    hookTimeout: 30_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.spec.ts',
        // Arranque del proceso: solo se puede ejercitar levantando un
        // servidor que escuche de verdad, y eso ya lo cubren las pruebas de
        // integracion a traves de configurarAplicacion().
        'src/infrastructure/main.ts',
      ],
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
