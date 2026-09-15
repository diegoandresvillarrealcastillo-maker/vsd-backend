import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  Logger,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Registro de peticiones.
 *
 * Cubre el factor "registros como flujo de eventos" de los doce factores: la
 * aplicacion no administra archivos ni rota nada, escribe a la salida
 * estandar y es el entorno de despliegue quien los recoge.
 *
 * REGLA QUE NO SE NEGOCIA: aqui no entra ningun dato personal ni de salud.
 * Nada de correos, puntajes, niveles orientativos ni contenido de respuestas.
 * Los registros parecen internos, pero los lee el personal del proveedor de
 * despliegue y acaban en sistemas de indexacion. Se tratan como informacion
 * que alguien va a leer.
 *
 * Los identificadores si se registran: son UUID sin significado por si mismos
 * y son lo que permite seguir el rastro de una peticion concreta.
 */
/**
 * Devuelve la plantilla de la ruta, por ejemplo "/api/resultados".
 *
 * Express solo rellena `route` cuando la peticion llego a un controlador. Si
 * no coincidio con ninguno, se cae a la URL recibida.
 *
 * Se prefiere la plantilla sobre la URL concreta a proposito: asi una ruta
 * como "/api/resultados/:id" no acaba dejando identificadores sueltos en el
 * registro solo por aparecer en la direccion.
 */
function obtenerRuta(peticion: Request): string {
  const ruta: unknown = peticion.route;

  if (typeof ruta === 'object' && ruta !== null && 'path' in ruta) {
    const { path } = ruta;

    if (typeof path === 'string') {
      return path;
    }
  }

  return peticion.url;
}

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly registro = new Logger('Peticiones');

  intercept(contexto: ExecutionContext, siguiente: CallHandler): Observable<unknown> {
    const http = contexto.switchToHttp();
    const peticion = http.getRequest<Request>();
    const respuesta = http.getResponse<Response>();

    const metodo = peticion.method;
    // `route` solo existe cuando Express ya resolvio la ruta; si la peticion
    // no coincide con ningun controlador, se cae a la URL recibida.
    const ruta = obtenerRuta(peticion);
    const inicio = Date.now();

    return siguiente.handle().pipe(
      tap({
        next: () => this.anotar(metodo, ruta, respuesta.statusCode, inicio),
        error: () => this.anotar(metodo, ruta, respuesta.statusCode, inicio),
      }),
    );
  }

  private anotar(metodo: string, ruta: string, estado: number, inicio: number): void {
    // Se registra la plantilla de la ruta y no la URL concreta. Asi
    // "/api/resultados/:id" no acaba dejando identificadores sueltos en el
    // registro solo por aparecer en la direccion.
    this.registro.log(`${metodo} ${ruta} ${estado} ${Date.now() - inicio}ms`);
  }
}
