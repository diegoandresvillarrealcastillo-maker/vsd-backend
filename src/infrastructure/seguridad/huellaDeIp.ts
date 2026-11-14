import { createHmac } from 'node:crypto';

/**
 * La IP escrita igual aunque llegue de dos maneras: `::ffff:203.0.113.9` es la
 * misma conexion que `203.0.113.9`.
 */
export function normalizarIp(ip: string): string {
  return ip
    .trim()
    .toLowerCase()
    .replace(/^::ffff:(?=\d+\.\d+\.\d+\.\d+$)/, '');
}

/**
 * Convierte una IP en una huella que sirve para **comparar** y no para **leer**.
 *
 * Una IP es un dato personal. Aun asi, en un incidente hace falta saber si dos
 * eventos vienen del mismo sitio, y una huella lo permite sin escribir la
 * direccion. Un SHA-256 simple no basta: el espacio de IPv4 son cuatro mil
 * millones de valores y se recorre entero en minutos. Por eso es un HMAC con una
 * clave que no sale del servidor: sin la clave, la huella no se puede revertir
 * probando direcciones.
 *
 * Son 64 bits (16 caracteres hexadecimales): sobran para distinguir origenes en
 * un registro de 90 dias y no pretenden ser un identificador unico.
 */
export function crearHuellaDeIp(clave: string | Buffer): (ip: string) => string {
  return (ip) => createHmac('sha256', clave).update(normalizarIp(ip)).digest('hex').slice(0, 16);
}
