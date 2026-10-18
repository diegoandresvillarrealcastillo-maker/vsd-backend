import { CALCULO } from './contratos/calculo.js';
import { CLASIFICAR } from './contratos/clasificar.js';
import { CUESTIONARIO_CORTO } from './contratos/cuestionarioCorto.js';
import { ESCRITURA_BREVE } from './contratos/escrituraBreve.js';
import { GUIA_PASO_A_PASO } from './contratos/guiaPasoAPaso.js';
import { PALABRAS } from './contratos/palabras.js';
import type { Problema, Validador } from './contratos/piezas.js';
import { SECUENCIA } from './contratos/secuencia.js';
import { TOCAR_EL_OBJETIVO } from './contratos/tocarElObjetivo.js';
import { VER_OCULTAR_RECORDAR } from './contratos/verOcultarRecordar.js';
import { Motor } from './Motor.js';

/**
 * La forma de `parametros` de cada motor: el contrato entre el servidor y el componente que pinta
 * la sesion (ADR 0030, PLAN-FASE-0-Y-PILOTO §4, SCRUM-206 y SCRUM-220).
 *
 * La base de datos no mira dentro de `parametros` (es JSONB). Sin este contrato, una sesion mal
 * escrita (un cuestionario con una sola opcion, una respiracion con una pausa de diez segundos)
 * llegaria al telefono y romperia la pantalla de quien la abre. Se comprueba al cargar la sesion y
 * al sembrarla, con la misma funcion.
 *
 * Reglas que valen para todos los motores (las piezas estan en `contratos/piezas.ts`):
 *
 * - **Solo se admiten los parametros del contrato.** Una clave escrita mal (`rondaz`) se rechaza en
 *   lugar de ignorarse en silencio: el componente usaria su valor por omision y nadie se enteraria.
 * - Los textos que lee la persona no van vacios y tienen un largo maximo.
 * - Se informa **del primer problema**, con la ruta del campo (`opciones[3].valor`), sin punto final:
 *   el error de dominio arma la frase.
 * - Un motor que sirve a varias mecanicas tiene un contrato **por `modo`**. Las sesiones sembradas antes de
 *   que existieran los modos no traen `modo` y siguen siendo validas (`porModo`).
 *
 * Los nueve motores tienen contrato desde SCRUM-220. Una actividad sin motor (las cuatro pantallas propias
 * de antes de la Fase 0) tampoco se valida.
 *
 * Lo que NO se comprueba aqui: el filtro de lenguaje clinico (R6) y la lista de exclusion (R14).
 * Son pruebas automaticas sobre el contenido que se siembra, y se ejecutan con ese contenido.
 */
export type ParametrosDeMotor = Readonly<Record<string, unknown>>;

const CONTRATOS: ReadonlyMap<Motor, Validador> = new Map<Motor, Validador>([
  [Motor.SECUENCIA, SECUENCIA],
  [Motor.TOCAR_EL_OBJETIVO, TOCAR_EL_OBJETIVO],
  [Motor.VER_OCULTAR_RECORDAR, VER_OCULTAR_RECORDAR],
  [Motor.CLASIFICAR, CLASIFICAR],
  [Motor.PALABRAS, PALABRAS],
  [Motor.CALCULO, CALCULO],
  [Motor.GUIA_PASO_A_PASO, GUIA_PASO_A_PASO],
  [Motor.CUESTIONARIO_CORTO, CUESTIONARIO_CORTO],
  [Motor.ESCRITURA_BREVE, ESCRITURA_BREVE],
]);

/** Los motores cuyo contrato ya esta fijado: los nueve. */
export const MOTORES_CON_CONTRATO: readonly Motor[] = [...CONTRATOS.keys()];

/**
 * El primer problema de `parametros` para `motor`, o `undefined` si estan bien formados.
 *
 * `motor` es `null` para una actividad que no tiene (las cuatro pantallas propias): sin contrato,
 * cualquier objeto vale.
 */
export function problemaDeLosParametros(
  motor: Motor | null,
  parametros: ParametrosDeMotor,
): Problema {
  if (motor === null) {
    return undefined;
  }

  return CONTRATOS.get(motor)?.(parametros, '');
}
