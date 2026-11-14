import { idDeMecanica, idDeSesion } from './ids.ts';
import type {
  Categoria,
  FranjaDeContenido,
  MecanicaDeContenido,
  Parametros,
  SesionDeContenido,
} from './tipos.ts';

/**
 * Lo que comparten las mecanicas de Bienestar y Emociones (SCRUM-223 y SCRUM-224): ninguna puntua, y todas
 * piden revision (profesional o ligera), asi que **entran `pendiente` y sin publicar**. La base impide
 * publicarlas asi; se publican con una migracion que genera `piloto/preparar-publicacion` cuando una persona
 * con formacion las revisa y queda dicho quien y cuando.
 *
 * Los textos son BORRADORES para quien revise. Que esten en la base no los aprueba.
 */

export interface FichaSinPuntaje {
  readonly codigo: string;
  readonly categoria: Categoria;
  readonly nombre: string;
  readonly descripcion: string;
  readonly motor: string;
  readonly sesiones: readonly SesionDeContenido[];
  readonly franja?: FranjaDeContenido;
  /** Si la mecanica ya esta sembrada (las del piloto): solo se agregan sesiones. */
  readonly yaExiste?: boolean;
  /** El identificador de una mecanica que ya existe; las nuevas lo toman de su codigo. */
  readonly id?: string;
}

export function mecanicaSinPuntaje(ficha: FichaSinPuntaje): MecanicaDeContenido {
  return {
    codigo: ficha.codigo,
    id: ficha.id ?? idDeMecanica(ficha.codigo),
    categoria: ficha.categoria,
    nombre: ficha.nombre,
    tipo: 'bitacora',
    descripcion: ficha.descripcion,
    motor: ficha.motor,
    direccion: 'sin_puntaje',
    maximo: null,
    umbrales: null,
    textosNivel: null,
    ...(ficha.franja === undefined ? {} : { franja: ficha.franja }),
    revision: 'pendiente',
    publicar: false,
    sesiones: ficha.sesiones,
    ...(ficha.yaExiste === true ? { yaExiste: true } : {}),
  };
}

/** La sesion numero `posicion` (de 1 a 40) de una mecanica. */
export function sesion(
  codigo: string,
  posicion: number,
  titulo: string,
  parametros: Parametros,
  nivel: 1 | 2 | 3 = 1,
): SesionDeContenido {
  return { id: idDeSesion(codigo, posicion), titulo: titulo.slice(0, 100), nivel, parametros };
}

/** Las tres respuestas de una tarjeta, que **cuentan igual**: ninguna es la buena. */
export function opcionesDeTarjeta(
  cuando: readonly [clave: string, texto: string],
  yaLoHace: readonly [clave: string, texto: string],
  hoyNo: readonly [clave: string, texto: string],
): { clave: string; texto: string }[] {
  return [cuando, yaLoHace, hoyNo].map(([clave, texto]) => ({ clave, texto }));
}

/**
 * Una tarjeta del dia (motor `cuestionario_corto`, modo `tarjeta`): una practica con su frase de por que, y
 * tres respuestas que cuentan igual.
 */
export function tarjeta(datos: {
  readonly titulo: string;
  readonly texto: string;
  readonly porQue?: string;
  readonly opciones: readonly { clave: string; texto: string }[];
  readonly indicacion?: string;
  readonly nota?: string;
  readonly cierre?: string;
}): Parametros {
  return {
    modo: 'tarjeta',
    ...(datos.indicacion === undefined ? {} : { indicacion: datos.indicacion }),
    titulo: datos.titulo,
    texto: datos.texto,
    ...(datos.porQue === undefined ? {} : { porQue: datos.porQue }),
    opciones: datos.opciones,
    ...(datos.nota === undefined ? {} : { nota: datos.nota }),
    ...(datos.cierre === undefined ? {} : { cierre: datos.cierre }),
  };
}

/** `n` elementos de una lista, empezando en `desde` y dando la vuelta: sin repetir mientras `n` <= largo. */
export function ventana<T>(elementos: readonly T[], desde: number, n: number, salto = 1): T[] {
  return Array.from(
    { length: n },
    (_, k) =>
      elementos[
        (((desde + k * salto) % elementos.length) + elementos.length) % elementos.length
      ] as T,
  );
}
