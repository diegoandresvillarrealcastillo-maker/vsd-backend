/**
 * Lo que dice cada correo de Supabase Auth (SCRUM-125).
 *
 * Son siete, de tres clases (`tipo`), y todos usan la misma plantilla
 * (`correos/plantilla.html`); aqui solo vive el texto:
 *
 * - `enlace`: lo que se hace tocando un boton. Confirmar la cuenta, recuperar la
 *   contrasena y cambiar el correo.
 * - `codigo`: lo que se hace escribiendo un codigo en la aplicacion. La
 *   reautenticacion: es el correo que sale al cambiar la contrasena desde el
 *   perfil, porque el proyecto exige verificarla (`Secure password change`).
 * - `aviso`: lo que solo informa, sin boton. Los avisos de seguridad de Supabase,
 *   que llegan cuando cambia algo de la cuenta; solo se escriben los que le
 *   sirven a esta aplicacion (contrasena, correo y metodo de acceso vinculado).
 *
 * ## Como se escriben
 *
 * - **Ningun dato de salud.** Un correo llega a una bandeja compartida, se ve
 *   en la pantalla bloqueada y puede reenviarse. Dicen lo que hace el boton y
 *   nada mas: ni para que se usa la aplicacion, ni nada que salga de ella.
 * - **Tono de VSD Health:** calido, claro y sin alarma. Cuando alguien no pidio
 *   el correo, se le dice que no pasa nada; en un aviso de seguridad, que hacer
 *   si no fue la persona.
 * - **Solo las variables que Supabase da** y que sirven en esa plantilla:
 *   `{{ .ConfirmationURL }}` y `{{ .SiteURL }}`, y ademas, solo donde Supabase
 *   las trae: `{{ .NewEmail }}` al cambiar de correo, `{{ .Token }}` en el codigo,
 *   `{{ .OldEmail }}` y `{{ .Email }}` en el aviso de correo cambiado y
 *   `{{ .Provider }}` en el de metodo vinculado. Fuera de ahi `{{ .Email }}` no
 *   se usa (en el cambio de correo es el anterior, y con "cambio seguro" el mismo
 *   correo llega a las dos direcciones), ni `{{ .Data }}` (metadatos de la
 *   persona).
 *
 * ## La mascota (SCRUM-171)
 *
 * Cada correo abre con una mascota distinta, la que acompana ese momento en la
 * aplicacion: Fungito da la bienvenida, Obsidian protege la cuenta al
 * recuperarla y Ojo de Gato vigila el cambio de correo. La imagen es un GIF
 * animado que aporta el equipo y vive en el sitio de la aplicacion
 * (`vsd-frontend/public/correo/<archivo>.gif`); el correo la pide a
 * `{{ .SiteURL }}/correo/<archivo>.gif`. Si el GIF no esta o el cliente bloquea
 * las imagenes, se lee el nombre de la mascota y el correo funciona igual.
 *
 * Los textos de aqui son los que se pegan en Supabase: si cambia uno, hay que
 * volver a generar (`npm run correos`) y pegarlo de nuevo.
 */

export interface MascotaDelCorreo {
  /** Su nombre, tal cual: es el texto alternativo de la imagen. */
  readonly nombre: string;
  /** El GIF, sin extension, dentro de `correo/` en el sitio de la aplicacion. */
  readonly archivo: string;
}

export type TipoDeCorreo = 'enlace' | 'codigo' | 'aviso';

export interface ContenidoDelCorreo {
  /** Nombre del archivo en `correos/generados/`, sin extension. */
  readonly archivo: string;
  /** Que se hace con el correo: tocar un boton, escribir un codigo o solo leerlo. */
  readonly tipo: TipoDeCorreo;
  /** Como se llama la plantilla en el panel de Supabase Auth. */
  readonly plantillaEnSupabase: string;
  /** Los dos campos de la API de gestion de Supabase, para quien prefiera pegarla por ahi. */
  readonly campoDelAsunto: string;
  readonly campoDelContenido: string;
  readonly asunto: string;
  /** Lo que se lee en la lista de correos junto al asunto. */
  readonly preencabezado: string;
  readonly titulo: string;
  /** Quien encabeza el correo. */
  readonly mascota: MascotaDelCorreo;
  readonly parrafos: readonly string[];
  /** Los pasos a seguir, como lista numerada bajo los parrafos. Solo si hay mas de uno que dar. */
  readonly pasos?: readonly string[];
  /** El texto del boton, que lleva al enlace de confirmacion. Solo en los de tipo `enlace`. */
  readonly boton?: string;
  /** Lo de debajo: que hacer si la persona no pidio el correo, o no fue ella quien hizo el cambio. */
  readonly nota: string;
}

export const CORREOS: readonly ContenidoDelCorreo[] = [
  {
    archivo: 'confirmar-cuenta',
    tipo: 'enlace',
    plantillaEnSupabase: 'Confirm sign up',
    campoDelAsunto: 'mailer_subjects_confirmation',
    campoDelContenido: 'mailer_templates_confirmation_content',
    asunto: 'Confirma tu cuenta en VSD Health',
    preencabezado: 'Un último paso para empezar: confirma que este correo es tuyo.',
    titulo: 'Te damos la bienvenida a VSD Health',
    mascota: { nombre: 'Fungito', archivo: 'fungito' },
    parrafos: [
      'Fungito ya te espera. Gracias por crear tu cuenta: para terminar, confirma que este correo es tuyo.',
      'Toca el botón y entrarás directo a tu cuenta.',
    ],
    boton: 'Confirmar mi cuenta',
    nota: 'Si no creaste una cuenta en VSD Health, puedes ignorar este correo: no pasará nada.',
  },
  {
    archivo: 'recuperar-contrasena',
    tipo: 'enlace',
    plantillaEnSupabase: 'Reset password',
    campoDelAsunto: 'mailer_subjects_recovery',
    campoDelContenido: 'mailer_templates_recovery_content',
    asunto: 'Elige una contraseña nueva en VSD Health',
    preencabezado: 'Usa este enlace para elegir una contraseña nueva.',
    titulo: 'Recupera el acceso a tu cuenta',
    mascota: { nombre: 'Obsidian', archivo: 'obsidian' },
    parrafos: [
      'No pasa nada: recuperar el acceso toma un minuto. Recibimos una solicitud para cambiar la contraseña de tu cuenta de VSD Health.',
      'Por tu seguridad, el enlace funciona una sola vez y caduca en poco tiempo. Estos son los pasos:',
    ],
    pasos: [
      'Toca el botón de abajo.',
      'Escribe la contraseña nueva que quieras usar.',
      'Entra de nuevo a tu cuenta con ella.',
    ],
    boton: 'Elegir contraseña nueva',
    nota: 'Si no lo pediste tú, ignora este correo: tu contraseña actual sigue igual.',
  },
  {
    archivo: 'cambiar-correo',
    tipo: 'enlace',
    plantillaEnSupabase: 'Change email address',
    campoDelAsunto: 'mailer_subjects_email_change',
    campoDelContenido: 'mailer_templates_email_change_content',
    asunto: 'Confirma tu nuevo correo en VSD Health',
    preencabezado: 'Confirma el cambio para que quede hecho.',
    titulo: 'Confirma tu nuevo correo',
    mascota: { nombre: 'Ojo de Gato', archivo: 'ojo-de-gato' },
    parrafos: [
      'Pediste usar {{ .NewEmail }} como el correo de tu cuenta de VSD Health.',
      'Por seguridad, el cambio no se hace hasta que lo confirmes. Toca el botón y quedará hecho.',
    ],
    boton: 'Confirmar el cambio',
    nota: 'Si no pediste este cambio, ignora este correo: tu cuenta sigue con el correo de antes. Si crees que alguien más entró a tu cuenta, cambia tu contraseña.',
  },
  {
    archivo: 'codigo-de-verificacion',
    tipo: 'codigo',
    plantillaEnSupabase: 'Reauthentication',
    campoDelAsunto: 'mailer_subjects_reauthentication',
    campoDelContenido: 'mailer_templates_reauthentication_content',
    asunto: 'Tu código de verificación de VSD Health',
    preencabezado: 'Escríbelo en VSD Health para confirmar que eres tú.',
    titulo: 'Confirma que eres tú',
    mascota: { nombre: 'Obsidian', archivo: 'obsidian' },
    parrafos: [
      'Pediste un cambio en tu cuenta de VSD Health y necesitamos comprobar que eres tú.',
      'Escribe este código en la aplicación. Sirve una sola vez y caduca en poco tiempo:',
    ],
    nota: 'Si no pediste este código, ignora este correo: no se cambió nada. Si te llegan varios sin que los pidas, cambia tu contraseña.',
  },
  {
    archivo: 'aviso-contrasena-cambiada',
    tipo: 'aviso',
    plantillaEnSupabase: 'Password changed',
    campoDelAsunto: 'mailer_subjects_password_changed_notification',
    campoDelContenido: 'mailer_templates_password_changed_notification_content',
    asunto: 'Cambió la contraseña de tu cuenta en VSD Health',
    preencabezado: 'Te avisamos por seguridad: la contraseña de tu cuenta cambió.',
    titulo: 'La contraseña de tu cuenta cambió',
    mascota: { nombre: 'Obsidian', archivo: 'obsidian' },
    parrafos: [
      'La contraseña de tu cuenta de VSD Health se cambió hace un momento. Te lo contamos por seguridad.',
      'Si fuiste tú, no tienes que hacer nada más.',
    ],
    nota: 'Si no fuiste tú, entra a VSD Health y usa la opción de recuperar el acceso de la pantalla de entrada: así creas una contraseña nueva que solo tú conoces.',
  },
  {
    archivo: 'aviso-correo-cambiado',
    tipo: 'aviso',
    plantillaEnSupabase: 'Email address changed',
    campoDelAsunto: 'mailer_subjects_email_changed_notification',
    campoDelContenido: 'mailer_templates_email_changed_notification_content',
    asunto: 'Cambió el correo de tu cuenta en VSD Health',
    preencabezado: 'Te avisamos por seguridad: el correo de tu cuenta ya no es el mismo.',
    titulo: 'El correo de tu cuenta cambió',
    mascota: { nombre: 'Ojo de Gato', archivo: 'ojo-de-gato' },
    parrafos: [
      'El correo de tu cuenta de VSD Health pasó de {{ .OldEmail }} a {{ .Email }}.',
      'Si fuiste tú, no tienes que hacer nada más.',
    ],
    nota: 'Si no fuiste tú, cambia tu contraseña en cuanto puedas y revisa que nadie más tenga acceso a tu correo. Si ya no puedes entrar a tu cuenta, avisa al equipo de VSD Health.',
  },
  {
    archivo: 'aviso-metodo-vinculado',
    tipo: 'aviso',
    plantillaEnSupabase: 'Sign-in method linked',
    campoDelAsunto: 'mailer_subjects_identity_linked_notification',
    campoDelContenido: 'mailer_templates_identity_linked_notification_content',
    asunto: 'Se vinculó un método de acceso a tu cuenta en VSD Health',
    preencabezado: 'Te avisamos por seguridad: ahora puedes entrar a tu cuenta de otra forma.',
    titulo: 'Se vinculó un método de acceso',
    mascota: { nombre: 'Ojo de Gato', archivo: 'ojo-de-gato' },
    parrafos: [
      'Se vinculó un método de acceso nuevo ({{ .Provider }}) a tu cuenta de VSD Health. Desde ahora también puedes entrar con él.',
      'Si fuiste tú, no tienes que hacer nada más.',
    ],
    nota: 'Si no fuiste tú, cambia tu contraseña en cuanto puedas y asegúrate de que solo tú entras a tu correo.',
  },
];
