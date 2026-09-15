import { HttpException, HttpStatus } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { InvalidIdentifierError } from '../../domain/model/DomainError.js';
import { DomainExceptionFilter } from './DomainExceptionFilter.js';

/** Doble minimo de la respuesta de Express. */
function respuestaFalsa() {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });

  return { status, json };
}

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
});
