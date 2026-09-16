import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { DomainError } from '../../domain/model/DomainError.js';

/**
 * Traduce los errores a respuestas HTTP.
 *
 * El dominio no conoce codigos de estado: lanza errores propios con un codigo
 * estable. Es aqui, en la infraestructura, donde se decide como se ven desde
 * fuera. Asi el dominio sigue sirviendo igual si manana se invoca desde una
 * cola de sincronizacion en lugar de por HTTP.
 */
const ESTADO_POR_CODIGO: Record<string, HttpStatus> = {
  IDENTIFICADOR_INVALIDO: HttpStatus.BAD_REQUEST,
  PUNTAJE_FUERA_DE_RANGO: HttpStatus.BAD_REQUEST,
  RANGO_DE_PUNTAJE_INVALIDO: HttpStatus.BAD_REQUEST,
  FECHA_EN_EL_FUTURO: HttpStatus.BAD_REQUEST,

  // 404 y no 403, a proposito. Un 403 confirmaria que ese identificador de
  // operacion existe. El 404 no distingue entre "no existe" y "no es tuyo",
  // que es justo lo que queremos: conocer un identificador ajeno no puede
  // servir ni para escribir ni para deducir que hay algo detras.
  OPERACION_DE_OTRO_USUARIO: HttpStatus.NOT_FOUND,

  // La actividad no esta en el catalogo. 404 porque el recurso que se nombra
  // no existe, y quien llama no puede hacer nada distinto con su peticion.
  ACTIVIDAD_NO_ENCONTRADA: HttpStatus.NOT_FOUND,

  CLAVE_DE_METADATA_RESERVADA: HttpStatus.BAD_REQUEST,
  LA_ACTIVIDAD_NO_PUNTUA: HttpStatus.BAD_REQUEST,

  // Esto no es culpa de quien llama: significa que el catalogo del servidor
  // esta mal configurado. Devolver 400 le diria que corrija algo que no esta
  // en su mano.
  CONFIGURACION_DE_ACTIVIDAD_INVALIDA: HttpStatus.INTERNAL_SERVER_ERROR,
};

interface CuerpoDeError {
  readonly codigo: string;
  readonly mensaje: string;
}

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly registro = new Logger('Errores');

  catch(excepcion: unknown, host: ArgumentsHost): void {
    const respuesta = host.switchToHttp().getResponse<Response>();

    if (excepcion instanceof DomainError) {
      const estado = ESTADO_POR_CODIGO[excepcion.code] ?? HttpStatus.BAD_REQUEST;
      const cuerpo: CuerpoDeError = { codigo: excepcion.code, mensaje: excepcion.message };

      respuesta.status(estado).json(cuerpo);

      return;
    }

    // Errores que ya vienen con su estado: validacion del DTO, ruta no
    // encontrada, limite de peticiones superado.
    if (excepcion instanceof HttpException) {
      respuesta.status(excepcion.getStatus()).json(excepcion.getResponse());

      return;
    }

    // Cualquier otra cosa es un fallo nuestro. El detalle va al registro del
    // servidor, donde sirve para diagnosticar; al cliente solo le llega un
    // mensaje generico. Devolver la traza seria entregar un mapa del interior
    // del sistema a quien lo esta probando.
    this.registro.error(
      'Error no controlado',
      excepcion instanceof Error ? excepcion.stack : excepcion,
    );

    const cuerpo: CuerpoDeError = {
      codigo: 'ERROR_INTERNO',
      mensaje: 'Ocurrio un error inesperado. Intentalo de nuevo mas tarde.',
    };

    respuesta.status(HttpStatus.INTERNAL_SERVER_ERROR).json(cuerpo);
  }
}
