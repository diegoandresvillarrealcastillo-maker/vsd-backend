# ADR 0026: La baja de la cuenta borra todo y deja una constancia mínima

- **Estado:** aceptada (decisión D3 del ciclo 7, **corregible al probar y a revisar con asesoría
  jurídica**)
- **Fecha:** 2026-10-14
- **Tarea:** SCRUM-190 (`[C7-20]`). Lo completa el frontend con el texto de la confirmación.
- **Cambia un requisito:** el RF12 («se elimina todo lo suyo») pasa a «se elimina todo lo suyo,
  salvo la constancia de lo que aceptó».

## Contexto

Hasta ahora borrar la cuenta era un **borrado real**: se borraba la fila de `usuario` y, por
`ON DELETE CASCADE`, todo lo demás, más la identidad en Supabase Auth. Es lo más limpio para la
persona, pero tiene un costo que el sprint quiso corregir:

- **La Ley 1581 de 2012 obliga a poder demostrar la autorización** que la persona dio para tratar
  sus datos, y eso es lo primero que se perdía al borrar: la tabla `consentimiento` cuelga de
  `usuario` y se iba con ella. Ante una reclamación no había nada que mostrar.
- **La identidad ya no existe, pero su token sí.** Supabase firmó un token que sigue siendo válido
  hasta que caduca (hasta una hora). Con el borrado real, ese token no encontraba cuenta y la API
  respondía `CUENTA_NO_REGISTRADA`, que para el cliente significa «completa tu registro»: el alta
  habría creado **una cuenta nueva para una identidad que ya no existe**.

Lo que condiciona la decisión:

- **D3 (aprobada):** en la baja solo queda el esqueleto (identificador y fechas) y la prueba de
  consentimientos; se borra todo lo demás. **Sin retención de contenido de salud.**
- **Misma persona, mismo correo:** tiene que poder volver a registrarse sin colisión.
- **La exportación no puede devolver datos anonimizados como si fueran de la persona.**
- **Todo dato personal nuevo se borra solo.** Hoy lo garantiza una prueba que recorre cada tabla con
  `id_usuario`; la solución no puede obligar a acordarse de una lista.

## Decisión

1. **Dos tablas de constancia**, aparte de `usuario`:
   - `cuenta_inactiva`: el identificador que tuvo la cuenta, el identificador que el proveedor le dio
     a la identidad, cuándo se creó y cuándo se dio de baja, y lo último que aceptó (versión y fecha
     del aviso y de los términos).
   - `consentimiento_de_cuenta_inactiva`: lo que aceptó, versión por versión y con su fecha. Es la
     copia del historial de `consentimiento`.

   **Ninguna lleva nombre, correo, fecha de nacimiento, foto, mascota, diario ni respuestas.** Una
   constancia demuestra una autorización, no identifica a nadie.

2. **La baja borra todo lo vivo, como antes.** En una sola transacción: se anota la constancia, se
   borra la fila de `usuario` (y por `ON DELETE CASCADE`, resultados, diario, pendientes, avisos y el
   cursor del dato curioso), se borran los archivos de la persona (foto, mascota propia) y, por
   último, la identidad en Supabase. Si algo falla, **no queda nada hecho**: ni la baja ni la
   constancia. Lo irreversible va al final.

3. **La constancia solo se añade.** `vsd_app` tiene `INSERT` y, en `cuenta_inactiva`, `SELECT` por el
   identificador del token; no tiene `UPDATE` ni `DELETE`, y del historial de consentimientos no lee
   nada. Ambas con RLS forzado. Quien opera la base (rol de mantenimiento) es el único que puede
   consultarlas, y para demostrar la autorización.

4. **Un token de una cuenta dada de baja se rechaza con `401 CUENTA_INACTIVA`.** La guardia y el
   alta consultan `estaInactivadaPorProveedor` cuando no encuentran cuenta. Es **401 y no 403**: no
   falta completar nada, falta una sesión que sirva. El cliente, al ver un 401, cierra la sesión en
   ese dispositivo: así terminan las de los demás la próxima vez que preguntan. Esa es la
   **revocación de sesiones**: la identidad ya se borró en Supabase (no hay renovación posible) y
   la API no deja que el token vigente la resucite.

5. **El mismo correo puede volver a registrarse.** La fila de `usuario` ya no existe, así que el
   `UNIQUE` del correo no choca; Supabase entrega una identidad nueva y el alta crea una cuenta
   nueva y vacía, con otro identificador.

6. **Una orden que llega tarde no la vuelve a crear.** `save` era un `upsert`: una petición que cargó
   la cuenta antes de la baja y guarda después la habría creado de nuevo con su nombre y su correo.
   Ahora actualiza y, solo si no hay fila, comprueba que no esté dada de baja (la sesión de la persona
   ve su propia constancia) y responde `CUENTA_INACTIVA` en lugar de crearla.

7. **La exportación y todo lo demás ven una cuenta inexistente.** `findById` y
   `findByIdProveedorAuth` no la encuentran, y la guardia responde 401 antes de llegar a ningún caso
   de uso. No hay una fila anonimizada que se pueda confundir con la de la persona.

8. **El rechazo de un menor sigue siendo un borrado sin constancia** (`BorrarCuentaUseCaseImpl`,
   `BORRAR_SIN_CONSTANCIA`): una cuenta anterior a la fecha de nacimiento que resulta ser de un
   menor no tiene autorización válida que demostrar, y no se conserva nada, ni la constancia.

## Alternativas consideradas

- **Una columna `estado` (`INACTIVA`) en `usuario` y anonimizar la fila en el sitio.** Es lo que
  sugería el ticket. Descartada porque **falla hacia el lado malo**: cada columna y cada tabla nueva
  que guarde algo personal tiene que acordarse de limpiarse en la baja, y el olvido deja datos de
  salud de alguien que pidió que se borraran. Además deja el correo ocupado por el `UNIQUE` (habría
  que inventarle uno), obliga a que toda consulta recuerde excluir las inactivas, y permite que una
  petición en vuelo añada filas hijas a una cuenta ya dada de baja, porque la clave foránea sigue
  teniendo a quien apuntar. Con constancia aparte, lo nuevo se borra solo y la clave foránea impide
  añadir nada.
- **Seguir con el borrado real.** Es lo más simple, pero deja sin prueba de autorización y sin
  rechazo del token vigente.
- **Una cola de limpieza posterior** (marcar y borrar días después). Descartada: «sin retención de
  contenido de salud» (D3) pide que se borre en el momento, y una cola es otro sitio donde puede
  quedar algo.
- **Dejar el historial de consentimientos en `consentimiento` con `ON DELETE SET NULL`.** Obligaría a
  que `id_usuario` aceptara nulos y mezclaría lo vivo con lo que sobrevive. Descartada.

## Consecuencias

**Lo que se gana**

- La autorización se puede demostrar, y la constancia no identifica a nadie.
- Lo vivo se borra por la misma vía de siempre, sin una lista de campos que mantener.
- Un token vigente no resucita la cuenta, y el cliente cierra la sesión.
- Volver a registrarse es posible con el mismo correo.

**Lo que se pierde o queda abierto**

- **Se conserva algo de quien pidió borrarse.** Es mínimo (un identificador sin significado fuera de
  aquí, fechas y versiones) y es lo que la ley pide poder demostrar, pero **no es «todo»**. La
  política de privacidad dice hoy que se borra todo: **su texto debe actualizarse** (y eso cambia su
  versión), y quien lo decide es Diego con asesoría jurídica. No se tocó en este cambio.
  **Actualización (SCRUM-235, 2026-10-20):** el aviso de privacidad `2026-10-1` ya describe la
  constancia (qué se conserva, que no lleva nombre, correo, fecha de nacimiento ni datos de
  bienestar, y para qué se conserva) y los términos suben a `2026-10-2`. Sigue abierto el plazo de
  conservación de la constancia: el texto dice «mientras sea necesario para demostrar tu
  autorización», sin cifra.
- **No hay plazo de retención.** Las constancias se conservan mientras haga falta demostrar la
  autorización; cuánto es lo define la asesoría jurídica, y un purgado por plazo queda como trabajo
  pendiente.
- **No se puede reactivar una cuenta.** No es un olvido: «sin retención de contenido de salud»
  descarta que haya algo que reactivar.
- **El identificador del proveedor queda en la constancia.** Es opaco y la identidad ya no existe,
  pero es lo que permite rechazar el token; sin él no hay forma de saber que el token es de una
  cuenta dada de baja.
- **Mantenimiento necesita un rol que ignore RLS** para consultar o purgar las constancias. Es el
  mismo que ya hace las migraciones.
- **Una cuenta dada de baja da 401 y no 403 en todo.** El frontend ya cierra la sesión con un 401;
  quien lea el código `CUENTA_INACTIVA` puede, además, explicarlo.
- **Migración nueva** (`20261017120000_cuenta_inactiva`): la aplica una persona, con `db:estado`
  antes y después. Es aditiva (dos tablas), y el código nuevo falla sin ella al dar de baja.

## Cómo se comprobó

- Contrato común del repositorio (memoria y PostgreSQL): la cuenta deja de encontrarse, queda
  marcada para su identificador del proveedor, el correo queda libre, todo o nada, una orden tardía
  no la vuelve a crear, y dar de baja una que no existe o dos veces no es un error.
- Integración contra PostgreSQL con la aplicación como `vsd_app`: ninguna tabla con `id_usuario`
  conserva una fila; la constancia no tiene columnas ni contenido de nombre, correo o fecha de
  nacimiento; el token viejo da 401 en consulta, exportación, borrado y alta, sin crear nada; el
  mismo correo vuelve a registrarse con otra cuenta vacía; y la aplicación no puede leer, reescribir,
  borrar ni anotar a nombre de otra persona.
