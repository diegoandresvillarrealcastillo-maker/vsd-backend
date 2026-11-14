/**
 * Lo que dejo una vuelta de la tarea que termina las bajas de cuenta, para medirla. Son solo
 * cuentas: ni de quien, ni nada de lo suyo.
 */
export interface ResumenDeLasBajas {
  /** Bajas que la vuelta tomo: pedidas hace un rato y sin terminar. */
  readonly tomadas: number;
  /** Las que se terminaron. */
  readonly terminadas: number;
  /** Las que fallaron: siguen marcadas y se vuelven a intentar en la proxima vuelta. */
  readonly fallos: number;
}

/**
 * Puerto de entrada: terminar las bajas de cuenta que se cortaron a mitad (SCRUM-267, ADR 0040).
 *
 * Lo llama la tarea periodica del API. No hay ninguna ruta HTTP que lo exponga.
 */
export interface TerminarBajasPendientesUseCase {
  /** Toma las bajas pedidas antes de `ahora` menos la espera, las mas antiguas primero, y las termina. */
  terminar(ahora: Date): Promise<ResumenDeLasBajas>;
}
