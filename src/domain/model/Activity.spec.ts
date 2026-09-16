import { describe, expect, it } from 'vitest';
import { Activity, DireccionEscala } from './Activity.js';
import { InvalidActivityConfigurationError, InvalidScoreRangeError } from './DomainError.js';
import { ActivityId } from './Identifier.js';
import { NivelOrientativo } from './OrientativeScore.js';

const ID = new ActivityId('33333333-3333-4333-a333-333333333333');

/** Un juego de memoria: mas puntaje es mejor. */
function juego(): Activity {
  return Activity.create({
    id: ID,
    nombre: 'Secuencias',
    direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
    puntajeMaximo: 10,
  });
}

/** Un cuestionario de carga: mas puntaje indica mas tension. */
function cuestionario(): Activity {
  return Activity.create({
    id: ID,
    nombre: 'Tu semana en una hoja',
    direccionEscala: DireccionEscala.MAYOR_REQUIERE_ATENCION,
    puntajeMaximo: 20,
  });
}

describe('La direccion de la escala', () => {
  // Esta es la prueba que justifica toda la tarea. Sin la direccion, el
  // sistema derivaba el nivel igual para las dos actividades y le mostraba
  // un resultado favorable justamente a quien peor estaba.

  it('un puntaje alto en un juego es favorable', () => {
    expect(juego().nivelPara(90)).toBe(NivelOrientativo.FAVORABLE);
  });

  it('un puntaje alto en un cuestionario de carga requiere atencion', () => {
    expect(cuestionario().nivelPara(90)).toBe(NivelOrientativo.REQUIERE_ATENCION);
  });

  it('un puntaje bajo en un juego requiere atencion', () => {
    expect(juego().nivelPara(10)).toBe(NivelOrientativo.REQUIERE_ATENCION);
  });

  it('un puntaje bajo en un cuestionario de carga es favorable', () => {
    expect(cuestionario().nivelPara(10)).toBe(NivelOrientativo.FAVORABLE);
  });

  it('la banda intermedia queda en seguimiento en ambas direcciones', () => {
    expect(juego().nivelPara(50)).toBe(NivelOrientativo.EN_SEGUIMIENTO);
    expect(cuestionario().nivelPara(50)).toBe(NivelOrientativo.EN_SEGUIMIENTO);
  });

  it('el mismo puntaje produce niveles opuestos segun la actividad', () => {
    // La demostracion directa del defecto que se corrige.
    expect(juego().nivelPara(90)).not.toBe(cuestionario().nivelPara(90));
  });
});

describe('Los umbrales son propios de cada actividad', () => {
  it('dos actividades con cortes distintos clasifican distinto el mismo puntaje', () => {
    const porTercios = Activity.create({
      id: ID,
      nombre: 'Por tercios',
      direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
      puntajeMaximo: 100,
    });

    const masExigente = Activity.create({
      id: ID,
      nombre: 'Mas exigente',
      direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
      puntajeMaximo: 100,
      umbrales: { primero: 0.5, segundo: 0.8 },
    });

    expect(porTercios.nivelPara(45)).toBe(NivelOrientativo.EN_SEGUIMIENTO);
    expect(masExigente.nivelPara(45)).toBe(NivelOrientativo.REQUIERE_ATENCION);
  });

  it('rechaza umbrales que no separan tres bandas', () => {
    expect(() =>
      Activity.create({
        id: ID,
        nombre: 'Mal configurada',
        direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
        puntajeMaximo: 10,
        umbrales: { primero: 0.8, segundo: 0.4 },
      }),
    ).toThrow(InvalidActivityConfigurationError);
  });
});

describe('Normalizacion a la escala comun', () => {
  it('lleva el puntaje crudo a una escala de 0 a 100', () => {
    // Sin esto no se puede dibujar el progreso del RF7 comparando una
    // actividad de 0 a 10 con otra de 0 a 20.
    expect(juego().normalizar(8)).toBe(80);
    expect(cuestionario().normalizar(8)).toBe(40);
  });

  it('el mismo puntaje crudo vale distinto en actividades de distinto maximo', () => {
    expect(juego().normalizar(10)).toBe(100);
    expect(cuestionario().normalizar(10)).toBe(50);
  });
});

describe('Configuracion coherente de la actividad', () => {
  it('una actividad que puntua tiene que declarar su maximo', () => {
    expect(() =>
      Activity.create({
        id: ID,
        nombre: 'Sin maximo',
        direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
      }),
    ).toThrow(InvalidActivityConfigurationError);
  });

  it('una actividad que no puntua no puede declarar un maximo', () => {
    expect(() =>
      Activity.create({
        id: ID,
        nombre: 'Contradictoria',
        direccionEscala: DireccionEscala.SIN_PUNTAJE,
        puntajeMaximo: 10,
      }),
    ).toThrow(InvalidActivityConfigurationError);
  });

  it('rechaza un maximo que no sirve como escala', () => {
    expect(() =>
      Activity.create({
        id: ID,
        nombre: 'Maximo cero',
        direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
        puntajeMaximo: 0,
      }),
    ).toThrow(InvalidScoreRangeError);
  });

  it('una actividad de registro no puntua', () => {
    const bitacora = Activity.create({
      id: ID,
      nombre: 'Bitacora de sueno',
      direccionEscala: DireccionEscala.SIN_PUNTAJE,
    });

    expect(bitacora.puntua()).toBe(false);
  });
});

describe('Los textos que ve la persona', () => {
  it('cada actividad habla en su propio lenguaje', () => {
    const conTextos = Activity.create({
      id: ID,
      nombre: 'Tu semana en una hoja',
      direccionEscala: DireccionEscala.MAYOR_REQUIERE_ATENCION,
      puntajeMaximo: 20,
      textosNivel: {
        favorable: 'Semana tranquila',
        en_seguimiento: 'Semana con tension',
        requiere_atencion: 'Semana pesada',
      },
    });

    expect(conTextos.textoPara(NivelOrientativo.REQUIERE_ATENCION)).toBe('Semana pesada');
  });

  it('sin textos propios devuelve el nivel, sin inventar una frase', () => {
    // Feo pero honesto. Inventar aqui es como acaban saliendo frases que
    // suenan a dictamen.
    expect(juego().textoPara(NivelOrientativo.REQUIERE_ATENCION)).toBe('requiere_atencion');
  });

  it('ningun texto del catalogo usa terminologia diagnostica', () => {
    const prohibidas = /depresion|ansiedad|trastorno|patolog|diagnost|enferm|sindrome/i;

    const conTextos = Activity.create({
      id: ID,
      nombre: 'Tu semana en una hoja',
      direccionEscala: DireccionEscala.MAYOR_REQUIERE_ATENCION,
      puntajeMaximo: 20,
      textosNivel: {
        favorable: 'Semana tranquila',
        en_seguimiento: 'Semana con tension',
        requiere_atencion: 'Semana pesada',
      },
    });

    for (const nivel of Object.values(NivelOrientativo)) {
      expect(conTextos.textoPara(nivel)).not.toMatch(prohibidas);
    }
  });
});
