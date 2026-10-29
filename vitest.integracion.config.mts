import { defineConfig } from 'vitest/config';
import base from './vitest.config.mts';

// La misma configuracion que `vitest.config.mts`, para sacar el informe de cobertura de las pruebas de
// integracion en un directorio aparte (SCRUM-301). SonarQube lo suma al de la suite unitaria.
//
// Sin los umbrales: domain/ y application/ se miden con la suite completa, y las pruebas de integracion
// solas no los alcanzan ni tienen por que.
const { thresholds: _umbrales, ...cobertura } = base.test?.coverage ?? {};

export default defineConfig({
  test: {
    ...base.test,
    coverage: { ...cobertura, reportsDirectory: './coverage-integracion' },
  },
});
