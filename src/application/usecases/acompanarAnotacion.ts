import type { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import type { AnotacionGuardada } from '../../domain/ports/in/EscribirEnElDiarioUseCase.js';

/**
 * Una anotacion con lo que conviene ensenar junto a ella.
 *
 * ## Solo con permiso (SCRUM-108)
 *
 * Nadie se mete en lo que alguien escribe en su diario. Si la persona no lo
 * permitio en su perfil, lo escrito **no se lee**: no se busca ninguna senal y
 * la respuesta va sin sugerencia. Se guarda y se devuelve, nada mas.
 *
 * ## Sin lineas de atencion (SCRUM-194)
 *
 * Con el permiso dado, si lo escrito trae una senal de riesgo, la respuesta lo
 * **indica** y nada mas: no manda ninguna linea de atencion. Quien escribe en
 * su diario no pidio un telefono, y recibirlo pegado a lo que acaba de contar
 * se siente como una alarma. El dispositivo ofrece, con su mascota, ir a
 * Recursos, donde las lineas del pais de la persona viven; esa decision, y que
 * el texto sea calido, es de la pantalla.
 */
export function acompanarAnotacion(
  entrada: EntradaDeDiario,
  conRecomendaciones: boolean,
): AnotacionGuardada {
  if (!conRecomendaciones) {
    return { entrada, sugiereAcompanamiento: false };
  }

  return { entrada, sugiereAcompanamiento: entrada.contieneSenalDeRiesgo() };
}
