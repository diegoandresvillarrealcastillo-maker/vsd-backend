import { describe, expect, it } from 'vitest';
import { InvalidSessionConfigurationError } from './DomainError.js';
import { ActivityId, SesionId } from './Identifier.js';
import { Motor } from './Motor.js';
import {
  REVISIONES,
  Revision,
  SesionDeActividad,
  type DatosDeSesion,
} from './SesionDeActividad.js';

const SESION = new SesionId('55555555-5555-4555-a555-555555555555');
const ACTIVIDAD = new ActivityId('33333333-3333-4333-a333-333333333333');
const REVISADA_EL = new Date('2026-10-20T15:00:00.000Z');

/** Una sesion que no pide revision, en borrador: la forma mas simple de crear una. */
function datos(cambios: Partial<DatosDeSesion> = {}): DatosDeSesion {
  return {
    id: SESION,
    idActividad: ACTIVIDAD,
    titulo: 'Cuatro colores',
    nivel: 1,
    parametros: { largo: 4 },
    publicado: false,
    revision: Revision.NO_REQUIERE,
    ...cambios,
  };
}

describe('SesionDeActividad: lo que es', () => {
  it('se crea con lo que dice la ficha y deja lo demas sin constancia', () => {
    const sesion = SesionDeActividad.create(datos());

    expect(sesion.id).toBe(SESION);
    expect(sesion.idActividad).toBe(ACTIVIDAD);
    expect(sesion.titulo).toBe('Cuatro colores');
    expect(sesion.nivel).toBe(1);
    expect(sesion.parametros).toEqual({ largo: 4 });
    expect(sesion.publicado).toBe(false);
    expect(sesion.revision).toBe('no_requiere');
    expect(sesion.revisadaPor).toBeUndefined();
    expect(sesion.revisadaEl).toBeUndefined();
  });

  it('quita los espacios sobrantes del titulo', () => {
    expect(SesionDeActividad.create(datos({ titulo: '  Cuatro colores  ' })).titulo).toBe(
      'Cuatro colores',
    );
  });

  it('las tres revisiones son las que la base conoce', () => {
    expect(REVISIONES).toEqual(['no_requiere', 'pendiente', 'revisada']);
  });

  it.each([1, 2, 3])('acepta el nivel %i', (nivel) => {
    expect(SesionDeActividad.create(datos({ nivel })).nivel).toBe(nivel);
  });

  it.each([0, 4, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])('rechaza el nivel %s', (nivel) => {
    expect(() => SesionDeActividad.create(datos({ nivel }))).toThrow(
      InvalidSessionConfigurationError,
    );
  });

  it.each([
    ['vacio', ''],
    ['solo espacios', '   '],
    ['de mas de 100 caracteres', 'a'.repeat(101)],
  ])('rechaza un titulo %s', (_caso, titulo) => {
    expect(() => SesionDeActividad.create(datos({ titulo }))).toThrow(
      InvalidSessionConfigurationError,
    );
  });

  it('acepta un titulo de exactamente 100 caracteres', () => {
    expect(SesionDeActividad.create(datos({ titulo: 'a'.repeat(100) })).titulo).toHaveLength(100);
  });

  it('el mensaje dice cual sesion es y por que', () => {
    expect(() => SesionDeActividad.create(datos({ nivel: 9 }))).toThrow(
      /La sesión "Cuatro colores" .*nivel/,
    );
  });
});

describe('SesionDeActividad: los parametros son JSON de verdad', () => {
  it('acepta anidados: listas, objetos, textos, numeros, booleanos y nulos', () => {
    const parametros = {
      pasos: [
        { texto: 'Inhala', segundos: 4 },
        { texto: 'Exhala', segundos: 6 },
      ],
      conSonido: false,
      nota: null,
    };

    expect(SesionDeActividad.create(datos({ parametros })).parametros).toEqual(parametros);
  });

  it('acepta un objeto vacio (una mecanica que no necesita ajustes)', () => {
    expect(SesionDeActividad.create(datos({ parametros: {} })).parametros).toEqual({});
  });

  it.each([
    ['una lista', []],
    ['un texto', 'largo: 4'],
    ['un numero', 4],
    ['nulo', null],
    ['indefinido', undefined],
  ])('rechaza %s en lugar de un objeto', (_caso, parametros) => {
    expect(() =>
      SesionDeActividad.create(
        datos({ parametros: parametros as unknown as Record<string, unknown> }),
      ),
    ).toThrow(InvalidSessionConfigurationError);
  });

  it.each([
    ['indefinido', { largo: undefined }],
    ['una funcion', { largo: () => 4 }],
    ['NaN', { largo: Number.NaN }],
    ['infinito', { largo: Number.POSITIVE_INFINITY }],
    ['una fecha', { cuando: new Date() }],
    ['un simbolo', { s: Symbol('x') }],
    ['un bigint', { n: 4n }],
    ['uno anidado en una lista', { pasos: [{ texto: undefined }] }],
  ])('rechaza %s dentro de los parametros', (_caso, parametros) => {
    // Lo que no sobrevive a JSON.stringify llegaria a la base cambiado o perdido en silencio.
    expect(() => SesionDeActividad.create(datos({ parametros }))).toThrow(
      InvalidSessionConfigurationError,
    );
  });

  it('rechaza una referencia circular en lugar de colgarse', () => {
    const circular: Record<string, unknown> = {};
    circular['yo'] = circular;

    expect(() => SesionDeActividad.create(datos({ parametros: circular }))).toThrow(
      InvalidSessionConfigurationError,
    );
  });

  it('una clave "__proto__" es un dato mas: no cambia el prototipo de la copia', () => {
    // JSON.parse la crea como propiedad propia, y asignarla con `copia[clave] = ...` cambiaria el
    // prototipo en lugar de guardarla.
    const parametros = JSON.parse('{"__proto__":{"largo":9},"nivel":1}') as Record<string, unknown>;

    const copia = SesionDeActividad.create(datos({ parametros })).parametros;

    expect(Object.getPrototypeOf(copia)).toBe(Object.prototype);
    expect(Object.keys(copia)).toEqual(['__proto__', 'nivel']);
    expect(JSON.stringify(copia)).toBe('{"__proto__":{"largo":9},"nivel":1}');
  });

  it('guarda una copia: cambiar el original despues no cambia la sesion', () => {
    const parametros: Record<string, unknown> = { largo: 4 };
    const sesion = SesionDeActividad.create(datos({ parametros }));

    parametros['largo'] = 99;

    expect(sesion.parametros).toEqual({ largo: 4 });
  });
});

describe('SesionDeActividad: lo que no esta revisado no se publica', () => {
  // Es la regla de Samuel (15/10/2026) convertida en garantia: el dominio la comprueba al cargar y
  // la base la impone con un CHECK. Aqui se prueba la mitad del dominio.

  it('no deja publicar una sesion con revision pendiente', () => {
    expect(() =>
      SesionDeActividad.create(datos({ publicado: true, revision: Revision.PENDIENTE })),
    ).toThrow(/no se puede publicar/);
  });

  it('una sesion pendiente sin publicar es un borrador valido', () => {
    const sesion = SesionDeActividad.create(
      datos({ publicado: false, revision: Revision.PENDIENTE }),
    );

    expect(sesion.publicado).toBe(false);
    expect(sesion.revision).toBe('pendiente');
  });

  it('deja publicar una sesion que no requiere revision', () => {
    expect(
      SesionDeActividad.create(datos({ publicado: true, revision: Revision.NO_REQUIERE }))
        .publicado,
    ).toBe(true);
  });

  it('deja publicar una sesion revisada, con quien y cuando', () => {
    const sesion = SesionDeActividad.create(
      datos({
        publicado: true,
        revision: Revision.REVISADA,
        revisadaPor: 'Psicología',
        revisadaEl: REVISADA_EL,
      }),
    );

    expect(sesion.publicado).toBe(true);
    expect(sesion.revisadaPor).toBe('Psicología');
    expect(sesion.revisadaEl).toEqual(REVISADA_EL);
  });

  it('rechaza una revision que no existe', () => {
    expect(() =>
      SesionDeActividad.create(datos({ revision: 'aprobada' as unknown as Revision })),
    ).toThrow(InvalidSessionConfigurationError);
  });
});

describe('SesionDeActividad: la constancia de la revision', () => {
  it('una sesion revisada tiene que decir quien la reviso', () => {
    expect(() =>
      SesionDeActividad.create(datos({ revision: Revision.REVISADA, revisadaEl: REVISADA_EL })),
    ).toThrow(/quién/);
  });

  it('una sesion revisada tiene que decir cuando', () => {
    expect(() =>
      SesionDeActividad.create(datos({ revision: Revision.REVISADA, revisadaPor: 'Psicología' })),
    ).toThrow(/cuándo/);
  });

  it.each([Revision.NO_REQUIERE, Revision.PENDIENTE])(
    'una sesion %s no puede traer constancia de una revision que no hubo',
    (revision) => {
      expect(() =>
        SesionDeActividad.create(
          datos({ revision, revisadaPor: 'Psicología', revisadaEl: REVISADA_EL }),
        ),
      ).toThrow(InvalidSessionConfigurationError);
    },
  );

  it.each([
    ['vacio', ''],
    ['solo espacios', '   '],
    ['de mas de 100 caracteres', 'a'.repeat(101)],
  ])('rechaza un nombre del revisor %s', (_caso, revisadaPor) => {
    expect(() =>
      SesionDeActividad.create(
        datos({ revision: Revision.REVISADA, revisadaPor, revisadaEl: REVISADA_EL }),
      ),
    ).toThrow(InvalidSessionConfigurationError);
  });

  it.each([
    ['un correo', 'revisora@ejemplo.com'],
    ['un telefono', 'Llamar al 3001234567'],
  ])('no guarda datos de contacto: rechaza %s', (_caso, revisadaPor) => {
    // ADR 0030: «constancia de quién y cuándo (rol o nombre; sin datos de contacto)».
    expect(() =>
      SesionDeActividad.create(
        datos({ revision: Revision.REVISADA, revisadaPor, revisadaEl: REVISADA_EL }),
      ),
    ).toThrow(/contacto/);
  });

  it('acepta un rol o un nombre, con tildes y espacios', () => {
    const sesion = SesionDeActividad.create(
      datos({
        revision: Revision.REVISADA,
        revisadaPor: '  Ana María Pérez, psicología  ',
        revisadaEl: REVISADA_EL,
      }),
    );

    expect(sesion.revisadaPor).toBe('Ana María Pérez, psicología');
  });

  it('rechaza una fecha de revision invalida', () => {
    expect(() =>
      SesionDeActividad.create(
        datos({
          revision: Revision.REVISADA,
          revisadaPor: 'Psicología',
          revisadaEl: new Date('no es una fecha'),
        }),
      ),
    ).toThrow(InvalidSessionConfigurationError);
  });
});

describe('SesionDeActividad: los parametros cumplen el contrato del motor', () => {
  const casillas = [
    { clave: 'circulo', nombre: 'círculo verde', forma: 'círculo', color: 'verde' },
    { clave: 'cuadrado', nombre: 'cuadrado azul', forma: 'cuadrado', color: 'azul' },
  ];
  const secuencia = {
    casillas,
    largoInicial: 3,
    rondas: 12,
    msPorElemento: 700,
    msDeMargen: 1000,
    msDestello: 700,
  };

  it('acepta parametros que cumplen el contrato de su motor', () => {
    const sesion = SesionDeActividad.create(
      datos({ motor: Motor.SECUENCIA, parametros: secuencia }),
    );

    expect(sesion.parametros).toEqual(secuencia);
  });

  it('rechaza parametros que no lo cumplen y dice el motor y el campo', () => {
    const intento = () =>
      SesionDeActividad.create(
        datos({ motor: Motor.SECUENCIA, parametros: { ...secuencia, msDestello: 300 } }),
      );

    expect(intento).toThrow(InvalidSessionConfigurationError);
    expect(intento).toThrow(
      'La sesión "Cuatro colores" trae parámetros que no cumplen el contrato del motor ' +
        '"secuencia": msDestello debe ser un número entero de 600 a 5000.',
    );
  });

  it('una actividad sin motor acepta cualquier objeto', () => {
    expect(
      SesionDeActividad.create(datos({ motor: null, parametros: { largo: 4 } })).parametros,
    ).toEqual({ largo: 4 });
    expect(SesionDeActividad.create(datos({ parametros: { largo: 4 } })).parametros).toEqual({
      largo: 4,
    });
  });

  it('un motor sin contrato todavia acepta cualquier objeto', () => {
    expect(
      SesionDeActividad.create(datos({ motor: Motor.CLASIFICAR, parametros: { loQueSea: [1] } }))
        .parametros,
    ).toEqual({ loQueSea: [1] });
  });

  it('lo que no es JSON se rechaza antes de mirar el contrato', () => {
    expect(() =>
      SesionDeActividad.create(
        datos({ motor: Motor.SECUENCIA, parametros: { ...secuencia, rondas: Number.NaN } }),
      ),
    ).toThrow(/no son un objeto JSON válido/);
  });
});
