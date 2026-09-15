import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  Logger,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';

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
/** Ruta que se anota cuando Express no dejo la plantilla disponible. */
const RUTA_SIN_RESOLVER = '(sin ruta)';

/**
 * Devuelve la plantilla de la ruta, por ejemplo "/api/resultados".
 *
 * Se prefiere la plantilla sobre la URL concreta a proposito: asi una ruta
 * como "/api/resultados/:id" no acaba dejando identificadores sueltos en el
 * registro solo por aparecer en la direccion.
 *
 * El respaldo **no** cae a `peticion.url`. Esa cadena la escribe quien llama y
 * puede traer un correo o un token en la consulta, que acabarian anotados. Se
 * prefiere perder el detalle de una ruta rara antes que arriesgar la fuga.
 *
 * En la practica el respaldo no se alcanza por HTTP: los interceptores de Nest
 * solo corren en peticiones que ya coincidieron con un controlador, y para
 * entonces `route` esta puesta. Se conserva porque el tipo lo admite vacio.
 */
function obtenerRuta(peticion: Request): string {
  const ruta: unknown = peticion.route;

  if (typeof ruta === 'object' && ruta !== null && 'path' in ruta) {
    const { path } = ruta;

    if (typeof path === 'string') {
      return path;
    }
  }

  return RUTA_SIN_RESOLVER;
}

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly registro = new Logger('Peticiones');

  intercept(contexto: ExecutionContext, siguiente: CallHandler): Observable<unknown> {
    const http = contexto.switchToHttp();
    const peticion = http.getRequest<Request>();
    const respuesta = http.getResponse<Response>();

    const metodo = peticion.method;
    const inicio = Date.now();

    // Se anota cuando la respuesta termina de enviarse, no cuando el
    // controlador acaba.
    //
    // Leer el estado dentro del flujo da un numero equivocado: el codigo de
    // exito ya esta puesto en la respuesta antes de que las validaciones
    // fallen, asi que una peticion rechazada se anotaba como 201. El filtro
    // de excepciones corrige el estado despues, y solo al terminar el envio
    // el numero es el que de verdad recibio quien llamo.
    //
    // La ruta tambien se resuelve aqui: para entonces Express ya sabe con
    // que controlador coincidio la peticion.
    respuesta.once('finish', () => {
      this.anotar(metodo, obtenerRuta(peticion), respuesta.statusCode, inicio);
    });

    return siguiente.handle();
  }

  private anotar(metodo: string, ruta: string, estado: number, inicio: number): void {
    // Se registra la plantilla de la ruta y no la URL concreta. Asi
    // "/api/resultados/:id" no acaba dejando identificadores sueltos en el
    // registro solo por aparecer en la direccion.
    this.registro.log(`${metodo} ${ruta} ${estado} ${Date.now() - inicio}ms`);
  }
}
