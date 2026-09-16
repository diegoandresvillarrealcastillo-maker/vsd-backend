import { describe, expect, it } from 'vitest';
import { EXPRESIONES_DE_RIESGO, hayRiesgo, normalizar } from './SenalesDeRiesgo.js';

/**
 * La deteccion de senales de riesgo.
 *
 * De todo lo que hay en este repositorio, esto es lo que peor puede salir. Un
 * fallo aqui no rompe nada, no sale en ningun registro y no lo nota nadie:
 * simplemente alguien escribio algo grave y la aplicacion respondio como si
 * hubiera preguntado por el clima.
 *
 * De ahi que haya una prueba por cada expresion de la lista, y no una prueba
 * con tres ejemplos.
 */
describe('Senales de riesgo', () => {
  describe('normalizar', () => {
    it('quita las tildes', () => {
      // Nadie escribe con tildes cuando esta mal. Si la comparacion las
      // exigiera, la mitad de la lista no serviria para nada.
      expect(normalizar('Quiero morír')).toBe('quiero morir');
    });

    it('pasa a minusculas y recorta los espacios de sobra', () => {
      expect(normalizar('  YA   NO   PUEDO  MAS  ')).toBe('ya no puedo mas');
    });
  });

  describe('cada expresion de la lista se reconoce', () => {
    // Una por una, a proposito. Si alguien anade una expresion nueva y se
    // equivoca al escribirla, esta prueba lo dice; una prueba con tres
    // ejemplos representativos no.
    it.each(EXPRESIONES_DE_RIESGO)('reconoce "%s"', (expresion) => {
      expect(hayRiesgo(expresion)).toBe(true);
    });

    it.each(EXPRESIONES_DE_RIESGO)('reconoce "%s" dentro de una frase', (expresion) => {
      expect(hayRiesgo(`hoy fue un dia horrible y la verdad ${expresion} ya no se que hacer`)).toBe(
        true,
      );
    });

    it.each(EXPRESIONES_DE_RIESGO)('reconoce "%s" escrito en mayusculas', (expresion) => {
      expect(hayRiesgo(expresion.toUpperCase())).toBe(true);
    });
  });

  describe('lo que no dispara', () => {
    it.each([
      'me fue bien en la actividad de memoria',
      'quiero mejorar mi rutina de descanso',
      'como interpreto mi nivel',
      'gracias por la ayuda',
      '',
    ])('no ve riesgo en "%s"', (texto) => {
      expect(hayRiesgo(texto)).toBe(false);
    });
  });

  it('prefiere equivocarse de mas: "no quiero morirme" tambien dispara', () => {
    // Es un falso positivo y se deja a proposito. Interpretar negaciones
    // significaria decidir cuando NO mostrar los telefonos, y esa decision no
    // la queremos tomar con una regla de texto.
    //
    // El coste de equivocarse por exceso es una pantalla que alguien ignora.
    // El de equivocarse por defecto no tiene arreglo.
    expect(hayRiesgo('no quiero morirme, solo estoy cansado')).toBe(true);
  });

  it('la lista no esta vacia', () => {
    // Suena tonto hasta el dia que alguien la vacia para depurar algo y se le
    // olvida devolverla. Nada mas fallaria.
    expect(EXPRESIONES_DE_RIESGO.length).toBeGreaterThan(15);
  });

  it('todas las expresiones estan ya normalizadas', () => {
    // Si alguien anade "Quiero Morír" con tilde y mayuscula, no coincidiria
    // nunca, porque lo que se compara ya viene normalizado. El fallo seria
    // invisible: la expresion esta en la lista y aun asi no se reconoce.
    for (const expresion of EXPRESIONES_DE_RIESGO) {
      expect(normalizar(expresion)).toBe(expresion);
    }
  });
});
