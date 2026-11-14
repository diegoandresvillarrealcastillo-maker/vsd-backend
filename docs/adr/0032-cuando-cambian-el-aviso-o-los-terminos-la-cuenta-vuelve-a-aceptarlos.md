# ADR 0032: Cuando cambian el aviso o los términos, la cuenta tiene que volver a aceptarlos

- **Estado:** aceptada (SCRUM-237, `[C7-67]`). La decisión 6 («qué pasa si no acepta») es un valor por defecto
  **corregible por Samuel y Diego**.
- **Fecha:** 2026-10-20
- **Relacionados:** [ADR 0021](0021-la-edad-y-el-consentimiento-se-comprueban-en-el-servidor.md),
  [ADR 0026](0026-la-baja-de-la-cuenta-borra-todo-y-deja-una-constancia-minima.md), SCRUM-235 (textos legales).

## Contexto

El aviso de privacidad (sección 11) y los términos (sección 10) prometen: «si cambian, publicaremos la nueva
versión y te pediremos que la aceptes de nuevo». La aplicación no lo hacía. La versión solo se comprobaba **al
registrarse** (`RegistrarCuentaUseCaseImpl`, con `esLaVersionVigente`): quien ya tenía cuenta conservaba la versión
que aceptó en su día y seguía entrando sin que nadie le pidiera nada, aunque el texto fuera otro.

Eso importa por dos motivos. Primero, el texto prometía algo que el sistema no cumplía. Segundo, la versión
guardada es **la prueba de lo que cada persona autorizó** (Ley 1581 de 2012): si el texto cambia y la persona sigue
usando el servicio, esa prueba ya no corresponde a lo vigente.

No bloquea el lanzamiento (en producción todas las cuentas nacen con la versión vigente), pero tiene que estar hecho
antes del **primer cambio de textos con personas reales**.

## Decisión

1. **Un texto está pendiente cuando la versión que la persona aceptó no es la vigente.** Lo calcula el dominio
   (`User.textosPendientes`, con las dos versiones de `VERSIONES_VIGENTES`), por cada texto, en el orden aviso y
   términos. Lo que nunca se aceptó también está pendiente. Sin consulta a la base: es una comparación.
2. **La guardia de la cuenta responde 403 `TEXTOS_PENDIENTES_DE_ACEPTAR`** a todo, salvo:
   - lo que lleva `@PermiteRegistroIncompleto()`: **ver, exportar y borrar la cuenta**, que son derechos que no se
     condicionan a aceptar nada (ya era así con el registro incompleto);
   - lo que lleva la marca nueva `@PermiteTextosPendientes()`: solo `POST /api/cuenta/aceptacion`, sin la cual nadie
     podría aceptar.

   **El registro incompleto va primero.** Sin declarar la edad no hay nada que volver a aceptar, y aceptar un texto
   no sustituye a declararla: la ruta de aceptar sigue exigiendo el registro completo.

3. **`POST /api/cuenta/aceptacion` guarda la aceptación de todo lo pendiente, o nada.** Pide, como el registro, la
   casilla y la versión vigente de cada texto pendiente (sin casilla no hay autorización expresa; con una versión
   vieja, la persona leyó otro texto). La fecha la pone el servidor. Lo que **ya estaba al día no se vuelve a
   fechar**, aunque la orden lo traiga: la fecha es la prueba de cuándo aceptó. Sin nada pendiente no hace nada, así
   que se puede reintentar sin llenar el historial.
4. **Lo anterior no se pierde.** La nueva aceptación se **añade** al historial de consentimientos, que solo admite
   altas, y la anterior queda como prueba de lo que la persona aceptó antes. No hace falta migración: el modelo ya
   lo contemplaba.
5. **`GET /api/cuenta` devuelve `textosPendientes`** (`aviso_de_privacidad`, `terminos`, ninguno o los dos). Es lo
   que le dice al frontend qué pantalla mostrar. Las versiones nuevas las sigue dando `GET /api/aviso`, que no
   cambia.
6. **Si la persona no acepta, no se le borra nada ni se le bloquea para siempre.** La API le sigue negando todo salvo
   exportar y borrar, y el frontend le ofrece cerrar la sesión o borrar la cuenta. Es lo más simple y lo más
   respetuoso: no aceptar es una decisión válida, y los derechos de acceso y supresión siguen intactos.

## Alternativas consideradas

- **Solo un aviso en el frontend, sin que la API lo exija.** Es lo más fácil y no cumple nada: cualquier cliente o una
  pestaña vieja seguiría usando la API con la versión que aceptó antes, y el texto prometería algo que el servidor no
  hace. La seguridad no depende solo del frontend.
- **Reusar `REGISTRO_INCOMPLETO` (marcar el registro como incompleto cuando la versión no es la vigente).** Es la
  pieza que ya existe, pero la pantalla que provoca pide la fecha de nacimiento, y a quien solo le falta aceptar un
  texto se le mandaría a «Completa tu registro». Mezclaría dos cosas distintas: lo que se declara una vez y lo que
  hay que volver a aceptar cada vez que cambia el texto.
- **Reutilizar `POST /api/cuenta` para aceptar.** Ese endpoint ya es idempotente a propósito y no sobrescribe lo
  aceptado, justo para no borrar la prueba. Cargarle esto lo volvería ambiguo.
- **Invalidar la sesión de todas las cuentas al subir la versión.** Obligaría a iniciar sesión otra vez sin decir por
  qué y no sirve de nada: tras iniciar sesión, lo pendiente seguiría igual.

## Consecuencias

**Lo que se gana**

- La promesa de los dos textos se cumple, y se cumple en el servidor.
- La prueba de lo que cada persona aceptó sigue siendo cierta: la versión vigente de su cuenta es la última que
  aceptó, y el historial guarda las anteriores.
- Sin migración y sin consultas nuevas.

**Lo que se pierde o queda abierto**

- **Cada cambio de versión bloquea a todas las cuentas hasta que acepten.** Por eso la versión **solo sube cuando el
  cambio afecta a lo que las personas autorizan**, y una errata o un cambio de redacción que no cambie el sentido
  **no** la sube. Es una regla de proceso, no una comprobación técnica: nada impide subirla, solo que bloquea a todos.
- **El backend y el frontend tienen que llegar juntos** (backend primero, como siempre). Un frontend viejo no conoce
  `TEXTOS_PENDIENTES_DE_ACEPTAR`, y una cuenta con una versión vieja recibiría 403 sin pantalla que lo explique. En PRE,
  las cuentas de prueba que aceptaron `2026-09-1` y `2026-10-1` pasarán a tener los dos textos pendientes: es lo
  esperado, y es la prueba del flujo.
- **Lo que quedó en la cola sin conexión con la versión vieja** recibirá 403 al enviarse. El frontend no debe
  descartarlo: no es un fallo de sesión, es que falta aceptar. Se envía cuando la persona acepte.
- **Aplica a todos los roles**, también a la persona administradora: tiene un correo y una cuenta como cualquiera.
- **No distingue qué cambió dentro del texto.** Pide aceptar el texto completo otra vez, sin resaltar la diferencia.
  Es lo más sencillo y lo más seguro legalmente; resaltar cambios sería una mejora posterior.
