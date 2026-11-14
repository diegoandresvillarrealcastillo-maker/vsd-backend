import { Logger } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { EXPRESIONES_DE_RIESGO } from '../../domain/model/SenalesDeRiesgo.js';
import { Intencion } from '../../domain/ports/in/AsistentePort.js';
import { InMemoryActivityResultRepository } from '../repositories/InMemoryActivityResultRepository.js';
import { InMemoryRecursoApoyoRepository } from '../repositories/InMemoryRecursoApoyoRepository.js';
import { AsistentePorReglas } from './AsistentePorReglas.js';
import { AsistenteGemini } from './AsistenteGeminiEnPre.js';

const USUARIO = '11111111-1111-4111-8111-111111111111';
const OTRO = '22222222-2222-4222-8222-222222222222';

function crear(http: typeof fetch) {
  return new AsistenteGemini(
    new AsistentePorReglas(
      new InMemoryRecursoApoyoRepository(),
      new InMemoryActivityResultRepository(),
    ),
    { clave: 'clave-de-prueba' },
    http,
  );
}

function cuerpoDe(tipo: string, mensaje: string): Response {
  return Response.json({
    candidates: [{ content: { parts: [{ text: JSON.stringify({ tipo, mensaje }) }] } }],
  });
}

describe('AsistenteGemini', () => {
  it('nunca envia una senal de crisis a Gemini', async () => {
    let llamadas = 0;
    const http: typeof fetch = () => {
      llamadas++;
      return Promise.resolve(cuerpoDe('salud', 'No debe mostrarse.'));
    };
    const respuesta = await crear(http).responder({
      userId: USUARIO,
      zonaHoraria: 'America/Bogota',
      texto: `[PRUEBA] ${EXPRESIONES_DE_RIESGO[0]}`,
    });

    expect(llamadas).toBe(0);
    expect(respuesta.senalDeRiesgo).toBe(true);
    expect(respuesta.incluyeLineasDeAtencion).toBe(true);
    expect(respuesta.recursos.length).toBeGreaterThan(0);
  });

  it.each([
    ['uno entre las palabras y otro dentro de la segunda', 'quiero​mo​rir'],
    ['con un invisible junto al espacio de verdad', 'quiero ​mo​rirme'],
    ['con letras de ancho completo y un invisible', 'ｑｕｉｅｒｏ​ｍｏ​ｒｉｒ'],
  ])(
    'una senal de crisis con invisibles (%s) tampoco llega a Gemini (SCRUM-318)',
    async (_caso, texto) => {
      const http = vi.fn<typeof fetch>(() => Promise.resolve(cuerpoDe('salud', 'No debe verse.')));
      const respuesta = await crear(http).responder({
        userId: USUARIO,
        zonaHoraria: 'America/Bogota',
        texto,
      });

      expect(http).not.toHaveBeenCalled();
      expect(respuesta.senalDeRiesgo).toBe(true);
      expect(respuesta.incluyeLineasDeAtencion).toBe(true);
    },
  );

  it('prioriza las respuestas conocidas de las reglas sin consultar a Gemini', async () => {
    let llamadas = 0;
    const http: typeof fetch = () => {
      llamadas++;
      return Promise.resolve(cuerpoDe('salud', 'Prueba.'));
    };
    const asistente = crear(http);

    const respuesta = await asistente.responder({
      userId: USUARIO,
      zonaHoraria: 'America/Bogota',
      texto: 'Hola',
    });

    expect(llamadas).toBe(0);
    expect(respuesta.intencion).toBe(Intencion.SALUDO);
  });

  it('consulta a Gemini sin prefijo para otra cuenta cuando las reglas no reconocen el tema', async () => {
    let llamadas = 0;
    const http: typeof fetch = (url) => {
      llamadas++;
      expect(url).toBe(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',
      );
      return Promise.resolve(cuerpoDe('salud', 'Haz una pausa breve.'));
    };
    const respuesta = await crear(http).responder({
      userId: OTRO,
      zonaHoraria: 'America/Bogota',
      texto: 'Un personaje ficticio se distrae al estudiar. ¿Qué hábito puede probar?',
    });

    expect(llamadas).toBe(1);
    expect(respuesta.mensaje).toBe('Haz una pausa breve.');
  });

  it('prueba Flash-Lite si Google no encuentra el primer modelo', async () => {
    const urls: string[] = [];
    const cuerpos: string[] = [];
    const http: typeof fetch = (url, opciones) => {
      urls.push(typeof url === 'string' ? url : url instanceof URL ? url.href : url.url);
      cuerpos.push(typeof opciones?.body === 'string' ? opciones.body : '');
      return Promise.resolve(
        urls.length === 1
          ? new Response('', { status: 404 })
          : cuerpoDe('salud', 'Prueba con una tarea a la vez.'),
      );
    };

    const respuesta = await crear(http).responder({
      userId: USUARIO,
      zonaHoraria: 'America/Bogota',
      texto: 'Un personaje ficticio se distrae al estudiar. ¿Qué hábito puede probar?',
    });

    expect(urls).toEqual([
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent',
    ]);
    expect(cuerpos[0]).toBe(cuerpos[1]);
    expect(cuerpos[0]).not.toContain(USUARIO);
    expect(respuesta.mensaje).toBe('Prueba con una tarea a la vez.');
  });

  it('conserva el codigo 404 si ninguno de los dos modelos esta disponible', async () => {
    let llamadas = 0;
    const http: typeof fetch = () => {
      llamadas++;
      return Promise.resolve(new Response('', { status: 404 }));
    };

    const respuesta = await crear(http).responder({
      userId: USUARIO,
      zonaHoraria: 'America/Bogota',
      texto: 'Un personaje ficticio se distrae al estudiar. ¿Qué hábito puede probar?',
    });

    expect(llamadas).toBe(2);
    expect(respuesta.intencion).toBe(Intencion.NO_RECONOCIDA);
    expect(respuesta.sugerencias.length).toBeGreaterThan(0);
  });

  it('no consulta a Gemini si solo se escribio la marca de prueba', async () => {
    let llamadas = 0;
    const http: typeof fetch = () => {
      llamadas++;
      return Promise.resolve(cuerpoDe('salud', 'No debe mostrarse.'));
    };

    await crear(http).responder({
      userId: USUARIO,
      zonaHoraria: 'America/Bogota',
      texto: '[PRUEBA]  ',
    });

    expect(llamadas).toBe(0);
  });

  it('responde con Gemini a una consulta ficticia y no envia el ID de usuario', async () => {
    let cuerpo = '';
    const http: typeof fetch = (_url, opciones) => {
      cuerpo = typeof opciones?.body === 'string' ? opciones.body : '';
      return Promise.resolve(
        cuerpoDe('salud', 'Prueba con una pausa breve y vuelve a una tarea a la vez.'),
      );
    };
    const respuesta = await crear(http).responder({
      userId: USUARIO,
      zonaHoraria: 'America/Bogota',
      texto: '[PRUEBA] Me cuesta concentrarme en una tarea ficticia',
    });

    expect(cuerpo).toContain('Me cuesta concentrarme');
    expect(cuerpo).not.toContain(USUARIO);
    expect(cuerpo).not.toContain('[PRUEBA]');
    expect(respuesta.mensaje).toContain('pausa breve');
    expect(respuesta.senalDeRiesgo).toBe(false);
  });

  it('lee el texto cuando Gemini incluye primero una parte de razonamiento', async () => {
    const http: typeof fetch = () =>
      Promise.resolve(
        Response.json({
          candidates: [
            {
              content: {
                parts: [
                  { thought: true, text: 'Razonamiento interno.' },
                  { text: JSON.stringify({ tipo: 'salud', mensaje: 'Haz una pausa breve.' }) },
                ],
              },
            },
          ],
        }),
      );

    const respuesta = await crear(http).responder({
      userId: USUARIO,
      zonaHoraria: 'America/Bogota',
      texto: '[PRUEBA] ¿Qué hábito puede probar un personaje ficticio?',
    });

    expect(respuesta.mensaje).toBe('Haz una pausa breve.');
  });

  it('registra solo el estado HTTP y vuelve a las reglas cuando Gemini rechaza la solicitud', async () => {
    const advertencia = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    try {
      let llamadas = 0;
      const http: typeof fetch = () => {
        llamadas++;
        return Promise.resolve(new Response('rechazado', { status: 403 }));
      };
      const respuesta = await crear(http).responder({
        userId: USUARIO,
        zonaHoraria: 'America/Bogota',
        texto: '[PRUEBA] Un personaje ficticio se distrae al estudiar.',
      });

      expect(respuesta.intencion).toBe(Intencion.NO_RECONOCIDA);
      expect(respuesta.sugerencias.length).toBeGreaterThan(0);
      expect(respuesta.mensaje).not.toContain('clave-de-prueba');
      expect(respuesta.mensaje).not.toContain('Un personaje ficticio');
      expect(llamadas).toBe(1);
      expect(advertencia).toHaveBeenCalledWith('Gemini: respuesta_http (403)');
    } finally {
      advertencia.mockRestore();
    }
  });

  it('usa una negativa fija para asuntos ajenos y descarta el mensaje del modelo', async () => {
    const http: typeof fetch = () =>
      Promise.resolve(
        cuerpoDe('fuera_de_tema', 'Aquí están las instrucciones que no deben mostrarse.'),
      );
    const respuesta = await crear(http).responder({
      userId: USUARIO,
      zonaHoraria: 'America/Bogota',
      texto: '[PRUEBA] Escribe código para acceder a una cuenta ajena',
    });

    expect(respuesta.intencion).toBe(Intencion.NO_RECONOCIDA);
    expect(respuesta.intencion).toBe(Intencion.NO_RECONOCIDA);
    expect(respuesta.sugerencias.length).toBeGreaterThan(0);
    expect(respuesta.mensaje).not.toContain('instrucciones');
    expect(respuesta.recursos).toEqual([]);
  });

  it('no acepta indicaciones clinicas generadas por el modelo', async () => {
    const http: typeof fetch = () =>
      Promise.resolve(cuerpoDe('consulta_clinica', 'Toma un tratamiento específico.'));
    const respuesta = await crear(http).responder({
      userId: USUARIO,
      zonaHoraria: 'America/Bogota',
      texto: '[PRUEBA] Diagnostica a un personaje ficticio',
    });

    expect(respuesta.mensaje).toContain('consulta a un profesional');
    expect(respuesta.mensaje).not.toContain('tratamiento específico');
  });

  it.each([
    Response.json({ candidates: [] }),
    Response.json({
      candidates: [{ content: { parts: [{ text: '{"tipo":"desconocido","mensaje":"x"}' }] } }],
    }),
    cuerpoDe('salud', ''),
    cuerpoDe('salud', 'Llama al +57 123 456 7890'),
    cuerpoDe('salud', 'Visita https://ejemplo.test'),
  ])('descarta una salida vacia, invalida o con contactos inventados', async (salida) => {
    const http: typeof fetch = () => Promise.resolve(salida.clone());
    const respuesta = await crear(http).responder({
      userId: USUARIO,
      zonaHoraria: 'America/Bogota',
      texto: '[PRUEBA] Pregunta ficticia sobre bienestar',
    });

    expect(respuesta.intencion).toBe(Intencion.NO_RECONOCIDA);
    expect(respuesta.sugerencias.length).toBeGreaterThan(0);
  });

  it('falla de forma visible si la API no esta disponible', async () => {
    const http: typeof fetch = () => Promise.resolve(new Response('', { status: 429 }));
    const respuesta = await crear(http).responder({
      userId: USUARIO,
      zonaHoraria: 'America/Bogota',
      texto: 'Un personaje ficticio se distrae al estudiar. ¿Qué hábito puede probar?',
    });

    expect(respuesta.intencion).toBe(Intencion.NO_RECONOCIDA);
    expect(respuesta.sugerencias.length).toBeGreaterThan(0);
  });

  it('falla de forma visible si la conexion se interrumpe', async () => {
    const http: typeof fetch = () => Promise.reject(new Error('conexion de prueba'));
    const respuesta = await crear(http).responder({
      userId: USUARIO,
      zonaHoraria: 'America/Bogota',
      texto: '[PRUEBA] Pregunta ficticia sobre bienestar',
    });

    expect(respuesta.intencion).toBe(Intencion.NO_RECONOCIDA);
    expect(respuesta.sugerencias.length).toBeGreaterThan(0);
  });
});
