import { normalizar } from '../domain/model/SenalesDeRiesgo.js';
import type { ReglasLocalesDelAsistente } from '../domain/ports/in/ConsultarLasReglasLocalesUseCase.js';
import {
  contieneAlguno,
  palabrasDe,
  reconocerCharla,
} from '../infrastructure/asistente/Reconocimiento.js';

/**
 * Lo que responde el dispositivo sin conexion (SCRUM-141).
 *
 * Es la **especificacion ejecutable** de lo que tiene que hacer la aplicacion con
 * el paquete que publica `GET /api/asistente/reglas-locales`, escrita solo con
 * lo que hay en el paquete: no mira `PaisDeAyuda.ts`, ni la tabla de recursos, ni
 * ninguna otra cosa del servidor. Si hiciera falta algo mas para reproducir la
 * respuesta del servidor, el paquete esta incompleto, y la prueba de conformidad
 * (`ReglasLocalesYAsistente.spec.ts`) lo dice.
 *
 * Los casos que salen de aqui se publican en `docs/contratos/reglas-locales.json`
 * para que el frontend compruebe su motor contra los mismos casos.
 *
 * El orden es el del servidor y no se negocia:
 *
 * 1. **El riesgo**, primero y aparte, sobre el texto normalizado.
 * 2. **La charla**, solo si el mensaje entero es charla.
 * 3. **Lo demas que se reconoce**, la primera regla que coincide.
 *
 * Y lo que no se puede responder sin conexion **no se inventa**: `exige-conexion`.
 */
export type ResultadoSinConexion =
  | { readonly tipo: 'riesgo'; readonly mensaje: string; readonly lineas: readonly string[] }
  | {
      readonly tipo: 'charla';
      readonly intencion: string;
      readonly mensaje: string;
    }
  | {
      readonly tipo: 'ayuda';
      readonly intencion: string;
      readonly mensaje: string;
      readonly lineas: readonly string[];
    }
  | { readonly tipo: 'exige-conexion' };

export interface ConsultaSinConexion {
  readonly texto: string;
  /** La zona horaria de la cuenta. De ella sale el pais; nunca se pide ubicacion. */
  readonly zona: string;
  /** El nombre de la mascota: para que "hola, Luma" se lea como un saludo. */
  readonly mascota?: string | undefined;
}

/**
 * El nombre de la zona como lo escribe IANA, igual que hace el servidor al deducir el
 * pais (`Calendario.canonica`): `america/bogota` y `US/Eastern` son `America/Bogota` y
 * `America/New_York`. Una zona que no se conoce se queda como esta y no tiene pais.
 */
function canonica(zona: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', { timeZone: zona }).resolvedOptions().timeZone;
  } catch {
    return zona;
  }
}

/** Las lineas del pais de la zona, o el directorio si la zona no es de ningun pais. */
function lineasDeLaZona(reglas: ReglasLocalesDelAsistente, zona: string): readonly string[] {
  const buscada = canonica(zona);
  const pais = Object.values(reglas.paises).find((una) => una.zonas.includes(buscada));
  const lineas = pais?.lineas ?? reglas.internacional;

  return lineas.map((linea) => linea.id);
}

export function responderSinConexion(
  reglas: ReglasLocalesDelAsistente,
  consulta: ConsultaSinConexion,
): ResultadoSinConexion {
  const limpio = normalizar(consulta.texto);

  if (reglas.riesgo.expresiones.some((expresion) => limpio.includes(expresion))) {
    return {
      tipo: 'riesgo',
      mensaje: reglas.riesgo.mensaje,
      lineas: lineasDeLaZona(reglas, consulta.zona),
    };
  }

  const palabras = palabrasDe(consulta.texto);
  const relleno = new Set([...reglas.charla.relleno, ...palabrasDe(consulta.mascota ?? '')]);
  const charla = reconocerCharla(palabras, reglas.charla.reglas, relleno);

  if (charla !== undefined) {
    if (charla.mensaje === null) {
      return { tipo: 'exige-conexion' };
    }

    const variante = charla.variantes.find((una) => contieneAlguno(palabras, una.patrones));

    return {
      tipo: 'charla',
      intencion: charla.intencion,
      mensaje: variante?.mensaje ?? charla.mensaje,
    };
  }

  const regla = reglas.intenciones.find((una) => contieneAlguno(palabras, una.patrones));

  if (regla?.mensaje == null) {
    return { tipo: 'exige-conexion' };
  }

  return {
    tipo: 'ayuda',
    intencion: regla.intencion,
    mensaje: regla.mensaje,
    lineas: regla.conLineas ? lineasDeLaZona(reglas, consulta.zona) : [],
  };
}
