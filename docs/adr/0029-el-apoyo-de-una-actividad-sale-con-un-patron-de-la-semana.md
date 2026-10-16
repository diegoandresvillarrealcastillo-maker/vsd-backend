# ADR 0029: El apoyo de una actividad sale con un patrón de la semana, no con un solo resultado

- **Estado:** aceptada (SCRUM-200, `[C7-30]`; decisión de Samuel del 15/10/2026, **corregible al
  probar y a revisar con Diego**)
- **Fecha:** 2026-10-15
- **Reemplaza en parte a:** la regla de SCRUM-94 («un nivel que requiere atención sugiere
  acompañamiento»). La señal de riesgo en lo escrito, y las líneas del país, **no cambian**.
- **Cambia un comportamiento clínico y de la API:** por eso va con un ADR.

## Contexto

Hasta ahora, al terminar una actividad, el servidor calculaba el nivel con las respuestas **de ese
día**. Si salía `requiere_atencion`, la respuesta traía `sugiereAcompanamiento: true` y las líneas de
atención, y la pantalla mostraba el aviso de apoyo (en el frontend, «Si te sirve hablarlo con
alguien…»).

Eso bastaba con **un solo resultado**: un juego que no salió, o un día flojo, disparaba un mensaje de
apoyo pensado para una situación difícil sostenida. Con el uso, Samuel lo señaló: los mensajes duros
llegaban «de una vez», tras una respuesta, y deben salir **después de analizar un patrón de una
semana**.

La decisión original (catálogo inicial, SCRUM-9) iba en sentido contrario: «equivocarse hacia el lado
de mostrar apoyo de más es preferible a callar». Esto la revisa para los resultados con puntaje; **no**
para lo escrito (ver el punto 4).

## Decisión

1. **Hay patrón cuando, en los 7 días que terminan en el día del resultado, al menos 4 días
   distintos tienen un resultado que requiere atención** (decisión de Samuel: «4 de 7»). Es
   `hayPatronEnLaSemana`, una función pura de los resultados (`PatronDeLaSemana.ts`), igual que la
   racha (ADR 0024): sin contador ni tabla.
2. **Un nivel que requiere atención ya no sugiere acompañamiento por sí solo.** El resultado se
   registra con su nivel, como siempre, pero `sugiereAcompanamiento` es falso y `lineasDeAtencion`
   viene vacía **salvo que haya patrón**. Se evalúa solo cuando el resultado de ahora requiere
   atención: un buen resultado no trae apoyo aunque la semana haya sido dura.
3. **La semana se mide contra el día del resultado, no contra hoy.** Un resultado hecho sin
   conexión se mide con la semana en que ocurrió, y un reintento ve lo mismo que la primera vez
   aunque después se hayan registrado más días (la idempotencia de ADR 0019 se mantiene).
4. **El riesgo en lo escrito no espera una semana.** Si algún texto de la `metadata` trae una
   frase de la lista de riesgo, el resultado sigue sugiriendo acompañamiento esa misma vez
   (ADR 0011). Lo mismo el asistente y el diario (ADR 0027 y 0028): no cambian.
5. **Qué cuenta como un día.** Un día es un día, haya tenido uno o cinco resultados; si tuvo uno
   bueno y uno que requiere atención, cuenta como día con atención (lo contrario dejaría sin
   cobertura a quien tuvo un mal rato). Lo que no puntúa no cuenta ni a favor ni en contra. Cuenta
   cualquier actividad con puntaje, también un juego de cognición: es lo que hasta hoy disparaba el
   apoyo, y el requisito dice «falla o respuestas negativas».
6. **El mínimo de datos queda implícito.** Con 4 días con atención hay, por fuerza, al menos 4
   días registrados; la regla «al menos 3 días registrados» del ticket se cumple sola. Si algún día
   el umbral baja de 3, habrá que añadirla.
7. **La API no cambia de forma, cambia de sentido.** `nivelOrientativo` sigue diciendo cómo le fue;
   `sugiereAcompanamiento` y `lineasDeAtencion` dicen si conviene acompañar. Un cliente anterior
   sigue funcionando: ve el nivel y, sin líneas, no muestra el bloque de apoyo.
8. **La exportación de datos no cambia.** `ResultadoRespuestaDto.desde` sin el tercer argumento usa
   lo que el resultado sugiere por sí solo (`sugiereAcompanamientoPorSiSolo`): es un registro, no un
   mensaje. El nombre del método dice «por sí solo» a propósito, para que nadie lo use esperando la
   decisión.

## Alternativas consideradas

- **Un contador o una tabla de «semanas con aviso».** Descartado: puede desincronizarse del
  historial, y es lo que la racha y el sendero ya evitaron.
- **Medir contra hoy.** Descartado: el resultado hecho sin conexión y recibido días después daría
  otra respuesta, y el reintento no sería idempotente.
- **Contar solo las actividades de «mayor requiere atención» (emociones y carga).** Descartado: dejaría
  fuera «falla», que el requisito pide, y un juego de memoria bajo ya disparaba el apoyo. Es un
  filtro de una línea si se prefiere.
- **Mostrarlo a lo más una vez por semana.** **No se hizo aquí:** exige guardar cuándo se mostró (una
  columna o una tabla y una migración). Hoy, mientras el patrón se mantenga, cada resultado que
  requiere atención trae el apoyo. Es una mejora aparte.

## Consecuencias

- **Se gana:** un día flojo o un juego que no salió dejan de recibir mensajes de apoyo pensados para
  una semana difícil. El apoyo llega cuando hay un patrón, y habla de la semana.
- **Se pierde:** una persona que está mal **de verdad pero no lo escribe** y contesta con puntajes
  bajos recibe el apoyo **después de 4 días**, no el primero. Es el costo de la decisión y por eso
  el umbral es de criterio y conviene que lo revise Diego o alguien con formación en salud. El
  asistente y el diario, que sí reciben lo que la persona escribe, siguen siendo inmediatos.
- **El frontend tiene su parte** (SCRUM-200, segundo PR): hoy pinta «Conviene prestarle atención
  estos días» con solo `nivelOrientativo`; con un resultado aislado debe mostrar un texto neutro. El
  backend es aditivo y se puede desplegar antes.
- **Los textos sembrados no cambian.** `textos_nivel` (la migración del catálogo) se queda tal cual:
  la API nunca los expone. Si se quisiera reescribirlos, va en una migración nueva que aplica una
  persona.
- **Un umbral, dos constantes:** `DIAS_DE_LA_VENTANA` y `DIAS_CON_ATENCION_PARA_UN_PATRON`, con su
  prueba. Cambiar el 4 es cambiar un número y esa prueba.
