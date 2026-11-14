import { Logger, type OnModuleDestroy } from '@nestjs/common';

/** Lo que recibe el servicio de registros: una linea ya armada por evento. */
export type LineaDeEvento = Readonly<Record<string, unknown>>;

/** Los ajustes que se pueden cambiar; los de fabrica sirven para el servicio real. */
export interface AjustesDelEnvio {
  readonly intervaloEnMs?: number;
  readonly maximoPorEnvio?: number;
  readonly maximoEnCola?: number;
  readonly esperaMaximaEnMs?: number;
  /** El nombre de la cabecera de autorizacion. Por defecto `Authorization`. */
  readonly cabecera?: string;
}

const DE_FABRICA = {
  intervaloEnMs: 5_000,
  maximoPorEnvio: 50,
  maximoEnCola: 500,
  esperaMaximaEnMs: 3_000,
  cabecera: 'Authorization',
} as const;

/** Cada cuanto, como maximo, se avisa de que el servicio no responde. */
const ENTRE_AVISOS_EN_MS = 60_000;

/**
 * Manda los eventos de seguridad a un servicio de registros por HTTP
 * (SCRUM-163, decision D8: un servicio externo con retencion de 90 dias).
 *
 * ## No se ata a ningun proveedor
 *
 * Hace una cosa que casi todos aceptan: un `POST` con un arreglo JSON y una
 * cabecera de autorizacion. Que servicio sea, y cual su direccion y su clave, lo
 * decide una persona en las variables de entorno. Si el elegido pide otra cosa,
 * el cambio es de este archivo y de nada mas.
 *
 * ## Nunca estorba
 *
 * - **No bloquea.** `encolar` solo agrega a una cola en memoria; el envio ocurre
 *   aparte, por tandas, cada pocos segundos.
 * - **No crece sin limite.** La cola tiene tope; si el servicio esta caido, se
 *   descartan los eventos mas viejos antes de dejar que la memoria suba.
 * - **No filtra al fallar.** Cuando un envio falla, el aviso dice cuantos eventos
 *   y que estado, nunca su contenido, la direccion ni la clave.
 *
 * Se descarta antes que reintentar para siempre: este envio es una copia. El
 * registro de verdad ya salio por la salida estandar, que es lo que Render
 * conserva.
 */
export class EnvioHttpDeEventos implements OnModuleDestroy {
  private readonly registro = new Logger('RegistroDeSeguridad');
  private readonly ajustes: Required<AjustesDelEnvio>;
  private readonly cola: LineaDeEvento[] = [];
  private temporizador: NodeJS.Timeout | undefined;
  private enCurso: Promise<void> | undefined;
  private ultimoAviso = Number.NEGATIVE_INFINITY;
  private descartados = 0;
  private enFallo = false;

  /**
   * @param url La direccion del servicio. Puede llevar un secreto en la ruta, asi
   *   que no se escribe en ningun registro.
   * @param token El valor completo de la cabecera de autorizacion, tal como lo
   *   pide el servicio (por ejemplo `Bearer abc123`).
   */
  constructor(
    private readonly url: string,
    private readonly token: string | undefined,
    ajustes: AjustesDelEnvio = {},
    private readonly peticion: typeof fetch = (...argumentos) => fetch(...argumentos),
    private readonly reloj: () => number = () => Date.now(),
  ) {
    this.ajustes = {
      intervaloEnMs: ajustes.intervaloEnMs ?? DE_FABRICA.intervaloEnMs,
      maximoPorEnvio: ajustes.maximoPorEnvio ?? DE_FABRICA.maximoPorEnvio,
      maximoEnCola: ajustes.maximoEnCola ?? DE_FABRICA.maximoEnCola,
      esperaMaximaEnMs: ajustes.esperaMaximaEnMs ?? DE_FABRICA.esperaMaximaEnMs,
      cabecera: ajustes.cabecera ?? DE_FABRICA.cabecera,
    };
  }

  /** Empieza a enviar por tandas. No mantiene vivo el proceso. */
  iniciar(): void {
    if (this.temporizador !== undefined) {
      return;
    }

    this.temporizador = setInterval(() => void this.vaciar(), this.ajustes.intervaloEnMs);
    this.temporizador.unref();
  }

  encolar(linea: LineaDeEvento): void {
    this.cola.push(linea);
    this.recortar();

    // Con el servicio caido no se insiste en cada evento: el temporizador
    // reintenta por su cuenta, y martillar un servicio que ya no responde solo
    // gasta conexiones.
    if (!this.enFallo && this.cola.length >= this.ajustes.maximoPorEnvio) {
      void this.vaciar();
    }
  }

  /** Cuantos eventos esperan salir. */
  get pendientes(): number {
    return this.cola.length;
  }

  /** Cuantos eventos se perdieron por tener la cola llena. */
  get perdidos(): number {
    return this.descartados;
  }

  /**
   * Envia una tanda. Si ya hay un envio en curso devuelve ese mismo, para no
   * mandar dos veces los mismos eventos.
   */
  vaciar(): Promise<void> {
    if (this.enCurso !== undefined) {
      return this.enCurso;
    }

    if (this.cola.length === 0) {
      return Promise.resolve();
    }

    const envio = this.enviarUnaTanda().finally(() => {
      this.enCurso = undefined;
    });

    this.enCurso = envio;

    return envio;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.temporizador !== undefined) {
      clearInterval(this.temporizador);
      this.temporizador = undefined;
    }

    // Una ultima tanda al cerrar, para no perder lo ultimo de un despliegue.
    await this.vaciar();
  }

  private async enviarUnaTanda(): Promise<void> {
    const tanda = this.cola.splice(0, this.ajustes.maximoPorEnvio);
    const cabeceras: Record<string, string> = { 'Content-Type': 'application/json' };

    if (this.token !== undefined && this.token !== '') {
      cabeceras[this.ajustes.cabecera] = this.token;
    }

    try {
      const respuesta = await this.peticion(this.url, {
        method: 'POST',
        headers: cabeceras,
        body: JSON.stringify(tanda),
        // No se sigue una redireccion: llevaria la clave a otro sitio.
        redirect: 'error',
        signal: AbortSignal.timeout(this.ajustes.esperaMaximaEnMs),
      });

      if (respuesta.ok) {
        this.enFallo = false;
      } else {
        this.devolver(tanda, `estado ${respuesta.status}`);
      }
    } catch {
      // El motivo exacto puede traer la direccion (con su secreto) dentro del
      // mensaje, asi que no se copia: basta saber que no hubo respuesta.
      this.devolver(tanda, 'sin respuesta');
    }
  }

  /** Devuelve la tanda a la cola para el siguiente intento, sin pasar del tope. */
  private devolver(tanda: LineaDeEvento[], motivo: string): void {
    this.enFallo = true;
    this.cola.unshift(...tanda);
    this.recortar();

    const ahora = this.reloj();

    if (ahora - this.ultimoAviso >= ENTRE_AVISOS_EN_MS) {
      this.ultimoAviso = ahora;
      this.registro.warn(
        `No se pudo enviar el registro de seguridad (${motivo}). ` +
          `En espera: ${this.cola.length}. Perdidos hasta ahora: ${this.descartados}.`,
      );
    }
  }

  /** Quita los mas viejos si la cola pasa del tope. */
  private recortar(): void {
    const sobra = this.cola.length - this.ajustes.maximoEnCola;

    if (sobra > 0) {
      this.cola.splice(0, sobra);
      this.descartados += sobra;
    }
  }
}
