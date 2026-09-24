import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { SignJWT, exportJWK, generateKeyPair, type JWK, type KeyObject } from 'jose';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { TokenInvalidoError, VerificadorDeIdentidad } from './VerificadorDeIdentidad.js';

/**
 * El verificador, con criptografia de verdad.
 *
 * Aqui no hay dobles. Se genera un par de claves ES256 en el momento, se
 * publica la parte publica en un servidor de una linea sobre localhost, y se
 * firman tokens con la privada. Es exactamente lo que hace Supabase, a
 * pequena escala y sin salir de la maquina.
 *
 * Importa que sea asi. Un doble del verificador probaria que el guardia llama
 * a algo; lo que hay que demostrar es que ese algo **rechaza** un token que no
 * cuadra, y eso solo se ve firmando tokens que no cuadran.
 */

const PERSONA = '11111111-1111-4111-8111-111111111111';
const IDENTIFICADOR_DE_CLAVE = 'clave-de-prueba';

let servidor: Server;
let base: string;
let privada: KeyObject | CryptoKey;

/** Lo mismo que publica Supabase en su JWKS. */
async function publicarClaves(publica: KeyObject | CryptoKey): Promise<JWK> {
  const jwk = await exportJWK(publica);

  return { ...jwk, alg: 'ES256', use: 'sig', kid: IDENTIFICADOR_DE_CLAVE };
}

/** Un token firmado con la clave buena, salvo lo que se pida cambiar. */
async function token(
  opciones: {
    emisor?: string;
    audiencia?: string;
    sujeto?: string | null;
    caducaEn?: string;
    correo?: string;
  } = {},
): Promise<string> {
  const firma = new SignJWT({ email: opciones.correo ?? 'persona@ejemplo.test' })
    .setProtectedHeader({ alg: 'ES256', kid: IDENTIFICADOR_DE_CLAVE })
    .setIssuer(opciones.emisor ?? `${base}/auth/v1`)
    .setAudience(opciones.audiencia ?? 'authenticated')
    .setIssuedAt()
    .setExpirationTime(opciones.caducaEn ?? '1h');

  if (opciones.sujeto !== null) {
    firma.setSubject(opciones.sujeto ?? PERSONA);
  }

  return firma.sign(privada);
}

beforeAll(async () => {
  const par = await generateKeyPair('ES256', { extractable: true });

  privada = par.privateKey;

  const jwks = JSON.stringify({ keys: [await publicarClaves(par.publicKey)] });

  servidor = createServer((peticion, respuesta) => {
    if (peticion.url === '/auth/v1/.well-known/jwks.json') {
      respuesta.writeHead(200, { 'content-type': 'application/json' });
      respuesta.end(jwks);

      return;
    }

    respuesta.writeHead(404);
    respuesta.end();
  });

  await new Promise<void>((listo) => {
    servidor.listen(0, '127.0.0.1', listo);
  });

  base = `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise<void>((listo) => {
    servidor.close(() => {
      listo();
    });
  });
});

describe('VerificadorDeIdentidad', () => {
  it('acepta un token bien firmado y devuelve quien es', async () => {
    const identidad = await new VerificadorDeIdentidad(base).verificar(await token());

    expect(identidad.id).toBe(PERSONA);
    expect(identidad.correo).toBe('persona@ejemplo.test');
  });

  it('tolera que la URL venga con barra final', async () => {
    const identidad = await new VerificadorDeIdentidad(`${base}/`).verificar(await token());

    expect(identidad.id).toBe(PERSONA);
  });

  it('rechaza un token de otro proyecto de Supabase', async () => {
    // Es un token perfectamente valido, firmado por quien dice y sin caducar.
    // Lo unico que falla es que no lo emitio nuestro proyecto. Sin comprobar
    // el emisor, cualquiera con una cuenta gratuita de Supabase podria crearse
    // un usuario en su propio proyecto y entrar aqui con el.
    await expect(
      new VerificadorDeIdentidad(base).verificar(
        await token({ emisor: 'https://otro-proyecto.supabase.co/auth/v1' }),
      ),
    ).rejects.toThrow(TokenInvalidoError);
  });

  it('rechaza un token que no es de una persona con sesion', async () => {
    await expect(
      new VerificadorDeIdentidad(base).verificar(await token({ audiencia: 'service_role' })),
    ).rejects.toThrow(TokenInvalidoError);
  });

  it('rechaza un token caducado', async () => {
    await expect(
      new VerificadorDeIdentidad(base).verificar(await token({ caducaEn: '-1h' })),
    ).rejects.toThrow(TokenInvalidoError);
  });

  it('rechaza un token que no dice a quien pertenece', async () => {
    await expect(
      new VerificadorDeIdentidad(base).verificar(await token({ sujeto: null })),
    ).rejects.toThrow(TokenInvalidoError);
  });

  it('rechaza un token al que le cambiaron el contenido', async () => {
    const original = await token();
    const [cabecera, , firma] = original.split('.');

    const contenidoFalso = Buffer.from(
      JSON.stringify({
        sub: '99999999-9999-4999-a999-999999999999',
        iss: `${base}/auth/v1`,
        aud: 'authenticated',
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    ).toString('base64url');

    await expect(
      new VerificadorDeIdentidad(base).verificar(`${cabecera}.${contenidoFalso}.${firma}`),
    ).rejects.toThrow(TokenInvalidoError);
  });

  it('rechaza un token firmado con HS256 usando la clave publica como secreto', async () => {
    // La confusion de algoritmo. La clave publica esta publicada a proposito,
    // asi que cualquiera la tiene; si la verificacion aceptara el algoritmo
    // que dice la cabecera del token, bastaria con usarla como si fuera el
    // secreto compartido de HS256 y el token saldria valido.
    //
    // Lo que lo impide es que la lista de algoritmos esta fijada en el codigo
    // y no se lee del token.
    const jwk = await exportJWK((await generateKeyPair('ES256', { extractable: true })).publicKey);
    const secreto = new TextEncoder().encode(JSON.stringify(jwk));

    const falsificado = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256', kid: IDENTIFICADOR_DE_CLAVE })
      .setIssuer(`${base}/auth/v1`)
      .setAudience('authenticated')
      .setSubject(PERSONA)
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secreto);

    await expect(new VerificadorDeIdentidad(base).verificar(falsificado)).rejects.toThrow(
      TokenInvalidoError,
    );
  });

  it('rechaza texto que ni siquiera es un token', async () => {
    await expect(new VerificadorDeIdentidad(base).verificar('hola')).rejects.toThrow(
      TokenInvalidoError,
    );
  });
});
