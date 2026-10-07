import { beforeEach, describe, expect, it } from 'vitest';
import { Activity, DireccionEscala } from '../../domain/model/Activity.js';
import { ActivityResult } from '../../domain/model/ActivityResult.js';
import { ActivityId, ClientOperationId, ResultId, UserId } from '../../domain/model/Identifier.js';
import { OrientativeScore } from '../../domain/model/OrientativeScore.js';
import { EXPRESIONES_DE_RIESGO } from '../../domain/model/SenalesDeRiesgo.js';
import { Intencion } from '../../domain/ports/in/AsistentePort.js';
import { InMemoryActivityResultRepository } from '../repositories/InMemoryActivityResultRepository.js';
import { InMemoryRecursoApoyoRepository } from '../repositories/InMemoryRecursoApoyoRepository.js';
import { AsistentePorReglas } from './AsistentePorReglas.js';

const USUARIO = '11111111-1111-4111-8111-111111111111';
const ACTIVIDAD = '33333333-3333-4333-a333-333333333333';
const ZONA = 'America/Bogota';
const AHORA = new Date('2026-09-16T12:00:00.000Z');

function actividad(): Activity {
  return Activity.create({
    id: new ActivityId(ACTIVIDAD),
    nombre: 'Secuencias',
    direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
    puntajeMaximo: 10,
  });
}

function unResultado(dias: number, operacion: string): ActivityResult {
  const cuando = new Date(AHORA.getTime() - dias * 24 * 60 * 60 * 1000);

  return ActivityResult.create(
    {
      id: new ResultId(globalThis.crypto.randomUUID()),
      userId: new UserId(USUARIO),
      activityId: new ActivityId(ACTIVIDAD),
      clientOperationId: new ClientOperationId(operacion),
      score: OrientativeScore.create(8, actividad()),
      completedAt: cuando,
      dia: cuando.toISOString().slice(0, 10),
    },
    AHORA,
  );
}

describe('AsistentePorReglas', () => {
  let historial: InMemoryActivityResultRepository;
  let asistente: AsistentePorReglas;

  beforeEach(() => {
    historial = new InMemoryActivityResultRepository();
    asistente = new AsistentePorReglas(
      new InMemoryRecursoApoyoRepository(),
      historial,
      () => AHORA,
    );
  });

  describe('senales de riesgo', () => {
    // El criterio de aceptacion de la tarea, literal: una prueba por cada
    // expresion de la lista. No tres ejemplos representativos.
    it.each(EXPRESIONES_DE_RIESGO)('devuelve lineas de atencion ante "%s"', async (expresion) => {
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: expresion,
      });

      expect(respuesta.senalDeRiesgo).toBe(true);
      expect(respuesta.incluyeLineasDeAtencion).toBe(true);
      expect(respuesta.recursos.length).toBeGreaterThan(0);
      expect(respuesta.recursos.every((recurso) => recurso.esLineaDeAtencion())).toBe(true);
    });

    it('el riesgo gana a cualquier otra intencion reconocida', async () => {
      // La frase habla de dormir, que es una intencion que el asistente sabe
      // responder. Da igual: si hay una senal de riesgo, la respuesta ya esta
      // decidida antes de mirar nada mas.
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'queria dormir mejor pero ya no aguanto mas',
      });

      expect(respuesta.senalDeRiesgo).toBe(true);
      expect(respuesta.recursos.every((recurso) => recurso.esLineaDeAtencion())).toBe(true);
    });

    it('no personaliza la respuesta de riesgo con el historial', async () => {
      // "Estas lineas atienden ahora mismo. En el ultimo mes registraste 3
      // actividades." Ese anadido convierte un momento serio en una ficha de
      // seguimiento.
      await historial.save(unResultado(2, '44444444-4444-4444-b444-000000000001'));

      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'quiero morirme',
      });

      expect(respuesta.mensaje).not.toMatch(/registraste/u);
    });

    it('la linea nacional va antes que la de Bogota', async () => {
      // La Linea 106 se marca desde Bogota y la sede principal de la
      // universidad esta en Fusagasuga. Ensenar primero un numero que no
      // contesta donde esta la mayoria de la gente seria un error caro.
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'quiero morirme',
      });

      expect(respuesta.recursos[0]?.cobertura).toBe('nacional');
    });
  });

  describe('intenciones', () => {
    it.each([
      ['como puedo dormir mejor', Intencion.COMO_DUERMO_MEJOR],
      ['no duermo bien ultimamente', Intencion.COMO_DUERMO_MEJOR],
      ['que significa mi nivel', Intencion.QUE_SIGNIFICA_MI_RESULTADO],
      ['no entiendo mi resultado', Intencion.QUE_SIGNIFICA_MI_RESULTADO],
      ['me siento triste', Intencion.ME_SIENTO_MAL],
      ['donde busco ayuda profesional', Intencion.DONDE_BUSCO_AYUDA],
    ])('reconoce "%s"', async (texto, esperada) => {
      const respuesta = await asistente.responder({ userId: USUARIO, zonaHoraria: ZONA, texto });

      expect(respuesta.intencion).toBe(esperada);
      expect(respuesta.mensaje).not.toBe('');
      expect(respuesta.recursos.length).toBeGreaterThan(0);
    });

    it('responde algo util cuando no entiende, no un error', async () => {
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'cuanto cuesta el parqueadero de la sede',
      });

      expect(respuesta.intencion).toBe(Intencion.NO_RECONOCIDA);
      expect(respuesta.recursos.length).toBeGreaterThan(0);
      expect(respuesta.senalDeRiesgo).toBe(false);
    });

    it('funciona igual sin tildes y en mayusculas', async () => {
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'COMO DUERMO MEJOR',
      });

      expect(respuesta.intencion).toBe(Intencion.COMO_DUERMO_MEJOR);
    });
  });

  describe('las lineas segun el pais, sacado de la zona horaria (SCRUM-124)', () => {
    // [zona de la cuenta, pais de las lineas que debe recibir]. Sin pais: el
    // directorio internacional y nada mas.
    const ZONAS: readonly (readonly [string, string | undefined])[] = [
      ['America/Bogota', 'CO'],
      ['America/Mexico_City', 'MX'],
      ['Europe/Madrid', 'ES'],
      ['America/New_York', 'US'],
      // Misma hora que Bogota, otro pais: no recibe el 192.
      ['America/Lima', undefined],
      ['America/Guayaquil', undefined],
      ['Asia/Tokyo', undefined],
      ['UTC', undefined],
    ];

    // El criterio de aceptacion, literal: una persona sin pais reconocido
    // nunca recibe un numero de otro pais como si fuera suyo. Y como esto es
    // lo que importa ante una senal de riesgo, se comprueba con cada una de
    // las 23 frases.
    it.each(EXPRESIONES_DE_RIESGO)(
      'ante "%s", cada zona recibe las lineas de su pais y de ningun otro',
      async (expresion) => {
        for (const [zonaHoraria, pais] of ZONAS) {
          const respuesta = await asistente.responder({
            userId: USUARIO,
            zonaHoraria,
            texto: expresion,
          });

          expect(respuesta.senalDeRiesgo, zonaHoraria).toBe(true);
          expect(respuesta.recursos.length, zonaHoraria).toBeGreaterThan(0);
          expect(
            respuesta.recursos.every((recurso) => recurso.pais === pais),
            zonaHoraria,
          ).toBe(true);
        }
      },
    );

    it('desde Madrid, el 024 y el 112, y ni rastro de los telefonos de Colombia', async () => {
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: 'Europe/Madrid',
        texto: 'quiero morirme',
      });
      const titulos = respuesta.recursos.map((recurso) => recurso.titulo);

      expect(titulos).toEqual(['Línea 024, llama a la vida', 'Línea 112']);
      expect(JSON.stringify(respuesta)).not.toMatch(/192|\b123\b|\b106\b/u);
    });

    it('desde Lima, el directorio internacional y ningun telefono', async () => {
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: 'America/Lima',
        texto: 'quiero morirme',
      });

      expect(respuesta.recursos.map((recurso) => recurso.titulo)).toEqual([
        'Directorio internacional de líneas de ayuda',
      ]);
      expect(respuesta.incluyeLineasDeAtencion).toBe(true);
      expect(JSON.stringify(respuesta)).not.toMatch(/192|\b123\b|\b106\b|\b911\b|\b112\b/u);
    });

    it('desde Bogota todo sigue igual: las tres lineas de Colombia, la nacional primero', async () => {
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: 'America/Bogota',
        texto: 'quiero morirme',
      });

      expect(respuesta.recursos.map((recurso) => recurso.titulo)).toEqual([
        'Línea 192, opción 4',
        'Línea 123',
        'Línea 106, el poder de ser escuchado',
      ]);
    });

    it('lo que no se entiende tambien las ensena segun el pais', async () => {
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: 'America/Mexico_City',
        texto: 'cuanto cuesta el parqueadero de la sede',
      });

      expect(respuesta.intencion).toBe(Intencion.NO_RECONOCIDA);
      expect(respuesta.recursos.every((recurso) => recurso.pais === 'MX')).toBe(true);
    });

    it('"donde busco ayuda" tambien: no tiene lecturas, asi que cae a las lineas del pais', async () => {
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: 'America/New_York',
        texto: 'donde busco ayuda',
      });

      expect(respuesta.intencion).toBe(Intencion.DONDE_BUSCO_AYUDA);
      expect(respuesta.recursos.map((recurso) => recurso.titulo)).toEqual([
        'Línea 988',
        'Línea 911',
      ]);
    });

    it('una zona que no existe no rompe la respuesta: recibe el directorio', async () => {
      // Esto se llama cuando alguien puede estar mal. Lo ultimo que debe pasar
      // es que falle por una zona mal guardada.
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: 'Marte/Olimpo',
        texto: 'quiero morirme',
      });

      expect(respuesta.senalDeRiesgo).toBe(true);
      expect(respuesta.recursos.map((recurso) => recurso.titulo)).toEqual([
        'Directorio internacional de líneas de ayuda',
      ]);
    });

    it('los contenidos de lectura no dependen del pais', async () => {
      for (const [zonaHoraria] of ZONAS) {
        const respuesta = await asistente.responder({
          userId: USUARIO,
          zonaHoraria,
          texto: 'como puedo dormir mejor',
        });

        expect(
          respuesta.recursos.map((recurso) => recurso.titulo),
          zonaHoraria,
        ).toEqual(['Rutina para descansar mejor']);
      }
    });
  });

  describe('personalizacion', () => {
    it('cuenta lo que la persona registro de verdad', async () => {
      await historial.save(unResultado(2, '44444444-4444-4444-b444-000000000001'));
      await historial.save(unResultado(9, '44444444-4444-4444-b444-000000000002'));

      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'que significa mi nivel',
      });

      expect(respuesta.mensaje).toContain('2 actividades');
    });

    it('no dice nada sobre el historial de quien no tiene historial', async () => {
      // Una frase amable e inventada sobre la constancia de alguien que no ha
      // hecho nada se nota enseguida, y a partir de ahi tampoco se cree el
      // resto de lo que diga el asistente.
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'que significa mi nivel',
      });

      expect(respuesta.mensaje).not.toMatch(/registraste/u);
    });

    it('no cuenta lo que quedo fuera del ultimo mes', async () => {
      await historial.save(unResultado(45, '44444444-4444-4444-b444-000000000003'));

      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'que significa mi nivel',
      });

      expect(respuesta.mensaje).not.toMatch(/registraste/u);
    });

    it('no cuenta actividades de otra persona', async () => {
      await historial.save(unResultado(2, '44444444-4444-4444-b444-000000000004'));

      const respuesta = await asistente.responder({
        userId: '22222222-2222-4222-9222-222222222222',
        zonaHoraria: ZONA,
        texto: 'que significa mi nivel',
      });

      expect(respuesta.mensaje).not.toMatch(/registraste/u);
    });
  });

  it('ningun texto del asistente usa terminologia diagnostica', async () => {
    // La misma prueba que protege los textos del catalogo desde el Ciclo 2.
    // VSD Health no diagnostica: el dia que un mensaje diga "ansiedad" deja de
    // ser una herramienta de acompanamiento y pasa a ser otra cosa.
    const prohibidas = /depresion|ansiedad|trastorno|patolog|diagnost|enferm|sindrome/iu;

    const consultas = [
      'quiero morirme',
      'como duermo mejor',
      'que significa mi nivel',
      'me siento triste',
      'donde busco ayuda',
      'cuanto cuesta el parqueadero',
    ];

    for (const texto of consultas) {
      const respuesta = await asistente.responder({ userId: USUARIO, zonaHoraria: ZONA, texto });
      const todo = [
        respuesta.mensaje,
        ...respuesta.recursos.map((recurso) => `${recurso.titulo} ${recurso.descripcion ?? ''}`),
      ].join(' ');

      expect(todo).not.toMatch(prohibidas);
    }
  });

  it('no llama a nada de fuera: responde sin red', async () => {
    // El RF9 dice que la aplicacion funciona sin conexion, y esta es la
    // version del asistente que lo cumple. Si algun dia alguien mete aqui una
    // llamada a una API, esta prueba se queda sin red y falla.
    const original = globalThis.fetch;

    globalThis.fetch = () => {
      throw new Error('El asistente por reglas no puede depender de la red.');
    };

    try {
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'quiero morirme',
      });

      expect(respuesta.incluyeLineasDeAtencion).toBe(true);
    } finally {
      globalThis.fetch = original;
    }
  });
});
