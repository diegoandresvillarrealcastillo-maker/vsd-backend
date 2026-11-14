import { HttpStatus } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import {
  InvalidIdentifierError,
  InvalidPetSvgError,
  InvalidPhotoError,
  type MotivoDeFotoInvalida,
  type MotivoDeSvgInvalido,
} from '../../domain/model/DomainError.js';
import type { EventoDeSeguridad } from '../../domain/model/EventoDeSeguridad.js';
import type { RegistroDeSeguridadPort } from '../../domain/ports/out/RegistroDeSeguridadPort.js';
import { CABECERA_DE_PETICION } from '../logging/identificadorDePeticion.js';
import { DomainExceptionFilter } from './DomainExceptionFilter.js';

/**
 * Los archivos peligrosos que se rechazan se anotan como hecho de seguridad
 * (SCRUM-163), y la respuesta no cambia en nada por ello.
 */
const ID_DE_LA_CUENTA = '8f14e45f-ceea-467a-9575-0d9a1c3c7b11';
const ID_DE_LA_PETICION = 'b1e7a5a4-1f0e-4a43-9d2c-5a3f6b1c9d11';

function respuestaFalsa() {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  const getHeader = vi.fn((nombre: string) =>
    nombre === CABECERA_DE_PETICION ? ID_DE_LA_PETICION : undefined,
  );

  return { status, json, getHeader };
}

const PETICION_CON_CUENTA = { cuenta: { id: { value: ID_DE_LA_CUENTA } }, ip: '203.0.113.9' };

function hostConCuenta(respuesta: unknown, peticion: object = PETICION_CON_CUENTA) {
  return {
    switchToHttp: () => ({
      getResponse: () => respuesta,
      getRequest: () => peticion,
    }),
  } as unknown as ArgumentsHost;
}

function registroQueGuarda(): { registro: RegistroDeSeguridadPort; eventos: EventoDeSeguridad[] } {
  const eventos: EventoDeSeguridad[] = [];

  return { registro: { registrar: (evento) => eventos.push(evento) }, eventos };
}

describe('DomainExceptionFilter y el registro de seguridad', () => {
  it.each<[string, () => Error, string]>([
    ['una foto de otro tipo', () => new InvalidPhotoError('tipo'), 'FOTO_TIPO_NO_PERMITIDO'],
    ['una foto que no es imagen', () => new InvalidPhotoError('imagen'), 'FOTO_NO_ES_UNA_IMAGEN'],
    ['un SVG de otro tipo', () => new InvalidPetSvgError('tipo'), 'MASCOTA_SVG_TIPO_NO_PERMITIDO'],
    ['un SVG que no lo es', () => new InvalidPetSvgError('no-es-svg'), 'MASCOTA_SVG_NO_ES_UN_SVG'],
    ['un SVG peligroso', () => new InvalidPetSvgError('peligroso'), 'MASCOTA_SVG_PELIGROSO'],
  ])('%s se anota como ARCHIVO_PELIGROSO_RECHAZADO', (_cual, error, codigo) => {
    const { registro, eventos } = registroQueGuarda();
    const respuesta = respuestaFalsa();

    new DomainExceptionFilter(registro).catch(error(), hostConCuenta(respuesta));

    expect(eventos).toEqual([
      {
        tipo: 'ARCHIVO_PELIGROSO_RECHAZADO',
        idUsuario: ID_DE_LA_CUENTA,
        motivo: codigo,
        idPeticion: ID_DE_LA_PETICION,
        ip: '203.0.113.9',
      },
    ]);
  });

  it.each<[string, () => Error]>([
    ['una foto muy pesada', () => new InvalidPhotoError('peso')],
    ['una foto muy grande', () => new InvalidPhotoError('lado')],
    ['un SVG muy pesado', () => new InvalidPetSvgError('peso')],
    ['un SVG con algo no admitido', () => new InvalidPetSvgError('no-admitido')],
    ['un SVG muy complejo', () => new InvalidPetSvgError('demasiado-complejo')],
    ['un error cualquiera del dominio', () => new InvalidIdentifierError('usuario', 'roto')],
  ])('%s es un descuido y no se anota', (_cual, error) => {
    const { registro, eventos } = registroQueGuarda();

    new DomainExceptionFilter(registro).catch(error(), hostConCuenta(respuestaFalsa()));

    expect(eventos).toEqual([]);
  });

  it('la respuesta es la misma con o sin registro', () => {
    const conRegistro = respuestaFalsa();
    const sinRegistro = respuestaFalsa();
    const error = new InvalidPetSvgError('peligroso');

    new DomainExceptionFilter(registroQueGuarda().registro).catch(
      error,
      hostConCuenta(conRegistro),
    );
    new DomainExceptionFilter().catch(error, hostConCuenta(sinRegistro));

    expect(conRegistro.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(conRegistro.status.mock.calls).toEqual(sinRegistro.status.mock.calls);
    expect(conRegistro.json.mock.calls).toEqual(sinRegistro.json.mock.calls);
  });

  it('sin cuenta en la peticion no hay a quien atribuirlo y no se anota', () => {
    const { registro, eventos } = registroQueGuarda();

    new DomainExceptionFilter(registro).catch(
      new InvalidPetSvgError('peligroso'),
      hostConCuenta(respuestaFalsa(), { ip: '203.0.113.9' }),
    );

    expect(eventos).toEqual([]);
  });

  it('si el registro falla, la persona recibe su respuesta igual', () => {
    const respuesta = respuestaFalsa();
    const roto: RegistroDeSeguridadPort = {
      registrar: () => {
        throw new Error('el registro se cayo');
      },
    };

    expect(() =>
      new DomainExceptionFilter(roto).catch(
        new InvalidPhotoError('tipo'),
        hostConCuenta(respuesta),
      ),
    ).not.toThrow();
    expect(respuesta.status).toHaveBeenCalledWith(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
  });

  it('si el contexto no trae la peticion, tampoco rompe la respuesta', () => {
    const { registro, eventos } = registroQueGuarda();
    const respuesta = respuestaFalsa();
    const sinPeticion = {
      switchToHttp: () => ({ getResponse: () => respuesta }),
    } as unknown as ArgumentsHost;

    expect(() =>
      new DomainExceptionFilter(registro).catch(new InvalidPetSvgError('peligroso'), sinPeticion),
    ).not.toThrow();
    expect(respuesta.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(eventos).toEqual([]);
  });

  it('cubre todos los motivos de rechazo que existen', () => {
    // Si alguien agrega un motivo nuevo a los archivos, esta lista obliga a
    // decidir si es un descuido o un hecho de seguridad.
    const fotos: readonly MotivoDeFotoInvalida[] = ['tipo', 'peso', 'lado', 'imagen'];
    const svgs: readonly MotivoDeSvgInvalido[] = [
      'tipo',
      'peso',
      'no-es-svg',
      'peligroso',
      'no-admitido',
      'demasiado-complejo',
    ];
    const { registro, eventos } = registroQueGuarda();
    const filtro = new DomainExceptionFilter(registro);

    for (const motivo of fotos) {
      filtro.catch(new InvalidPhotoError(motivo), hostConCuenta(respuestaFalsa()));
    }

    for (const motivo of svgs) {
      filtro.catch(new InvalidPetSvgError(motivo), hostConCuenta(respuestaFalsa()));
    }

    expect(
      eventos.map((evento) => (evento.tipo === 'ARCHIVO_PELIGROSO_RECHAZADO' ? evento.motivo : '')),
    ).toEqual([
      'FOTO_TIPO_NO_PERMITIDO',
      'FOTO_NO_ES_UNA_IMAGEN',
      'MASCOTA_SVG_TIPO_NO_PERMITIDO',
      'MASCOTA_SVG_NO_ES_UN_SVG',
      'MASCOTA_SVG_PELIGROSO',
    ]);
  });
});
