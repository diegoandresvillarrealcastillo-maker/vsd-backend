import { describe, expect, it } from 'vitest';

import { Activity, DireccionEscala } from '../../../domain/model/Activity.js';
import { Categoria } from '../../../domain/model/Categoria.js';
import { ActivityId, CategoryId } from '../../../domain/model/Identifier.js';
import { ActividadDelCatalogoDto, CategoriaDelCatalogoDto } from './CatalogoRespuestaDto.js';

/**
 * Lo que el catalogo dice de cada actividad.
 *
 * El nucleo de este archivo es una sola idea, y esta aqui porque durante un
 * tiempo la documentacion decia lo contrario: **que una actividad produzca
 * nivel lo decide su escala, no su tipo**.
 *
 * Son dos columnas independientes. `tipo` dice como se hace la actividad
 * —juego, preguntas, bitacora— y la escala dice si se valora. El contraejemplo
 * estaba sembrado desde el principio: de las tres bitacoras del catalogo, dos
 * registran sin valorar y "Como dormiste anoche" si se valora.
 */
function actividad(datos: {
  nombre: string;
  tipo?: string;
  direccionEscala: (typeof DireccionEscala)[keyof typeof DireccionEscala];
  puntajeMaximo?: number;
}): Activity {
  return Activity.create({
    id: new ActivityId(crypto.randomUUID()),
    nombre: datos.nombre,
    direccionEscala: datos.direccionEscala,
    ...(datos.tipo === undefined ? {} : { tipo: datos.tipo }),
    ...(datos.puntajeMaximo === undefined ? {} : { puntajeMaximo: datos.puntajeMaximo }),
    ...(datos.direccionEscala === DireccionEscala.SIN_PUNTAJE
      ? {}
      : {
          textosNivel: {
            favorable: 'Bien',
            en_seguimiento: 'Regular',
            requiere_atencion: 'Costo mas',
          },
        }),
  });
}

describe('ActividadDelCatalogoDto', () => {
  it('una bitacora que se valora produce nivel', () => {
    // Es la prueba que impide volver a atar las dos columnas. Si alguien hace
    // que `produceNivel` dependa del tipo, esto falla.
    const dto = ActividadDelCatalogoDto.desde(
      actividad({
        nombre: 'Como dormiste anoche',
        tipo: 'bitacora',
        direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
        puntajeMaximo: 10,
      }),
    );

    expect(dto.tipo).toBe('bitacora');
    expect(dto.produceNivel).toBe(true);
  });

  it('una bitacora que solo registra no produce nivel', () => {
    const dto = ActividadDelCatalogoDto.desde(
      actividad({
        nombre: 'Movimiento del dia',
        tipo: 'bitacora',
        direccionEscala: DireccionEscala.SIN_PUNTAJE,
      }),
    );

    // Mismo tipo que la anterior, resultado distinto. Ahi esta la
    // independencia entre las dos columnas.
    expect(dto.tipo).toBe('bitacora');
    expect(dto.produceNivel).toBe(false);
  });

  it('no publica el maximo ni los cortes de nivel', () => {
    const dto = ActividadDelCatalogoDto.desde(
      actividad({
        nombre: 'Parejas de cartas',
        tipo: 'juego',
        direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
        puntajeMaximo: 20,
      }),
    );

    // Se comprueba sobre el JSON y no sobre el objeto: los campos declarados de
    // una clase existen como propiedad aunque valgan `undefined`, asi que
    // preguntarselo al objeto no dice lo que de verdad viaja. Lo que viaja es
    // esto, porque `JSON.stringify` descarta lo indefinido.
    const viaja = Object.keys(JSON.parse(JSON.stringify(dto)) as object);

    // El catalogo sirve para elegir, no para interpretar. Con el maximo y los
    // cortes el cliente podria calcular el nivel por su cuenta, y entonces
    // habria dos interpretaciones del mismo dato que pueden no coincidir.
    expect(viaja).not.toContain('puntajeMaximo');
    expect(viaja).not.toContain('umbrales');
    expect(viaja).not.toContain('textosNivel');

    // Y lo que si tiene que llegar.
    expect(viaja).toContain('produceNivel');
  });

  it('omite el tipo y la descripcion cuando la actividad no los trae', () => {
    const dto = ActividadDelCatalogoDto.desde(
      actividad({ nombre: 'Sin adornos', direccionEscala: DireccionEscala.SIN_PUNTAJE }),
    );

    // Se omiten en lugar de viajar como null: un campo ausente y un campo nulo
    // significan lo mismo aqui, y tener las dos formas obliga a comprobar dos
    // cosas en cada cliente.
    const viaja = Object.keys(JSON.parse(JSON.stringify(dto)) as object);

    expect(viaja).not.toContain('tipo');
    expect(viaja).not.toContain('descripcion');
    expect(viaja).toEqual(expect.arrayContaining(['id', 'nombre', 'produceNivel']));
  });
});

describe('CategoriaDelCatalogoDto', () => {
  it('lleva sus actividades dentro, en el orden que le llegan', () => {
    const dto = CategoriaDelCatalogoDto.desde(
      Categoria.create({
        id: new CategoryId(crypto.randomUUID()),
        nombre: 'Cognición',
        actividades: [
          actividad({ nombre: 'Primera', direccionEscala: DireccionEscala.SIN_PUNTAJE }),
          actividad({ nombre: 'Segunda', direccionEscala: DireccionEscala.SIN_PUNTAJE }),
        ],
      }),
    );

    expect(dto.nombre).toBe('Cognición');
    expect(dto.actividades.map((una) => una.nombre)).toEqual(['Primera', 'Segunda']);
  });
});
