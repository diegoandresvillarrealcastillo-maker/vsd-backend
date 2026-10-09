# Correos de VSD Health

Los tres correos que manda Supabase Auth, con la identidad visual de la app
(SCRUM-125): confirmar la cuenta, recuperar la contraseña y cambiar el correo.
Los tres salen de **una sola plantilla**, así que se ven igual, y cada uno lo
encabeza una mascota distinta (SCRUM-171): Fungito, Obsidian y Ojo de Gato.

Los correos propios de la aplicación (avisos, resúmenes) quedan fuera: exigen un
proveedor de envío y una clave nueva. Tampoco se tocan las plantillas que
Supabase no usa aquí (enlace mágico, invitación, reautenticación; ver el
[ADR 0012](../docs/adr/0012-contrasena-y-google-en-lugar-del-enlace-magico.md))
ni sus notificaciones de seguridad.

## Qué hay aquí

| Qué                                                            | Para qué                                                                        |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [`plantilla.html`](plantilla.html)                             | La plantilla maestra: estructura, estilos y modo oscuro                         |
| [`../src/correos/contenidos.ts`](../src/correos/contenidos.ts) | Lo que dice cada correo: asunto, mascota, título, párrafos, pasos, botón y nota |
| [`../src/correos/paleta.ts`](../src/correos/paleta.ts)         | Colores y tipografías, tomados de los tokens de la app                          |
| [`generados/`](generados/)                                     | **Lo que se pega en Supabase**: la plantilla con cada texto                     |

`npm run correos` combina la plantilla con cada texto y escribe `generados/`.

## Qué se pega y dónde

En el panel de Supabase del proyecto: **Authentication → Emails → Templates**
(`/dashboard/project/<ref>/auth/templates`). Cada plantilla tiene un campo
_Subject_ y otro de contenido (_Message body_).

| Plantilla en Supabase | Asunto                                   | Contenido (pegar el archivo completo)                                        |
| --------------------- | ---------------------------------------- | ---------------------------------------------------------------------------- |
| Confirm sign up       | Confirma tu cuenta en VSD Health         | [`generados/confirmar-cuenta.html`](generados/confirmar-cuenta.html)         |
| Reset password        | Elige una contraseña nueva en VSD Health | [`generados/recuperar-contrasena.html`](generados/recuperar-contrasena.html) |
| Change email address  | Confirma tu nuevo correo en VSD Health   | [`generados/cambiar-correo.html`](generados/cambiar-correo.html)             |

Si prefieren la API de gestión de Supabase, los campos son
`mailer_subjects_confirmation` / `mailer_templates_confirmation_content`,
`mailer_subjects_recovery` / `mailer_templates_recovery_content` y
`mailer_subjects_email_change` / `mailer_templates_email_change_content`. Pide
un token de acceso personal, que no pasa por Git ni por ningún chat: el panel
es el camino más simple.

### Antes de pegar: la _Site URL_

El logo y el enlace del pie salen de `{{ .SiteURL }}`, la **Site URL** de
_Authentication → URL Configuration_. Así la misma plantilla sirve en PRE y en
PROD sin dominios escritos a mano. Eso obliga a que esa URL sea la **de la
PWA** de ese ambiente:

- **PRE:** `https://vsd-health-pre.vercel.app`
- **PROD:** la del proyecto de Vercel de producción, cuando exista.

Se comprueba abriendo `<Site URL>/icono-192.png`: tiene que mostrar el isotipo
verde. Si la Site URL es otra (por ejemplo `http://localhost:3000`, que es el
valor por defecto de Supabase), el logo sale roto.

### Las mascotas: dónde poner los GIF

Cada correo pide su mascota a `{{ .SiteURL }}/correo/<archivo>.gif`, o sea, a la
carpeta `public/correo/` de **`vsd-frontend`**. Los GIF los aporta el equipo; la
plantilla ya los espera con estos nombres:

| Correo               | Mascota     | Archivo en `vsd-frontend/public/correo/` |
| -------------------- | ----------- | ---------------------------------------- |
| Confirmar la cuenta  | Fungito     | `fungito.gif`                            |
| Recuperar contraseña | Obsidian    | `obsidian.gif`                           |
| Cambiar el correo    | Ojo de Gato | `ojo-de-gato.gif`                        |

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
tres archivos con la Site URL de PROD. Las plantillas **no se aplican solas**:
las pega una persona del equipo.

## Cómo se cambia algo

1. Editar la plantilla, la paleta o un texto.
2. `npm run correos`.
3. Subir el cambio **junto con** `generados/`. Una prueba falla si lo guardado
   no es exactamente lo que se genera, así nadie edita un archivo a mano y se
   olvida de los otros dos.
4. Pegar de nuevo en Supabase (PRE, y PROD cuando exista).

Los colores salen de los tokens de la app (`--app-*` en `vsd-frontend`,
`src/estilos/aplicacion.css`). Si cambian allí, hay que cambiarlos en
`paleta.ts`.

## Cómo está hecha, y por qué

Un correo no es una página web. Los clientes de correo (Gmail, Outlook) recortan
o ignoran casi todo lo que un navegador entiende, y por eso:

- **Los estilos van dentro de cada etiqueta.** El bloque `<style>` solo mejora
  (modo oscuro y pantallas pequeñas): sin él, el correo se ve bien.
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
- **Cada texto cumple 4,5:1 de contraste** (WCAG AA), en claro y en oscuro.
- **Ningún dato de salud ni de la persona**: solo lo que hace el botón. No se
  usa `{{ .Email }}` (en el cambio de correo es el anterior) ni `{{ .Data }}`.
- **Cambio de correo seguro:** si en Supabase está activo, el mismo correo llega
  a la dirección vieja y a la nueva. El texto sirve para las dos.

## Qué se comprueba solo, y qué no

`npm test` (`src/correos/construirCorreos.spec.ts`) vigila todo lo anterior:
solo variables de Supabase válidas, estilos en cada etiqueta, sin scripts ni
dominios fijos, modo oscuro completo, contraste, ausencia de palabras de salud y
que `generados/` esté al día. Además se vieron en un navegador, en claro, en
oscuro y a 375 px.

**No se probó en clientes reales.** Lo que sigue lo hace una persona al pegar en
PRE, creando una cuenta de prueba y pidiendo cada correo:

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
