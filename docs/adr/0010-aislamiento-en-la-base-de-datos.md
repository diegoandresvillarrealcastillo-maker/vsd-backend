# ADR 0010: El aislamiento entre personas lo impone la base de datos

- **Estado:** aceptado
- **Fecha:** 2026-09-16
- **Tarea:** SCRUM-59
- **Sustituye en parte a:** nada. Complementa al ADR 0003 (UUID como clave primaria).

## Contexto

La restriccion del proyecto no admite matices: una persona jamas podra acceder
a informacion de otra, aunque conozca su UUID, su identificador, la URL o el
endpoint. Y la seguridad no puede depender de una sola capa.

Hasta el Ciclo 4 esa regla vivia entera en el caso de uso. Funciona mientras
cada consulta se acuerde de filtrar por persona. El problema no es la consulta
que hay hoy, es la que se escriba manana: un `findMany` sin `where`, un
endpoint nuevo de historial, un informe que junte tablas. Ninguno de esos
fallos da error. Devuelven datos de mas con toda normalidad, y la unica forma
de enterarse es que alguien lo note.

Hay un segundo problema, mas silencioso. La clave de idempotencia
`id_operacion_cliente` era unica en toda la tabla. Enviar el identificador de
otra persona daba `404`; enviar uno inventado daba `201`. Nadie llegaba a ver
datos ajenos, pero la diferencia entre las dos respuestas convierte el endpoint
en un oraculo: probando identificadores se puede averiguar cuales existen. Es
exactamente lo que la restriccion dice que no puede pasar, aunque no se filtre
ni un campo.

## Decision

**Row Level Security en PostgreSQL, y la clave de idempotencia unica por
persona.**

### Como sabe la base quien pregunta

No hay un usuario de PostgreSQL por persona: son miles y la conexion se
reutiliza. La identidad viaja en una variable de sesion, `vsd.usuario_actual`,
que la aplicacion fija con `set_config(..., true)` dentro de la transaccion.

El `true` es lo importante: ata la variable a la transaccion. Sin el se quedaria
pegada a la conexion, y con un pool en modo transaccion como el de Supabase la
siguiente peticion heredaria la identidad de la anterior. Ese fallo no se nota
hasta que alguien ve datos que no son suyos.

Si nadie la fija vale `NULL`, y toda comparacion contra `NULL` es falsa. Sin
sesion no se ve nada. **Se cierra por defecto.**

### Quien se conecta

Un rol dedicado, `vsd_app`, que no es superusuario, no es dueno de ninguna
tabla y no tiene `BYPASSRLS`. Sin eso nada de lo anterior sirve: el dueno de
una tabla esta exento de sus politicas, y un rol privilegiado ni las evalua.

La migracion lo crea **sin contrasena y sin permiso de conexion**. Una
migracion se versiona en Git, y una contrasena en Git es una contrasena
publicada. Darle acceso es un paso manual por ambiente, una sola vez.

Las tablas con datos personales llevan ademas `FORCE ROW LEVEL SECURITY`, que
somete tambien al dueno. Es la red por si algun dia alguien conecta la
aplicacion con el usuario de las migraciones.

### La idempotencia pasa a ser por persona

`UNIQUE (id_usuario, id_operacion_cliente)` en lugar de `UNIQUE
(id_operacion_cliente)`. Usar el identificador de otra persona deja de ser un
caso especial: se registra un resultado propio, como cualquier otra peticion, y
no hay dos respuestas que comparar.

La idempotencia no pierde nada. Lo que protege es que un mismo dispositivo no
duplique su propia operacion al reintentar, y eso siempre ocurre dentro de una
misma cuenta.

## Alternativas descartadas

**Dejarlo en el caso de uso y probarlo mejor.** Mas pruebas no cubren el
endpoint que aun no existe. El problema no es que el codigo de hoy este mal, es
que la regla depende de que nadie se despiste nunca.

**`auth.uid()` de Supabase.** Es lo natural cuando el cliente habla con
PostgREST usando su JWT. Aqui el que habla con la base es nuestro backend, con
una conexion propia, asi que `auth.uid()` no tendria nada que leer. Ademas
ataria las politicas a Supabase, y las pruebas de integracion corren contra un
PostgreSQL normal.

**Un usuario de PostgreSQL por persona.** Es el aislamiento mas fuerte que
existe, y es inviable: miles de roles, ningun pool aprovechable y una migracion
por cada alta.

**Devolver `404` tambien ante una operacion inexistente,** para igualar las dos
respuestas sin tocar el esquema. Habria cerrado el oraculo, pero rompiendo la
idempotencia: un reintento legitimo tras un corte de red pasaria a fallar.

## Consecuencias

**A favor**

- Una consulta que olvide filtrar no devuelve de mas: devuelve de menos.
- El administrador no puede leer resultados, entradas de diario ni datos
  personales. Las politicas ni mencionan su rol: es una persona mas y ve lo
  suyo. Lo que el entregable prometia, ahora el motor no lo permite.
- Conocer un UUID ajeno deja de servir para nada, incluso para saber que existe.
- Las politicas se versionan como migracion. No se configuran a mano en el
  panel de Supabase, donde nadie las revisa ni quedan en la historia.

**En contra, y hay que decirlo**

- **Esto no protege contra un backend comprometido.** Quien controle el proceso
  puede declarar la identidad que quiera. Protege contra nuestros propios
  errores, que es de lo que mas hay. La capa que falta es la autenticacion, y
  llega en el Ciclo 5.
- Cada operacion sobre datos personales abre una transaccion. Es el coste de
  que la identidad sea local a ella.
- Si alguien conecta la aplicacion como dueno de las tablas, el aislamiento
  desaparece sin dar ningun error. Por eso la aplicacion lo comprueba al
  arrancar y, fuera de desarrollo, se niega a arrancar.
- Una tabla nueva nace sin acceso para `vsd_app` y sin politicas. Falla
  haciendo ruido, que es lo que se busca, pero hay que acordarse de anadirlas.
  Hay una prueba que falla si alguna tabla se queda sin RLS.
