import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

/**
 * Lo que dicen igual los controladores que reciben un archivo de la cuenta (la foto de perfil y la
 * mascota propia) al subirlo: el cuerpo es el archivo mismo, no JSON, y las respuestas de error
 * son las mismas salvo por el motivo concreto de cada archivo.
 */

/** Los textos que cambian de un archivo a otro en las respuestas de error al subirlo. */
export interface MotivosDeSubirUnArchivo {
  /** Por que se rechaza el contenido (400). */
  readonly invalido: string;
  /** Por que pesa demasiado (413). */
  readonly pesado: string;
  /** Que tipos admite (415). */
  readonly tipo: string;
}

/** Las respuestas de error de la subida, para el documento OpenAPI. */
export function RespuestasDeSubirUnArchivo(motivos: MotivosDeSubirUnArchivo) {
  return applyDecorators(
    ApiResponse({ status: 400, description: motivos.invalido }),
    ApiResponse({ status: 401, description: 'Falta la sesión o el token no es válido.' }),
    ApiResponse({ status: 403, description: 'Hay sesión pero todavía no hay cuenta.' }),
    ApiResponse({ status: 413, description: motivos.pesado }),
    ApiResponse({ status: 415, description: motivos.tipo }),
    ApiResponse({
      status: 503,
      description: 'ALMACENAMIENTO_NO_DISPONIBLE: no se guardó nada. Reintentar.',
    }),
  );
}

/**
 * Los bytes del cuerpo. Si el tipo no era el que el lector admite, no tocó el cuerpo y llega otra
 * cosa: no importa, el tipo se mira primero y falla con su motivo.
 */
export function bytesDelCuerpo(cuerpo: unknown): Uint8Array {
  return Buffer.isBuffer(cuerpo) ? cuerpo : new Uint8Array(0);
}
