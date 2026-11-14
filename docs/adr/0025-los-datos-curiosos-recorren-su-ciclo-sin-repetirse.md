# ADR 0025: Los datos curiosos recorren su ciclo sin repetirse

- **Estado:** aceptada (decisión D7 del ciclo 7, **corregible al probar**)
- **Fecha:** 2026-10-13
- **Tarea:** SCRUM-185 (`[C7-15]`). Lo completa el frontend con el mini-panel del panel.

## Contexto

El sprint pidió un **dato curioso por día** en el panel, con un motor pensado para un catálogo de
100 mil datos, **único por persona**, en **un solo ciclo sin repeticiones** y el **mismo dato todo el
día**, también sin conexión. Hasta hoy no existía nada: solo hay un banco de unas 200 frases de la
mascota en el frontend.

Lo que condiciona la decisión:

- **Cien mil datos a mano no son realistas.** El motor tiene que servir para cualquier tamaño, y el
  contenido es un problema aparte: lo escribe y lo revisa una persona.
- **El catálogo cambia.** Se agregan y se retiran datos con el ciclo de alguien en curso. Contar «el
  día número N» movería todo y repetiría uno ya visto.
- **El día es del servidor, en la zona de la persona** (SCRUM-123). El reloj del dispositivo no manda.
- **Todo dato personal nuevo entra en la exportación y el borrado** (Ley 1581).
- **Un dato curioso no es un consejo de salud.** Si lo fuera, equivocarse costaría caro.

## Decisión

1. **Dos tablas.** `dato_curioso` es el catálogo (de todos: lectura abierta y escritura de
   administrador, igual que `recurso_apoyo`) y `dato_curioso_cursor` es una fila por persona con el
   último dato que se le dio y el día. Es lo único que se guarda de ella.
2. **El orden de cada persona no se guarda: se calcula.** La clave de un dato para una persona es
   `hashtextextended(id_dato || ':' || id_usuario, 0)`, un hash de 64 bits. Todos los datos publicados,
   ordenados por esa clave (con el identificador como desempate), son su ciclo. No hay 100 mil filas por
   cuenta.
3. **El siguiente es «el de clave mayor más cercana a la del cursor».** Si no queda ninguno, se vuelve
   al principio: empieza un ciclo nuevo, en el mismo orden. Un dato nuevo entra donde le toca, uno
   retirado se salta, y ninguno ya visto vuelve antes de terminar el ciclo.
4. **El mismo dato todo el día.** Una vez elegido queda en el cursor con el día; pedirlo otra vez, desde
   otro dispositivo, da el mismo. Si el cursor es de un día posterior al de hoy (un viaje hacia el
   oeste), se sigue con el mismo: avanzar o retroceder daría un repetido o un salto.
5. **Sin bloqueo.** El siguiente se calcula de forma determinista desde el cursor, así que dos
   peticiones a la vez eligen el mismo dato y escriben el mismo cursor.
6. **`publicado`, no «revisado».** Un dato sin publicar existe pero no se sirve. Retirar uno no lo borra:
   quien ya lo tiene como el del día lo conserva hasta que termine el día. La migración trae un catálogo
   inicial de **98 datos de cultura general** (hongos, naturaleza, animales, cuerpo, espacio, Colombia,
   ciencia y lenguaje), **ninguno un consejo de salud**, publicados.
7. **`GET /api/datos-curiosos/hoy`**, de la cuenta propia, `Cache-Control: no-store`. El dato es `null`
   solo si no hay ninguno publicado; la pantalla no inventa uno.
8. **El cursor es un dato personal.** Se borra con la cuenta (`ON DELETE CASCADE`), tiene RLS forzado y
   sale en la exportación con el texto y el día, no con el identificador.

## Alternativas consideradas

- **«El día número N»:** `catálogo[(a·N + b) mod tamaño]`, sin guardar nada. Descartada: al cambiar el
  catálogo repite o salta.
- **Una fila por persona y dato visto.** Garantiza no repetir, pero son 100 mil filas por cuenta y
  hay que borrarlas. Descartada.
- **Un orden aleatorio guardado en una columna del dato** (igual para todos, con un punto de partida por
  persona). Barato, pero todas las personas verían el mismo orden con otro comienzo: no es «único por
  persona». Descartada.
- **Calcular el hash en la aplicación.** Obliga a traer los 100 mil datos en cada consulta.
  Descartada: el orden se calcula en la base, una vez por persona y por día.

## Consecuencias

**Lo que se gana.** Un catálogo del tamaño que sea sin una fila más por cuenta. Cambiar el catálogo a
mitad de un ciclo no repite ni inventa nada. Cada persona tiene su orden, estable mientras el catálogo
no cambie. El caso de uso se prueba sin base de datos y las propiedades del ciclo se prueban otra vez
contra PostgreSQL de verdad.

**Lo que se pierde o se acepta.**

- **Una pasada por el catálogo, una vez por persona y por día.** Con 100 mil datos son decenas de
  milisegundos; con diez mil personas al día, minutos de CPU repartidos en el día. Si algún día pesa, se
  puede precalcular la clave por bloque, no guardar el orden.
- **Hay dos hashes.** El adaptador de PostgreSQL usa `hashtextextended` y el de memoria usa SHA-256. No
  dan los mismos números y no tienen por qué: lo que vale es la propiedad, y se prueba en los dos.
- **Las personas con poca historia ven datos de un orden que no eligieron.** Es lo esperable; si alguien
  quiere «otro dato», es una función aparte.
- **La calidad del contenido es de quien lo revisa.** El motor no distingue un dato falso de uno cierto.
  Por eso `publicado`: un `UPDATE` lo retira sin tocar a nadie.
- **Las frases de la mascota** (`frasesDeLaMascota.ts`) siguen con su propio mecanismo en el frontend; no
  pasan por este motor.

## Pendiente fuera de este ADR

- El mini-panel que reemplaza el texto «Empieza por la que más te llame…», y que el dispositivo guarde
  el del día para mostrarlo sin conexión.
- Que Diego o Samuel revisen los 98 datos de la migración.
