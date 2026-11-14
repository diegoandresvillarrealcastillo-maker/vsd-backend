/**
 * Fotos de prueba (SCRUM-120).
 *
 * Dos archivos **reales**, de 8 x 6 pixeles, para comprobar que lo que se lee
 * de una cabecera de verdad coincide con lo que se esperaba; y dos funciones que
 * arman cabeceras a medida para los casos que un archivo real no da: un tamano
 * desmesurado en pocos bytes, un marcador raro, un archivo cortado.
 */

/** Un JPEG de verdad (lo escribio Pillow): 8 x 6, de 632 bytes. */
export const JPEG_REAL_DE_8_X_6 = new Uint8Array(
  Buffer.from(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAGAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCWiiivLPVP/9k=',
    'base64',
  ),
);

/** Un PNG de verdad (lo escribio Pillow): 8 x 6, de 78 bytes. */
export const PNG_REAL_DE_8_X_6 = new Uint8Array(
  Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAIAAABxZ0isAAAAFUlEQVR42mM8UWHDgA0wMeAA9JAAAOBWAYhnDE3RAAAAAElFTkSuQmCC',
    'base64',
  ),
);

function enBytes(numero: number, cuantos: 2 | 4): number[] {
  return cuantos === 2
    ? [(numero >> 8) & 0xff, numero & 0xff]
    : [(numero >>> 24) & 0xff, (numero >>> 16) & 0xff, (numero >>> 8) & 0xff, numero & 0xff];
}

/**
 * La cabecera de un PNG con el tamano que se pida, mas `relleno` bytes al
 * final. No se puede decodificar: solo tiene lo que mira la validacion.
 */
export function unPng(ancho: number, alto: number, relleno = 0): Uint8Array {
  return Uint8Array.from([
    ...[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    ...enBytes(13, 4),
    ...[0x49, 0x48, 0x44, 0x52],
    ...enBytes(ancho, 4),
    ...enBytes(alto, 4),
    ...[8, 2, 0, 0, 0],
    ...enBytes(0, 4),
    ...enBytes(0, 4),
    ...[0x49, 0x45, 0x4e, 0x44],
    ...enBytes(0, 4),
    ...new Array<number>(relleno).fill(0),
  ]);
}

/**
 * La cabecera de un JPEG con el tamano que se pida, mas `relleno` bytes antes
 * del cierre. Antes del marcador de tamano lleva un segmento de tablas (`FF
 * C4`), que se parece a un marcador de tamano y no lo es.
 */
export function unJpeg(ancho: number, alto: number, relleno = 0): Uint8Array {
  return Uint8Array.from([
    ...[0xff, 0xd8],
    // APP0 (JFIF), 16 bytes de largo.
    ...[0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00],
    ...[0x01, 0x00, 0x00],
    // DHT: tablas, no un tamano.
    ...[0xff, 0xc4, 0x00, 0x04, 0x00, 0x00],
    // SOF0: largo 17, precision 8, alto, ancho y tres componentes.
    ...[0xff, 0xc0, 0x00, 0x11, 0x08],
    ...enBytes(alto, 2),
    ...enBytes(ancho, 2),
    ...[0x03, 0x01, 0x22, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01],
    // SOS y los datos.
    ...[0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00],
    ...new Array<number>(relleno).fill(0x11),
    ...[0xff, 0xd9],
  ]);
}
