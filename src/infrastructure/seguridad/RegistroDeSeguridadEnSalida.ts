import type { OnModuleDestroy } from '@nestjs/common';
import { CAMPOS_POR_TIPO, type EventoDeSeguridad } from '../../domain/model/EventoDeSeguridad.js';
import type { RegistroDeSeguridadPort } from '../../domain/ports/out/RegistroDeSeguridadPort.js';
import type { LineaDeEvento } from './EnvioHttpDeEventos.js';

/** Lo mas que se escribe de un texto: un UUID cabe de sobra, un parrafo no. */
const MAXIMO_DE_UN_TEXTO = 100;

export interface OpcionesDelRegistro {
  /** El ambiente (`preproduction`...), para poder filtrar al leer el registro. */
  readonly ambiente: string;
  /** Convierte la IP en la huella que se escribe. Ver `crearHuellaDeIp`. */
  readonly huellaDeIp: (ip: string) => string;
  /** Donde sale cada linea. Por defecto, la salida estandar. */
  readonly escribir?: (linea: string) => void;
  readonly reloj?: () => Date;
  /** Una copia por HTTP a un servicio de registros, si una persona lo configuro. */
  readonly copiarA?: {
    encolar(linea: LineaDeEvento): void;
    /** Se llama al cerrar la aplicacion, para no perder lo ultimo. */
    onModuleDestroy?(): Promise<void>;
  };
}

function aLaSalidaEstandar(linea: string): void {
  process.stdout.write(`${linea}\n`);
}

/**
 * Escribe cada hecho de seguridad como **una linea JSON** en la salida estandar
 * (SCRUM-163).
 *
 * Render recoge esa salida y puede reenviarla a un servicio externo con sus
 * flujos de registros; es el camino principal. Si ademas se configura un envio
 * por HTTP (`copiarA`), cada linea se manda tambien alli.
 *
 * ## Lo que hace antes de escribir
 *
 * - **Solo los campos del catalogo.** Para cada tipo se copian los campos que
 *   `CAMPOS_POR_TIPO` declara y nada mas: un objeto con propiedades de sobra no
 *   las filtra.
 * - **Solo texto corto o booleanos.** Un valor de otro tipo se descarta.
 * - **La IP no sale.** Se escribe su huella (HMAC), no la direccion.
 * - **Nunca lanza.** Si algo falla se pierde ese evento, no la peticion.
 *
 * La linea lleva `canal: "seguridad"` para separarla de los registros de
 * peticiones en el servicio donde se lea.
 */
export class RegistroDeSeguridadEnSalida implements RegistroDeSeguridadPort, OnModuleDestroy {
  private readonly escribir: (linea: string) => void;
  private readonly reloj: () => Date;

  constructor(private readonly opciones: OpcionesDelRegistro) {
    this.escribir = opciones.escribir ?? aLaSalidaEstandar;
    this.reloj = opciones.reloj ?? (() => new Date());
  }

  /** Al cerrar la aplicacion, la copia por HTTP manda lo que le quede. */
  async onModuleDestroy(): Promise<void> {
    await this.opciones.copiarA?.onModuleDestroy?.();
  }

  registrar(evento: EventoDeSeguridad): void {
    try {
      const linea = this.armar(evento);

      if (linea === undefined) {
        return;
      }

      this.escribir(JSON.stringify(linea));
      this.opciones.copiarA?.encolar(linea);
    } catch {
      // Contrato del puerto: anotar un hecho nunca rompe lo que se estaba haciendo.
    }
  }

  private armar(evento: EventoDeSeguridad): LineaDeEvento | undefined {
    const campos = CAMPOS_POR_TIPO[evento.tipo] as readonly string[] | undefined;

    if (campos === undefined) {
      // Un tipo que el catalogo no conoce no se escribe.
      return undefined;
    }

    const origen = evento as unknown as Readonly<Record<string, unknown>>;
    const linea: Record<string, unknown> = {
      canal: 'seguridad',
      version: 1,
      en: this.reloj().toISOString(),
      ambiente: this.opciones.ambiente,
      tipo: evento.tipo,
    };

    for (const campo of campos) {
      const valor = origen[campo];

      if (typeof valor === 'boolean') {
        linea[campo] = valor;
      } else if (typeof valor === 'string') {
        linea[campo] = valor.slice(0, MAXIMO_DE_UN_TEXTO);
      }
    }

    if (typeof origen['idPeticion'] === 'string') {
      linea['idPeticion'] = origen['idPeticion'].slice(0, MAXIMO_DE_UN_TEXTO);
    }

    if (typeof origen['ip'] === 'string' && origen['ip'] !== '') {
      linea['huellaDeIp'] = this.opciones.huellaDeIp(origen['ip']);
    }

    return linea;
  }
}

/** No escribe nada. Para pruebas y para los lugares que construyen un guardia sin registro. */
export class RegistroDeSeguridadNulo implements RegistroDeSeguridadPort {
  registrar(): void {
    // A proposito.
  }
}
