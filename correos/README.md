# Correos de VSD Health

Los correos que manda Supabase Auth, con la identidad visual de la app
(SCRUM-125 y SCRUM-171). Son siete, de tres clases, y salen de **una sola
plantilla**, así que se ven igual. Cada uno lo encabeza una mascota: Fungito,
Obsidian o Ojo de Gato.

| Clase    | Qué hace la persona         | Correos                                                          |
| -------- | --------------------------- | ---------------------------------------------------------------- |
| `enlace` | Toca un botón               | Confirmar la cuenta, recuperar la contraseña, cambiar el correo  |
| `codigo` | Escribe un código en la app | Reautenticación (cambiar la contraseña desde el perfil)          |
| `aviso`  | Solo lo lee; no lleva botón | Contraseña cambiada, correo cambiado, método de acceso vinculado |

Los correos propios de la aplicación (avisos, resúmenes) quedan fuera: exigen un
proveedor de envío y una clave nueva. Tampoco se tocan las plantillas que
Supabase no usa aquí: enlace mágico e invitación (ver el
[ADR 0012](../docs/adr/0012-contrasena-y-google-en-lugar-del-enlace-magico.md)).

## Qué hay aquí

| Qué                                                            | Para qué                                                                        |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [`plantilla.html`](plantilla.html)                             | La plantilla maestra: estructura, estilos y modo oscuro                         |
| [`piezas/`](piezas/)                                           | Lo que cambia según la clase: el botón con su enlace, o la caja del código      |
| [`../src/correos/contenidos.ts`](../src/correos/contenidos.ts) | Lo que dice cada correo: asunto, mascota, título, párrafos, pasos, botón y nota |
| [`../src/correos/paleta.ts`](../src/correos/paleta.ts)         | Colores y tipografías, tomados de los tokens de la app                          |
| [`generados/`](generados/)                                     | **Lo que se pega en Supabase**: la plantilla con cada texto                     |

`npm run correos` combina la plantilla, la pieza que toca y cada texto, y escribe
`generados/`.

## Qué pegar, qué activar y qué dejar

En el panel de Supabase del proyecto: **Authentication → Emails → Templates**
(`/dashboard/project/<ref>/auth/templates`). La página tiene dos grupos:
_Autenticación_ (correos que la app provoca) y _Seguridad_ (avisos que Supabase
manda cuando algo de la cuenta cambia, y que vienen **apagados**).

Una plantilla que no se pega sale con el texto por defecto de Supabase: en inglés
y sin la identidad de la app. Por eso la regla es una sola: **si se usa o se
activa, se pega la nuestra.**

### Autenticación

| Fila en Supabase            | Plantilla (API)      | ¿Lo usa la app?                                                                                    | Qué hacer                                 |
| --------------------------- | -------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Confirmar registro          | Confirm sign up      | **Sí**: al crear la cuenta                                                                         | Pegar `confirmar-cuenta.html`             |
| Restablecer contraseña      | Reset password       | **Sí**: al recuperar el acceso                                                                     | Pegar `recuperar-contrasena.html`         |
| Reautenticación             | Reauthentication     | **Sí**: al cambiar la contraseña desde el perfil (`reauthenticate()`), porque el proyecto la exige | Pegar `codigo-de-verificacion.html`       |
| Cambiar dirección de correo | Change email address | No hay pantalla para hacerlo, pero la API de Supabase lo permite a quien tenga la sesión iniciada  | Pegar `cambiar-correo.html`, por si acaso |
| Invitar al usuario          | Invite user          | No: nadie invita a nadie                                                                           | Dejar como está                           |
| Enlace mágico o OTP         | Magic link or OTP    | No: se entra con contraseña o Google (ADR 0012)                                                    | Dejar como está                           |

### Seguridad (los interruptores)

| Fila en Supabase                            | ¿Conviene?                                                                                                                              | Qué hacer                                                  |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Contraseña cambiada                         | **Sí.** Es la señal más clara de que alguien tomó una cuenta, y la app tiene dos caminos que cambian la contraseña (recuperar y perfil) | Pegar `aviso-contrasena-cambiada.html` y **luego** activar |
| Dirección de correo cambiada                | **Sí.** Un correo nuevo suele ser lo último que hace quien se queda con una cuenta, y el aviso es la forma de que la persona se entere  | Pegar `aviso-correo-cambiado.html` y **luego** activar     |
| Método de inicio de sesión vinculado        | **Sí.** La app ofrece Google: si alguien con acceso a ese correo lo vincula a una cuenta que ya existía, la persona se entera           | Pegar `aviso-metodo-vinculado.html` y **luego** activar    |
| Método de inicio de sesión eliminado        | No: la app no tiene pantalla para desvincular nada                                                                                      | Dejar apagado                                              |
| Número de teléfono cambiado                 | No: la app no pide ni usa teléfono                                                                                                      | Dejar apagado                                              |
| Método de verificación agregado o eliminado | No: no hay verificación en dos pasos                                                                                                    | Dejar apagado                                              |

Si algún día se agrega una de esas funciones a la app (desvincular Google,
teléfono, verificación en dos pasos), se activa el aviso correspondiente y se
escribe su texto en `contenidos.ts`: el generador ya sabe hacerlo.

**Primero la plantilla y después el interruptor.** Al revés, durante unos
minutos saldría el aviso por defecto, en inglés.

Cada aviso cuesta un correo más. Con el límite actual de 30 por hora de Brevo
(ver el [ADR 0012](../docs/adr/0012-contrasena-y-google-en-lugar-del-enlace-magico.md))
sobra: cambiar la contraseña desde
el perfil manda dos (el código y el aviso), y recuperarla, dos también (el
enlace y el aviso).

### Paso a paso

1. Entrar al proyecto de Supabase del ambiente (**PRE**: el de Samuel; con rol
   _Developer_ puede que no deje guardar, y entonces lo hace él con estos mismos
   pasos).
2. Comprobar la _Site URL_ (ver abajo).
3. **Authentication → Emails → Templates.** Por cada fila de las tablas de arriba
   que diga «Pegar»:
   1. Abrir la fila.
   2. En el **asunto**, escribir el de la tabla de abajo.
   3. En el **contenido**, borrar todo lo que hay y pegar el archivo completo de
      `generados/` (abrirlo, _Ctrl+A_, _Ctrl+C_).
   4. Guardar y mirar la vista previa.
4. En _Seguridad_, para cada aviso a activar: hacer lo mismo con su fila y, ya
   guardada la plantilla, encender el interruptor.
5. Probar, como se explica al final.

| Fila en Supabase                     | Asunto                                                   | Contenido (pegar el archivo completo)                                                  |
| ------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Confirmar registro                   | Confirma tu cuenta en VSD Health                         | [`generados/confirmar-cuenta.html`](generados/confirmar-cuenta.html)                   |
| Restablecer contraseña               | Elige una contraseña nueva en VSD Health                 | [`generados/recuperar-contrasena.html`](generados/recuperar-contrasena.html)           |
| Reautenticación                      | Tu código de verificación de VSD Health                  | [`generados/codigo-de-verificacion.html`](generados/codigo-de-verificacion.html)       |
| Cambiar dirección de correo          | Confirma tu nuevo correo en VSD Health                   | [`generados/cambiar-correo.html`](generados/cambiar-correo.html)                       |
| Contraseña cambiada                  | Cambió la contraseña de tu cuenta en VSD Health          | [`generados/aviso-contrasena-cambiada.html`](generados/aviso-contrasena-cambiada.html) |
| Dirección de correo cambiada         | Cambió el correo de tu cuenta en VSD Health              | [`generados/aviso-correo-cambiado.html`](generados/aviso-correo-cambiado.html)         |
| Método de inicio de sesión vinculado | Se vinculó un método de acceso a tu cuenta en VSD Health | [`generados/aviso-metodo-vinculado.html`](generados/aviso-metodo-vinculado.html)       |

Si prefieren la API de gestión de Supabase, los campos son estos (el interruptor
de cada aviso es `mailer_notifications_<nombre>_enabled`). Pide un token de
acceso personal, que no pasa por Git ni por ningún chat: el panel es el camino
más simple.

| Correo                     | Asunto                                          | Contenido                                                |
| -------------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| Confirmar registro         | `mailer_subjects_confirmation`                  | `mailer_templates_confirmation_content`                  |
| Restablecer contraseña     | `mailer_subjects_recovery`                      | `mailer_templates_recovery_content`                      |
| Reautenticación            | `mailer_subjects_reauthentication`              | `mailer_templates_reauthentication_content`              |
| Cambiar correo             | `mailer_subjects_email_change`                  | `mailer_templates_email_change_content`                  |
| Contraseña cambiada        | `mailer_subjects_password_changed_notification` | `mailer_templates_password_changed_notification_content` |
| Correo cambiado            | `mailer_subjects_email_changed_notification`    | `mailer_templates_email_changed_notification_content`    |
| Método de acceso vinculado | `mailer_subjects_identity_linked_notification`  | `mailer_templates_identity_linked_notification_content`  |

### Antes de pegar: la _Site URL_

El logo, la mascota y el enlace del pie salen de `{{ .SiteURL }}`, la **Site URL**
de _Authentication → URL Configuration_. Así la misma plantilla sirve en PRE y en
PROD sin dominios escritos a mano, y **no hay que volver a pegar nada cuando se
suban los GIF**. Eso obliga a que esa URL sea la **de la PWA** de ese ambiente:

- **PRE:** `https://vsd-health-pre.vercel.app`
- **PROD:** la del proyecto de Vercel de producción, cuando exista.

Se comprueba abriendo `<Site URL>/icono-192.png`: tiene que mostrar el isotipo
verde. Si la Site URL es otra (por ejemplo `http://localhost:3000`, que es el
valor por defecto de Supabase), el logo y la mascota salen rotos.

### Las mascotas: dónde poner los GIF

Cada correo pide su mascota a `{{ .SiteURL }}/correo/<archivo>.gif`, o sea, a la
carpeta `public/correo/` de **`vsd-frontend`**. Los GIF los aporta el equipo; la
plantilla ya los espera con estos nombres, y los correos nuevos reutilizan las
mismas tres mascotas:

| Mascota     | Archivo en `vsd-frontend/public/correo/` | La encabeza                                                       |
| ----------- | ---------------------------------------- | ----------------------------------------------------------------- |
| Fungito     | `fungito.gif`                            | Confirmar la cuenta                                               |
| Obsidian    | `obsidian.gif`                           | Recuperar contraseña, código de verificación, contraseña cambiada |
| Ojo de Gato | `ojo-de-gato.gif`                        | Cambiar el correo, correo cambiado, método de acceso vinculado    |

Para que se vean bien:

- **Cuadrados, de 280 × 280 px.** Se muestran a 140 px, así que se ven nítidos
  en pantallas de alta densidad. Si no son cuadrados se deforman: la plantilla
  fija el ancho y el alto porque Outlook de escritorio los exige.
- **Fondo transparente**, para que el mismo GIF sirva sobre la cabecera clara y
  la oscura.
- **Menos de unos 300 KB cada uno** y con la animación en bucle. Un GIF pesado
  tarda en salir y, en datos móviles, la persona ve primero el hueco.
- **El primer cuadro tiene que servir solo.** Outlook de escritorio no anima los
  GIF: muestra ese primer cuadro y nada más.
- Se comprueba abriendo `<Site URL>/correo/fungito.gif` en el navegador. Mientras
  el archivo no esté, el correo muestra el nombre de la mascota donde iría la
  imagen y todo lo demás funciona.

El nombre de la mascota es el texto alternativo de la imagen (`alt`). Para
cambiar una mascota o su archivo se edita `mascota` en `contenidos.ts` y se
vuelve a generar.

### PRE ahora, PROD después

Se pega primero en PRE y se prueba. PROD sigue en pausa
([`docs/ambientes.md`](../docs/ambientes.md)): cuando se retome, son los mismos
archivos con la Site URL de PROD. Las plantillas **no se aplican solas**: las
pega una persona del equipo.

## Cómo se cambia algo

1. Editar la plantilla, una pieza, la paleta o un texto.
2. `npm run correos`.
3. Subir el cambio **junto con** `generados/`. Una prueba falla si lo guardado
   no es exactamente lo que se genera, así nadie edita un archivo a mano y se
   olvida de los otros.
4. Pegar de nuevo en Supabase (PRE, y PROD cuando exista).

Los colores salen de los tokens de la app (`--app-*` en `vsd-frontend`,
`src/estilos/aplicacion.css`). Si cambian allí, hay que cambiarlos en
`paleta.ts`.

## Cómo está hecha, y por qué

Un correo no es una página web. Los clientes de correo (Gmail, Outlook) recortan
o ignoran casi todo lo que un navegador entiende, y por eso:

- **Los estilos van dentro de cada etiqueta.** El bloque `<style>` solo mejora
  (modo oscuro, pantallas pequeñas y el movimiento del botón): sin él, el correo
  se ve bien.
- **La estructura es de tablas**, porque Outlook de escritorio dibuja con el
  motor de Word. El botón lleva su relleno también en la celda por la misma
  razón.
- **Modo oscuro:** `prefers-color-scheme` para Apple Mail y la mayoría de
  clientes, y los atributos `data-ogsc` y `data-ogsb` para Outlook.com y su app.
  Gmail oscurece por su cuenta; los colores de la paleta sobreviven a ese
  proceso.
- **Sin fuentes web, sin scripts, sin imágenes incrustadas.** Tipografías del
  sistema (serif para los títulos, como en la app). Las únicas imágenes son el
  isotipo y el GIF de la mascota, las dos del propio sitio; el nombre va al lado
  del isotipo en texto y el de la mascota es su `alt`, así que con las imágenes
  bloqueadas el correo sigue diciendo de quién es.
- **El movimiento es una mejora, no lo esencial.** La animación de la mascota es
  el GIF. El botón cambia de color, sube un poco y proyecta sombra al pasar el
  cursor, con una transición de 0,25 s: eso solo lo dibujan los clientes que
  entienden `:hover` y `transition` (por ejemplo, Apple Mail), y en el celular
  no hay cursor. En los demás el botón queda quieto y funciona igual. Quien
  tiene activado «reducir movimiento» no recibe transición ni desplazamiento, y
  el botón tiene foco visible para quien navega con teclado. No hay
  `@keyframes`: casi ningún cliente los respeta y no se necesitan.
- **El botón es grande y redondo:** 52 px de alto (los dedos piden al menos 44),
  esquinas completamente redondeadas y ancho completo en pantallas pequeñas.
  Outlook de escritorio ignora `border-radius`: ahí se ve con esquinas rectas,
  pero igual de grande y funcional.
- **El código se escribe en el correo**, en una caja con letra de ancho fijo y
  de 32 px, para que las cifras no se confundan y se lean en el celular. El
  asunto nunca lleva el código: se leería en la pantalla bloqueada.
- **Un aviso no dice «ignóralo».** Si la persona no fue quien hizo el cambio,
  tiene que hacer algo, y el correo le dice qué, sin alarma; a quien sí fue, le
  dice que no tiene que hacer nada más.
- **Cada texto cumple 4,5:1 de contraste** (WCAG AA), en claro y en oscuro.
- **Ningún dato de salud ni de la persona**: solo lo que hace el botón. Cada
  correo recibe únicamente las variables que Supabase le da a **su** plantilla
  (`{{ .Token }}` en el código, `{{ .OldEmail }}` y `{{ .Email }}` en el aviso de
  correo cambiado, `{{ .Provider }}` en el de método vinculado, `{{ .NewEmail }}`
  al cambiar de correo) y una prueba lo comprueba. `{{ .Email }}` no se usa
  fuera de ese aviso (en el cambio de correo es el anterior) ni `{{ .Data }}`.
- **Cambio de correo seguro:** si en Supabase está activo, el mismo correo llega
  a la dirección vieja y a la nueva. El texto sirve para las dos.

## Qué se comprueba solo, y qué no

`npm test` (`src/correos/construirCorreos.spec.ts`) vigila todo lo anterior:
las variables de cada plantilla, estilos en cada etiqueta, sin scripts ni
dominios fijos, modo oscuro completo, contraste, ausencia de palabras de salud,
que el aviso diga qué hacer y que `generados/` esté al día. Además se vieron en
un navegador, en claro, en oscuro y a 375 px.

**No se probó en clientes reales.** Lo que sigue lo hace una persona al pegar en
PRE, creando una cuenta de prueba y provocando cada correo:

- [ ] Gmail (web y app), en claro y en oscuro.
- [ ] Outlook.com u Outlook de escritorio, en claro y en oscuro.
- [ ] Apple Mail o el correo del iPhone, en oscuro.
- [ ] Con las imágenes bloqueadas: se lee el nombre y el botón funciona.
- [ ] Con los GIF ya subidos: se animan en Gmail y en Apple Mail, y Outlook de
      escritorio muestra su primer cuadro.
- [ ] El botón cambia de color al pasar el cursor en un cliente de escritorio.
- [ ] El botón y el enlace escrito llevan a la app (confirmar entra; recuperar
      abre «contraseña nueva»).
- [ ] En el cambio de correo, el texto nombra la dirección nueva.
- [ ] Cambiar la contraseña desde el perfil: llega el código, se escribe en la
      app, y después llega el aviso de contraseña cambiada.
- [ ] Recuperar la contraseña: llega el enlace y, al elegir la nueva, el aviso.
- [ ] Entrar con Google a una cuenta que ya existía con ese correo: llega el
      aviso de método vinculado.
- [ ] El aviso de correo cambiado: comprobar **a qué dirección llega**. Lo que
      protege es que llegue a la anterior; si Supabase lo manda solo a la nueva,
      el aviso no cumple su función y hay que decidir qué hacer.
