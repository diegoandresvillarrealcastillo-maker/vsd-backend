import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { bytesDelCuerpo, RespuestasDeSubirUnArchivo } from './subirUnArchivoPersonal.js';

/**
 * Lo que comparten los controladores de la foto de perfil y de la mascota propia al subir un
 * archivo. Cada uno prueba su ruta; aqui, solo las dos piezas que usan los dos.
 */
const CLAVE_DE_LAS_RESPUESTAS = 'swagger/apiResponse';

class Ejemplo {
  subir(): void {}
}

/** Las respuestas que el decorador deja en el metodo, como las lee el documento OpenAPI. */
function respuestasDelMetodo(): Record<string, { description: string }> {
  const descriptor = Object.getOwnPropertyDescriptor(Ejemplo.prototype, 'subir');

  // Los decoradores de los controladores se escriben con `@`; aqui se aplica a mano porque este
  // archivo de pruebas no pasa por la configuracion de decoradores del proyecto.
  RespuestasDeSubirUnArchivo({
    invalido: 'No es lo que dice ser.',
    pesado: 'Pesa demasiado.',
    tipo: 'Solo se admite otro tipo.',
  })(Ejemplo.prototype, 'subir', descriptor as TypedPropertyDescriptor<() => void>);

  return Reflect.getMetadata(CLAVE_DE_LAS_RESPUESTAS, descriptor?.value as object) as Record<
    string,
    { description: string }
  >;
}

describe('RespuestasDeSubirUnArchivo', () => {
  const respuestas = respuestasDelMetodo();

  it('documenta cada error de la subida con su estado', () => {
    expect(Object.keys(respuestas).sort()).toEqual(['400', '401', '403', '413', '415', '503']);
  });

  it('pone el motivo de cada archivo en 400, 413 y 415', () => {
    expect(respuestas['400']?.description).toBe('No es lo que dice ser.');
    expect(respuestas['413']?.description).toBe('Pesa demasiado.');
    expect(respuestas['415']?.description).toBe('Solo se admite otro tipo.');
  });

  it('lo demas es igual para todos', () => {
    expect(respuestas['401']?.description).toBe('Falta la sesión o el token no es válido.');
    expect(respuestas['403']?.description).toBe('Hay sesión pero todavía no hay cuenta.');
    expect(respuestas['503']?.description).toBe(
      'ALMACENAMIENTO_NO_DISPONIBLE: no se guardó nada. Reintentar.',
    );
  });
});

describe('bytesDelCuerpo', () => {
  it('si el lector leyo el cuerpo, son esos bytes', () => {
    const cuerpo = Buffer.from([1, 2, 3]);

    expect(bytesDelCuerpo(cuerpo)).toBe(cuerpo);
  });

  it.each([
    ['nada', undefined],
    ['un objeto vacio', {}],
    ['un texto', 'hola'],
    ['un arreglo de bytes que no es un Buffer', new Uint8Array([1, 2, 3])],
  ])('si llega %s, no hay bytes', (_nombre, cuerpo) => {
    expect(bytesDelCuerpo(cuerpo)).toEqual(new Uint8Array(0));
  });
});
