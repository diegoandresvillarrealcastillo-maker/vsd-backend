import { describe, expect, it } from 'vitest';
import { problemaDeLosParametros } from '../ParametrosDelMotor.js';
import { Motor } from '../Motor.js';

const VALIDO = {
  modo: 'deduccion_logica',
  premisas: ['Todas las aves del parque tienen plumas.', 'Lina es un ave del parque.'],
  opciones: [
    { clave: 'a', texto: 'Lina tiene plumas.', correcta: true },
    { clave: 'b', texto: 'Lina puede volar.', correcta: false },
    { clave: 'c', texto: 'Todas las aves son de Lina.', correcta: false },
  ],
  explicacion: 'La primera premisa incluye a las aves del parque; Lina pertenece a ese grupo.',
  puntosMaximos: 1,
};

describe('el contrato de deduccion logica', () => {
  it('acepta premisas y una conclusion correcta', () => {
    expect(problemaDeLosParametros(Motor.DEDUCCION_LOGICA, VALIDO)).toBeUndefined();
  });

  it('rechaza dos conclusiones correctas', () => {
    const opciones = VALIDO.opciones.map((opcion) => ({ ...opcion, correcta: true }));

    expect(problemaDeLosParametros(Motor.DEDUCCION_LOGICA, { ...VALIDO, opciones })).toContain(
      'una sola conclusion correcta',
    );
  });

  it('rechaza claves de opciones repetidas', () => {
    const opciones = VALIDO.opciones.map((opcion) => ({ ...opcion, clave: 'misma' }));

    expect(problemaDeLosParametros(Motor.DEDUCCION_LOGICA, { ...VALIDO, opciones })).toContain(
      'repite',
    );
  });
});
