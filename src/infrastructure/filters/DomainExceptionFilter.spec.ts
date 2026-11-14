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

  it('un cuerpo demasiado grande responde 413 y no se anota como fallo nuestro', () => {
    // Es la forma del error que lanza el lector de JSON de Express. Antes
    // caia en el error interno: 500, y anotado entero (SCRUM-95).
    const anotado = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const respuesta = respuestaFalsa();
    const error = Object.assign(new Error('request entity too large'), {
      status: 413,
      expose: true,
      type: 'entity.too.large',
    });

    new DomainExceptionFilter().catch(error, hostFalso(respuesta));

    expect(respuesta.status).toHaveBeenCalledWith(HttpStatus.PAYLOAD_TOO_LARGE);
    expect(respuesta.json).toHaveBeenCalledWith(
      expect.objectContaining({ codigo: 'CUERPO_DEMASIADO_GRANDE' }),
    );
    expect(anotado).not.toHaveBeenCalled();
  });

  it('un error con estado 4xx pero sin `expose` sigue siendo un fallo interno', () => {
    // `expose` es lo que dice que el error es de quien llama y se puede
    // contar. Sin el, no se le cree el estado.
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const respuesta = respuestaFalsa();

    new DomainExceptionFilter().catch(
      Object.assign(new Error('algo'), { status: 400 }),
      hostFalso(respuesta),
    );

    expect(respuesta.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
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

  it('de un error de Prisma no anota el mensaje, que puede traer lo que escribio la persona', () => {
    // SCRUM-94: el texto libre de "Un momento bueno del dia" no puede acabar
    // en el registro. Prisma repite en su mensaje los argumentos de la llamada
    // que fallo, y ahi iria la metadata del resultado.
    const registrar = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const fallo = Object.assign(
      new Error(
        'Invalid `prisma.resultado.create()` invocation:\n  metadata: { texto: "hoy hable con mi abuela" }',
      ),
      { name: 'PrismaClientValidationError', code: 'P2009' },
    );

    new DomainExceptionFilter().catch(fallo, hostFalso(respuestaFalsa()));

    const anotado = registrar.mock.calls.flat().join('\n');

    expect(anotado).not.toContain('abuela');
    expect(anotado).toContain('PrismaClientValidationError P2009');
    expect(anotado).toContain('at ');
  });

  it('de lo que no es un Error solo anota que clase de cosa era', () => {
    const registrar = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    new DomainExceptionFilter().catch({ texto: 'algo privado' }, hostFalso(respuestaFalsa()));

    const anotado = registrar.mock.calls.flat().join('\n');

    expect(anotado).not.toContain('algo privado');
    expect(anotado).toContain('object');
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
