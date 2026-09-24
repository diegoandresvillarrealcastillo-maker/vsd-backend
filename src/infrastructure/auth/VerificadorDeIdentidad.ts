import { createRemoteJWKSet, jwtVerify } from 'jose';

/**
 * Quien hace la peticion, segun su token ya verificado.
 *
 * Es deliberadamente pequena. Trae **la identidad, no los permisos**: quien
 * es, y nada sobre que puede hacer.
 *
 * El motivo esta en como funciona Supabase. Un token suyo incluye un campo
 * `role`, y es tentador leerlo; pero ese campo vale `authenticated` para todo
 * el mundo, porque nombra el rol de PostgreSQL con el que actua la sesion, no
 * el rol de VSD Health. El nuestro —usuario o administrador— vive en la tabla
 * `usuario`, que es nuestra y la persona no puede tocar.
 *
 * Y hay algo peor cerca: `user_metadata` viaja tambien en el token, y
 * cualquiera puede escribir en el suyo llamando a `updateUser` desde el
 * navegador. Un token con `user_metadata.rol = "administrador"` tiene la firma
 * perfectamente valida. Por eso de aqui no sale ningun permiso.
 */
export interface Identidad {
  /** El `sub` del token: el identificador de la persona en Supabase. */
  readonly id: string;
  readonly correo: string | undefined;
}

/**
 * Se lanza cuando un token no se puede aceptar, por el motivo que sea.
 *
 * El motivo concreto se registra pero **no se responde**. A quien lo envia le
 * llega siempre un 401 igual: saber si el token caduco, si venia de otro
 * proyecto o si la firma no cuadraba es informacion util para quien esta
 * probando combinaciones.
 */
export class TokenInvalidoError extends Error {
  constructor(motivo: string) {
    super(motivo);
    this.name = 'TokenInvalidoError';
  }
}

/**
 * Algoritmos de firma que se aceptan.
 *
 * Son los asimetricos, y la ausencia de HS256 es lo importante de esta lista.
 *
 * Con firma asimetrica hay dos claves: Supabase firma con la privada, que no
 * sale de Supabase, y nosotros comprobamos con la publica, que esta publicada
 * a proposito. Con HS256 hay una sola clave que sirve para las dos cosas.
 *
 * Mezclarlos es un fallo conocido —la confusion de algoritmo—: si la
 * verificacion acepta el algoritmo que diga la cabecera del token, alguien
 * puede firmar el suyo con HS256 usando **la clave publica** como si fuera el
 * secreto compartido. La clave publica la tiene cualquiera. El token saldria
 * valido.
 *
 * Fijar la lista aqui, y no leerla del token, cierra eso.
 */
const ALGORITMOS_ACEPTADOS = ['ES256', 'RS256'];

/** Margen para el desfase de reloj entre Supabase y nuestro servidor. */
const TOLERANCIA_DE_RELOJ = '10s';

/**
 * Comprueba que un token lo emitio Supabase y sigue siendo valido.
 *
 * Verifica contra el **JWKS** del proyecto: la lista de claves publicas que
 * Supabase publica en una URL conocida. Se eligio esto y no el secreto
 * compartido (`SUPABASE_JWT_SECRET`) por dos razones.
 *
 * La primera es que el secreto compartido permite firmar, no solo comprobar.
 * Tenerlo en la API significa que filtrar la configuracion del servidor basta
 * para fabricar la identidad de cualquiera. Con la clave publica, lo peor que
 * puede hacer quien la obtenga es lo mismo que ya podia hacer: comprobar.
 *
 * La segunda es la rotacion. Las claves se cambian cada cierto tiempo, y el
 * JWKS se consulta solo y guarda el resultado; con el secreto en una variable
 * de entorno, cada rotacion es un despliegue y un rato de tokens rechazados.
 *
 * Nota: el proyecto de VSD Health firma hoy con ES256.
 */
export class VerificadorDeIdentidad {
  private readonly claves: ReturnType<typeof createRemoteJWKSet>;
  private readonly emisor: string;

  /**
   * @param urlDeSupabase URL base del proyecto, sin barra final.
   *        Por ejemplo `https://abcdefgh.supabase.co`.
   */
  constructor(urlDeSupabase: string) {
    this.emisor = `${urlDeSupabase.replace(/\/+$/, '')}/auth/v1`;

    // `createRemoteJWKSet` no descarga nada al construirse: lo hace en la
    // primera verificacion y despues reutiliza lo que tiene. Si aparece un
    // token firmado con una clave que no conoce, vuelve a consultar, con un
    // limite de frecuencia propio para que un token basura repetido no se
    // convierta en una peticion a Supabase por cada intento.
    this.claves = createRemoteJWKSet(new URL(`${this.emisor}/.well-known/jwks.json`));
  }

  /**
   * Devuelve la identidad del token, o lanza si no se puede aceptar.
   *
   * Las cuatro comprobaciones que exige el ticket:
   *
   * - **alg**: solo los de `ALGORITMOS_ACEPTADOS`.
   * - **iss**: que lo emitiera *nuestro* proyecto. Sin esto, un token valido
   *   de cualquier otro proyecto de Supabase entraria aqui como si nada.
   * - **aud**: `authenticated`, que es lo que Supabase pone en el token de una
   *   persona con sesion. Deja fuera los tokens de servicio.
   * - **exp**: la comprueba `jwtVerify` por su cuenta, con la tolerancia de
   *   reloj indicada.
   */
  async verificar(token: string): Promise<Identidad> {
    let contenido;

    try {
      const resultado = await jwtVerify(token, this.claves, {
        algorithms: ALGORITMOS_ACEPTADOS,
        issuer: this.emisor,
        audience: 'authenticated',
        clockTolerance: TOLERANCIA_DE_RELOJ,
      });

      contenido = resultado.payload;
    } catch (error) {
      throw new TokenInvalidoError(error instanceof Error ? error.message : 'token no verificable');
    }

    // `sub` es opcional en el estandar de JWT, asi que hay que comprobarlo:
    // un token sin el pasaria la firma y nos dejaria sin saber de quien es.
    if (typeof contenido.sub !== 'string' || contenido.sub.trim() === '') {
      throw new TokenInvalidoError('el token no dice a quien pertenece');
    }

    const correo = contenido['email'];

    return {
      id: contenido.sub,
      correo: typeof correo === 'string' && correo.trim() !== '' ? correo : undefined,
    };
  }
}
