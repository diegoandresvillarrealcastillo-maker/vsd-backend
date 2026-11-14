import { InvalidPhotoError } from './DomainError.js';

/**
 * La foto de perfil (SCRUM-120).
 *
 * Es una imagen pequena que la persona elige en su perfil. El navegador la
 * recorta y la comprime antes de mandarla —unos 256 px y menos de 50 KB—, pero
 * **el servidor no se fia de eso**: cualquiera puede llamar a la API sin pasar
 * por el navegador. Aqui se comprueban otra vez las reglas que importan.
 *
 * La validacion es de **estructura**, no una decodificacion completa: se mira
 * que el contenido empiece como un JPEG o un PNG y coincida con el tipo
 * declarado, y se lee el tamano en pixeles de su cabecera. Eso basta para lo
 * que hace falta: que un HTML o un script no se haga pasar por imagen, y que un
 * archivo de pocos bytes no declare 30 000 x 30 000 pixeles para agotar la
 * memoria de quien lo abra. La foto solo la ve su dueno, como `<img>`.
 */

export const TIPOS_DE_FOTO = ['image/jpeg', 'image/png'] as const;

export type TipoDeFoto = (typeof TIPOS_DE_FOTO)[number];

/** «Menos de 50 KB», como pide el ticket: 50 KB son 51 200 bytes. */
export const PESO_MAXIMO_DE_LA_FOTO = 50 * 1024;

/**
 * El navegador la deja en unos 256 px. Esto solo corta lo desmesurado: una
 * imagen mayor no es una foto de perfil.
 */
export const LADO_MAXIMO_DE_LA_FOTO = 1024;

const FIRMA_PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] as const;

interface Dimensiones {
  readonly ancho: number;
  readonly alto: number;
}

function esTipoDeFoto(tipo: string): tipo is TipoDeFoto {
  return (TIPOS_DE_FOTO as readonly string[]).includes(tipo);
}

function empiezaCon(bytes: Uint8Array, firma: readonly number[]): boolean {
  return firma.every((valor, indice) => bytes[indice] === valor);
}

/** El ancho y el alto de un PNG, que van en el primer bloque (IHDR). */
function dimensionesDelPng(bytes: Uint8Array): Dimensiones | undefined {
  // Firma (8) + largo del bloque (4) + «IHDR» (4) + ancho (4) + alto (4).
  if (bytes.length < 24 || !empiezaCon(bytes, FIRMA_PNG)) {
    return undefined;
  }

  const vista = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const esIhdr = vista.getUint32(12) === 0x49484452;

  return esIhdr ? { ancho: vista.getUint32(16), alto: vista.getUint32(20) } : undefined;
}

/** Los marcadores SOF0 a SOF15 llevan el tamano, salvo tres que significan otra cosa. */
function esMarcadorDeTamano(marcador: number): boolean {
  return marcador >= 0xc0 && marcador <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marcador);
}

/**
 * El ancho y el alto de un JPEG: se recorren sus segmentos hasta el que trae el
 * tamano. Cada uno es `FF`, un marcador y su largo, salvo los que no llevan
 * contenido.
 */
function dimensionesDelJpeg(bytes: Uint8Array): Dimensiones | undefined {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return undefined;
  }

  let posicion = 2;

  while (posicion + 3 < bytes.length) {
    if (bytes[posicion] !== 0xff) {
      return undefined;
    }

    // Los bytes de relleno `FF` pueden repetirse antes del marcador.
    while (bytes[posicion] === 0xff) {
      posicion += 1;
    }

    const marcador = bytes[posicion];
    posicion += 1;

    if (marcador === undefined || marcador === 0xd9 || marcador === 0xda) {
      // Fin de la imagen, o los datos de la imagen, sin haber visto el tamano.
      return undefined;
    }

    // Sin contenido: el inicio (D8), el temporal (01) y los reinicios (D0 a D7).
    if (marcador === 0xd8 || marcador === 0x01 || (marcador >= 0xd0 && marcador <= 0xd7)) {
      continue;
    }

    const largo = ((bytes[posicion] ?? 0) << 8) | (bytes[posicion + 1] ?? 0);

    if (largo < 2) {
      return undefined;
    }

    if (esMarcadorDeTamano(marcador)) {
      // Despues del largo: precision (1), alto (2) y ancho (2).
      if (posicion + 6 >= bytes.length) {
        return undefined;
      }

      const alto = ((bytes[posicion + 3] ?? 0) << 8) | (bytes[posicion + 4] ?? 0);
      const ancho = ((bytes[posicion + 5] ?? 0) << 8) | (bytes[posicion + 6] ?? 0);

      return { ancho, alto };
    }

    posicion += largo;
  }

  return undefined;
}

/** Una foto de perfil que ya paso todas las reglas. */
export class FotoDePerfil {
  private constructor(
    readonly contenido: Uint8Array,
    readonly tipo: TipoDeFoto,
  ) {}

  /**
   * Valida lo que llego y devuelve la foto, o falla diciendo por que.
   *
   * El orden va de lo mas barato a lo mas caro, y el peso se mira antes de
   * abrir nada: un archivo enorme no se recorre.
   *
   * @param tipoDeclarado El `Content-Type` de la peticion. Se acepta con
   *   parametros (`image/png; charset=...`) y en cualquier mayuscula.
   */
  static crear(contenido: Uint8Array, tipoDeclarado: string): FotoDePerfil {
    const tipo = (tipoDeclarado.split(';')[0] ?? '').trim().toLowerCase();

    if (!esTipoDeFoto(tipo)) {
      throw new InvalidPhotoError('tipo');
    }

    if (contenido.length === 0) {
      throw new InvalidPhotoError('imagen');
    }

    if (contenido.length > PESO_MAXIMO_DE_LA_FOTO) {
      throw new InvalidPhotoError('peso');
    }

    // Lo que dice ser y lo que es tienen que coincidir.
    const dimensiones =
      tipo === 'image/png' ? dimensionesDelPng(contenido) : dimensionesDelJpeg(contenido);

    if (dimensiones === undefined || dimensiones.ancho < 1 || dimensiones.alto < 1) {
      throw new InvalidPhotoError('imagen');
    }

    if (dimensiones.ancho > LADO_MAXIMO_DE_LA_FOTO || dimensiones.alto > LADO_MAXIMO_DE_LA_FOTO) {
      throw new InvalidPhotoError('lado');
    }

    return new FotoDePerfil(contenido, tipo);
  }
}
