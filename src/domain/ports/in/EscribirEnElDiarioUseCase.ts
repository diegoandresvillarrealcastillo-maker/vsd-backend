import type { EntradaDeDiario } from '../../model/EntradaDeDiario.js';

/**
 * Una anotacion recien guardada, con lo que conviene ensenar junto a ella.
 *
 * Lo devuelven escribir y editar. `sugiereAcompanamiento` se calcula en cada
 * respuesta y no se guarda: la anotacion no lleva ninguna marca de lo que se
 * detecto en ella. Y solo se calcula si la persona lo permitio (SCRUM-108); si
 * no, va en falso.
 *
 * **No lleva lineas de atencion** (SCRUM-194): el diario ofrece ayuda y no las
 * pone en la respuesta; quien las quiere las pide al asistente.
 */
export interface AnotacionGuardada {
  readonly entrada: EntradaDeDiario;
  readonly sugiereAcompanamiento: boolean;
}

export interface EscribirEnElDiarioCommand {
  readonly userId: string;
  /** La zona horaria de la persona, de su cuenta: decide cual es "hoy". */
  readonly zonaHoraria: string;
  readonly clientOperationId: string;
  /** AAAA-MM-DD. Si no viene, hoy en el calendario de la persona. */
  readonly dia?: string | undefined;
  readonly titulo?: string | undefined;
  /** El documento del editor. Su forma la comprueba el dominio. */
  readonly contenido: unknown;
  readonly adjuntos?: unknown;
  /**
   * «Carta a mi de manana» (EMO-05, SCRUM-230): la anotacion se guarda hoy, sin que su texto salga
   * en las respuestas, y la persona decide desde manana si la lee o la borra. Sin esto, es una
   * anotacion corriente.
   */
  readonly cartaAManana?: boolean | undefined;
  /**
   * La hora en que el dispositivo escribio la anotacion (ISO 8601), si la mando.
   * Importa cuando se escribio sin conexion y llega despues (SCRUM-144). Es un
   * dato sin fiar: si no sirve —mal formada, en el futuro, de hace mas de un mes,
   * anterior a su dia— se ignora y se usa la del servidor, sin error.
   */
  readonly escritaEn?: unknown;
  /**
   * Si la persona permitio que su diario se lea para recomendarle (SCRUM-108).
   * Sin ese permiso, lo escrito no pasa por ninguna deteccion.
   */
  readonly conRecomendaciones: boolean;
}

/** Puerto de entrada: escribir una anotacion en el diario propio (SCRUM-95). */
export interface EscribirEnElDiarioUseCase {
  execute(command: EscribirEnElDiarioCommand): Promise<AnotacionGuardada>;
}
