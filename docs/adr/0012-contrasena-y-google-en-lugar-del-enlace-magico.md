# ADR 0012 — Contrasena y Google en lugar del enlace magico

- **Estado:** Aceptada
- **Fecha:** 2026-09-22
- **Ciclo:** 5
- **Reemplaza a:** [ADR 0004](0004-autenticacion-sin-contrasenas.md)

## Contexto

El [ADR 0004](0004-autenticacion-sin-contrasenas.md) decidio que VSD
Health no tendria contrasenas: se entraria con un enlace magico o un
codigo de un solo uso enviados al correo. El razonamiento era solido y
sigue siendo cierto en lo que afirmaba: sin contrasenas almacenadas no
hay contrasenas que filtrar.

Lo que ese ADR no midio fue el coste del correo, porque en el Ciclo 0
todavia no habia nada que enviar.

Al construir las pantallas de acceso en el Ciclo 5 ese coste aparecio
entero y medido:

- El remitente gratuito de Supabase permite **dos correos por hora**.
  Con enlace magico, cada inicio de sesion consume uno. Dos personas
  probando la aplicacion agotan la cuota antes de terminar de probarla.
- Al mover el envio a un servicio propio (Brevo), el limite subio a
  treinta por hora, pero los correos **llegan a la carpeta de spam**.
  Se envian desde una direccion `@gmail.com` a traves de un tercero, y
  Gmail no puede comprobar que ese envio este autorizado. Se arregla
  con un dominio propio, que hoy no existe.
- Un enlace de un solo uso **va atado al navegador que lo pidio**.
  Abrirlo en el telefono cuando se pidio en el computador falla, y el
  mensaje de error no puede explicar por que sin revelar demasiado.

Con enlace magico, esos tres problemas se pagan **en cada inicio de
sesion**. Con contrasena se pagan solo al recuperar, que es algo que
ocurre pocas veces.

A esto se suma que el Entregable IV, que es la fuente formal del
proyecto, especifica autenticacion con contrasena. Sostener la
divergencia obligaba a defenderla en tres documentos a la vez.

## Decision

Se entra con **correo y contrasena**, y de forma opcional con **Google**.

La identidad se sigue delegando en **Supabase Auth**: es Supabase quien
guarda y verifica la contrasena. **La tabla `usuario` de VSD Health
sigue sin tener `password_hash`**, y sigue guardando unicamente
`id_proveedor_auth`.

Esa distincion es el nucleo de esta decision: se recupera la
**usabilidad** de la contrasena sin recuperar la **responsabilidad** de
almacenarla.

El correo se sigue usando en dos momentos, no en todos:

- al crear la cuenta, para confirmar que la direccion existe;
- al recuperar la contrasena, cuando se olvida.

El backend verifica el JWT de cada peticion, igual que antes. Esa parte
del ADR 0004 no cambia.

## Alternativas consideradas

### Mantener el enlace magico y arreglar el correo primero

Comprar un dominio, verificarlo en Brevo y configurar SPF y DKIM
resuelve el spam, y el limite de treinta por hora alcanza para un
proyecto academico.

Se descarto por orden de dependencias: eso deja el acceso a la
aplicacion **bloqueado detras de un tramite y un gasto**, con fecha de
entrega encima. Y aunque el correo llegue perfecto, siguen en pie la
atadura al navegador y el hecho de que sin bandeja de entrada no se
entra.

Nada impide comprar el dominio despues. Con contrasena, hacerlo mejora
la confirmacion y la recuperacion; sin ella, era condicion para poder
entrar.

### Contrasena propia, no delegada

Es lo que decia literalmente el Entregable IV. Se descarto por lo mismo
que en el ADR 0004: obliga a hacerse cargo del algoritmo de derivacion,
la caducidad de los enlaces, el limite de intentos y la rotacion de
sesiones. Seis sitios donde equivocarse, en un equipo de dos personas.

### Solo Google, sin contrasena

Quita el problema del correo de raiz y no exige recordar nada.

Se descarto porque obliga a tener cuenta de Google para usar una
herramienta de bienestar, y porque le cuenta a un tercero cuando entra
cada persona. Ademas depende de un tramite en Google Cloud que a la
fecha de esta decision no esta terminado.

Queda como **opcion**, no como unica puerta.

## Consecuencias

### A favor

- Entrar no depende del correo. Es el cambio que de verdad importa.
- La aplicacion deja de estar limitada por la cuota de envio.
- Desaparece la atadura al navegador en el caso frecuente. Sigue
  existiendo al recuperar, que es el caso raro.
- El sistema deja de divergir del Entregable IV en este punto.
- Google queda disponible para quien prefiera no recordar una
  contrasena.

### En contra

- **Vuelve a haber contrasenas.** Aunque no las guardemos nosotros,
  ahora se pueden olvidar, reutilizar en otro sitio y elegir debiles.
  Eso es exactamente lo que el ADR 0004 evitaba, y hay que decirlo sin
  rodeos.
- **Aparece un flujo de recuperacion** que antes no existia, con sus
  enlaces caducables y su limite de intentos. Lo implementa Supabase,
  pero hay que probarlo y mantenerlo.
- **Hace falta una politica de contrasena.** Hoy es el minimo de ocho
  caracteres que impone Supabase. El rechazo de contrasenas filtradas
  contra Pwned Passwords **solo esta en el plan de pago**, asi que no
  se puede activar.
- La dependencia de Supabase Auth sigue igual de fuerte que en el ADR 0004. `id_proveedor_auth` sigue siendo lo que permitiria cambiar de
  proveedor sin rehacer el modelo.
- **Los correos de confirmacion y recuperacion siguen cayendo en
  spam.** Ya no bloquean el acceso, pero si estorban al registrarse y
  al recuperar. Las pantallas lo advierten de forma explicita mientras
  no exista dominio propio.

## Lo que este ADR no cambia

- El JWT se sigue verificando en el backend.
- La tabla `usuario` no gana ningun campo.
- El aislamiento entre personas lo sigue imponiendo la base de datos,
  no la autenticacion. Ver [ADR 0010](0010-aislamiento-en-la-base-de-datos.md).
