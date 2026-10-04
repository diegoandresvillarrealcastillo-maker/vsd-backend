import type { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { RecursoApoyo } from '../../domain/model/RecursoApoyo.js';
import type { AnotacionGuardada } from '../../domain/ports/in/EscribirEnElDiarioUseCase.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';

/**
 * Una anotacion con lo que conviene ensenar junto a ella.
 *
 * Si lo escrito trae una senal de riesgo, las lineas de atencion viajan en la
 * misma respuesta, ordenadas por alcance. Igual que con los resultados
 * (SCRUM-94): quien recibe la senal recibe tambien los telefonos, sin una
 * segunda peticion que podria fallar justo entonces.
 */
export async function acompanarAnotacion(
  entrada: EntradaDeDiario,
  recursos: RecursoApoyoRepositoryPort,
): Promise<AnotacionGuardada> {
  const sugiereAcompanamiento = entrada.contieneSenalDeRiesgo();

  return {
    entrada,
    sugiereAcompanamiento,
    lineasDeAtencion: sugiereAcompanamiento
      ? RecursoApoyo.ordenarPorAlcance(await recursos.lineasDeAtencion())
      : [],
  };
}
