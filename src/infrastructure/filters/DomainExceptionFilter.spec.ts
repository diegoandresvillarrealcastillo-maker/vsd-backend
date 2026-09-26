import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InvalidIdentifierError } from '../../domain/model/DomainError.js';
import { CABECERA_DE_PETICION } from '../logging/identificadorDePeticion.js';
import { DomainExceptionFilter } from './DomainExceptionFilter.js';

/**
 * Doble minimo de la respuesta de Express.
 *
 * Lleva `getHeader` porque la respuesta de verdad lo lleva: el filtro lee de
 * ahi el identificador de la peticion. Un doble al que le falta un metodo del
 * original no prueba lo que parece.
 */
function respuestaFalsa(identificador?: string) {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  const getHeader = vi.fn((nombre: string) =>
    nombre === CABECERA_DE_PETICION ? identificador : undefined,
  );

  return { status, json, getHeader };
}

afterEach(() => {
  vi.restoreAllMocks();
});

function hostFalso(respuesta: unknown): ArgumentsHost {
  return {
    switchToHttp: () => ({ getResponse: () => respuesta }),
  } as unknown as ArgumentsHost;
}

describe('DomainExceptionFilter', () => {
  it('traduce un error de dominio a su codigo HTTP', () => {
    const respuesta = respuestaFalsa();

    new DomainExceptionFilter().catch(
      new InvalidIdentifierError('usuario', 'roto'),
      hostFalso(respuesta),
    );

    expect(respuesta.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(respuesta.json).toHaveBeenCalledWith(
      expect.objectContaining({ codigo: 'IDENTIFICADOR_INVALIDO' }),
    );
  });

  it('respeta el estado de las excepciones que ya lo traen', () => {
    const respuesta = respuestaFalsa();

    new DomainExceptionFilter().catch(
      new HttpException('No encontrado', HttpStatus.NOT_FOUND),
      hostFalso(respuesta),
    );

    expect(respuesta.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
  });

  it('un error inesperado responde 500 sin filtrar detalles', () => {
    // Es la ruta que mas importa de este archivo. Devolver la traza seria
    // entregar un mapa del interior del sistema a quien lo este probando.
    const respuesta = respuestaFalsa();
    const fallo = new Error('Conexion rechazada: postgres://usuario:clave@host:5432');

    new DomainExceptionFilter().catch(fallo, hostFalso(respuesta));

    expect(respuesta.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);

    const cuerpo = JSON.stringify(respuesta.json.mock.calls[0]?.[0]);

    expect(cuerpo).toContain('ERROR_INTERNO');
    expect(cuerpo).not.toContain('postgres://');
    expect(cuerpo).not.toContain('clave');
  });

  it('tambien maneja lo que no es un Error', () => {
    const respuesta = respuestaFalsa();

    new DomainExceptionFilter().catch('algo raro', hostFalso(respuesta));

    expect(respuesta.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('registra el identificador de la peticion junto al error interno', () => {
    // Es el puente entre lo que la persona ve y esta entrada del registro. Sin
    // el, saber que hubo un error interno no ayuda a encontrar cual de todos.
    const registrar = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const respuesta = respuestaFalsa('11111111-1111-4111-8111-111111111111');

    new DomainExceptionFilter().catch(new Error('lo que sea'), hostFalso(respuesta));

    expect(registrar).toHaveBeenCalledWith(
      expect.stringContaining('11111111-1111-4111-8111-111111111111'),
      expect.anything(),
    );
  });

  it('sin identificador tambien registra, en lugar de fallar al fallar', () => {
    // Un filtro de errores que se rompe mientras informa de un error deja el
    // fallo original sin rastro. Aqui la respuesta no trae la cabecera.
    const registrar = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const respuesta = respuestaFalsa();

    new DomainExceptionFilter().catch(new Error('lo que sea'), hostFalso(respuesta));

    expect(respuesta.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(registrar).toHaveBeenCalledWith(
      expect.stringContaining('sin identificador'),
      expect.anything(),
    );
  });
});
