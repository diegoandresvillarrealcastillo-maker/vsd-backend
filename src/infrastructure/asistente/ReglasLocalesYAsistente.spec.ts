import { beforeAll, describe, expect, it } from 'vitest';
import { ConsultarLasReglasLocalesUseCaseImpl } from '../../application/usecases/ConsultarLasReglasLocalesUseCaseImpl.js';
import { PAISES_CON_LINEAS, ZONAS_POR_PAIS, paisDeLaZona } from '../../domain/model/PaisDeAyuda.js';
import {
  MENSAJES,
  REGLAS_DE_CHARLA,
  REGLAS_DE_INTENCION,
} from '../../domain/model/ReglasDelAsistente.js';
import { EXPRESIONES_DE_RIESGO, hayRiesgo } from '../../domain/model/SenalesDeRiesgo.js';
import { Intencion } from '../../domain/ports/in/AsistentePort.js';
import type { ReglasLocalesDelAsistente } from '../../domain/ports/in/ConsultarLasReglasLocalesUseCase.js';
import { CASOS_DE_LAS_REGLAS_LOCALES } from '../../pruebas/casosDeLasReglasLocales.js';
import { responderSinConexion } from '../../pruebas/motorLocalDeReferencia.js';
import { ReglasLocalesDelAsistenteDto } from '../controllers/dto/ReglasLocalesDelAsistenteDto.js';
import { InMemoryActivityResultRepository } from '../repositories/InMemoryActivityResultRepository.js';
import { InMemoryRecursoApoyoRepository } from '../repositories/InMemoryRecursoApoyoRepository.js';
import { AsistentePorReglas } from './AsistentePorReglas.js';

/**
 * Lo que publica el servidor para responder sin conexion y lo que responde el
 * asistente de verdad tienen que ser **lo mismo** (SCRUM-141).
 *
 * Es la prueba que falla si se separan. El criterio de aceptacion lo pide asi:
 * "las reglas del cliente y del servidor salen del mismo origen". Aqui se comprueba
 * de la unica forma que de verdad prueba algo: **ejecutando las dos cosas**. Para
 * cada regla, cada patron, cada expresion de riesgo y cada zona, se le pregunta al
 * asistente y se le pregunta al motor de referencia, que solo conoce el paquete
 * publicado, y las respuestas tienen que coincidir.
 *
 * Si alguien agrega una regla en un sitio y no en el otro, o cambia un texto, o una
 * zona, o una linea, una de estas pruebas se rompe y dice cual.
 */
const USUARIO = '11111111-1111-4111-8111-111111111111';
const BOGOTA = 'America/Bogota';
const MADRID = 'Europe/Madrid';
const TOKIO = 'Asia/Tokyo';

/** Lo que el asistente responde sin conexion, aunque con conexion diga mas. */
const SE_RESPONDE_SIN_CONEXION: readonly string[] = [
  Intencion.SALUDO,
  Intencion.AGRADECIMIENTO,
  Intencion.DESPEDIDA,
  Intencion.DONDE_BUSCO_AYUDA,
];

/** Un texto que activa un patron: el patron mismo, sin el `*` de las raices. */
const ejemploDe = (patron: string): string => patron.replace(/\*$/u, '');

describe('lo que se publica y lo que responde el asistente: una sola verdad', () => {
  let reglas: ReglasLocalesDelAsistente;
  let asistente: AsistentePorReglas;

  const responder = (texto: string, zona = BOGOTA, nombreDeLaMascota?: string) =>
    asistente.responder({ userId: USUARIO, zonaHoraria: zona, texto, nombreDeLaMascota });

  beforeAll(async () => {
    const recursos = new InMemoryRecursoApoyoRepository();

    reglas = await new ConsultarLasReglasLocalesUseCaseImpl(recursos).ejecutar();
    asistente = new AsistentePorReglas(recursos, new InMemoryActivityResultRepository());
  });

  describe('el riesgo', () => {
    it('el paquete trae exactamente las expresiones que usa el servidor, ni una mas ni una menos', () => {
      expect([...reglas.riesgo.expresiones]).toEqual([...EXPRESIONES_DE_RIESGO]);
    });

    it.each(EXPRESIONES_DE_RIESGO)(
      'ante "%s", servidor y dispositivo ensenan lo mismo: el mismo mensaje y las mismas lineas',
      async (expresion) => {
        const delServidor = await responder(expresion);
        const delDispositivo = responderSinConexion(reglas, { texto: expresion, zona: BOGOTA });

        expect(hayRiesgo(expresion)).toBe(true);
        expect(delServidor.senalDeRiesgo).toBe(true);
        expect(delDispositivo).toEqual({
          tipo: 'riesgo',
          mensaje: delServidor.mensaje,
          lineas: delServidor.recursos.map((recurso) => recurso.id),
        });
      },
    );

    it.each(
      Object.entries(ZONAS_POR_PAIS).flatMap(([pais, zonas]) => zonas.map((zona) => [pais, zona])),
    )(
      'desde una zona de %s (%s), el dispositivo ensena las lineas de ese pais y las del servidor',
      async (pais, zona) => {
        const delServidor = await responder('quiero morirme', zona);
        const delDispositivo = responderSinConexion(reglas, { texto: 'quiero morirme', zona });

        expect(paisDeLaZona(zona)).toBe(pais);
        expect(delDispositivo).toMatchObject({
          tipo: 'riesgo',
          lineas: delServidor.recursos.map((recurso) => recurso.id),
        });
        expect(delServidor.recursos.length).toBeGreaterThan(0);
        // Y nunca las de otro pais: es el peor error posible.
        for (const recurso of delServidor.recursos) {
          expect(reglas.paises[pais]?.lineas.map((linea) => linea.id)).toContain(recurso.id);
        }
      },
    );

    it.each([TOKIO, 'Narnia/Cair_Paravel', '', 'America/Lima'])(
      'una zona sin pais ("%s") recibe el directorio internacional, igual que del servidor',
      async (zona) => {
        const delServidor = await responder('quiero morirme', zona);
        const delDispositivo = responderSinConexion(reglas, { texto: 'quiero morirme', zona });

        expect(delDispositivo).toMatchObject({
          tipo: 'riesgo',
          lineas: delServidor.recursos.map((recurso) => recurso.id),
        });
        expect(delDispositivo).toMatchObject({
          lineas: reglas.internacional.map((linea) => linea.id),
        });
      },
    );

    it('no hay ninguna zona de un pais con lineas que el paquete no sepa a que pais pertenece', () => {
      const delPaquete = new Map(
        Object.entries(reglas.paises).flatMap(([pais, datos]) =>
          datos.zonas.map((zona): [string, string] => [zona, pais]),
        ),
      );

      for (const pais of PAISES_CON_LINEAS) {
        for (const zona of ZONAS_POR_PAIS[pais]) {
          expect(delPaquete.get(zona), zona).toBe(pais);
        }
      }
    });
  });

  describe('la charla', () => {
    const casos = REGLAS_DE_CHARLA.flatMap((regla) =>
      regla.patrones.map((patron) => [regla.intencion, ejemploDe(patron), regla.sinConexion]),
    );

    it.each(casos)(
      'la regla de "%s" reconoce "%s" igual en el servidor y en el paquete',
      async (intencion, texto, sinConexion) => {
        const delServidor = await responder(String(texto));
        const delDispositivo = responderSinConexion(reglas, {
          texto: String(texto),
          zona: BOGOTA,
        });

        // Todos los patrones se alcanzan: ninguno queda tapado por otra regla.
        expect(delServidor.intencion).toBe(intencion);
        expect(delServidor.senalDeRiesgo).toBe(false);

        if (sinConexion) {
          expect(delDispositivo).toMatchObject({ tipo: 'charla', intencion });
        } else {
          expect(delDispositivo).toEqual({ tipo: 'exige-conexion' });
        }
      },
    );

    it('lo que se dice sin conexion es lo del servidor, salvo el saludo, que no invita a preguntar lo que no se puede', async () => {
      for (const regla of REGLAS_DE_CHARLA.filter((una) => una.sinConexion)) {
        const texto = ejemploDe(regla.patrones[0] ?? '');
        const delServidor = await responder(texto);
        const delDispositivo = responderSinConexion(reglas, { texto, zona: BOGOTA });

        expect(delDispositivo, regla.intencion).toMatchObject({
          mensaje:
            regla.mensajeSinConexion === undefined ? delServidor.mensaje : regla.mensajeSinConexion,
        });
      }
    });

    it('una despedida con "buenas noches" lleva la variante, en el servidor y en el paquete', async () => {
      const delServidor = await responder('buenas noches');
      const delDispositivo = responderSinConexion(reglas, {
        texto: 'buenas noches',
        zona: BOGOTA,
      });

      expect(delDispositivo).toMatchObject({ tipo: 'charla', mensaje: delServidor.mensaje });
      expect(delServidor.mensaje).not.toBe(MENSAJES[Intencion.DESPEDIDA]);
    });

    it('el nombre de la mascota cuenta como relleno en los dos lados', async () => {
      const delServidor = await responder('hola luma', BOGOTA, 'Luma');
      const delDispositivo = responderSinConexion(reglas, {
        texto: 'hola luma',
        zona: BOGOTA,
        mascota: 'Luma',
      });

      expect(delServidor.intencion).toBe(Intencion.SALUDO);
      expect(delDispositivo).toMatchObject({ tipo: 'charla', intencion: Intencion.SALUDO });
    });

    it('un saludo con algo serio detras no es charla en ninguno de los dos lados', async () => {
      const delServidor = await responder('hola, quiero desaparecer');
      const delDispositivo = responderSinConexion(reglas, {
        texto: 'hola, quiero desaparecer',
        zona: BOGOTA,
      });

      expect(delServidor.intencion).not.toBe(Intencion.SALUDO);
      expect(delDispositivo).toEqual({ tipo: 'exige-conexion' });
    });
  });

  describe('lo demas que el servidor reconoce', () => {
    const casos = REGLAS_DE_INTENCION.flatMap((regla) =>
      regla.patrones.map((patron) => [regla.intencion, ejemploDe(patron), regla.sinConexion]),
    );

    it.each(casos)(
      'la regla de "%s" reconoce "%s" igual en el servidor y en el paquete',
      async (intencion, texto, sinConexion) => {
        const delServidor = await responder(String(texto));
        const delDispositivo = responderSinConexion(reglas, {
          texto: String(texto),
          zona: BOGOTA,
        });

        expect(delServidor.intencion).toBe(intencion);

        if (sinConexion) {
          // Donde buscar ayuda: el mismo mensaje y las mismas lineas.
          expect(delDispositivo).toEqual({
            tipo: 'ayuda',
            intencion,
            mensaje: delServidor.mensaje,
            lineas: delServidor.recursos.map((recurso) => recurso.id),
          });
        } else {
          expect(delDispositivo).toEqual({ tipo: 'exige-conexion' });
        }
      },
    );

    it.each([BOGOTA, MADRID, TOKIO, 'America/Mexico_City', 'America/New_York'])(
      'donde buscar ayuda desde %s: las lineas de ese lugar, como las del servidor',
      async (zona) => {
        const delServidor = await responder('donde busco ayuda', zona);
        const delDispositivo = responderSinConexion(reglas, { texto: 'donde busco ayuda', zona });

        expect(delDispositivo).toMatchObject({
          tipo: 'ayuda',
          lineas: delServidor.recursos.map((recurso) => recurso.id),
        });
      },
    );
  });

  describe('el conjunto de frases', () => {
    it.each(CASOS_DE_LAS_REGLAS_LOCALES.map((caso) => [caso.texto, caso]))(
      'servidor y dispositivo coinciden en "%s"',
      async (_texto, caso) => {
        const delServidor = await responder(caso.texto, caso.zona, caso.mascota);
        const delDispositivo = responderSinConexion(reglas, caso);

        if (delServidor.senalDeRiesgo) {
          expect(delDispositivo).toEqual({
            tipo: 'riesgo',
            mensaje: delServidor.mensaje,
            lineas: delServidor.recursos.map((recurso) => recurso.id),
          });

          return;
        }

        if (SE_RESPONDE_SIN_CONEXION.includes(delServidor.intencion)) {
          // Lo que el servidor reconoce de esta lista y no se puede responder sin
          // conexion es un hueco: el dispositivo tendria que callar donde el servidor
          // habla, o hablar donde el servidor no.
          expect(delDispositivo.tipo, caso.texto).not.toBe('exige-conexion');
          expect(delDispositivo).toMatchObject({ intencion: delServidor.intencion });

          return;
        }

        expect(delDispositivo, caso.texto).toEqual({ tipo: 'exige-conexion' });
      },
    );

    it('el conjunto tiene de todo: lo que se responde sin conexion y lo que no', () => {
      const tipos = new Set(
        CASOS_DE_LAS_REGLAS_LOCALES.map((caso) => responderSinConexion(reglas, caso).tipo),
      );

      expect([...tipos].sort()).toEqual(['ayuda', 'charla', 'exige-conexion', 'riesgo']);
    });
  });

  describe('lo que sale por HTTP es lo mismo que sale del caso de uso', () => {
    it('el DTO no pierde ni agrega nada de lo que se comprueba arriba', () => {
      const dto = JSON.parse(JSON.stringify(ReglasLocalesDelAsistenteDto.desde(reglas))) as Record<
        string,
        unknown
      >;

      expect(dto['esquema']).toBe(reglas.esquema);
      expect(dto['riesgo']).toEqual({
        expresiones: [...reglas.riesgo.expresiones],
        mensaje: reglas.riesgo.mensaje,
      });
      expect(Object.keys(dto['paises'] as object)).toEqual(Object.keys(reglas.paises));
    });
  });
});
