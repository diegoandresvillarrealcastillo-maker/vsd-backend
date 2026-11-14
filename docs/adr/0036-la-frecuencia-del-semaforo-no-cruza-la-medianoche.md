# ADR 0036: La frecuencia del semáforo: las dos horas nunca cruzan la medianoche

- **Estado:** aceptada (SCRUM-146). Cierra el «punto abierto» del ticket, que esperaba a Diego; Samuel
  delegó la decisión con la condición de que «no se rompa» y de que el aviso siga siendo el de dos
  veces al día, en la tarde-noche, y personalizable por cada persona. **Diego la confirma al
  fusionar.**
- **Fecha:** 2026-10-24
- **Se relaciona con:** SCRUM-145 (el aviso del semáforo con un interruptor y una hora), SCRUM-126
  (los recordatorios fijos de las 8:00 y las 20:00) y SCRUM-123 (la zona horaria de cada persona).

## Contexto

El aviso del semáforo (los pendientes sin hacer) sale una vez al día, a la hora que la persona elige.
SCRUM-146 pide un desplegable de frecuencia: **solo en la mañana, solo en la noche o dos veces al día**,
con esta semántica aprobada: la hora elegida es la de la mañana, «solo en la noche» es esa hora más
12 horas y «dos veces» son las dos.

El punto abierto: con una hora elegida desde las 12:00, «más 12 horas» **cruza la medianoche** y el
aviso de «la noche» llega de madrugada (12:00 + 12 h = 00:00; 18:00 + 12 h = 06:00). Había dos
salidas en el ticket: limitar la hora a la mañana, o tratar la hora tal como se elija.

## Decisión

1. **La hora que la persona elige sigue siendo una sola**, la **hora base**
   (`preferencia_aviso.minuto_semaforo`, la misma de siempre). Se le suma la **frecuencia**
   (`frecuencia_semaforo`: `manana`, `noche`, `dos_veces`; `manana` por omisión).
2. **Los dos avisos no se guardan: salen de la hora base y la frecuencia** (`minutosDelSemaforo`).
   Se llaman el **primer aviso** (la mañana) y el **segundo aviso** (la tarde o la noche):
   - `manana`: solo el primero, **a la hora base, tal cual**. Es lo que el semáforo ya hacía, así que
     **todas las cuentas que existían quedan exactamente como estaban**, también las que eligieron
     una hora de la tarde. No se les mueve nada.
   - `noche`: solo el segundo.
   - `dos_veces`: los dos, siempre a 12 horas uno del otro.
3. **Nunca se cruza la medianoche.** El primer aviso de `dos_veces` cae siempre entre las 00:00 y las
   11:59, y el segundo, entre las 12:00 y las 23:59. Para eso la hora base se lee dentro de «medio
   día»: con una hora de la mañana, el segundo aviso es base + 12 h (08:00 → 20:00); con una de la
   tarde, el segundo aviso es **la propia hora base** y el primero es 12 horas antes (18:00 →
   06:00 y 18:00). Para `noche`, una hora de la tarde avisa a esa misma hora.
4. **El servidor devuelve las horas que le tocan** (`horasDelSemaforo`, por ejemplo `["08:00",
"20:00"]`), para que el desplegable muestre «Te avisaremos a las 8:00 y a las 20:00» sin que el
   frontend repita la regla.
5. **Cada aviso se reclama por separado**: el segundo tiene su propio tipo (`semaforo_noche`) y su
   propia marca (`ultimo_aviso_semaforo_noche`). Sale una vez al día cada uno, aunque la revisión
   corra cada minuto o dos instancias del API se solapen; el reclamo sigue siendo una sola sentencia.
   Los dos dicen lo mismo, con lo que haya pendiente en ese momento: quien ya los hizo todos no
   recibe el segundo.
6. **A quién le toca se pregunta por la hora base**, que es la columna con índice
   (`basesDelPrimerAviso` y `basesDelSegundoAviso` son lo contrario de `minutosDelSemaforo`), y
   una prueba comprueba que dan **exactamente lo mismo** para todas las horas y todas las ventanas
   del día. Una ventana sin ninguna hora base posible (el segundo aviso antes de las 12:00) se
   expresa con una condición siempre falsa y no con un `OR` vacío: Prisma deja pasar un `OR` vacío
   como si no hubiera condición, y el aviso le tocaría a todo el mundo (lo encontró la prueba
   contra PostgreSQL).
7. **Migración** `20261024160000_frecuencia_del_semaforo`: un tipo enumerado y dos columnas (la
   frecuencia con valor por omisión `manana` y la marca del segundo aviso). Sin datos que mover y
   sin cambiar los permisos ni el aislamiento. **La aplica una persona, antes de desplegar el
   backend.**

## Alternativas consideradas

- **Limitar la hora a la mañana.** Descartada: dejaría sin poder elegir una hora de la tarde a quien
  hoy la tiene (habría que moverle el aviso, o rechazar un valor que ya existe) y obliga a una
  validación en dos sitios.
- **Tratar la hora «tal como se elija» (base + 12 h con vuelta al día).** Descartada: es lo que manda
  el segundo aviso de madrugada. «Dos veces al día» con 18:00 daría 18:00 y 06:00 del día siguiente, y
  «solo en la noche» a las 00:00: lo contrario de lo que dice el nombre.
- **Guardar las dos horas en columnas.** Descartada: dos valores que pueden quedar distintos del
  estado que muestra la pantalla, y una migración de datos para las cuentas que ya existían. Las
  funciones puras no tienen ese problema.
- **Dos horas elegidas por la persona, sin relación entre sí.** Descartada por ahora: pide dos
  selectores y su validación; el desplegable del ticket es más simple y cubre lo pedido. Si Diego
  lo quiere, es una columna más.

## Consecuencias

- **Se gana:** la frecuencia que pedía el ticket, para cualquier hora que la persona elija, sin
  avisos de madrugada, sin tocar a nadie que ya tenía el suyo y con una sola fuente de verdad.
- **Se pierde:**
  - **«Solo en la mañana» no siempre es de la mañana:** si alguien tenía una hora de la tarde, sigue
    avisando a esa hora, bajo ese nombre. Es la única forma de no moverle nada; la pantalla
    muestra siempre la hora real (`horasDelSemaforo`).
  - **La hora base y las horas a las que avisa no son lo mismo** con una hora de la tarde en
    «dos veces»: se elige 18:00 y se avisa a las 06:00 y a las 18:00. Se compensa mostrando las
    horas reales.
  - Una persona que cambia la frecuencia a mitad del día puede recibir, ese día, un aviso más o uno
    menos del que esperaba: cada aviso tiene su propia marca y no se «reparten» entre sí.
- **El frontend tiene su parte** (PR aparte): el desplegable de frecuencia y el texto con las horas
  reales. **Orden:** primero la migración en PRE (la aplica una persona), después este backend y al
  final el frontend. Sin elegir otra frecuencia, nada cambia para nadie.
