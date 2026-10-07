/**
 * Lo que dice cada correo de Supabase Auth (SCRUM-125).
 *
 * Son los tres de la primera etapa: confirmar la cuenta, recuperar la
 * contrasena y cambiar el correo. Todos usan la misma plantilla
 * (`correos/plantilla.html`); aqui solo vive el texto.
 *
 * ## Como se escriben
 *
 * - **Ningun dato de salud.** Un correo llega a una bandeja compartida, se ve
 *   en la pantalla bloqueada y puede reenviarse. Dicen lo que hace el boton y
 *   nada mas: ni para que se usa la aplicacion, ni nada que salga de ella.
 * - **Tono de VSD Health:** calido, claro y sin alarma. Cuando alguien no pidio
 *   el correo, se le dice que no pasa nada.
 * - **Solo las variables que Supabase da** y que sirven en esa plantilla:
 *   `{{ .ConfirmationURL }}`, `{{ .SiteURL }}` y, solo al cambiar de correo,
 *   `{{ .NewEmail }}`. No se usa `{{ .Email }}` (en el cambio de correo es el
 *   anterior, y con "cambio seguro" el mismo correo llega a las dos
 *   direcciones) ni `{{ .Data }}` (metadatos de la persona).
 *
 * Los textos de aqui son los que se pegan en Supabase: si cambia uno, hay que
 * volver a generar (`npm run correos`) y pegarlo de nuevo.
 */

export interface ContenidoDelCorreo {
  /** Nombre del archivo en `correos/generados/`, sin extension. */
  readonly archivo: string;
  /** Como se llama la plantilla en el panel de Supabase Auth. */
  readonly plantillaEnSupabase: string;
  /** Los dos campos de la API de gestion de Supabase, para quien prefiera pegarla por ahi. */
  readonly campoDelAsunto: string;
  readonly campoDelContenido: string;
  readonly asunto: string;
  /** Lo que se lee en la lista de correos junto al asunto. */
  readonly preencabezado: string;
  readonly titulo: string;
  readonly parrafos: readonly string[];
  /** El texto del boton, que lleva al enlace de confirmacion. */
  readonly boton: string;
  /** Lo de debajo: que hacer si la persona no pidio el correo. */
  readonly nota: string;
}

export const CORREOS: readonly ContenidoDelCorreo[] = [
  {
    archivo: 'confirmar-cuenta',
    plantillaEnSupabase: 'Confirm sign up',
    campoDelAsunto: 'mailer_subjects_confirmation',
    campoDelContenido: 'mailer_templates_confirmation_content',
    asunto: 'Confirma tu cuenta en VSD Health',
    preencabezado: 'Un último paso para empezar: confirma que este correo es tuyo.',
    titulo: 'Te damos la bienvenida a VSD Health',
    parrafos: [
      'Gracias por crear tu cuenta. Para terminar, confirma que este correo es tuyo.',
      'Toca el botón y entrarás directo a tu cuenta.',
    ],
    boton: 'Confirmar mi cuenta',
    nota: 'Si no creaste una cuenta en VSD Health, puedes ignorar este correo: no pasará nada.',
  },
  {
    archivo: 'recuperar-contrasena',
    plantillaEnSupabase: 'Reset password',
    campoDelAsunto: 'mailer_subjects_recovery',
    campoDelContenido: 'mailer_templates_recovery_content',
    asunto: 'Elige una contraseña nueva en VSD Health',
    preencabezado: 'Usa este enlace para elegir una contraseña nueva.',
    titulo: 'Elige una contraseña nueva',
    parrafos: [
      'Recibimos una solicitud para cambiar la contraseña de tu cuenta. Toca el botón para elegir una nueva.',
      'Por tu seguridad, el enlace funciona una sola vez y caduca en poco tiempo.',
    ],
    boton: 'Elegir contraseña nueva',
    nota: 'Si no lo pediste tú, ignora este correo: tu contraseña actual sigue igual.',
  },
  {
    archivo: 'cambiar-correo',
    plantillaEnSupabase: 'Change email address',
    campoDelAsunto: 'mailer_subjects_email_change',
    campoDelContenido: 'mailer_templates_email_change_content',
    asunto: 'Confirma tu nuevo correo en VSD Health',
    preencabezado: 'Confirma el cambio para que quede hecho.',
    titulo: 'Confirma tu nuevo correo',
    parrafos: [
      'Pediste usar {{ .NewEmail }} como el correo de tu cuenta de VSD Health.',
      'Toca el botón para confirmar el cambio y dejarlo hecho.',
    ],
    boton: 'Confirmar el cambio',
    nota: 'Si no pediste este cambio, ignora este correo: tu cuenta sigue con el correo de antes. Si crees que alguien más entró a tu cuenta, cambia tu contraseña.',
  },
];
