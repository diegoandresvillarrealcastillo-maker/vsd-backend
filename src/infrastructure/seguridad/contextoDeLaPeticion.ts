import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ContextoDeLaPeticion } from '../../domain/model/EventoDeSeguridad.js';
import { identificadorDeLaRespuesta } from '../logging/identificadorDePeticion.js';

/**
 * De donde viene una peticion, para anotarlo en el registro de seguridad: el
 * identificador que genera el servidor y la IP que Express da por buena.
 *
 * La IP viaja en claro hasta el adaptador, que es el unico que sabe convertirla
 * en una huella. Que sea la del cliente o la del proxy depende de
 * `TRUST_PROXY_HOPS` (SCRUM-151): sin eso, detras de Render veria siempre la
 * misma direccion.
 */
export function contextoDeLaPeticion(peticion: Request, respuesta: Response): ContextoDeLaPeticion {
  try {
    const idPeticion = identificadorDeLaRespuesta(respuesta);
    const ip: string | undefined = peticion.ip;

    return {
      ...(idPeticion === undefined ? {} : { idPeticion }),
      ...(ip === undefined || ip === '' ? {} : { ip }),
    };
  } catch {
    // Anotar de donde venia una peticion no puede ser lo que la rompa.
    return {};
  }
}

/** `@ContextoDeSeguridad()`: el contexto de la peticion en curso, para pasarlo al registro. */
export const ContextoDeSeguridad = createParamDecorator(
  (_dato: unknown, contexto: ExecutionContext): ContextoDeLaPeticion => {
    const http = contexto.switchToHttp();

    return contextoDeLaPeticion(http.getRequest<Request>(), http.getResponse<Response>());
  },
);
