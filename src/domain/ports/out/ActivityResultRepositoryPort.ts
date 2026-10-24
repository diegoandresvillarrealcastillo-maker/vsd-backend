import type { ActivityResult } from '../../model/ActivityResult.js';
import type { Dia } from '../../model/Calendario.js';
import type { FilaDelHistorial, PuntoDeLaPagina } from '../../model/HistorialDelModulo.js';
import type { ActivityId, ClientOperationId, UserId } from '../../model/Identifier.js';

/**
 * Puerto de salida: lo que el dominio necesita del mundo para poder cumplir
 * sus reglas.
 *
 * Es una interfaz, no una implementacion. El dominio declara que necesita
 * guardar y recuperar resultados, y no le importa si al otro lado hay
 * PostgreSQL, memoria o un archivo. Quien lo implementa vive en
 * infrastructure/repositories/.
 *
 * Esta inversion es lo que permite probar la logica sin levantar una base de
 * datos, y cambiar de proveedor de persistencia tocando un adaptador en lugar
 * del nucleo del sistema.
 */
export interface ActivityResultRepositoryPort {
  /**
   * Busca, **entre los resultados de esa persona**, el asociado a un
   * identificador de operacion del cliente.
   *
   * Es la consulta que sostiene la idempotencia de la sincronizacion: antes
   * de crear un resultado hay que saber si esa misma operacion ya se
   * registro. Devuelve `null` si no existe.
   *
   * El identificador de la persona forma parte de la pregunta, no es un
   * filtro que se anade despues. Una firma que no lo pidiera dejaria a cada
   * implementacion la decision de acordarse de filtrar, y esa es exactamente
   * la clase de olvido que termina mostrando datos ajenos. Aqui no hay nada
   * que olvidar: sin persona no se puede ni llamar al metodo.
   */
  findByClientOperationId(
    clientOperationId: ClientOperationId,
    userId: UserId,
  ): Promise<ActivityResult | null>;

  /** Guarda un resultado nuevo. */
  save(result: ActivityResult): Promise<void>;

  /**
   * Los resultados de esa persona desde una fecha, del mas reciente al mas
   * antiguo.
   *
   * Es lo que permite al asistente decir algo cierto en lugar de algo bonito.
   * "Llevas tres semanas registrando tu descanso" sale de contar filas; si
   * saliera de otro sitio seria una frase amable e inventada, y a la tercera
   * vez que no cuadre con lo que la persona recuerda, deja de creerse el resto.
   */
  ultimosDe(userId: UserId, desde: Date): Promise<readonly ActivityResult[]>;

  /**
   * Si esa persona hizo alguna actividad desde una fecha.
   *
   * Es lo unico que necesitan los recordatorios de la racha y de la noche:
   * saber si hoy hubo algo, no que fue. Con `ultimosDe` se traian y se
   * reconstruian todas las filas del dia, y se consultaba el catalogo por cada
   * actividad distinta, para despues mirar solo si la lista estaba vacia. Aqui
   * basta una fila.
   */
  hayActividadDesde(userId: UserId, desde: Date): Promise<boolean>;

  /**
   * Los dias del calendario local en que esa persona hizo algo, sin repetir y del mas
   * antiguo al mas reciente (SCRUM-186).
   *
   * Es lo unico que necesita la racha: `resultado.dia`, el dia que quedo fijado al
   * registrar el resultado, en la zona que la persona tenia entonces (SCRUM-123). Con
   * `ultimosDe` se traian y reconstruian todas las filas, y se consultaba el catalogo
   * por cada actividad, para despues quedarse solo con un dia por fila.
   */
  diasConActividad(userId: UserId): Promise<readonly Dia[]>;

  /**
   * Los dias del calendario local en que esa persona tuvo al menos un resultado que requiere
   * atencion, sin repetir y del mas antiguo al mas reciente (SCRUM-177).
   *
   * Es lo unico que necesita el acompanamiento por dias seguidos: **que dias**, no el puntaje ni
   * que actividad fue. Solo cuenta lo que puntua: una actividad de registro no produce nivel.
   * Usa `resultado.dia`, el dia fijado al registrar el resultado (SCRUM-123).
   */
  diasConAtencion(userId: UserId): Promise<readonly Dia[]>;

  /**
   * Una pagina de lo que esa persona hizo en un conjunto de actividades, del mas reciente al
   * mas antiguo (SCRUM-184). Es el historial de un modulo.
   *
   * Devuelve **filas ligeras** (identificador, actividad, dia y hora) y no entidades: el
   * historial no necesita el puntaje ni lo escrito, y asi ni se leen ni salen de la base.
   *
   * La pagina es **por cursor**: `despuesDe` es el ultimo hecho de la anterior, y esta
   * empieza justo despues en el orden (hora y, a igual hora, identificador). Con numero de
   * pagina, un hecho nuevo mientras se lee repetiria o saltaria una fila.
   *
   * Sin actividades, lista vacia. Solo trae lo de esa persona: como en los demas metodos, el
   * identificador es parte de la pregunta.
   */
  historialDe(
    userId: UserId,
    actividades: readonly ActivityId[],
    pagina: { readonly limite: number; readonly despuesDe?: PuntoDeLaPagina | undefined },
  ): Promise<readonly FilaDelHistorial[]>;
}
