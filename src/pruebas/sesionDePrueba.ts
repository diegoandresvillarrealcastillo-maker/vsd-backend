import { TokenInvalidoError } from '../infrastructure/auth/VerificadorDeIdentidad.js';
import type { Identidad } from '../infrastructure/auth/VerificadorDeIdentidad.js';

/**
 * Ayudantes para probar rutas que exigen sesion.
 *
 * ## Que se sustituye y que no
 *
 * Solo la criptografia. El guardia, el decorador que entrega la identidad al
 * controlador, la validacion del cuerpo y el resto de la tuberia son los de
 * verdad: lo unico que cambia es que la firma no se comprueba contra Supabase.
 *
 * Es a proposito. Verificar de verdad obligaria a que cada prueba HTTP
 * hablara por red con un proyecto real, y unas pruebas que necesitan internet
 * dejan de correrse. Pero sustituir el guardia entero seria peor: dejaria sin
 * probar precisamente lo que el ticket anade, que es que una peticion sin
 * token no pasa.
 *
 * Con este doble, una peticion sin cabecera sigue dando 401, una con un token
 * desconocido tambien, y el controlador sigue recibiendo la identidad por el
 * mismo camino que en produccion.
 *
 * La criptografia de verdad se prueba en `VerificadorDeIdentidad.spec.ts`,
 * que genera un par de claves en el momento y no toca la red.
 */

/** Personas con las que se prueba. El token es el nombre, y basta. */
export const SESIONES: Record<string, Identidad> = {
  'token-de-A': { id: '11111111-1111-4111-8111-111111111111', correo: 'a@ejemplo.test' },
  'token-de-B': { id: '22222222-2222-4222-9222-222222222222', correo: 'b@ejemplo.test' },
};

/** Cabecera lista para pasar a supertest. */
export function comoUsuario(token: string): [string, string] {
  return ['Authorization', `Bearer ${token}`];
}

/**
 * Doble del verificador: reconoce los tokens de `SESIONES` y rechaza el resto.
 *
 * Tiene la misma forma publica que el verdadero, asi que si alguien cambia la
 * firma de `verificar` esto deja de compilar. Es lo que se busca: un doble que
 * se desincroniza en silencio es peor que no tener doble.
 */
export class VerificadorFalso {
  // No lleva `async` porque no espera a nada, y la regla de lint que lo
  // prohibe tiene razon: un `async` sin `await` suele ser una pista de que
  // alguien olvido esperar algo. Devolver la promesa a mano deja la misma
  // firma que el verificador de verdad.
  verificar(token: string): Promise<Identidad> {
    const identidad = SESIONES[token];

    if (identidad === undefined) {
      return Promise.reject(new TokenInvalidoError('token desconocido en las pruebas'));
    }

    return Promise.resolve(identidad);
  }
}
