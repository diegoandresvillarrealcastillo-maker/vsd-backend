export interface BorrarAnotacionCommand {
  readonly userId: string;
  readonly entradaId: string;
}

/**
 * Puerto de entrada: borrar una anotacion propia del diario, a cualquier hora y la haya leido o
 * no (SCRUM-230). Borrar algo que ya no esta, o que es de otra persona, no es un error y no cambia
 * nada: asi se puede reintentar, tambien desde la cola sin conexion.
 */
export interface BorrarAnotacionUseCase {
  execute(command: BorrarAnotacionCommand): Promise<void>;
}
