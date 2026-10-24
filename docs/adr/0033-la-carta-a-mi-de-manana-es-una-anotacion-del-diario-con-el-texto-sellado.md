# ADR 0033: La «carta a mí de mañana» es una anotación del diario con el texto sellado

- **Estado:** propuesta (SCRUM-230, `[C7-60]`). Las decisiones 5 y 6 («qué pasa con la que no se abre» y «qué
  hace la exportación») son valores por defecto **corregibles por Samuel y Diego**.
- **Fecha:** 2026-10-24
- **Relacionados:** [ADR 0009](0009-versionado-de-entradas-de-diario.md) (el diario nunca pierde lo escrito),
  [ADR 0020](0020-la-hora-de-una-anotacion-es-la-del-dispositivo-acotada.md) (la hora del dispositivo),
  SCRUM-224 y SCRUM-227 (el contenido de EMO-05), `CATALOGO-FICHAS-DE-MECANICAS.md` (EMO-05, decisión D-C5).

## Contexto

La ficha de EMO-05, «Carta a mí de mañana», promete que **al abrir la app mañana aparece «Ayer te dejaste esto»,
con la opción de borrarla sin leerla**. El catálogo (SCRUM-224 y SCRUM-227) salió con una versión honesta porque
el sistema no podía cumplirlo:

- el diario no admite anotaciones de un día futuro;
- no tenía borrado: solo `GET`, `POST` y `PATCH`, y una anotación se corrige solo dentro de su hora;
- no existía ninguna tarjeta «Ayer te dejaste esto».

Así que la carta se guardaba como una anotación corriente de hoy, y su cierre decía «Quedó guardada en tu diario».

Lo que hace delicada a esta carta es que **la escribe alguien en un mal día y la lee quien despierta mañana**. Tres
barandas de la ficha no se negocian: siempre se puede borrar sin leerla; nunca llega por notificación (la pantalla
bloqueada la puede ver otra persona); y el texto pasa por la detección de riesgo de siempre (R8).

## Decisión

1. **La carta es una anotación del diario con una etiqueta** (`carta_a_manana`, decisión D-C5 de la ficha). Ya tiene
   aislamiento por persona (RLS), exportación y borrado de la cuenta. No hay tabla nueva ni día futuro: se escribe
   **hoy**, con el día de hoy, y es la lectura la que espera.
2. **El texto está sellado mientras la carta espera.** Una carta espera mientras no se abrió y no pasó su semana
   (`DIAS_DE_ESPERA_DE_LA_CARTA = 7`). Mientras espera, **ninguna respuesta de la API lleva su texto, su título ni
   sus diagramas**: ni al escribirla, ni al listar el diario, ni al editar. Las respuestas marcan `carta: true` y
   `sellada: true`. Lo único que lo entrega es `POST /api/diario/{id}/abrir`.
3. **Abrir es desde mañana, nunca hoy.** `abrir` responde `409 CARTA_PARA_MANANA` el mismo día en que se escribió. «Hoy»
   es el día de la persona en su zona, no el del servidor: a las 11 p. m. en Bogotá ya es el día siguiente en UTC y
   para ella sigue siendo hoy. Abrir una carta la deja marcada (`carta_abierta_en`); desde entonces sale completa en el
   diario como cualquier anotación. Abrirla otra vez devuelve lo mismo y no cambia la hora de la primera.
4. **Borrar es siempre posible y no lee nada.** `DELETE /api/diario/{id}` borra la fila entera, a cualquier hora, la
   haya leído o no, y vale para cualquier anotación propia. Es idempotente **por el identificador**: borrar lo que ya no
   está, o lo que es de otra persona, responde `204` igual y no cambia nada. Eso permite reintentar y encolar sin
   conexión sin que la respuesta delate qué identificadores existen. No deja texto en ningún registro: la fila era lo
   único que lo guardaba, la petición no lleva cuerpo y el interceptor anota método, ruta, estado y duración.
5. **Una carta que nadie abre sigue esperando una semana y después vuelve al diario**, como cualquier anotación. Sin
   insistir: no hay notificación, y la tarjeta solo está en el panel. _(Propuesta, corregible.)_
6. **La exportación entrega todo, también las cartas que esperan.** `GET /api/cuenta/exportacion` es la persona
   pidiendo todo lo suyo, y el derecho de acceso no se cumple con una parte callada. _(Propuesta, corregible: si se
   prefiere, la exportación puede dejar sellada la carta que espera.)_
7. **Una carta que espera no se edita** (`409 CARTA_PARA_MANANA` al corregirla). Corregir a ciegas la dejaría peor; si
   quiere cambiarla, la borra y escribe otra.
8. **La tarjeta se alimenta de `GET /api/diario/cartas-en-espera`**: las cartas de un día que ya pasó, sin abrir y
   dentro de su semana, la más reciente primero, **sin su texto** (solo `id` y `dia`).

### Cómo se hace cumplir en la base

`carta_a_manana` se decide al escribir y no se puede cambiar después (`vsd_app` no tiene permiso de UPDATE sobre esa
columna). `carta_abierta_en` solo la admite una carta (`CHECK`).

El disparador de la hora para editar devuelve `NULL` pasada la primera hora, y abrir una carta ocurre un día después.
Se le dio **una salida estrecha**: se deja pasar un UPDATE que **no cambia nada más** que `carta_abierta_en`, y solo de
vacío a un valor, con la hora acotada como las otras horas del diario (nunca en el futuro ni de hace más de un día). Un
UPDATE que cambie el texto y de paso marque la carta **no la abre**: en el camino de la edición `carta_abierta_en` se
queda como estaba. Las pruebas contra PostgreSQL cubren las dos puertas.

## Alternativas consideradas

- **Una anotación con fecha de mañana.** Descartada: obligaría a abrir el diario a días futuros, con la regla de
  `FutureJournalDayError`, el reloj del dispositivo y el calendario de cada persona. La carta de hoy que espera
  consigue lo mismo sin tocar esa regla.
- **Una tabla aparte para las cartas.** Descartada por la ficha (D-C5): habría que repetir RLS, exportación y borrado
  de cuenta.
- **Una tabla aparte solo para saber cuáles se abrieron.** Habría evitado tocar el disparador, a costa de otra tabla con
  sus políticas. Se prefirió la columna con una salida estrecha y probada.
- **Guardar quién la abrió en el cliente** (`localStorage`). Descartada: la tarjeta reaparecería en cada dispositivo y se
  perdería al limpiar el navegador, y la baranda de «sin insistir» dependería del aparato.
- **Idempotencia del borrado por `clientOperationId`.** El ticket la proponía. Borrar por identificador ya es idempotente
  y no hace falta un identificador de operación que guardar. Lo que no cubre: borrar **antes de que la anotación se
  sincronice**, cuando el dispositivo aún no conoce su identificador; ahí el cliente cancela la escritura pendiente de su
  cola en lugar de pedir un borrado.

## Consecuencias

- **Se gana:** la promesa de la ficha se cumple sin tocar las reglas del diario, con tres barandas probadas: siempre se
  borra, nada llega por notificación (ningún endpoint de avisos lleva texto) y el texto pasa por R8 antes de guardarse.
- **Se pierde:**
  - Una carta sellada es una anotación que el diario no muestra: para quien consulta el diario directamente aparece
    «Carta guardada para mañana», sin su texto, y no se puede corregir.
  - El disparador de la hora para editar tiene una segunda puerta. Está acotada y probada, pero es una puerta más en una
    pieza de seguridad.
  - La migración **la aplica una persona**, en PRE y luego en PROD. Hasta entonces el backend nuevo no debe desplegarse:
    sin las columnas, escribir una anotación falla. Backend antes que frontend.
  - Borrar no deja constancia. Es deliberado: una constancia sería otro lugar donde queda algo de lo escrito.
  - El sellado es de la API, no de la base: quien tenga acceso a las tablas ve el texto, como con cualquier anotación del
    diario (límite del diseño, ver `docs/seguridad.md`).
- **Queda abierto:** la decisión 5 (cuántos días espera una carta sin abrir) y la 6 (qué hace la exportación), y si la
  tarjeta debe aparecer cada día mientras la carta espera o solo el primero.
