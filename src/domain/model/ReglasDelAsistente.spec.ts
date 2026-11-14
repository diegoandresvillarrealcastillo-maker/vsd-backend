import { describe, expect, it } from 'vitest';
import { Intencion } from '../ports/in/AsistentePort.js';
import {
  MENSAJES,
  MENSAJE_DE_RIESGO,
  REGLAS_DE_CHARLA,
  REGLAS_DE_INTENCION,
  RELLENO_DE_LA_CHARLA,
} from './ReglasDelAsistente.js';
import { normalizar } from './SenalesDeRiesgo.js';

const TODOS_LOS_PATRONES = [
  ...REGLAS_DE_INTENCION.flatMap((regla) => regla.patrones),
  ...REGLAS_DE_CHARLA.flatMap((regla) => [
    ...regla.patrones,
    ...(regla.variantes ?? []).flatMap((variante) => variante.patrones),
  ]),
];

/** Los mensajes que se dicen sin conexion, de toda la charla y de las intenciones. */
function mensajesSinConexion(): string[] {
  return [
    ...REGLAS_DE_CHARLA.filter((regla) => regla.sinConexion).flatMap((regla) => [
      regla.mensajeSinConexion ?? MENSAJES[regla.intencion],
      ...(regla.variantes ?? []).map((variante) => variante.mensaje),
    ]),
    ...REGLAS_DE_INTENCION.filter((regla) => regla.sinConexion).map(
      (regla) => MENSAJES[regla.intencion],
    ),
    MENSAJE_DE_RIESGO,
  ];
}

describe('ReglasDelAsistente: lo que se responde sin conexion', () => {
  it('es lo que decidio el equipo: un saludo, un agradecimiento, una despedida y donde buscar ayuda', () => {
    // SCRUM-141. Si esta lista cambia, que cambie a proposito: cada intencion que
    // se agrega aqui es algo que el dispositivo responde sin poder consultar nada.
    const deLaCharla = REGLAS_DE_CHARLA.filter((regla) => regla.sinConexion).map(
      (regla) => regla.intencion,
    );
    const deLasDemas = REGLAS_DE_INTENCION.filter((regla) => regla.sinConexion).map(
      (regla) => regla.intencion,
    );

    expect([...deLaCharla].sort()).toEqual(
      [Intencion.SALUDO, Intencion.AGRADECIMIENTO, Intencion.DESPEDIDA].sort(),
    );
    expect(deLasDemas).toEqual([Intencion.DONDE_BUSCO_AYUDA]);
  });

  it('lo que exige conexion es lo que necesita al servidor: el historial, una lectura o a quien pregunta', () => {
    const exigen = [
      ...REGLAS_DE_CHARLA.filter((regla) => !regla.sinConexion),
      ...REGLAS_DE_INTENCION.filter((regla) => !regla.sinConexion),
    ].map((regla) => regla.intencion);

    expect(exigen.sort()).toEqual(
      [
        Intencion.COMO_ESTAS,
        Intencion.QUE_PUEDES_HACER,
        Intencion.COMO_DUERMO_MEJOR,
        Intencion.QUE_SIGNIFICA_MI_RESULTADO,
        Intencion.ME_SIENTO_MAL,
      ].sort(),
    );
  });

  it('el saludo sin conexion no promete lo que sin conexion no se puede responder', () => {
    const saludo = REGLAS_DE_CHARLA.find((regla) => regla.intencion === Intencion.SALUDO);
    const sinConexion = saludo?.mensajeSinConexion ?? '';

    // Con conexion invita a preguntar por el descanso o por un resultado.
    expect(MENSAJES[Intencion.SALUDO]).toMatch(/descanso/iu);
    expect(sinConexion).not.toMatch(/descanso|resultado/iu);
    expect(sinConexion).toMatch(/sin conexión/iu);
    expect(sinConexion).toMatch(/conexión/iu);
  });

  it('solo un saludo dice algo distinto sin conexion, y solo si se responde sin conexion', () => {
    for (const regla of REGLAS_DE_CHARLA) {
      if (regla.mensajeSinConexion !== undefined) {
        expect(regla.sinConexion, regla.intencion).toBe(true);
      }
    }

    expect(
      REGLAS_DE_CHARLA.filter((regla) => regla.mensajeSinConexion !== undefined).map(
        (regla) => regla.intencion,
      ),
    ).toEqual([Intencion.SALUDO]);
  });

  it('ningun texto que se dice sin conexion usa terminologia diagnostica', () => {
    const prohibidas = /depresion|ansiedad|trastorno|patolog|diagnost|enferm|sindrome/iu;

    for (const mensaje of mensajesSinConexion()) {
      expect(mensaje).not.toMatch(prohibidas);
    }
  });

  it('ningun texto que se dice sin conexion pregunta algo: no habria quien lo contestara', () => {
    for (const mensaje of mensajesSinConexion()) {
      expect(mensaje).not.toContain('?');
    }
  });
});

describe('ReglasDelAsistente: como estan escritas', () => {
  it('cada patron esta escrito como se compara: sin tildes, en minusculas y sin espacios de mas', () => {
    for (const patron of TODOS_LOS_PATRONES) {
      const raiz = patron.replace(/\*$/u, '');

      expect(normalizar(raiz), patron).toBe(raiz);
      expect(patron, patron).toMatch(/^[a-z0-9]+( [a-z0-9]+)*\*?$/u);
    }
  });

  it('el relleno de la charla tambien', () => {
    for (const palabra of RELLENO_DE_LA_CHARLA) {
      expect(palabra).toMatch(/^[a-z0-9]+$/u);
    }
  });

  it('ninguna intencion aparece dos veces entre las reglas de su lista', () => {
    const deIntencion = REGLAS_DE_INTENCION.map((regla) => regla.intencion);
    const deCharla = REGLAS_DE_CHARLA.map((regla) => regla.intencion);

    expect(new Set(deIntencion).size).toBe(deIntencion.length);
    expect(new Set(deCharla).size).toBe(deCharla.length);
  });

  it('cada variante se puede alcanzar: sus patrones son de la regla que la lleva', () => {
    // Una variante cuyo patron no activa la regla nunca se diria.
    for (const regla of REGLAS_DE_CHARLA) {
      for (const variante of regla.variantes ?? []) {
        for (const patron of variante.patrones) {
          expect(regla.patrones, `${regla.intencion}: ${patron}`).toContain(patron);
        }
      }
    }
  });

  it('hay un mensaje para cada intencion', () => {
    for (const intencion of Object.values(Intencion)) {
      expect(MENSAJES[intencion], intencion).toBeTruthy();
    }
  });

  it('el mensaje de riesgo no pregunta, no matiza y manda a las lineas', () => {
    expect(MENSAJE_DE_RIESGO).not.toContain('?');
    expect(MENSAJE_DE_RIESGO).toMatch(/líneas/iu);
  });
});
