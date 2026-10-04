import type { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { RecursoApoyo } from '../../domain/model/RecursoApoyo.js';
import type { AnotacionGuardada } from '../../domain/ports/in/EscribirEnElDiarioUseCase.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';

/**
 * Una anotacion con lo que conviene ensenar junto a ella.
 *
 * ## Solo con permiso (SCRUM-108)
 *
 * Nadie se mete en lo que alguien escribe en su diario. Si la persona no lo
 * permitio en su perfil, lo escrito **no se lee**: no se busca ninguna senal y
 * la respuesta va sin sugerencia y sin lineas. Se guarda y se devuelve, nada
 * mas.
 *
 * Con el permiso dado, si lo escrito trae una senal de riesgo, las lineas de
 * atencion viajan en la misma respuesta, ordenadas por alcance, como con los
 * resultados (SCRUM-94).
 */
export async function acompanarAnotacion(
  entrada: EntradaDeDiario,
  recursos: RecursoApoyoRepositoryPort,
  conRecomendaciones: boolean,
): Promise<AnotacionGuardada> {
  if (!conRecomendaciones) {
    return { entrada, sugiereAcompanamiento: false, lineasDeAtencion: [] };
  }

  const sugiereAcompanamiento = entrada.contieneSenalDeRiesgo();

  return {
    entrada,
    sugiereAcompanamiento,
    lineasDeAtencion: sugiereAcompanamiento
      ? RecursoApoyo.ordenarPorAlcance(await recursos.lineasDeAtencion())
      : [],
  };
}
