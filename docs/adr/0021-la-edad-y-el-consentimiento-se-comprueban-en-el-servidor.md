# ADR 0021: La edad y el consentimiento se comprueban en el servidor

- **Estado:** aceptado
- **Fecha:** 2026-10-07
- **Tarea:** auditoria 360, T-01 (hallazgos S-01, S-02 y L-05). Lo completa T-03
  en `vsd-frontend`.

## Contexto

La plataforma es **estrictamente para mayores de 18 anos** por la privacidad de
los datos: la Ley 1581 de 2012 pide garantias adicionales para tratar datos de
menores, y mas aun si son de salud. La auditoria encontro que nada lo
comprobaba:

- `EDAD_MINIMA = 18` existia en `User.ts` y solo la usaba una prueba. El
  registro no pedia fecha de nacimiento, ni la API la recibia.
- El consentimiento se registraba solo. El panel mandaba la version del aviso
  en cada carga, y quien entraba con Google quedaba con consentimiento sin haber
  marcado ninguna casilla. La Ley exige autorizacion **expresa**.
- Aceptar un aviso nuevo habria sobrescrito la columna y borrado la prueba de
  lo que se acepto antes.

Lo que condiciona la decision:

- **Lo unico fiable es lo que corre en el servidor.** Un formulario que pide la
  fecha es una cortesia: quien llama a la API directamente se lo salta.
- **La identidad se crea antes de llegar a la API.** Supabase registra el
  correo y la contrasena (o la cuenta de Google) y despues el frontend llama a
  `POST /api/cuenta`. Cuando la API se entera de que es menor, ya existe una
  identidad con su correo.
- **Hay cuentas.** Las de PRE se crearon sin fecha ni casillas, y no se pueden
  inventar.

## Decision

1. **La API exige la fecha de nacimiento y las dos casillas para crear una
   cuenta.** `POST /api/cuenta` recibe `fechaNacimiento` (AAAA-MM-DD),
   `aceptaAviso` y `aceptaTerminos` (booleanos que tienen que ser `true`) y las
   versiones vigentes de los dos textos. Enviar solo la version ya no basta.
2. **La edad se calcula en el servidor, con el dia local de la persona.** No
   con UTC ni con un calculo del cliente. Los nacidos un 29 de febrero cumplen el
   1 de marzo en los anos que no son bisiestos.
3. **Un menor no queda registrado.** La respuesta es 403 `MENOR_DE_EDAD`, no se
   crea la fila de `usuario` y se borra su identidad en Supabase Auth, por la
   misma via que el borrado de cuenta. Si esa llamada falla, igual se rechaza y
   se anota, sin la fecha ni el correo, que hay que limpiarla a mano. La edad
   se comprueba antes que el consentimiento: a un menor no se le pide aceptar,
   se le rechaza.
4. **Se guarda la fecha de nacimiento completa** (decision D1 de la
   auditoria), no solo una marca de mayoria de edad. Es la prueba de lo que la
   persona declaro, sale en su exportacion y se borra con la cuenta. Un
   `CHECK` en la base impide guardar la de un menor, con un dia de margen por la
   diferencia de zona.
5. **Los terminos se aceptan aparte del aviso**, con su version y su fecha: son
   dos documentos y cada uno cambia por su lado.
6. **El historial de lo aceptado es una tabla de solo altas**,
   `consentimiento`. La aplicacion no tiene permiso de `UPDATE` ni de `DELETE`.
   `usuario` sigue guardando lo vigente. Lo que las cuentas existentes habian
   aceptado se copia al historial en la migracion.
7. **Las cuentas anteriores completan su registro al volver a entrar** (D2).
   Hasta entonces `GuardiaDeCuenta` les responde 403 `REGISTRO_INCOMPLETO`,
   salvo en consultar, exportar y borrar la cuenta (`@PermiteRegistroIncompleto`):
   son derechos que no se condicionan, y quien no quiera completar el registro
   tiene que poder irse con lo suyo. La marca va por exclusion: una ruta nueva
   exige el registro completo sin que nadie tenga que acordarse.

## Alternativas consideradas

- **Guardar solo "es mayor de edad".** Menos dato personal, pero sin prueba de
  lo declarado y sin forma de revisar el calculo si la regla cambia. Descartada
  por D1.
- **Calcular la edad en el frontend y mandar un booleano.** Cualquiera puede
  mandar `true`. Descartada: la regla es del servidor.
- **Un Auth Hook "Before User Created" en Supabase, como unica barrera.** Evitaria
  que la identidad llegara a crearse, pero depende del plan de Supabase (D4) y
  de configuracion fuera del repositorio. Queda como barrera adicional cuando se
  confirme el plan; esta decision no depende de ella.
- **Bloquear a las cuentas anteriores sin dejarles borrar ni exportar.**
  Descartada: negar el acceso a los datos propios incumple el derecho de acceso
  y supresion.
- **Reescribir las columnas de consentimiento al aceptar un texto nuevo.**
  Descartada: borra la prueba de lo que se acepto antes.

## Consecuencias

**Lo que se gana.** La regla de los 18 anos y el consentimiento expreso dejan
de depender de que el formulario se porte bien. Hay una prueba de lo que cada
persona declaro y acepto, version por version. Un menor no deja correo ni datos.

**Lo que se pierde o se acepta.**

- **Un dato personal mas**: la fecha de nacimiento. Es sensible y por eso solo
  sale en la exportacion de la propia persona; `GET /api/cuenta` no la devuelve.
- **Una persona puede mentir sobre su fecha.** Es inevitable sin verificar un
  documento, que quedaria fuera de alcance. Lo que se garantiza es que la
  plataforma pidio, comprobo y guardo la declaracion.
- **Queda una ventana pequena.** Tras rechazar a un menor se borra su identidad,
  pero el token que ya tenia sigue siendo valido hasta que caduque (una hora).
  Con el, podria volver a llamar a `POST /api/cuenta` con otra fecha. Es la
  misma mentira de arriba, no un fallo nuevo, y el resultado seria una fila
  huerfana cuya identidad ya no existe y que nadie puede usar.
- **Las cuentas anteriores quedan bloqueadas hasta completar el registro.** Es
  el precio de no inventar lo que nunca dieron.
- **El frontend y el backend tienen que salir juntos.** Mientras el frontend no
  mande la fecha y las casillas (T-03), una cuenta nueva no se puede crear y
  las anteriores no pueden usar nada. Los dos PR se promocionan a la vez.
- **Una escritura mas en cada `save` de la cuenta** (el historial, con
  `ON CONFLICT DO NOTHING`). Es una fila por cuenta cada vez que cambia lo
  aceptado, y una sentencia sin efecto el resto.

## Pendiente fuera de este ADR

- Los textos del aviso y de los terminos y sus paginas publicas (T-02): las
  versiones `2026-09-1` y `2026-10-1` son identificadores, todavia sin texto
  publicado.
- La pantalla de rechazo, la de "Completa tu registro" y las casillas con enlaces
  (T-03).
- El Auth Hook "Before User Created" en Supabase, segun el plan (D4).
