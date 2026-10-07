# ADR 0019: El modo sin conexion guarda en el dispositivo y envia una cola idempotente

- **Estado:** aceptado
- **Fecha:** 2026-10-07
- **Tarea:** SCRUM-136 (el nucleo, en `vsd-frontend`). Lo preparan SCRUM-133 y
  SCRUM-134 (la API) y SCRUM-135 (abrir sin conexion); lo conectan SCRUM-137 a
  SCRUM-142.

## Contexto

El entregable promete que la aplicacion funcione sin conexion (MR-09, MR-10;
HU_MF09_001 a HU_MF09_003): las actividades, el diario y los pendientes se
pueden usar sin red, quedan guardados en el dispositivo y se envian cuando
vuelve la conexion, de forma manual con un boton o sola. Solo requieren
conexion el cambio de contrasena, el cambio de correo y la configuracion del
perfil.

Lo que condiciona la decision:

- **Lo que se guarda es de salud.** Un diario, el resultado de una actividad, un
  pendiente. Una parte de quienes la usan entra desde una sala de computo de la
  universidad: el equipo lo comparte la siguiente persona que se sienta.
- **La API ya sabe recibir lo mismo dos veces.** Los resultados, las anotaciones
  del diario y los pendientes se crean con un `clientOperationId` y repetirlo
  devuelve lo que ya existe (SCRUM-133). El diario no se sobrescribe nunca
  ([ADR 0009](0009-versionado-de-entradas-de-diario.md)) y los pendientes llevan
  `version` para detectar que otro dispositivo los cambio (SCRUM-134).
- **Safari es el navegador mas limitado** y buena parte de las personas usara
  iPhone. No tiene la API de Background Sync ni sincronizacion periodica, y puede
  borrar el almacenamiento de un sitio que no se usa en una semana.
- La decision de SCRUM-135 fue que el service worker **guarda la aplicacion y
  nada mas**: lo que devuelve la API es de una persona y esa copia no se borraria
  al cerrar sesion.
- El equipo decidio **cifrar** lo que se guarda en el dispositivo y usar
  librerias conocidas (`vite-plugin-pwa`, `idb`) en lugar de escribir IndexedDB a
  mano.

## Decision

**Lo que la persona hace sin conexion se guarda en el dispositivo, cifrado, en
una cola de operaciones que se envian despues con el mismo identificador, y la
cola se conserva o se borra segun como termine la sesion.**

1. **Una base de IndexedDB por persona**, con el identificador de Supabase en el
   nombre (`vsd-<id>`). Es el unico que se conoce sin conexion: el identificador
   de nuestra cuenta se aprende de la API. Una base por persona hace que olvidar a
   alguien sea una sola operacion (`deleteDB`), sin recorrer tablas ni dejar
   restos. Se usa `idb`.
2. **Dos cosas se guardan:** copias de lectura (lo que la persona ya vio, para
   volver a verlo) y la cola de operaciones (lo que hizo y falta enviar).
3. **Cifrado local.** AES-GCM de 256 bits con una clave **no extraible** que vive
   en **otra base** (`vsd-llavero`), un vector de inicializacion aleatorio por
   valor y un contexto autenticado `persona|tabla|clave`: un valor copiado a otro
   sitio no se abre. Se cifran el contenido de las lecturas y el `payload` y el
   recibo de cada operacion. Lo que sirve para ordenar y mostrar el estado
   (tipo, estado, intentos, fechas) queda en claro; no dice nada de salud.
4. **Cada operacion lleva un `operationId` que se crea una vez y no cambia.** Es
   el `clientOperationId` de la API. Reenviar tras perder una respuesta no crea
   nada dos veces. El orden se respeta solo sobre **una misma cosa** (editar un
   pendiente espera a que se cree) y no entre cosas distintas (una anotacion
   rechazada no detiene a los pendientes).
5. **Los fallos se clasifican y cada clase hace algo distinto:**

   | Clase      | Ejemplos                                               | Que se hace                                    |
   | ---------- | ------------------------------------------------------ | ---------------------------------------------- |
   | Red        | `fetch` que falla, respuesta que no es JSON            | Se detiene todo; **no gasta un intento**       |
   | Sesion     | 401                                                    | Se detiene todo; **la cola se conserva**       |
   | Pasajero   | 408, 425, 429, 5xx                                     | Espera creciente y reintento                   |
   | Conflicto  | 409 `VERSION_DESACTUALIZADA`, `EDICION_FUERA_DE_PLAZO` | Se marca; no se pisa nada                      |
   | Permanente | otros 4xx                                              | Se marca para atencion; no bloquea a las demas |

   La espera empieza en 5 s, se duplica hasta 15 min, tiene +-20 % de azar para
   que muchos dispositivos no vuelvan a la vez y respeta `Retry-After` (hasta una
   hora). Tras 12 intentos fallidos la operacion deja de insistir y **pide
   atencion**: nada se descarta en silencio.

6. **Una sola sincronizacion a la vez**, aunque haya varias pestanas abiertas:
   Web Locks (`ifAvailable`). Donde no existe, vale solo dentro de la pestana.
7. **La conexion se confirma con `/health`**, con un limite de 15 s.
   `navigator.onLine` solo es una pista: cuando dice que no hay red es fiable;
   cuando dice que si, solo significa que hay una red, no que llegue a la API.
8. **Nunca se envia con la sesion de otra persona.** Cada base es de una persona y
   el motor comprueba, antes de cada envio, que la sesion sea la suya.
9. **Cuando se olvida lo guardado depende de como termina la sesion:**

   | La sesion termina...                               | Lo guardado...                  |
   | -------------------------------------------------- | ------------------------------- |
   | porque la persona cierra sesion o borra su cuenta  | **se borra todo**: base y clave |
   | sola (caduco, se revoco, se cerro en otra pestana) | **se conserva**, cerrado        |
   | porque entra **otra** persona en el mismo equipo   | se borra lo de la anterior      |
   | y la sesion no se recuerda en este equipo          | todo vive **en memoria**        |

   Distinguir las dos primeras es la razon de ser de esta decision: tratarlas igual
   o bien borraria cambios sin enviar por una sesion caducada, o bien dejaria los
   datos de alguien en un equipo compartido.

10. **La hora de lo hecho sin conexion es la del dispositivo**, con una tolerancia
    de 5 minutos hacia el futuro (`ToleranciaDelReloj`, SCRUM-133): un reloj
    adelantado unos minutos no hace rechazar una anotacion, y uno que se pasa de
    esa tolerancia si.
11. **Con conexion y sin ella, la aplicacion decide que mostrar.** La orientacion
    de una actividad hecha sin red se muestra **al sincronizar** (decision del
    equipo): la orientacion la calcula el servidor. VSD IA responde sin red solo
    saludos, agradecimientos, despedidas y las lineas de atencion; lo demas
    requiere conexion (SCRUM-141).

## Alternativas consideradas

**Background Sync API en el service worker.** Enviaria la cola incluso con la
aplicacion cerrada. Se descarta como base porque Safari y Firefox no la tienen:
el comportamiento diferiria justo en los dispositivos que mas se usaran. Ademas,
el service worker tendria que tener acceso al token y a la clave. Puede sumarse
despues como mejora donde exista; el motor ya es el mismo.

**Guardar en `localStorage`.** Es sincrono, tiene un limite de unos 5 MB, no tiene
transacciones y guarda texto. Una cola que se modifica desde dos pestanas
necesita transacciones.

**Que el service worker guarde las respuestas de la API.** Es lo que haria una
PWA tipica y no necesitaria una cola de lecturas. Se descarta porque esas copias
viven en la Cache Storage del navegador, que no se borra al cerrar sesion, y
porque no tendrian cifrado ni dueno.

**Una libreria de sincronizacion (RxDB, PowerSync, Dexie Cloud).** Traen su
propio modelo de datos y su propio servidor de sincronizacion. La API ya es
idempotente y versionada; una cola de operaciones es lo que falta y es mas
pequena que adoptar un modelo entero.

**Mezclar los cambios automaticamente (CRDT, ultimo gana).** El diario no se
sobrescribe nunca (ADR 0009) y un resultado de actividad no se edita. Para los
pendientes, `version` detecta el choque y se le muestra a la persona.

**Derivar la clave de la contrasena.** Daria una clave que solo existe mientras la
persona esta presente, pero quien entra con Google no tiene una contrasena que
aportar, y abrir sin conexion tendria que pedirla. Se prefiere una clave
generada, no extraible, separada de los datos.

**Una sola base para todas las personas.** Olvidar a una exigiria recorrer
tablas, y un error dejaria restos. Una base por persona se borra entera.

**Escribir IndexedDB a mano.** Descartado por el equipo; `idb` es un envoltorio
pequeno y estable.

## Consecuencias

**A favor.** La aplicacion sirve sin red y nada de lo hecho se pierde ni se
duplica por un corte. Cada fallo tiene un tratamiento propio y comprobado. Lo
privado no queda en un equipo compartido. El nucleo se prueba sin navegador: el
contrato del almacen corre contra memoria e IndexedDB, y el motor contra un
servidor simulado idempotente.

**En contra.**

- **Lo que no se envio se pierde si la persona cierra sesion o entra otra.** Es el
  costo deliberado de no dejar datos de salud a la vista de otra persona. Avisar
  antes de cerrar sesion con cambios sin enviar es de SCRUM-142.
- **Sin Background Sync, la sincronizacion automatica ocurre con la aplicacion
  abierta.** Al volver la red, al volver a la pestana y de forma periodica
  mientras haya algo pendiente (SCRUM-137). Con la aplicacion cerrada no se
  envia nada: se envia al abrirla.
- **El cifrado tiene un limite.** Protege la base de quien la lea sin la pagina
  (copiar el perfil del navegador, una herramienta forense). No protege de codigo
  que corra **dentro** de la pagina, porque es la pagina quien usa la clave: un
  XSS la usaria igual. Por eso las defensas contra codigo inyectado (sanear
  lo que se muestra, una politica de contenido estricta) siguen siendo
  necesarias.
- **La clave no extraible solo existe en ese navegador.** Si el navegador borra
  los datos del sitio, se pierden la base y la clave a la vez (coherente: no
  quedan datos ilegibles), y tambien lo que no se hubiera enviado.
- **Safari puede borrar el almacenamiento** de un sitio que no se abre en una
  semana, salvo que este instalado en la pantalla de inicio. `storage.persist()`
  se pide, pero es una peticion que cada navegador contesta como quiere.
- **El token de acceso dura una hora.** `getSession()` devuelve sin sesion si
  vencio y no hay red para renovarlo; abrir la aplicacion sin conexion pasada esa
  hora llevaria a la pantalla de acceso aunque haya una sesion guardada. Se
  resuelve en SCRUM-137 leyendo la sesion guardada en ese caso.
- **La cuota del navegador es finita.** Un almacen lleno se informa
  (`AlmacenLleno`) en vez de perder una operacion en silencio.
- **El reloj del dispositivo decide la hora de lo hecho sin conexion.** Un reloj
  muy desajustado produce una fecha incorrecta; mas alla de la tolerancia, la
  API rechaza la operacion y queda para atencion.

**A vigilar.** El numero de operaciones que terminan en «requiere atencion»: si
crece, hay un rechazo permanente que se esta repitiendo. La edicion de una
anotacion del diario que se reintenta tras perder la respuesta puede aparecer
como conflicto sin serlo (se trata junto al diario, SCRUM-144 y SCRUM-139). Y la compatibilidad de
`payloadVersion`: una operacion guardada con una forma que una version posterior
no entienda se marca para atencion en lugar de adivinarse.
