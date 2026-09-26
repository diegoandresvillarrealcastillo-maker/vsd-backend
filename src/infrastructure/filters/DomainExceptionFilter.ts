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

  // Aqui vivia OPERACION_DE_OTRO_USUARIO. Se quito con el ADR 0010: la clave
  // de operacion es unica por persona, asi que usar una ajena ya no produce
  // una respuesta distinta a usar una inexistente. No hacia falta un estado
  // que no delatara nada porque dejo de haber algo que delatar.

  // La actividad no esta en el catalogo. 404 porque el recurso que se nombra
  // no existe, y quien llama no puede hacer nada distinto con su peticion.
  ACTIVIDAD_NO_ENCONTRADA: HttpStatus.NOT_FOUND,

  CLAVE_DE_METADATA_RESERVADA: HttpStatus.BAD_REQUEST,
  LA_ACTIVIDAD_NO_PUNTUA: HttpStatus.BAD_REQUEST,

  // 403 y no 401: el token es autentico y la sesion vale. Lo que falta es la
  // cuenta. Decir "no estas autenticado" mandaria a la persona a iniciar
  // sesion otra vez, que es justo lo que no arregla el problema.
  CUENTA_NO_REGISTRADA: HttpStatus.FORBIDDEN,

  // 409 porque es un conflicto con un recurso que ya existe, no un error de
  // formato. La peticion esta bien escrita; lo que pasa es que ese correo ya
  // esta tomado por una cuenta creada con otro metodo de acceso.
  CORREO_YA_REGISTRADO: HttpStatus.CONFLICT,

  // Sin consentimiento no hay base legal para tratar informacion de salud.
  // Ley 1581 de 2012.
  CONSENTIMIENTO_NO_REGISTRADO: HttpStatus.BAD_REQUEST,

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
      mensaje: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    };

    respuesta.status(HttpStatus.INTERNAL_SERVER_ERROR).json(cuerpo);
  }
}
