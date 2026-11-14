import { beforeEach, describe, expect, it } from 'vitest';
import {
  LENGUAJE_OFENSIVO,
  MARCAS_DE_DESAHOGO,
  TERMINOS_OFENSIVOS,
} from '../../domain/model/LenguajeOfensivo.js';
import { MENSAJES, REGLAS_DE_INTENCION } from '../../domain/model/ReglasDelAsistente.js';
import { EXPRESIONES_DE_RIESGO, normalizar } from '../../domain/model/SenalesDeRiesgo.js';
import { Intencion } from '../../domain/ports/in/AsistentePort.js';
import { InMemoryActivityResultRepository } from '../repositories/InMemoryActivityResultRepository.js';
import { InMemoryRecursoApoyoRepository } from '../repositories/InMemoryRecursoApoyoRepository.js';
import { AsistentePorReglas } from './AsistentePorReglas.js';
import { esLenguajeOfensivo, palabrasDe } from './Reconocimiento.js';

/**
 * El lenguaje ofensivo (SCRUM-192, decision D5 del ciclo 7).
 *
 * Lo mas importante de esta suite es lo que **no** es ofensivo. Cerrar una conversacion es algo
 * que le pasa a una persona, y quien escribe «me siento una mierda» o «soy un inutil» no esta
 * insultando al asistente: esta desahogandose, y es exactamente a quien el asistente tiene que
 * seguir escuchando. Un falso negativo (no ver un insulto) cuesta una frase mas amable; un falso
 * positivo (leer un desahogo como insulto) le cierra la puerta a quien mas la necesita. Por eso la
 * lista es corta y conservadora, y ante la duda **no** se cuenta.
 *
 * Y el riesgo va **antes**: «eres un idiota, quiero morirme» es una senal de riesgo, no un
 * insulto.
 */
const USUARIO = '11111111-1111-4111-8111-111111111111';
const AHORA = new Date('2026-10-14T12:00:00.000Z');

function ofensivo(texto: string): boolean {
  return esLenguajeOfensivo(palabrasDe(texto), LENGUAJE_OFENSIVO);
}

describe('lo que si es lenguaje ofensivo', () => {
  it.each([
    'eres un idiota',
    'IDIOTA',
    'idiotaaaa',
    'hola, idiota',
    'qué estúpida eres',
    'eres un imbécil',
    'callate',
    'cállate ya',
    'cierra la boca',
    'vete a la mierda',
    'eres una mierda',
    'eres una basura',
    'hijueputa',
    'hdp',
    'malparido',
    'eres un inútil',
    'fuck you',
    'shut up',
  ])('«%s»', (texto) => {
    expect(ofensivo(texto)).toBe(true);
  });
});

describe('lo que NO es lenguaje ofensivo: el desahogo y la charla', () => {
  it.each([
    // Obligatorias del ticket: desahogo, no insulto.
    'me siento una mierda',
    'odio mi vida',
    // Lo dice de si misma.
    'soy un idiota',
    'soy una inútil',
    'me siento inútil',
    'qué idiota fui',
    'estoy tan estúpida hoy',
    'me odio',
    'es mi culpa, soy una basura',
    // La charla y lo cotidiano.
    'hola',
    'gracias',
    'adiós',
    'no entiendo',
    'esto es normal',
    'tonterías',
    'saca la basura',
    'tengo una perra que se llama Luna',
    'qué rico el café',
    '',
  ])('«%s»', (texto) => {
    expect(ofensivo(texto)).toBe(false);
  });
});

describe('la lista, como archivo que revisa una persona', () => {
  it('esta escrita ya normalizada: sin tildes ni mayusculas ni espacios de mas', () => {
    for (const termino of [...TERMINOS_OFENSIVOS, ...MARCAS_DE_DESAHOGO]) {
      expect(termino, termino).toBe(normalizar(termino));
    }
  });

  it('no repite ningun termino', () => {
    expect(new Set(TERMINOS_OFENSIVOS).size).toBe(TERMINOS_OFENSIVOS.length);
    expect(new Set(MARCAS_DE_DESAHOGO).size).toBe(MARCAS_DE_DESAHOGO.length);
  });

  it('ningun termino pisa una expresion de riesgo: el riesgo se evalua aparte y primero', () => {
    for (const termino of TERMINOS_OFENSIVOS) {
      const limpio = termino.replace(/\*$/u, '');

      for (const expresion of EXPRESIONES_DE_RIESGO) {
        expect(expresion.includes(limpio) || limpio.includes(expresion), `${termino}`).toBe(false);
      }
    }
  });

  it('ningun termino es un patron de «me siento mal»: eso es un desahogo', () => {
    const delAnimo = REGLAS_DE_INTENCION.filter(
      (regla) => regla.intencion === Intencion.ME_SIENTO_MAL,
    ).flatMap((regla) => regla.patrones);

    for (const termino of TERMINOS_OFENSIVOS) {
      expect(delAnimo, termino).not.toContain(termino);
    }
  });

  it('reconoce que decirse algo a uno mismo no es insultar: las marcas de desahogo existen', () => {
    expect(MARCAS_DE_DESAHOGO).toEqual(expect.arrayContaining(['me siento', 'soy', 'odio mi']));
  });

  it('el umbral es de tres', () => {
    expect(LENGUAJE_OFENSIVO.umbral).toBe(3);
  });
});

describe('lo que responde VSD IA', () => {
  let asistente: AsistentePorReglas;

  beforeEach(() => {
    asistente = new AsistentePorReglas(
      new InMemoryRecursoApoyoRepository(),
      new InMemoryActivityResultRepository(),
      () => AHORA,
    );
  });

  const responder = (texto: string) =>
    asistente.responder({ userId: USUARIO, zonaHoraria: 'America/Bogota', texto });

  it('ante un insulto responde con asertividad, sin juicio y sin lineas de atencion', async () => {
    const respuesta = await responder('eres un idiota');

    expect(respuesta).toMatchObject({
      intencion: Intencion.LENGUAJE_OFENSIVO,
      mensaje: MENSAJES[Intencion.LENGUAJE_OFENSIVO],
      recursos: [],
      senalDeRiesgo: false,
      incluyeLineasDeAtencion: false,
    });
  });

  it('el mensaje entiende, pide evitar ese lenguaje y deja la puerta abierta', () => {
    const mensaje = MENSAJES[Intencion.LENGUAJE_OFENSIVO];

    expect(mensaje).toMatch(/entiendo/i);
    expect(mensaje).toMatch(/evita/i);
    expect(mensaje).toMatch(/aquí estoy/i);
    // No juzga ni castiga ni amenaza.
    expect(mensaje).not.toMatch(/grosero|maleducad|inaceptable|castigo|bloque|ban/i);
  });

  it('el riesgo gana: un insulto con una senal de riesgo es una senal de riesgo', async () => {
    const respuesta = await responder('eres un idiota, quiero morirme');

    expect(respuesta.senalDeRiesgo).toBe(true);
    expect(respuesta.intencion).toBe(Intencion.ME_SIENTO_MAL);
    expect(respuesta.incluyeLineasDeAtencion).toBe(true);
  });

  it('un insulto delante de un saludo no se vuelve charla', async () => {
    const respuesta = await responder('hola idiota');

    expect(respuesta.intencion).toBe(Intencion.LENGUAJE_OFENSIVO);
  });

  it('«me siento una mierda» sigue el camino de siempre, no el del insulto', async () => {
    const respuesta = await responder('me siento una mierda');

    expect(respuesta.intencion).toBe(Intencion.ME_SIENTO_MAL);
  });

  it('«odio mi vida» tampoco es un insulto', async () => {
    const respuesta = await responder('odio mi vida');

    expect(respuesta.intencion).not.toBe(Intencion.LENGUAJE_OFENSIVO);
  });

  it('no personaliza la respuesta con el historial', async () => {
    const respuesta = await responder('callate');

    expect(respuesta.mensaje).toBe(MENSAJES[Intencion.LENGUAJE_OFENSIVO]);
    expect(respuesta.mensaje).not.toMatch(/registraste/);
  });
});
