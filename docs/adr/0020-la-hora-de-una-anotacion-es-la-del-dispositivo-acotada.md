# ADR 0020: La hora de una anotacion del diario es la del dispositivo, acotada

- **Estado:** aceptado
- **Fecha:** 2026-10-07
- **Tarea:** SCRUM-144. Complementa el [ADR 0009](0009-versionado-de-entradas-de-diario.md)
  y se apoya en el [ADR 0019](0019-el-modo-sin-conexion-guarda-en-el-dispositivo-y-envia-una-cola-idempotente.md).

## Contexto

El diario guarda para cada anotacion la hora en que se escribio (`fecha_creacion`)
y la de su ultima edicion (`fecha_edicion`), y la regla del ADR 0009 dice que una
anotacion se puede corregir durante **una hora** desde que se escribio. Despues
queda como esta, y lo que se quiera anadir va en una nueva.

Hasta ahora esas horas eran **las de la base**: un disparador fijaba
`fecha_creacion := now()` al insertar, y una politica dejaba actualizar solo las
filas con `fecha_creacion > now() - 60 minutos`. Eso cumplia el objetivo de la
regla (nadie reescribe el diario de hace un mes) con una garantia dura.

El modo sin conexion (ADR 0019) lo rompe de dos maneras:

1. **Una anotacion escrita a las 9:00 sin conexion y sincronizada a las 14:00
   aparece como de las 14:00.** El dia si es correcto (lo manda el dispositivo),
   pero la hora no, y el historial se ordena por ella.
2. **La hora para editar corre desde la recepcion.** Una correccion hecha a las
   9:30 y recibida a las 14:00 llega «fuera de plazo» y, por el ADR 0009, se
   guarda como anotacion nueva: la persona acaba con dos anotaciones donde
   escribio una.

Lo que condiciona la decision:

- **El reloj de un dispositivo no es de fiar.** Se desajusta, se adelanta, lo
  cambia quien quiere. Y nadie puede demostrar a que hora escribio algo.
- **Mandar una hora mala no puede costar lo escrito.** Un rechazo por una hora
  incorrecta no se arregla reintentando: la persona perderia la anotacion sin
  enterarse hasta mucho despues (la misma razon de la tolerancia del reloj de
  SCRUM-133).
- **La inmutabilidad del diario es una regla de producto, no un limite de
  seguridad.** Protege a la persona de pisar lo que escribio en un mal momento y
  conserva un registro honesto. No defiende de la propia persona, que es la
  duena del diario y la unica que lo lee.

## Decision

**Quien escribe manda la hora de lo que escribe o corrige; el servidor y la base
la acotan sin rechazar nada.**

1. **`POST /api/diario` acepta `escritaEn` y `PATCH /api/diario/:id` acepta
   `editadaEn`**, ambas opcionales, en ISO 8601 **con desplazamiento** (`Z` o
   `+hh:mm`). Sin ellas, todo se comporta como hasta ahora.
2. **`horaDelDispositivo()` decide que hora se cree, y nunca lanza.** Se usa si:
   - es texto con la forma de ISO 8601 y desplazamiento, y el dia existe (`Date`
     lee el 30 de febrero como el 2 de marzo; no se acepta);
   - **no es posterior a «ahora»**: un reloj adelantado unos minutos queda en
     «ahora»; uno adelantado mas (el reloj esta roto) se ignora;
   - **no es de hace mas de 30 dias**;
   - **no es anterior a su piso**: una anotacion no se escribe antes de que empiece
     su dia (en el calendario de la persona), y una correccion no se hace antes de
     haberse escrito la anotacion.

   En cualquier otro caso se ignora y se usa la hora del servidor, **sin error**.

3. **El plazo de edicion se mide contra la hora de la edicion**, no contra la de
   recepcion: `editadaEn` ya acotada. La hora de una edicion no va hacia atras
   (nunca antes de la ultima), para que dos dispositivos con el reloj distinto no
   desordenen la historia.
4. **La base acota otra vez**, sin fiarse de la API (migracion
   `20261014120000_hora_del_dispositivo_en_el_diario`):
   - Al insertar, un disparador deja `fecha_creacion` entre `now() - 30 dias` y
     `now() + 5 minutos`, y pone `fecha_edicion` igual a ella.
   - Al editar, un disparador `BEFORE UPDATE` acota la hora de la edicion con las
     mismas cotas, mas «nunca antes de la creacion ni de la ultima edicion»;
     si ya paso la hora desde la creacion, devuelve `NULL` y el `UPDATE` no
     cambia nada, sin error (como hacia la politica).
   - **Un `UPDATE` que no cambia `fecha_edicion` se mide con `now()`.** Sin eso,
     dejarla como estaba bastaria para editar siempre «en el momento en que se
     escribio».
   - La politica de `UPDATE` deja de mirar el reloj y solo dice de quien es la fila.
5. **`fecha_creacion` sigue sin poder cambiarse despues de insertar** (permiso por
   columna), igual que `dia`, `id_usuario` e `id_operacion_cliente`.

## Alternativas consideradas

**Dejar la hora del servidor y aceptar el desorden.** Es lo que hay. Se descarta
porque rompe justo lo que el modo sin conexion promete: lo escrito a las 9:00 no
debe aparecer a las 14:00, y una correccion hecha dentro de su hora no debe
convertirse en una segunda anotacion.

**Aceptar siempre la hora del dispositivo sin cotas.** Es lo mas simple. Se
descarta porque una hora en el futuro alargaria la hora para editar sin limite
(basta con declarar una edicion «dentro de la hora» para una anotacion de hace un
ano), y porque una hora mal puesta por accidente desordenaria el historial.

**Rechazar las horas que no sirven.** Daria un error claro. Se descarta porque el
error no se arregla reintentando: la operacion quedaria atascada en la cola del
dispositivo y la persona perderia lo que escribio por culpa de su reloj.

**Mantener el plazo contra el reloj de la base y que el cliente reenvie lo tardio
como anotacion nueva.** Es el comportamiento del ADR 0009 tal cual. Se descarta
porque para la persona escribir una vez y ver dos anotaciones es un fallo, y es
el caso comun del modo sin conexion (corregir una errata al rato de escribir).

**Que el cliente junte la correccion con la creacion mientras ambas esperan en la
cola.** Se hace aparte, en el dispositivo (SCRUM-139), y cubre el caso mas comun.
No sustituye esto: una correccion sin conexion de una anotacion que _ya estaba_
en el servidor sigue necesitando que se mida contra su hora.

**Una politica de RLS en lugar de un disparador para la hora de edicion.** Una
politica de `UPDATE` ve la fila vieja (`USING`) o la nueva (`WITH CHECK`), no las
dos a la vez, y un `WITH CHECK` que falla produce un error en lugar de no tocar
nada. Aqui hacen falta las dos filas y que no se toque nada.

## Consecuencias

**A favor.** Lo escrito sin conexion muestra la hora en que se escribio y las
correcciones dentro de su hora se aplican como correcciones. Una hora mala nunca
pierde lo escrito. La base conserva cotas duras (el futuro, el pasado lejano, la
creacion y la ultima edicion), con pruebas contra PostgreSQL de verdad y
mutaciones sobre cada cota.

**En contra.**

- **Se pierde una garantia que era dura.** Antes, nada de lo escrito hace mas de
  una hora se podia editar, ni siquiera con acceso directo a la conexion de la
  aplicacion. Ahora, quien tenga ese acceso puede declarar una hora de edicion
  dentro de la hora y corregir una anotacion de hasta **30 dias** atras. Es el
  costo de poder corregir sin conexion y se acepta porque la regla es de
  producto: nadie puede demostrar a que hora corrigio algo, y quien tiene ese
  acceso es la propia persona sobre su propio diario o quien ya tiene las
  credenciales de la aplicacion, que pueden mucho mas que eso. Lo que se acota es
  **cuanto**: 30 dias, y nunca el futuro.
- **Una anotacion escrita sin conexion puede quedar entre otras de horas
  anteriores** del mismo dia. Es lo correcto (se escribio entonces), pero el
  historial ya no es «en el orden en que llegaron».
- **Una hora ignorada es invisible.** Si el reloj del dispositivo esta muy mal, la
  anotacion queda con la hora del servidor sin que la persona se entere. Es mejor
  que perderla.
- **El disparador de la edicion es la unica defensa de la hora para editar** en la
  base, y es codigo de PL/pgSQL que hay que mantener. Lo cubren pruebas contra la
  base y una prueba de mutacion por cada cota.

**A vigilar.** Que la cota de 30 dias siga siendo razonable: si hay personas que
pasan mas tiempo sin conexion, subirla agranda la ventana descrita arriba. Y la
edicion que se **reintenta** tras perder la respuesta: la primera llegada ya subio
la version y el reintento (con la version vieja) se ve como un conflicto sin
serlo; se trata junto al diario sin conexion (SCRUM-139).
