# ADR 0034: Acompañamiento por días seguidos con atención: moderado a los 3 y crítico a los 7

- **Estado:** propuesta (SCRUM-177, `[C7-08]`). **El ticket pide la decisión de Diego antes de
  escribir código**: esto es una propuesta completa para que la revise, no una decisión tomada. No
  debe fusionarse sin sus respuestas a las cinco preguntas de abajo.
- **Fecha:** 2026-10-23
- **Se relaciona con:** ADR 0029 (el apoyo de una actividad sale con un patrón de la semana), ADR 0028
  (el diario no manda líneas de atención) y ADR 0024 (la racha como función de los resultados).
- **Infiere algo sobre la persona a partir de sus resultados:** por eso va con un ADR y no se activa
  a ciegas.

## Contexto

El patrón de la semana (ADR 0029, «4 de 7») decide si el **resultado** de una actividad lleva texto
de apoyo. No hay nada que mire lo que viene pasando **día tras día** y se lo ofrezca a la persona
más allá de una actividad. SCRUM-177 propone dos niveles:

- **Moderado, a los 3 días con un indicador alto:** un aviso discreto, «¿Quieres hablarlo con un
  profesional?», que se puede cerrar.
- **Crítico, 1 semana continua:** un aviso persistente con las líneas de atención a la vista. Se
  recomienda un banner y no un modal que atrape a la persona.

Hoy el cliente no cuenta nada por su cuenta: lo que depende de los días lo calcula el servidor en la
hora de la persona. El contenido del diario no se evalúa salvo permiso (SCRUM-108). La aplicación no
diagnostica.

## Decisión (propuesta)

1. **Un «indicador alto» es un día con al menos un resultado que requiere atención**
   (`nivelOrientativo = requiere_atencion`). Es la misma definición de «día con atención» del ADR 0029. Hoy `sugiereAcompanamiento` es exactamente ese nivel, así que las dos lecturas que el ticket
   dudaba («solo `requiere_atencion` o también `sugiereAcompanamiento`») **dan el mismo resultado**;
   si algún día `sugiereAcompanamiento` incluye otra cosa, habrá que decidir de nuevo.
2. **«Continuo» son días del calendario seguidos, cada uno con atención.** Un día sin atención rompe
   la cadena, y **también un día sin ningún dato**. **Hoy no rompe nada hasta que termina**, igual que
   la racha: sin nada hoy, la cadena de ayer sigue en pie. Lo posterior a hoy se ignora.
3. **3 días seguidos: `moderado`. 7 seguidos: `critico`.** Las dos constantes, `DIAS_PARA_ACOMPANAR`
   y `DIAS_PARA_LAS_LINEAS`, tienen su prueba.
4. **Es una función de los resultados, no hay nada guardado** (`AcompanamientoPorRiesgo.ts`, como
   `Racha.ts` y `PatronDeLaSemana.ts`): sin contador que se desincronice ni migración. Los días son
   `resultado.dia`, fijados al registrar (SCRUM-123): viajar no mueve los de antes. «Hoy» sale del
   calendario de la zona de la persona.
5. **Un endpoint, `GET /api/acompanamiento`**, para quien firma el token. Responde
   `{ nivel, lineasDeAtencion }` y **nada más**: ni puntaje, ni cuántos días van, ni cuáles. Nunca
   se guarda en caché (`Cache-Control: no-store`: es sobre la persona). Las líneas son las **de su
   país** (SCRUM-124, ordenadas por alcance) y solo vienen con el nivel crítico; en una zona sin
   líneas verificadas viene el directorio, nunca el número de otro país.
6. **No sale por notificación** ni por ningún otro canal que no sea la propia aplicación abierta.

## Las cinco preguntas para Diego

1. **¿Qué es un indicador alto?** Se propone solo `requiere_atencion` (punto 1). ¿Se quiere algo más
   fino, por ejemplo solo las actividades de «mayor requiere atención» (emociones y carga) y no un
   juego de cognición bajo?
2. **¿Un día sin datos rompe la cadena?** Se propone que sí (lectura estricta: pide más para avisar).
   La alternativa es tolerar un hueco, que avisa antes pero más veces de más. Quien está peor puede
   dejar de usar la aplicación justo entonces: con la lectura estricta, ese silencio **apaga** el
   aviso en lugar de encenderlo.
3. **¿Hace falta el consentimiento de la persona para este seguimiento, y cómo se explica?** Se usan
   solo resultados que la persona ya generó y solo se le muestran a ella; no se envían a nadie. Pero
   es una inferencia, y SCRUM-108 pidió permiso para la del diario. Si se decide que hace falta, se
   puede condicionar el endpoint a un permiso nuevo (columna en la cuenta, migración que aplica una
   persona).
4. **Los textos de los dos niveles y la línea a la que llama «Llamar ahora».** Los del frontend son
   una propuesta. **El botón «Llamar ahora» no se construyó:** las líneas guardan el número dentro
   del título («Línea 192, opción 4») y no en un campo propio, y un `tel:` hecho a partir de texto
   libre podría marcar mal en una crisis; algunas llevan una opción que `tel:` no sabe marcar. Se
   muestran las líneas de siempre, con su enlace. Para un botón de llamada de verdad hace falta una
   columna `telefono` verificada en `recurso_apoyo` (migración y una persona que la confirme).
5. **¿Los dos umbrales (3 y 7) y su relación con el «4 de 7» del ADR 0029?** Son reglas distintas:
   aquella decide el texto del resultado; esta, un aviso continuo. Se solapan sin contradecirse, pero
   3 seguidos es más estricto que 4 de 7 en algunos casos y más laxo en otros.

## Alternativas consideradas

- **Un contador o una tabla de «días con alerta».** Descartado, por lo mismo que la racha y el
  patrón: puede desincronizarse del historial.
- **Calcularlo en el cliente.** Descartado: el cliente no cuenta nada que dependa de los días, y
  tendría que tener todos los resultados.
- **Reutilizar `hayPatronEnLaSemana` («4 de 7»).** Descartado como única regla: el ticket pide días
  seguidos y escalones distintos (3 y 7). Podría ser la del nivel moderado si Diego prefiere una sola
  vara.
- **Un modal obligatorio para el nivel crítico.** Descartado, como recomienda el ticket: un modal que
  atrapa a la persona puede dañar justo a quien está peor.
- **Un interruptor de configuración que lo apague.** No se añadió: la puerta es la revisión de este
  PR. Si Diego quiere poder encenderlo por ambiente, es una variable más y una prueba.

## Consecuencias

- **Se gana:** una forma de acompañar a quien lleva días mal sin esperar a que escriba nada ni a que
  un solo resultado «lo diga», sin guardar nada nuevo ni exponer puntajes.
- **Se pierde:**
  - Quien está mal **y deja de usar la aplicación** no recibe el aviso (ver pregunta 2). El aviso
    habla de lo que se registró, no de cómo está la persona.
  - **Es una inferencia sobre la persona**, y el criterio (3, 7, cuenta un día sin datos como rotura)
    es de quien sabe de salud, no del equipo de software.
  - Un falso positivo es un aviso que se puede cerrar (moderado); en el crítico, un banner que se
    queda a la vista. Por eso el nivel crítico es lo que más conviene que revise Diego.
- **El frontend tiene su parte** (PR aparte, dependiente de este): el aviso con los dos niveles,
  accesible, y la copia de este equipo sin conexión. El backend es aditivo y se puede desplegar antes.
- **Un ADR y dos constantes:** cambiar los umbrales es cambiar dos números y su prueba.
