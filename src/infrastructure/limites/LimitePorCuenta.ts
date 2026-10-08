import {
  type CallHandler,
  type ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  type NestInterceptor,
  Optional,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import type { Observable } from 'rxjs';
import type { PeticionConCuenta } from '../auth/CuentaActual.js';

export const LIMITE_POR_CUENTA = 'vsd:limite-por-cuenta';

/** Cuantas veces puede hacer una cuenta algo, y en cuanto tiempo. */
export interface ReglaDeLimite {
  readonly maximo: number;
  readonly ventanaMs: number;
}

/**
 * Pone un limite **por cuenta** a una ruta (S-03 de la auditoria 360).
 *
 * El limite global es por direccion IP, y no basta: varias personas detras del
 * mismo enrutador comparten direccion, una sola persona abusiva con varias
 * direcciones lo esquiva, y el mismo tope sirve igual para pedir el catalogo que
 * para algo que cuesta de verdad. Las rutas que cuestan —exportar todo lo de una
 * persona, preguntarle al asistente, subir un archivo, registrar un navegador para
 * los avisos— llevan ademas un tope propio por cuenta, mas bajo que el general.
 *
 * Se lee el identificador del token **ya verificado**, no nada que mande quien
 * llama: cambiar de IP o de cabeceras no cambia de cuenta.
 */
export const LimitePorCuenta = (regla: ReglaDeLimite): MethodDecorator =>
  SetMetadata(LIMITE_POR_CUENTA, regla);

/** Lo que dice el contador despues de contar una peticion. */
export interface ResultadoDelConteo {
  readonly permitido: boolean;
  /** Cuanto falta para que se reinicie la ventana, en milisegundos. */
  readonly reinicioEnMs: number;
}

interface Ventana {
  cuenta: number;
  reinicioEn: number;
}

/**
 * Cuenta peticiones por clave en ventanas fijas.
 *
 * Vive en memoria, igual que el limite global: la API corre en una sola instancia.
 * Si algun dia son varias, cada una contaria por su lado y el tope real seria el
 * de una multiplicado por el numero de instancias; ese dia el almacen cambia por
 * uno compartido y este archivo es el unico que se toca.
 *
 * La memoria esta acotada: al llegar a `maximoDeClaves` se barren las ventanas ya
 * vencidas, y si aun asi no cabe se descartan las mas antiguas. Descartar una
 * ventana solo le regala un cupo nuevo a una cuenta, que es mucho menos grave que
 * dejar crecer el mapa sin limite.
 */
export class ContadorPorVentana {
  private readonly ventanas = new Map<string, Ventana>();

  constructor(
    private readonly ahora: () => number = () => Date.now(),
    private readonly maximoDeClaves = 10_000,
  ) {}

  contar(clave: string, regla: ReglaDeLimite): ResultadoDelConteo {
    const ahora = this.ahora();
    const vigente = this.ventanas.get(clave);

    if (vigente === undefined || vigente.reinicioEn <= ahora) {
      this.hacerSitio(ahora);
      this.ventanas.set(clave, { cuenta: 1, reinicioEn: ahora + regla.ventanaMs });

      return { permitido: regla.maximo >= 1, reinicioEnMs: regla.ventanaMs };
    }

    vigente.cuenta += 1;

    return { permitido: vigente.cuenta <= regla.maximo, reinicioEnMs: vigente.reinicioEn - ahora };
  }

  /** Cuantas ventanas hay guardadas. Solo para pruebas. */
  get tamano(): number {
    return this.ventanas.size;
  }

  private hacerSitio(ahora: number): void {
    if (this.ventanas.size < this.maximoDeClaves) {
      return;
    }

    for (const [clave, ventana] of this.ventanas) {
      if (ventana.reinicioEn <= ahora) {
        this.ventanas.delete(clave);
      }
    }

    // Si todas siguen vigentes, se descartan las mas antiguas (el mapa conserva el
    // orden en que se insertaron) hasta que quepa una mas.
    for (const clave of this.ventanas.keys()) {
      if (this.ventanas.size < this.maximoDeClaves) {
        break;
      }

      this.ventanas.delete(clave);
    }
  }
}

/**
 * Aplica `@LimitePorCuenta` a las rutas que lo llevan.
 *
 * Es un interceptor y no un guardia a proposito: los guardias corren **antes** de
 * saber quien es la persona, y los interceptores despues de todos ellos. Con esto
 * el identificador que se cuenta es el del token que ya verifico el guardia de
 * sesion, y la ruta nunca llega a ejecutarse si el tope se paso.
 *
 * Responde 429 con el mismo cuerpo que el limite general y con `Retry-After`, para
 * que el cliente sepa cuanto esperar.
 */
@Injectable()
export class InterceptorDeLimitePorCuenta implements NestInterceptor {
  // `@Optional()`: el contador no es un proveedor del contenedor, y sin la marca
  // Nest intentaria resolverlo por su tipo y fallaria al arrancar. Las pruebas si
  // lo pasan, para fijar el reloj.
  constructor(
    private readonly reflector: Reflector,
    @Optional() private readonly contador: ContadorPorVentana = new ContadorPorVentana(),
  ) {}

  intercept(contexto: ExecutionContext, siguiente: CallHandler): Observable<unknown> {
    const regla = this.reflector.get<ReglaDeLimite | undefined>(
      LIMITE_POR_CUENTA,
      contexto.getHandler(),
    );

    if (regla === undefined) {
      return siguiente.handle();
    }

    const http = contexto.switchToHttp();
    const identidad = http.getRequest<PeticionConCuenta>().identidad;

    // Sin identidad no hay cuenta a quien contar. No deberia pasar en una ruta con
    // sesion; si pasa, el tope general por IP sigue ahi.
    if (identidad === undefined) {
      return siguiente.handle();
    }

    // La ruta forma parte de la clave: gastar el cupo de exportar no gasta el de
    // preguntar al asistente.
    const clave = `${contexto.getClass().name}.${contexto.getHandler().name}:${identidad.id}`;
    const conteo = this.contador.contar(clave, regla);

    if (!conteo.permitido) {
      http
        .getResponse<Response>()
        .setHeader('Retry-After', String(Math.max(1, Math.ceil(conteo.reinicioEnMs / 1000))));

      throw new HttpException(
        {
          codigo: 'DEMASIADAS_PETICIONES',
          mensaje: 'Has hecho esto demasiadas veces seguidas. Espera un momento.',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return siguiente.handle();
  }
}
