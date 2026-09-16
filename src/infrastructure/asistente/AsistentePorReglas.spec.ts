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
      const respuesta = await asistente.responder({ userId: USUARIO, texto: expresion });

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

      const respuesta = await asistente.responder({ userId: USUARIO, texto: 'quiero morirme' });

      expect(respuesta.mensaje).not.toMatch(/registraste/u);
    });

    it('la linea nacional va antes que la de Bogota', async () => {
      // La Linea 106 se marca desde Bogota y la sede principal de la
      // universidad esta en Fusagasuga. Ensenar primero un numero que no
      // contesta donde esta la mayoria de la gente seria un error caro.
      const respuesta = await asistente.responder({ userId: USUARIO, texto: 'quiero morirme' });

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
      const respuesta = await asistente.responder({ userId: USUARIO, texto });

      expect(respuesta.intencion).toBe(esperada);
      expect(respuesta.mensaje).not.toBe('');
      expect(respuesta.recursos.length).toBeGreaterThan(0);
    });

    it('responde algo util cuando no entiende, no un error', async () => {
      const respuesta = await asistente.responder({
        userId: USUARIO,
        texto: 'cuanto cuesta el parqueadero de la sede',
      });

      expect(respuesta.intencion).toBe(Intencion.NO_RECONOCIDA);
      expect(respuesta.recursos.length).toBeGreaterThan(0);
      expect(respuesta.senalDeRiesgo).toBe(false);
    });

    it('funciona igual sin tildes y en mayusculas', async () => {
      const respuesta = await asistente.responder({
        userId: USUARIO,
        texto: 'COMO DUERMO MEJOR',
      });

      expect(respuesta.intencion).toBe(Intencion.COMO_DUERMO_MEJOR);
    });
  });

  describe('personalizacion', () => {
    it('cuenta lo que la persona registro de verdad', async () => {
      await historial.save(unResultado(2, '44444444-4444-4444-b444-000000000001'));
      await historial.save(unResultado(9, '44444444-4444-4444-b444-000000000002'));

      const respuesta = await asistente.responder({
        userId: USUARIO,
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
        texto: 'que significa mi nivel',
      });

      expect(respuesta.mensaje).not.toMatch(/registraste/u);
    });

    it('no cuenta lo que quedo fuera del ultimo mes', async () => {
      await historial.save(unResultado(45, '44444444-4444-4444-b444-000000000003'));

      const respuesta = await asistente.responder({
        userId: USUARIO,
        texto: 'que significa mi nivel',
      });

      expect(respuesta.mensaje).not.toMatch(/registraste/u);
    });

    it('no cuenta actividades de otra persona', async () => {
      await historial.save(unResultado(2, '44444444-4444-4444-b444-000000000004'));

      const respuesta = await asistente.responder({
        userId: '22222222-2222-4222-9222-222222222222',
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
      const respuesta = await asistente.responder({ userId: USUARIO, texto });
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
      const respuesta = await asistente.responder({ userId: USUARIO, texto: 'quiero morirme' });

      expect(respuesta.incluyeLineasDeAtencion).toBe(true);
    } finally {
      globalThis.fetch = original;
    }
  });
});
