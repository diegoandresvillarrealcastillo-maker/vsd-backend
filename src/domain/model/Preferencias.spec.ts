import { describe, expect, it } from 'vitest';
import { InvalidPetError, NoActiveModulesError, UnknownModuleError } from './DomainError.js';
import {
  type Mascota,
  Modulo,
  TODOS_LOS_MODULOS,
  crearMascota,
  elegirModulos,
} from './Preferencias.js';

const LUMA: Mascota = { forma: 'brote', color: '#A2D9B6', accesorio: 'ninguno', nombre: ' Luma ' };

describe('elegirModulos', () => {
  it('acepta uno, dos o los tres', () => {
    expect(elegirModulos(['emociones'])).toEqual([Modulo.EMOCIONES]);
    expect(elegirModulos(['emociones', 'cognicion'])).toEqual([Modulo.COGNICION, Modulo.EMOCIONES]);
    expect(elegirModulos([...TODOS_LOS_MODULOS])).toEqual(TODOS_LOS_MODULOS);
  });

  it('los deja en orden canonico y sin repetidos', () => {
    expect(elegirModulos(['emociones', 'bienestar', 'emociones'])).toEqual([
      Modulo.BIENESTAR,
      Modulo.EMOCIONES,
    ]);
  });

  it('rechaza un modulo que no existe', () => {
    expect(() => elegirModulos(['cognicion', 'finanzas'])).toThrow(UnknownModuleError);
  });

  it('no confunde el nombre visible con la clave', () => {
    // 'Cognición' es como se muestra; la preferencia se guarda con la clave.
    expect(() => elegirModulos(['Cognición'])).toThrow(UnknownModuleError);
  });

  it('no deja quedarse con cero modulos', () => {
    expect(() => elegirModulos([])).toThrow(NoActiveModulesError);
  });
});

describe('crearMascota', () => {
  it('normaliza el color y el nombre', () => {
    expect(crearMascota(LUMA)).toEqual({
      forma: 'brote',
      color: '#a2d9b6',
      accesorio: 'ninguno',
      nombre: 'Luma',
    });
  });

  it('acepta formas nuevas sin tocar el backend', () => {
    // Los modelos definitivos llegan despues; la forma no es una lista cerrada.
    expect(crearMascota({ ...LUMA, forma: 'zorro-de-diego' }).forma).toBe('zorro-de-diego');
  });

  it.each([
    ['una forma con espacios', { forma: 'gato negro' }],
    ['una forma vacia', { forma: '' }],
    ['un accesorio en mayusculas', { accesorio: 'Bufanda' }],
    ['un color sin #', { color: 'a2d9b6' }],
    ['un color con nombre', { color: 'verde' }],
    ['un nombre vacio', { nombre: '   ' }],
    ['un nombre demasiado largo', { nombre: 'x'.repeat(31) }],
    ['un nombre con salto de linea', { nombre: 'Lu\nma' }],
  ])('rechaza %s', (_caso, cambio) => {
    expect(() => crearMascota({ ...LUMA, ...cambio })).toThrow(InvalidPetError);
  });

  it('cuenta los caracteres, no las unidades de UTF-16', () => {
    // Un emoji ocupa dos unidades; treinta emojis siguen siendo treinta caracteres.
    expect(crearMascota({ ...LUMA, nombre: '🌱'.repeat(30) }).nombre).toHaveLength(60);
  });
});
