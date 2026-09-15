import { InvalidIdentifierError } from './DomainError.js';

/**
 * Formato UUID segun la RFC 9562. Acepta las versiones 1 a 8.
 *
 * La validacion vive aqui, sin biblioteca externa, porque el dominio no puede
 * depender de nada de fuera. Es una expresion regular corta y estable: el
 * formato de un UUID no cambia.
 */
const FORMATO_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Identificador unico basado en UUID.
 *
 * Se eligio UUID y no un entero autoincremental por dos razones:
 * el dispositivo puede crear registros sin conexion, antes de hablar con el
 * servidor, y un identificador no consecutivo no se puede enumerar para
 * tantear datos ajenos. Ver docs/adr/0003-uuid-como-clave-primaria.md
 *
 * Es abstracta a proposito: `UserId` y `ActivityId` no son intercambiables
 * aunque por dentro los dos sean texto. Confundirlos seria un error caro.
 */
export abstract class Identifier {
  readonly value: string;

  protected constructor(value: string, tipo: string) {
    const normalizado = value.trim().toLowerCase();

    if (!FORMATO_UUID.test(normalizado)) {
      throw new InvalidIdentifierError(tipo, value);
    }

    this.value = normalizado;
  }

  equals(other: Identifier): boolean {
    return this.constructor === other.constructor && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

/** Identifica un resultado de actividad. */
export class ResultId extends Identifier {
  constructor(value: string) {
    super(value, 'resultado');
  }
}

/** Identifica a la persona duena del resultado. */
export class UserId extends Identifier {
  constructor(value: string) {
    super(value, 'usuario');
  }
}

/** Identifica la actividad que se realizo. */
export class ActivityId extends Identifier {
  constructor(value: string) {
    super(value, 'actividad');
  }
}

/**
 * Identificador de la operacion, generado por el dispositivo del usuario.
 *
 * Es la pieza que hace segura la sincronizacion: el dispositivo lo crea una
 * sola vez por intento, y lo reenvia en cada reintento. El servidor lo usa
 * para reconocer que una peticion repetida es la misma operacion y no una
 * nueva, de modo que una caida de red no acabe duplicando un resultado en el
 * historial. En base de datos lleva una restriccion UNIQUE.
 */
export class ClientOperationId extends Identifier {
  constructor(value: string) {
    super(value, 'operacion del cliente');
  }
}
