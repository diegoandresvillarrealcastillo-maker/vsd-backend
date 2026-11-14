# ADR 0039: Auditoría parte 2: pruebas solo en la base de pruebas y exportación en flujo

- **Estado:** propuesta (SCRUM-266). **Diego la confirma al fusionar.**
- **Fecha:** 2026-10-25
- **Se relaciona con:** ADR 0010 (el aislamiento lo impone la base), ADR 0026 (la baja de la cuenta) y
  ADR 0038 (primera tanda de la auditoría).
- **Registra decisiones ya tomadas en el código:** SCRUM-261 (PR #168) y SCRUM-262 (PR #169). Se
  escribió después de fusionarlas; no cambia nada de lo que hacen.

## Contexto

La misma auditoría de código del backend dejó dos hallazgos que cambiaron una regla de trabajo y un
contrato de salida, y ninguno de los dos tenía su decisión escrita.

1. **Las pruebas de integración podían llegar a PRE.** Cargaban el `.env` por su cuenta y usaban
   `DATABASE_URL`, que en un `.env` real puede apuntar a preproducción. Esas pruebas **insertan, borran
   y cambian la contraseña del rol `vsd_app`** a una clave de pruebas que está en el repositorio. Una
   configuración equivocada las convertía en «reescribir la contraseña de la aplicación en PRE con una
   clave pública», y nada se quejaba.
2. **La exportación de datos leía todo de una vez.** `GET /api/cuenta/exportacion` traía todos los
   resultados, el diario y los pendientes de la persona, armaba el objeto entero en memoria y lo
   serializaba. Con el historial de una persona activa eso crece sin tope, y el límite es de 5 por
   minuto por cuenta: cada petición repetida pagaba el costo completo.

## Decisión

### Las pruebas solo tocan la base de pruebas, y solo si es de esta máquina

1. **Se lee únicamente `TEST_DATABASE_URL`.** `DATABASE_URL` no existe para estas pruebas y el `.env` no
   se carga.
2. **El destino se comprueba antes de construir ningún cliente:** `localhost`, `127.0.0.1` o `::1`
   (nombre entero: `localhost.ejemplo.com` no lo es) y sin los parámetros `host`, `hostaddr` ni
   `service`, con los que el cliente cambia de servidor aunque la URL parezca local. Además,
   `prepararRolDeLaAplicacion` vuelve a comprobar el servidor del cliente ya conectado, justo antes del
   `ALTER ROLE`.
3. **No hay variable que levante la regla.** Una excepción escrita «para un momento» es la que acaba en
   el CI de otra persona. El mensaje de rechazo no repite la URL: trae la contraseña y diría a qué
   ambiente se estuvo a punto de llegar.
4. **Sin `TEST_DATABASE_URL`, las pruebas de integración se saltan; en el CI no pueden saltarse.** El
   CI las corre con `PRUEBAS_DE_INTEGRACION=obligatorias` contra un contenedor propio: si faltara la
   base, fallan diciéndolo en lugar de pasar sin comprobar nada.

### La exportación se lee por páginas y se escribe por piezas

1. **Tres lecturas nuevas por páginas de `FILAS_POR_PAGINA = 200`** (`paginasDeResultados`,
   `paginasDeEntradas`, `paginasDePendientes`), que devuelven `AsyncIterable<readonly T[]>`, perezosas y de
   un solo uso. El cursor es `(fecha, id)`: un orden total, así que dos filas con la misma hora no se
   repiten ni se saltan al partir una página. Cada página es su propia consulta y su propia sesión: no se
   mantiene una transacción abierta mientras el cliente lee despacio.
2. **El caso de uso solo lee lo acotado** (cuenta, aceptaciones, avisos, archivos, dato curioso) antes de
   responder. Si eso falla, la respuesta es un error de verdad con su código.
3. **La respuesta es un flujo** (`StreamableFile`): el mismo JSON, las mismas claves y el mismo orden, sin
   `Content-Length`. Una prueba compara el texto con el `JSON.stringify` del objeto entero.
4. **Si algo falla a mitad, la conexión se corta.** Con el cierre normal de Nest el cliente recibiría un
   `200` con medio archivo, que tardaría en descubrir roto. Cortada, la petición falla en la conexión
   (`ECONNRESET`) y se vuelve a intentar. Una prueba HTTP falla si alguien vuelve a `end()`.

## Alternativas consideradas

- **Pruebas: dejar `DATABASE_URL` y mirar el nombre de la base** (por ejemplo, que termine en `_test`).
  Descartada: un nombre no dice dónde está la base, y en PRE la base se llama `postgres`.
- **Pruebas: una variable para permitir bases remotas.** Descartada por lo dicho arriba.
- **Pruebas: fallar siempre si falta la base, en lugar de saltarse.** Descartada: obligaría a levantar
  una base para cambiar una línea de dominio, y eso termina con alguien comentando las pruebas.
- **Exportación: seguir armándola en memoria, con un tope de filas.** Descartada: una exportación
  recortada en silencio es peor que una lenta en un derecho de acceso a los propios datos.
- **Exportación: otro formato (NDJSON, un ZIP) o una tarea en segundo plano con enlace de descarga.**
  Descartada por ahora: cambia el contrato que el frontend lee con `res.json()`, y lo segundo es
  infraestructura nueva para un problema que el flujo ya acota.
- **Exportación: dejar el cierre normal si falla a mitad.** Descartada: es el caso que no se nota.

## Consecuencias

**Lo que se gana**

- Una configuración equivocada ya no puede apuntar las pruebas a PRE ni cambiarle la contraseña a
  `vsd_app` allí.
- La memoria del servidor al exportar ya no crece con el historial de la persona: ninguna consulta trae
  más de 200 filas.
- Un fallo a mitad de la exportación se ve como un fallo.

**Lo que se pierde o queda abierto**

- **La guardia compara el nombre del servidor.** Un túnel (`ssh -L 5432:...`) o un reenvío de puertos
  hacia una base remota se ve como `localhost` y pasa. Desde el código no se puede saber; lo que lo
  cierra es que la cuenta de base de datos de quien desarrolla no tenga permisos en PRE. Está dicho en el
  README (SCRUM-265).
- **El comando local cambia:** hay que exportar `TEST_DATABASE_URL` antes de correr las pruebas de
  integración. Quien solo tenga un `.env` ve que se saltan, y para eso está lo obligatorio del CI.
- **La exportación no es una foto de un instante.** Cada página es su propia consulta: lo que se escribe
  o se borra mientras se exporta puede aparecer o faltar. Para un archivo de datos propios es aceptable;
  si se necesitara una foto exacta, hay que leer todo dentro de una transacción de lectura, que es
  justo lo que se evitó.
- **El frontend sigue cargando todo en el navegador** (`res.json()`, y la descarga en PDF también): lo
  que se acotó es el servidor. Un corte de conexión tiene que tratarse allí como un error de descarga.
- **Sin `Content-Length`:** la respuesta va en trozos y el cliente no sabe de antemano cuánto falta.
- **`DATOS_EXPORTADOS` se registra cuando empieza la exportación, no cuando termina:** sigue siendo el
  rastro de quién la pidió, no de que le llegó completa.
- **Un fallo después de empezar a escribir no puede cambiar el código de estado:** ya salió `200`. Por
  eso la señal es el corte y no un error en el cuerpo.

## Cómo se comprobó

- Pruebas de integración contra PostgreSQL, con 450 filas y empates exactos en el límite de página, para
  los tres recorridos: páginas de 200, 200 y 50, el mismo orden que la base, sin repetir ni saltarse, solo
  lo de esa persona y sin páginas vacías.
- Prueba HTTP con 2.500 resultados (JSON válido), con el corte de la conexión a mitad (`ECONNRESET`, y
  falla si se vuelve a `end()`) y con que la exportación siguiente funciona.
- Pruebas de la guardia de la base de pruebas: los hosts permitidos y los que no, los tres parámetros que
  cambian el servidor, y que el mensaje no repite la URL.
