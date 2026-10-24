import { Calendario, type Dia } from './Calendario.js';
import type { Adjunto, DocumentoDelDiario } from './DocumentoDelDiario.js';
import {
  EditWindowClosedError,
  FutureJournalDayError,
  InvalidJournalEntryError,
  StaleJournalEntryError,
} from './DomainError.js';
import type { ClientOperationId, EntradaId, UserId } from './Identifier.js';
import { hayRiesgo, textosDe } from './SenalesDeRiesgo.js';

/**
 * Cuanto dura la posibilidad de corregir una anotacion.
 *
 * La misma cifra esta en la politica de la base (migracion
 * 20261003180000_diario_por_dia), que es quien la hace cumplir de verdad. Esta
 * sirve para responder con un error claro sin llegar a intentarlo, y para
 * decirle al cliente hasta cuando puede editar.
 */
export const MINUTOS_PARA_EDITAR = 60;

/** Coincide con la columna `titulo`, VARCHAR(120). */
export const LARGO_MAXIMO_DEL_TITULO = 120;

/**
 * Cuantos dias espera una carta sin abrir antes de volver al diario como cualquier anotacion
 * (SCRUM-230). Pasada la semana nadie la persigue: ni tarjeta ni texto oculto.
 */
export const DIAS_DE_ESPERA_DE_LA_CARTA = 7;

export interface DatosDeEntrada {
  readonly id: EntradaId;
  readonly userId: UserId;
  readonly clientOperationId: ClientOperationId;
  readonly dia: Dia;
  readonly titulo?: string | undefined;
  readonly documento: DocumentoDelDiario;
  readonly adjuntos?: readonly Adjunto[] | undefined;
  /** «Carta a mi de manana» (EMO-05): se guarda hoy y se lee, si la persona quiere, desde manana. */
  readonly cartaAManana?: boolean | undefined;
  /** Cuando la persona la abrio para leerla. Sin esto, la carta sigue esperando. */
  readonly cartaAbiertaEn?: Date | undefined;
  readonly version: number;
  readonly creadaEn: Date;
  readonly editadaEn: Date;
}

/**
 * Lo que cambia una edicion. Lo que no viene se queda como estaba, y un
 * titulo `null` quita el que hubiera.
 */
export interface CambiosDeEntrada {
  readonly titulo?: string | null | undefined;
  readonly documento?: DocumentoDelDiario | undefined;
  readonly adjuntos?: readonly Adjunto[] | undefined;
}

function tituloLimpio(titulo: string | null | undefined): string | undefined {
  const limpio = titulo?.trim();

  if (limpio === undefined || limpio === '') {
    return undefined;
  }

  if ([...limpio].length > LARGO_MAXIMO_DEL_TITULO) {
    throw new InvalidJournalEntryError(
      `el título admite como mucho ${LARGO_MAXIMO_DEL_TITULO} caracteres`,
    );
  }

  return limpio;
}

/**
 * Una anotacion del diario (SCRUM-95).
 *
 * El diario es un registro por dia hecho de anotaciones. Cada anotacion es una
 * fila y tiene su hora: escribir algo mas tarde el mismo dia no reescribe lo
 * de la manana, se anade debajo.
 *
 * ## La hora para editar
 *
 * Durante la primera hora se puede corregir: una errata, una frase que quedo
 * a medias. Despues la anotacion queda como se escribio, y lo que se quiera
 * anadir va en una nueva. Es la regla del ADR 0009 llevada al diario: nada de
 * lo escrito se pierde por una edicion.
 *
 * Que la regla viva aqui no la hace cumplir: la hace cumplir la base. Aqui
 * sirve para contestar antes y con claridad.
 *
 * ## El dia
 *
 * El de la persona, en su zona horaria, no el de UTC. Se puede escribir en un
 * dia pasado, y la anotacion conserva igual la hora real en que se escribio.
 * En un dia que todavia no llego, no.
 */
export class EntradaDeDiario {
  readonly id: EntradaId;
  readonly userId: UserId;
  readonly clientOperationId: ClientOperationId;
  readonly dia: Dia;
  readonly titulo: string | undefined;
  readonly documento: DocumentoDelDiario;
  readonly adjuntos: readonly Adjunto[];
  readonly cartaAManana: boolean;
  readonly cartaAbiertaEn: Date | undefined;
  readonly version: number;
  readonly creadaEn: Date;
  readonly editadaEn: Date;

  private constructor(datos: DatosDeEntrada) {
    this.id = datos.id;
    this.userId = datos.userId;
    this.clientOperationId = datos.clientOperationId;
    this.dia = datos.dia;
    this.titulo = datos.titulo;
    this.documento = datos.documento;
    this.adjuntos = datos.adjuntos ?? [];
    this.cartaAManana = datos.cartaAManana ?? false;
    this.cartaAbiertaEn =
      datos.cartaAbiertaEn === undefined ? undefined : new Date(datos.cartaAbiertaEn.getTime());
    this.version = datos.version;
    this.creadaEn = new Date(datos.creadaEn.getTime());
    this.editadaEn = new Date(datos.editadaEn.getTime());
  }

  /**
   * Una anotacion recien escrita.
   *
   * `ultimoDiaAdmitido` es el dia mas tardio que se acepta, en el calendario
   * de la persona: hoy, o el siguiente si el reloj del dispositivo, adelantado
   * dentro de la tolerancia, ya paso la medianoche (ver ToleranciaDelReloj).
   * Lo pasa quien llama, para que la regla del dia futuro se pueda probar sin
   * depender de cuando se ejecuten las pruebas.
   */
  static nueva(
    datos: Omit<DatosDeEntrada, 'version' | 'creadaEn' | 'editadaEn' | 'cartaAbiertaEn'>,
    ultimoDiaAdmitido: Dia,
    ahora: Date,
  ): EntradaDeDiario {
    if (!Calendario.esDia(datos.dia)) {
      throw new InvalidJournalEntryError(
        'el día tiene que ser una fecha real con formato AAAA-MM-DD',
      );
    }

    // Las dos fechas son AAAA-MM-DD, asi que compararlas como texto es
    // compararlas como fechas.
    if (datos.dia > ultimoDiaAdmitido) {
      throw new FutureJournalDayError(datos.dia);
    }

    const entrada = new EntradaDeDiario({
      ...datos,
      titulo: tituloLimpio(datos.titulo),
      version: 1,
      creadaEn: ahora,
      editadaEn: ahora,
    });

    entrada.comprobarQueNoEstaVacia();

    return entrada;
  }

  /**
   * Una anotacion que ya estaba guardada. No vuelve a comprobar el dia: lo
   * que paso la validacion al escribirse no deja de leerse porque cambien las
   * reglas.
   */
  static guardada(datos: DatosDeEntrada): EntradaDeDiario {
    return new EntradaDeDiario(datos);
  }

  /**
   * Hasta cuando se puede corregir, contado desde que se escribio. Esa hora es la
   * que dijo el dispositivo, acotada (ver `horaDelDispositivo`): lo escrito sin
   * conexion a las 9:00 se puede corregir hasta las 10:00 aunque se reciba a las
   * 14:00.
   */
  editableHasta(): Date {
    return new Date(this.creadaEn.getTime() + MINUTOS_PARA_EDITAR * 60_000);
  }

  sePuedeEditar(ahora: Date): boolean {
    return ahora.getTime() < this.editableHasta().getTime();
  }

  /**
   * La anotacion con una correccion.
   *
   * `versionLeida` es la que tenia quien edita cuando la abrio. Si no coincide
   * con esta, alguien la cambio entretanto desde otro dispositivo, y en lugar
   * de pisar esa version se rechaza: lo que se traia se guarda como anotacion
   * nueva (ADR 0009).
   *
   * Primero se mira la hora y despues la version: fuera de plazo da igual que
   * version se tuviera, y el mensaje que sirve es el del plazo.
   *
   * `ahora` es la hora de la edicion: la del dispositivo si la edicion se hizo sin
   * conexion y llega despues (SCRUM-144), ya acotada por quien llama. El plazo se
   * cuenta contra ella y no contra cuando se recibe.
   */
  editar(cambios: CambiosDeEntrada, versionLeida: number, ahora: Date): EntradaDeDiario {
    if (!this.sePuedeEditar(ahora)) {
      throw new EditWindowClosedError();
    }

    if (versionLeida !== this.version) {
      throw new StaleJournalEntryError();
    }

    if (
      cambios.titulo === undefined &&
      cambios.documento === undefined &&
      cambios.adjuntos === undefined
    ) {
      throw new InvalidJournalEntryError('la edición no trae nada que cambiar');
    }

    const editada = new EntradaDeDiario({
      ...this,
      titulo: cambios.titulo === undefined ? this.titulo : tituloLimpio(cambios.titulo),
      documento: cambios.documento ?? this.documento,
      adjuntos: cambios.adjuntos ?? this.adjuntos,
      version: this.version + 1,
      // Nunca antes de la ultima edicion: dos dispositivos con el reloj distinto
      // no hacen que la historia vaya hacia atras.
      editadaEn: new Date(Math.max(ahora.getTime(), this.editadaEn.getTime())),
    });

    editada.comprobarQueNoEstaVacia();

    return editada;
  }

  perteneceA(userId: UserId): boolean {
    return this.userId.equals(userId);
  }

  /**
   * Una carta que todavia espera: sin abrir y dentro de su semana. Mientras espera, **su texto no
   * sale por ninguna respuesta de la API** salvo la de abrirla: lo escrito en un mal dia lo lee quien
   * despierta manana, y solo si quiere (SCRUM-230).
   *
   * `hoy` es el dia de la persona. Una carta de un dia que aun no llega tambien espera.
   */
  estaSellada(hoy: Dia): boolean {
    return (
      this.cartaAManana &&
      this.cartaAbiertaEn === undefined &&
      Calendario.diasEntre(this.dia, hoy) <= DIAS_DE_ESPERA_DE_LA_CARTA
    );
  }

  /** Una carta se puede abrir desde el dia siguiente al que se escribio, nunca el mismo dia. */
  sePuedeAbrir(hoy: Dia): boolean {
    return this.cartaAManana && Calendario.diasEntre(this.dia, hoy) >= 1;
  }

  /** La misma carta, ya abierta en `cuando`. Abrirla no cambia su texto ni su version. */
  abierta(cuando: Date): EntradaDeDiario {
    if (!this.cartaAManana) {
      throw new InvalidJournalEntryError('solo una carta se puede abrir');
    }

    return new EntradaDeDiario({ ...this, cartaAbiertaEn: cuando });
  }

  /**
   * Si lo escrito trae una senal de riesgo.
   *
   * Pasa por la misma lista que el asistente: el titulo, el texto del
   * documento y el texto de los diagramas. El resultado se devuelve y no se
   * guarda: la anotacion no lleva ninguna marca de lo que se detecto.
   */
  contieneSenalDeRiesgo(): boolean {
    return [
      this.titulo ?? '',
      this.documento.textoPlano(),
      ...this.adjuntos.flatMap((adjunto) => textosDe(adjunto.datos)),
    ].some(hayRiesgo);
  }

  private comprobarQueNoEstaVacia(): void {
    if (this.documento.estaVacio() && this.adjuntos.length === 0) {
      throw new InvalidJournalEntryError('la anotación está vacía');
    }
  }
}
