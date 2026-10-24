# ADR 0034: Acompañamiento por días seguidos con atención: moderado a los 3 y crítico a los 7

- **Estado:** aceptada con ajustes (SCRUM-177, `[C7-08]`). Diego respondió las cinco preguntas el
  2026-10-24 (ver «Las cinco preguntas y lo que decidió Diego»). **El criterio clínico (qué cuenta,
  3 y 7 días) sigue pendiente de la revisión de una persona de salud**; lo que está aquí es la
  decisión de producto, no una validación clínica.
- **Fecha:** 2026-10-23 (propuesta); 2026-10-24 (decisión)
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

## Decisión

1. **Un «indicador alto» es un día con al menos un resultado que requiere atención**
   (`nivelOrientativo = requiere_atencion`) **en una actividad de escala «mayor requiere
   atención»** (carga y emociones). Un puntaje bajo en un juego de cognición no cuenta: no dice
   nada de cómo se siente la persona y daría falsas alarmas. Esto afina la definición de «día con
   atención» del ADR 0029, que sigue contando todas las actividades para el texto del resultado.
   El caso de uso pide el catálogo, toma las actividades con esa escala
   (`actividadesQueCuentanParaAcompanar`) y se las pasa al repositorio. Hoy `sugiereAcompanamiento`
   es exactamente ese nivel, así que las dos lecturas que el ticket dudaba **dan el mismo
   resultado**; si algún día `sugiereAcompanamiento` incluye otra cosa, habrá que decidir de nuevo.
2. **«Continuo» son días del calendario seguidos, cada uno con atención.** Un día sin atención rompe
   la cadena, y **también un día sin ningún dato**. **Hoy no rompe nada hasta que termina**, igual que
   la racha: sin nada hoy, la cadena de ayer sigue en pie. Lo posterior a hoy se ignora.
3. **3 días seguidos: `moderado`. 7 seguidos: `critico`.** Las dos constantes, `DIAS_PARA_ACOMPANAR`
   y `DIAS_PARA_LAS_LINEAS`, tienen su prueba.
4. **Es una función de los resultados, no hay ningún contador guardado** (`AcompanamientoPorRiesgo.ts`,
   como `Racha.ts` y `PatronDeLaSemana.ts`): nada que se desincronice. Lo único que se guarda es
   el **permiso** de la persona (punto 7). Los días son
   `resultado.dia`, fijados al registrar (SCRUM-123): viajar no mueve los de antes. «Hoy» sale del
   calendario de la zona de la persona.
5. **Un endpoint, `GET /api/acompanamiento`**, para quien firma el token. Responde
   `{ nivel, lineasDeAtencion }` y **nada más**: ni puntaje, ni cuántos días van, ni cuáles. Nunca
   se guarda en caché (`Cache-Control: no-store`: es sobre la persona). Las líneas son las **de su
   país** (SCRUM-124, ordenadas por alcance) y solo vienen con el nivel crítico; en una zona sin
   líneas verificadas viene el directorio, nunca el número de otro país.
6. **No sale por notificación** ni por ningún otro canal que no sea la propia aplicación abierta.
7. **Solo se mira lo de quien lo permite.** La cuenta tiene un permiso, `acompanamientoPorDias`,
   **apagado por defecto** (las cuentas que ya existen quedan apagadas: nadie lo dio, no se supone).
   Se cambia desde el perfil con `PATCH /api/cuenta/preferencias` y sale en `GET /api/cuenta`, igual
   que `diarioConRecomendaciones` (SCRUM-108). Sin el permiso, `GET /api/acompanamiento` responde
   `{ nivel: 'ninguno', lineasDeAtencion: [] }` **sin leer un solo resultado**. Es una columna
   nueva en `usuario` (migración `20261024140000_acompanamiento_por_dias`, que aplica una persona,
   en PRE y después en PROD, antes de desplegar este backend).

## Las cinco preguntas y lo que decidió Diego

Respondidas por Diego el 2026-10-24.

1. **¿Qué es un indicador alto?** **Afinarlo:** solo las actividades de «mayor requiere atención»
   (emociones y carga). Con el nivel general, a quien le va mal en un juego de cognición se le
   ofrecería acompañamiento sin que haya una señal emocional. Era un filtro sencillo y se hizo en
   este mismo cambio (punto 1). **Deuda anotada:** repasar qué actividades entran después de la
   revisión clínica.
2. **¿Un día sin datos rompe la cadena?** **Sí**, como se proponía. Tratar el silencio como una
   señal convertiría en alerta a quien solo olvidó abrir la aplicación (fatiga de alertas). El
   riesgo que señalaba la pregunta es real: quien está peor puede dejar de usarla. **Eso debe ser
   una regla de abandono independiente, en un ticket propio, y no un parche sobre esta regla de
   continuidad.**
3. **¿Hace falta el permiso de la persona?** **Sí.** Aunque ningún dato salga de su cuenta, es una
   inferencia sobre su salud mental, y SCRUM-108 ya sentó el precedente con el diario. Se asumió el
   costo de la migración ahora para no arriesgar su confianza ni el cumplimiento más adelante
   (punto 7). **No se anota todavía en el registro de seguridad** cuando cambia: ese catálogo es una
   lista cerrada de seis hechos acordados y ampliarla es el ticket SCRUM-167; allí debería entrar
   `PERMISO_DEL_ACOMPANAMIENTO_CAMBIADO`, como ya está `PERMISO_DEL_DIARIO_CAMBIADO`.
4. **Textos y botón «Llamar ahora».** Los textos del frontend quedan como **versión inicial**. Las
   líneas se muestran dentro del texto, con su enlace, como hasta ahora. **Se abre de inmediato un
   ticket para estructurar una columna `telefono` verificada en `recurso_apoyo`** (con una persona
   que confirme cada número): en una crisis, copiar y pegar un número es una fricción grave, y el
   botón «Llamar ahora» hace falta pronto.
5. **¿Los umbrales 3 y 7 frente al «4 de 7»?** **Coexisten.** Detectan cosas distintas: «3
   seguidos» es una caída aguda y rápida; el «4 de 7» (ADR 0029), una inestabilidad más sostenida.
   No se contradicen.

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
- **Un interruptor de configuración que lo apague por ambiente.** No se añadió: la puerta es el
  permiso de cada persona, apagado por defecto.

## Consecuencias

- **Se gana:** una forma de acompañar a quien lleva días mal sin esperar a que escriba nada ni a que
  un solo resultado «lo diga», sin guardar ningún contador ni exponer puntajes, y solo con su permiso.
- **Se pierde:**
  - Quien está mal **y deja de usar la aplicación** no recibe el aviso (ver pregunta 2). El aviso
    habla de lo que se registró, no de cómo está la persona.
  - **Es una inferencia sobre la persona**, y el criterio (3, 7, cuenta un día sin datos como rotura)
    es de quien sabe de salud, no del equipo de software.
  - Un falso positivo es un aviso que se puede cerrar (moderado); en el crítico, un banner que se
    queda a la vista. Por eso el nivel crítico es lo que más conviene que revise Diego.
- **El frontend tiene su parte** (PR aparte, dependiente de este): el aviso con los dos niveles,
  accesible, y la casilla del permiso en el perfil. **Orden:** primero la migración en PRE (la aplica
  una persona), después este backend y al final el frontend. Sin el permiso encendido, nada cambia
  para nadie.
- **Un ADR y dos constantes:** cambiar los umbrales es cambiar dos números y su prueba.
