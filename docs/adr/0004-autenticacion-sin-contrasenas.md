# ADR 0004 — Autenticacion sin contrasenas con Supabase Auth

- **Estado:** Aceptada
- **Fecha:** 2026-09-14
- **Ciclo:** 0

## Contexto

El entregable academico inicial contemplaba un campo `password_hash` en
la tabla `usuario`, es decir, autenticacion propia con contrasena.

Gestionar contrasenas implica hacerse cargo de: elegir y mantener un
algoritmo de derivacion adecuado, el flujo de recuperacion por correo,
la caducidad de los enlaces, la limitacion de intentos, el bloqueo por
fuerza bruta y la rotacion de sesiones. Es un area donde los errores son
faciles de cometer y caros de detectar, y donde el equipo son dos
estudiantes con un calendario academico.

A esto se suma que la aplicacion trata datos sensibles de salud: una
brecha de credenciales aqui no expone un carrito de compras.

## Decision

La identidad se delega en **Supabase Auth**, con acceso mediante enlace
magico o codigo de un solo uso enviado al correo. **VSD Health no
almacena contrasenas.** El campo `password_hash` se elimina del modelo y
se sustituye por `id_proveedor_auth`, que guarda el identificador que
Supabase asigna al usuario.

El backend verifica el JWT de cada peticion con `SUPABASE_JWT_SECRET`.

## Alternativas consideradas

### Autenticacion propia con contrasena

Es lo que decia el modelo original. Se descarto por la superficie de
riesgo descrita arriba: sin contrasenas almacenadas no hay contrasenas
que filtrar, ni que rotar, ni que reutilizar en otro sitio.

### Supabase Auth con contrasena

Delega el almacenamiento, que es la parte dificil, pero mantiene todos
los problemas de usabilidad de la contrasena: el usuario la olvida, la
reutiliza, o elige una debil. Para el publico de VSD Health, un enlace
al correo es mas simple.

### Inicio de sesion con Google o similar

Complementario, no excluyente. Supabase Auth lo admite y puede anadirse
mas adelante sin cambiar el modelo, porque `id_proveedor_auth` ya
abstrae de que proveedor viene la identidad.

## Consecuencias

### A favor

- No hay contrasenas que almacenar, cifrar, rotar ni filtrar.
- El flujo de recuperacion desaparece: acceder y recuperar son lo mismo.
- El correo queda verificado por el propio mecanismo de acceso.
- Menos codigo de seguridad propio significa menos codigo de seguridad
  propio que auditar.

### En contra

- **Dependencia de un proveedor externo.** Si Supabase Auth deja de
  responder, nadie puede entrar. `id_proveedor_auth` deja abierta la
  puerta a cambiar de proveedor sin rehacer el modelo de datos.
- **Depende del correo.** Sin acceso al correo no hay acceso a la
  aplicacion, y un correo que tarda en llegar se percibe como un fallo.
- Requiere conexion para iniciar sesion. La sesion ya iniciada sigue
  funcionando sin conexion, que es el caso de uso que importa.
