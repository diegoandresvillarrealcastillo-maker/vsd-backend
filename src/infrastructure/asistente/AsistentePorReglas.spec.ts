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

    // SCRUM-128: la charla no puede desviar ninguna frase de riesgo de su
    // protocolo, ni delante ni detras, ni en mayusculas ni con signos.
    it.each(EXPRESIONES_DE_RIESGO)(
      'con charla alrededor, "%s" sigue yendo a las lineas de atencion',
      async (expresion) => {
        const textos = [
          `hola, ${expresion}`,
          `${expresion}, gracias`,
          `buenas noches. ${expresion}`,
          `adiós, ${expresion.toUpperCase()}`,
          `¿cómo estás? ${expresion}!!`,
          `hola 😊 ${expresion} 😊 chao`,
        ];

        for (const texto of textos) {
          const respuesta = await asistente.responder({
            userId: USUARIO,
            zonaHoraria: ZONA,
            texto,
          });

          expect(respuesta.senalDeRiesgo, texto).toBe(true);
          expect(respuesta.incluyeLineasDeAtencion, texto).toBe(true);
          expect(respuesta.recursos.length, texto).toBeGreaterThan(0);
          expect(
            respuesta.recursos.every((recurso) => recurso.esLineaDeAtencion()),
            texto,
          ).toBe(true);
        }
      },
    );

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

  describe('palabras completas', () => {
    // El defecto que motivo SCRUM-128: "mal" se buscaba como pedazo de texto y
    // aparecia dentro de "normal".
    it.each(['normal', 'todo normal', 'animal', 'terminal', 'formal', 'maletas'])(
      '"%s" no se lee como "mal"',
      async (texto) => {
        const respuesta = await asistente.responder({ userId: USUARIO, zonaHoraria: ZONA, texto });

        expect(respuesta.intencion).toBe(Intencion.NO_RECONOCIDA);
      },
    );

    it('"mal" suelta si se sigue leyendo', async () => {
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'hoy me fue mal',
      });

      expect(respuesta.intencion).toBe(Intencion.ME_SIENTO_MAL);
    });

    it.each([
      ['no logro dormirme', Intencion.COMO_DUERMO_MEJOR],
      ['estoy desanimado', Intencion.ME_SIENTO_MAL],
      ['quiero hablar con una psicóloga', Intencion.DONDE_BUSCO_AYUDA],
      ['necesito terapia', Intencion.DONDE_BUSCO_AYUDA],
      ['estoy muy cansada', Intencion.ME_SIENTO_MAL],
      ['estoy sola', Intencion.ME_SIENTO_MAL],
      ['qué significan mis niveles', Intencion.QUE_SIGNIFICA_MI_RESULTADO],
    ])('lo que se reconocia antes se sigue reconociendo: "%s"', async (texto, esperada) => {
      const respuesta = await asistente.responder({ userId: USUARIO, zonaHoraria: ZONA, texto });

      expect(respuesta.intencion).toBe(esperada);
    });

    it('"solo" suelta ya no habla de soledad', async () => {
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'solo quería saludar',
      });

      expect(respuesta.intencion).toBe(Intencion.SALUDO);
    });
  });

  describe('la charla de todos los dias', () => {
    const CHARLA: readonly (readonly [string, Intencion])[] = [
      ['Hola', Intencion.SALUDO],
      ['holaaaa', Intencion.SALUDO],
      ['Hola 😊', Intencion.SALUDO],
      ['buenos días', Intencion.SALUDO],
      ['Buenas tardes', Intencion.SALUDO],
      ['hola de nuevo', Intencion.SALUDO],
      ['solo quería saludar', Intencion.SALUDO],
      ['gracias', Intencion.AGRADECIMIENTO],
      ['Muchas gracias!', Intencion.AGRADECIMIENTO],
      ['mil gracias', Intencion.AGRADECIMIENTO],
      ['te lo agradezco', Intencion.AGRADECIMIENTO],
      ['ok, gracias', Intencion.AGRADECIMIENTO],
      ['solo quería darte las gracias', Intencion.AGRADECIMIENTO],
      ['buenas noches', Intencion.DESPEDIDA],
      ['Buenas noches, voy a dormir', Intencion.DESPEDIDA],
      ['adiós', Intencion.DESPEDIDA],
      ['hasta mañana', Intencion.DESPEDIDA],
      ['chao, nos vemos', Intencion.DESPEDIDA],
      ['gracias, hasta luego', Intencion.DESPEDIDA],
      ['¿cómo estás?', Intencion.COMO_ESTAS],
      ['hola, ¿cómo estás hoy?', Intencion.COMO_ESTAS],
      ['qué tal', Intencion.COMO_ESTAS],
      ['¿qué puedes hacer?', Intencion.QUE_PUEDES_HACER],
      ['¿en qué me puedes ayudar?', Intencion.QUE_PUEDES_HACER],
      ['hola, ¿quién eres?', Intencion.QUE_PUEDES_HACER],
      ['¿qué es VSD IA?', Intencion.QUE_PUEDES_HACER],
    ];

    it.each(CHARLA)('"%s" se lee como charla', async (texto, esperada) => {
      const respuesta = await asistente.responder({ userId: USUARIO, zonaHoraria: ZONA, texto });

      expect(respuesta.intencion).toBe(esperada);
    });

    // El criterio de aceptacion, literal.
    it.each(['Hola', 'gracias', 'buenas noches'])(
      '"%s" recibe una respuesta calida y sin lineas de atencion',
      async (texto) => {
        const respuesta = await asistente.responder({ userId: USUARIO, zonaHoraria: ZONA, texto });

        expect(respuesta.mensaje.length).toBeGreaterThan(10);
        expect(respuesta.recursos).toEqual([]);
        expect(respuesta.incluyeLineasDeAtencion).toBe(false);
        expect(respuesta.senalDeRiesgo).toBe(false);
      },
    );

    it('"buenas noches" tiene su propia respuesta, y sirve a quien lo escribe al llegar', async () => {
      const noches = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'buenas noches',
      });
      const adios = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'adiós',
      });

      expect(noches.mensaje).toMatch(/buenas noches/iu);
      expect(noches.mensaje).toMatch(/aquí estoy/iu);
      expect(adios.mensaje).not.toBe(noches.mensaje);
    });

    it('no anade el historial: un saludo no es una ficha de seguimiento', async () => {
      await historial.save(unResultado(2, '44444444-4444-4444-b444-000000000001'));

      for (const [texto] of CHARLA) {
        const respuesta = await asistente.responder({ userId: USUARIO, zonaHoraria: ZONA, texto });

        expect(respuesta.mensaje, texto).not.toMatch(/registraste/u);
      }
    });

    it('no pregunta nada: no sabria contestar un "bien" o un "mas o menos"', async () => {
      for (const [texto] of CHARLA) {
        const respuesta = await asistente.responder({ userId: USUARIO, zonaHoraria: ZONA, texto });

        expect(respuesta.mensaje, texto).not.toMatch(/[?¿]/u);
      }
    });

    it('el nombre de la mascota tambien es charla', async () => {
      const con = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'Hola, Luma',
        nombreDeLaMascota: 'Luma',
      });
      const sin = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'Hola, Luma',
      });

      expect(con.intencion).toBe(Intencion.SALUDO);
      // Sin saber que Luma es la mascota, es una palabra que no se entiende.
      expect(sin.intencion).toBe(Intencion.NO_RECONOCIDA);
    });

    it('ni un nombre de mascota que sea una frase de riesgo desvia el protocolo', async () => {
      // El unico camino para que una frase de riesgo parezca charla: que sus
      // palabras sean "relleno". Aqui lo son, porque la persona llamo asi a su
      // mascota. El riesgo se mira antes y aparte, y gana igual.
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'hola, quiero morirme',
        nombreDeLaMascota: 'quiero morirme',
      });

      expect(respuesta.senalDeRiesgo).toBe(true);
      expect(respuesta.incluyeLineasDeAtencion).toBe(true);
    });

    it('el nombre de la mascota no abre la puerta a otra cosa', async () => {
      const respuesta = await asistente.responder({
        userId: USUARIO,
        zonaHoraria: ZONA,
        texto: 'Hola, Luma, quiero desaparecer',
        nombreDeLaMascota: 'Luma',
      });

      expect(respuesta.intencion).toBe(Intencion.NO_RECONOCIDA);
      expect(respuesta.incluyeLineasDeAtencion).toBe(true);
    });

    describe('si el mensaje trae algo mas, ya no es charla', () => {
      // Lo que importa de esta prueba: la lista de riesgo es un suelo, no un
      // techo. Estas frases no estan en ella, y un saludo delante no las puede
      // dejar sin lineas de atencion.
      it.each([
        'hola, quiero desaparecer',
        'hola, no quiero despertar',
        'adiós a todo',
        'adiós, y gracias por todo',
        'gracias por todo',
        'adiós para siempre',
        'hasta nunca',
        'buenas noches, que nadie me busque',
        'me despido de este mundo',
        'chao, ya no estoy',
      ])('"%s" sigue ensenando las lineas de atencion', async (texto) => {
        const respuesta = await asistente.responder({ userId: USUARIO, zonaHoraria: ZONA, texto });

        expect(respuesta.intencion).toBe(Intencion.NO_RECONOCIDA);
        expect(respuesta.incluyeLineasDeAtencion).toBe(true);
        expect(respuesta.recursos.every((recurso) => recurso.esLineaDeAtencion())).toBe(true);
      });
    });

    describe('con una pregunta de verdad, la pregunta gana', () => {
      it.each([
        ['hola, ¿cómo puedo dormir mejor?', Intencion.COMO_DUERMO_MEJOR],
        ['gracias, ¿qué significa mi nivel?', Intencion.QUE_SIGNIFICA_MI_RESULTADO],
        ['hola, me siento triste', Intencion.ME_SIENTO_MAL],
        ['buenas noches, ¿dónde busco ayuda?', Intencion.DONDE_BUSCO_AYUDA],
        ['gracias, pero me siento peor', Intencion.ME_SIENTO_MAL],
      ])('"%s"', async (texto, esperada) => {
        const respuesta = await asistente.responder({ userId: USUARIO, zonaHoraria: ZONA, texto });

        expect(respuesta.intencion).toBe(esperada);
      });
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
      'hola',
      'gracias',
      'buenas noches',
      'adiós',
      'cómo estás',
      'qué puedes hacer',
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
