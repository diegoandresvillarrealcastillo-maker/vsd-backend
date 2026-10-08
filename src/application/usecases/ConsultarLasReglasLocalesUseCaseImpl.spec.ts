import { describe, expect, it } from 'vitest';
import { PAISES_CON_LINEAS, ZONAS_POR_PAIS } from '../../domain/model/PaisDeAyuda.js';
import { RecursoApoyo } from '../../domain/model/RecursoApoyo.js';
import {
  MENSAJES,
  MENSAJE_DE_RIESGO,
  REGLAS_DE_CHARLA,
  REGLAS_DE_INTENCION,
} from '../../domain/model/ReglasDelAsistente.js';
import { EXPRESIONES_DE_RIESGO } from '../../domain/model/SenalesDeRiesgo.js';
import { Intencion } from '../../domain/ports/in/AsistentePort.js';
import { ESQUEMA_DE_LAS_REGLAS_LOCALES } from '../../domain/ports/in/ConsultarLasReglasLocalesUseCase.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import { ConsultarLasReglasLocalesUseCaseImpl } from './ConsultarLasReglasLocalesUseCaseImpl.js';

function contacto(
  id: string,
  pais: string | undefined,
  cobertura: string,
  titulo = `Linea ${id}`,
): RecursoApoyo {
  return RecursoApoyo.create({
    id,
    titulo,
    tipo: 'contacto',
    cobertura,
    ...(pais === undefined ? {} : { pais }),
    fuente: 'https://ejemplo.gov',
    verificadoEl: '2026-10-01',
  });
}

/** Lo que hay en la base: una linea nacional por pais, una de ciudad en Colombia y el directorio. */
const LINEAS = [
  contacto('0192c0de-0000-4000-8000-000000000192', 'CO', 'nacional'),
  contacto('0106c0de-0000-4000-8000-000000000106', 'CO', 'bogota'),
  contacto('0a00c0de-0000-4000-8000-0000000000a1', 'MX', 'nacional'),
  contacto('0a00c0de-0000-4000-8000-0000000000a2', 'ES', 'nacional'),
  contacto('0a00c0de-0000-4000-8000-0000000000a3', 'US', 'nacional'),
  contacto('0ffec0de-0000-4000-8000-00000000f1de', undefined, 'internacional'),
];

/**
 * Un doble de la base, con la misma regla que la de verdad: un pais recibe las
 * suyas y, si no tiene, o no hay pais, el directorio. Esta prueba no importa nada de
 * `infrastructure/`; que el paquete coincide con lo que responde el asistente
 * se comprueba en `ReglasLocalesYAsistente.spec.ts`.
 */
const repositorio: RecursoApoyoRepositoryPort = {
  lineasDeAtencion(pais) {
    const delPais = pais === undefined ? [] : LINEAS.filter((linea) => linea.pais === pais);

    return Promise.resolve(
      delPais.length > 0 ? delPais : LINEAS.filter((linea) => linea.pais === undefined),
    );
  },
  porTema: () => Promise.resolve([]),
};

describe('ConsultarLasReglasLocalesUseCaseImpl', () => {
  it('lleva la version de su forma', async () => {
    const reglas = await new ConsultarLasReglasLocalesUseCaseImpl(repositorio).ejecutar();

    expect(reglas.esquema).toBe(ESQUEMA_DE_LAS_REGLAS_LOCALES);
    expect(reglas.esquema).toBe(1);
  });

  describe('el riesgo', () => {
    it('son las mismas expresiones y el mismo mensaje que usa el servidor', async () => {
      const { riesgo } = await new ConsultarLasReglasLocalesUseCaseImpl(repositorio).ejecutar();

      expect(riesgo.expresiones).toEqual(EXPRESIONES_DE_RIESGO);
      expect(riesgo.mensaje).toBe(MENSAJE_DE_RIESGO);
    });

    it('no comparte la lista con el dominio: quien la reciba no puede cambiarla', async () => {
      const { riesgo } = await new ConsultarLasReglasLocalesUseCaseImpl(repositorio).ejecutar();
      const antes = EXPRESIONES_DE_RIESGO.length;

      (riesgo.expresiones as string[]).push('algo que no esta');

      expect(EXPRESIONES_DE_RIESGO).toHaveLength(antes);
    });
  });

  describe('quien lo reciba no puede cambiar las reglas del servidor', () => {
    it('ninguna lista del paquete es la del dominio: cambiar una no toca a la otra', async () => {
      const reglas = await new ConsultarLasReglasLocalesUseCaseImpl(repositorio).ejecutar();
      const patronesDeCharla = REGLAS_DE_CHARLA[0]?.patrones.length;
      const patronesDeIntencion = REGLAS_DE_INTENCION[0]?.patrones.length;
      const zonasDeColombia = ZONAS_POR_PAIS.CO.length;

      (reglas.charla.reglas[0]?.patrones as string[]).push('algo que no esta');
      (reglas.intenciones[0]?.patrones as string[]).push('algo que no esta');
      (reglas.paises['CO']?.zonas as string[]).push('Algun/Lugar');

      expect(REGLAS_DE_CHARLA[0]?.patrones).toHaveLength(patronesDeCharla ?? -1);
      expect(REGLAS_DE_INTENCION[0]?.patrones).toHaveLength(patronesDeIntencion ?? -1);
      expect(ZONAS_POR_PAIS.CO).toHaveLength(zonasDeColombia);
    });
  });

  describe('la charla', () => {
    it('va en el mismo orden que en el servidor, tambien lo que sin conexion no se responde', async () => {
      const { charla } = await new ConsultarLasReglasLocalesUseCaseImpl(repositorio).ejecutar();

      expect(charla.reglas.map((regla) => regla.intencion)).toEqual(
        REGLAS_DE_CHARLA.map((regla) => regla.intencion),
      );
      expect(charla.reglas.map((regla) => regla.patrones)).toEqual(
        REGLAS_DE_CHARLA.map((regla) => regla.patrones),
      );
    });

    it('un saludo, un agradecimiento y una despedida traen su mensaje', async () => {
      const { charla } = await new ConsultarLasReglasLocalesUseCaseImpl(repositorio).ejecutar();
      const mensajes = Object.fromEntries(
        charla.reglas.map((regla) => [regla.intencion, regla.mensaje]),
      );

      expect(mensajes[Intencion.AGRADECIMIENTO]).toBe(MENSAJES[Intencion.AGRADECIMIENTO]);
      expect(mensajes[Intencion.DESPEDIDA]).toBe(MENSAJES[Intencion.DESPEDIDA]);
      expect(mensajes[Intencion.SALUDO]).toEqual(expect.any(String));
    });

    it('el saludo sin conexion dice lo suyo y no lo que invita a preguntar con conexion', async () => {
      const { charla } = await new ConsultarLasReglasLocalesUseCaseImpl(repositorio).ejecutar();
      const saludo = charla.reglas.find((regla) => regla.intencion === Intencion.SALUDO);

      expect(saludo?.mensaje).not.toBe(MENSAJES[Intencion.SALUDO]);
      expect(saludo?.mensaje).toMatch(/sin conexión/iu);
    });

    it('lo que sin conexion no se responde se publica sin mensaje, pero se publica', async () => {
      const { charla } = await new ConsultarLasReglasLocalesUseCaseImpl(repositorio).ejecutar();

      for (const intencion of [Intencion.COMO_ESTAS, Intencion.QUE_PUEDES_HACER]) {
        const regla = charla.reglas.find((una) => una.intencion === intencion);

        expect(regla, intencion).toBeDefined();
        expect(regla?.mensaje, intencion).toBeNull();
        expect(regla?.patrones.length, intencion).toBeGreaterThan(0);
      }
    });

    it('la despedida lleva su variante de "buenas noches"', async () => {
      const { charla } = await new ConsultarLasReglasLocalesUseCaseImpl(repositorio).ejecutar();
      const despedida = charla.reglas.find((regla) => regla.intencion === Intencion.DESPEDIDA);

      expect(despedida?.variantes).toHaveLength(1);
      expect(despedida?.variantes[0]?.patrones).toEqual(['buenas noches']);
      expect(despedida?.variantes[0]?.mensaje).toMatch(/Buenas noches/u);
    });

    it('las reglas sin variantes las publican como una lista vacia, no como un hueco', async () => {
      const { charla } = await new ConsultarLasReglasLocalesUseCaseImpl(repositorio).ejecutar();

      expect(
        charla.reglas.find((regla) => regla.intencion === Intencion.SALUDO)?.variantes,
      ).toEqual([]);
    });

    it('el relleno es el del servidor', async () => {
      const { charla } = await new ConsultarLasReglasLocalesUseCaseImpl(repositorio).ejecutar();

      expect(charla.relleno).toContain('muchas');
      expect(charla.relleno.length).toBeGreaterThan(10);
    });
  });

  describe('lo demas que el servidor reconoce', () => {
    it('va en su orden, y solo donde buscar ayuda trae mensaje y lineas', async () => {
      const { intenciones } = await new ConsultarLasReglasLocalesUseCaseImpl(
        repositorio,
      ).ejecutar();

      expect(intenciones.map((regla) => regla.intencion)).toEqual(
        REGLAS_DE_INTENCION.map((regla) => regla.intencion),
      );

      const ayuda = intenciones.find((regla) => regla.intencion === Intencion.DONDE_BUSCO_AYUDA);

      expect(ayuda).toMatchObject({
        mensaje: MENSAJES[Intencion.DONDE_BUSCO_AYUDA],
        conLineas: true,
      });

      for (const regla of intenciones.filter((una) => una !== ayuda)) {
        expect(regla.mensaje, regla.intencion).toBeNull();
        expect(regla.conLineas, regla.intencion).toBe(false);
      }
    });
  });

  describe('los paises', () => {
    it('estan todos los que tienen lineas verificadas, con sus zonas', async () => {
      const { paises } = await new ConsultarLasReglasLocalesUseCaseImpl(repositorio).ejecutar();

      expect(Object.keys(paises)).toEqual([...PAISES_CON_LINEAS]);

      for (const pais of PAISES_CON_LINEAS) {
        expect(paises[pais]?.zonas).toEqual(ZONAS_POR_PAIS[pais]);
      }
    });

    it.each(PAISES_CON_LINEAS)('%s trae sus lineas y solo las suyas', async (pais) => {
      const { paises } = await new ConsultarLasReglasLocalesUseCaseImpl(repositorio).ejecutar();
      const esperadas = await repositorio.lineasDeAtencion(pais);

      expect(paises[pais]?.lineas.length).toBeGreaterThan(0);
      expect(new Set(paises[pais]?.lineas.map((linea) => linea.id))).toEqual(
        new Set(esperadas.map((linea) => linea.id)),
      );

      for (const linea of paises[pais]?.lineas ?? []) {
        expect(linea.pais, linea.titulo).toBe(pais);
        expect(linea.esLineaDeAtencion(), linea.titulo).toBe(true);
      }
    });

    it('lo nacional va primero, como en el servidor', async () => {
      const { paises } = await new ConsultarLasReglasLocalesUseCaseImpl(repositorio).ejecutar();

      expect(paises['CO']?.lineas[0]?.cobertura).toBe('nacional');
    });

    it('quien esta en un lugar sin pais recibe el directorio internacional y ningun telefono', async () => {
      const { internacional } = await new ConsultarLasReglasLocalesUseCaseImpl(
        repositorio,
      ).ejecutar();
      const delServidor = await repositorio.lineasDeAtencion(undefined);

      expect(internacional.map((linea) => linea.id)).toEqual(delServidor.map((linea) => linea.id));
      expect(internacional.length).toBeGreaterThan(0);

      for (const linea of internacional) {
        expect(linea.cobertura, linea.titulo).toBe('internacional');
        expect(linea.pais, linea.titulo).toBeUndefined();
      }
    });

    it('un pais sin lineas en la base recibe el directorio, igual que en el servidor', async () => {
      const directorio = contacto(
        '0ffec0de-0000-4000-8000-00000000f1de',
        undefined,
        'internacional',
      );
      const sinLineasDeNadie: RecursoApoyoRepositoryPort = {
        lineasDeAtencion: () => Promise.resolve([directorio]),
        porTema: () => Promise.resolve([]),
      };
      const { paises, internacional } = await new ConsultarLasReglasLocalesUseCaseImpl(
        sinLineasDeNadie,
      ).ejecutar();

      expect(paises['MX']?.lineas.map((linea) => linea.id)).toEqual([directorio.id]);
      expect(internacional.map((linea) => linea.id)).toEqual([directorio.id]);
    });
  });

  describe('un contenido igual es un paquete igual', () => {
    it('dos lecturas seguidas dan exactamente lo mismo', async () => {
      const caso = new ConsultarLasReglasLocalesUseCaseImpl(repositorio);

      expect(JSON.stringify(await caso.ejecutar())).toBe(JSON.stringify(await caso.ejecutar()));
    });

    it('las lineas salen en el orden en que las da el servidor: no se reordena nada', async () => {
      // El orden entre lineas del mismo alcance es una decision editorial (la 192
      // antes que la 123), no un detalle de la base: se conserva tal cual.
      const uno = contacto('00000000-0000-4000-8000-000000000009', 'CO', 'nacional');
      const dos = contacto('00000000-0000-4000-8000-000000000001', 'CO', 'nacional');
      const tres = contacto('00000000-0000-4000-8000-000000000005', 'CO', 'bogota');
      const delServidor: RecursoApoyoRepositoryPort = {
        lineasDeAtencion: () => Promise.resolve([uno, dos, tres]),
        porTema: () => Promise.resolve([]),
      };

      const { paises } = await new ConsultarLasReglasLocalesUseCaseImpl(delServidor).ejecutar();

      expect(paises['CO']?.lineas.map((linea) => linea.id)).toEqual([uno.id, dos.id, tres.id]);
    });
  });
});
