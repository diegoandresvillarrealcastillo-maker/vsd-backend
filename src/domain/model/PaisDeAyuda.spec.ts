import { describe, expect, it } from 'vitest';
import { Calendario } from './Calendario.js';
import { PAISES_CON_LINEAS, paisDeLaZona, ZONAS_POR_PAIS } from './PaisDeAyuda.js';

/**
 * Las dos zonas que unas versiones de Node escriben de otra forma. Estan en la
 * lista a proposito (una cuenta guardada con ese nombre sigue siendo de ahi) y
 * por eso la comparacion con `Intl` las deja pasar.
 */
const NOMBRES_ALTERNATIVOS = ['America/Indiana/Indianapolis', 'America/Kentucky/Louisville'];

function zonasQueConoceIntl(pais: string): readonly string[] {
  const lugar = new Intl.Locale(`und-${pais}`) as Intl.Locale & {
    getTimeZones?: () => string[];
  };

  return lugar.getTimeZones?.() ?? [];
}

describe('paisDeLaZona', () => {
  it.each([
    ['America/Bogota', 'CO'],
    ['America/Mexico_City', 'MX'],
    ['America/Cancun', 'MX'],
    ['America/Tijuana', 'MX'],
    ['Europe/Madrid', 'ES'],
    ['Atlantic/Canary', 'ES'],
    ['America/New_York', 'US'],
    ['America/Los_Angeles', 'US'],
    ['America/Phoenix', 'US'],
    ['Pacific/Honolulu', 'US'],
  ])('%s es de %s', (zona, pais) => {
    expect(paisDeLaZona(zona)).toBe(pais);
  });

  it('lee la zona como la lee el resto de la aplicacion: sin importar mayusculas ni alias', () => {
    expect(paisDeLaZona('america/bogota')).toBe('CO');
    expect(paisDeLaZona('US/Eastern')).toBe('US');
    expect(paisDeLaZona('Europe/Madrid')).toBe('ES');
  });

  describe('lo que no tiene pais, no lo tiene', () => {
    // Misma hora que Colombia no es el mismo pais: Peru, Ecuador y Panama
    // comparten UTC-5, y recibir el 192 desde Lima seria exactamente el error
    // que este ticket existe para evitar.
    it.each([
      'America/Lima',
      'America/Guayaquil',
      'America/Panama',
      'America/Caracas',
      'America/Santiago',
      'America/Argentina/Buenos_Aires',
      'America/Sao_Paulo',
      'America/Havana',
      'America/Toronto',
      'America/Puerto_Rico',
      'Europe/Paris',
      'Europe/Lisbon',
      'Europe/London',
      'Asia/Tokyo',
      'Africa/Cairo',
      'Australia/Sydney',
      'UTC',
    ])('%s', (zona) => {
      expect(paisDeLaZona(zona)).toBeUndefined();
    });

    it('una zona desconocida o vacia tampoco, y no falla', () => {
      expect(paisDeLaZona('Marte/Olimpo')).toBeUndefined();
      expect(paisDeLaZona('')).toBeUndefined();
      expect(paisDeLaZona('   ')).toBeUndefined();
    });
  });
});

describe('ZONAS_POR_PAIS', () => {
  it('cada zona es una zona IANA que el entorno conoce', () => {
    for (const pais of PAISES_CON_LINEAS) {
      for (const zona of ZONAS_POR_PAIS[pais]) {
        expect(Calendario.esZonaValida(zona), `${pais} ${zona}`).toBe(true);
      }
    }
  });

  it('ninguna zona esta en dos paises', () => {
    const todas = PAISES_CON_LINEAS.flatMap((pais) => ZONAS_POR_PAIS[pais]);

    expect(new Set(todas).size).toBe(todas.length);
  });

  it('los codigos son ISO de dos letras en mayuscula', () => {
    for (const pais of PAISES_CON_LINEAS) {
      expect(pais).toMatch(/^[A-Z]{2}$/u);
    }
  });

  describe('coincide con lo que Intl sabe de cada pais', () => {
    // Si una version nueva de Node trae una zona nueva de uno de estos paises,
    // esta prueba avisa. Sin ella, alguien en esa zona recibiria el directorio
    // internacional en lugar de las lineas de su pais, sin ningun error.
    it.each(PAISES_CON_LINEAS)('%s: no falta ninguna zona', (pais) => {
      const conocidas = zonasQueConoceIntl(pais);

      expect(conocidas.length).toBeGreaterThan(0);

      const nuestras = new Set<string>(ZONAS_POR_PAIS[pais]);

      expect(conocidas.filter((zona) => !nuestras.has(zona))).toEqual([]);
    });

    it.each(PAISES_CON_LINEAS)('%s: no sobra ninguna', (pais) => {
      const conocidas = new Set(zonasQueConoceIntl(pais));
      const sobran = ZONAS_POR_PAIS[pais].filter(
        (zona: string) => !conocidas.has(zona) && !NOMBRES_ALTERNATIVOS.includes(zona),
      );

      expect(sobran).toEqual([]);
    });
  });
});
