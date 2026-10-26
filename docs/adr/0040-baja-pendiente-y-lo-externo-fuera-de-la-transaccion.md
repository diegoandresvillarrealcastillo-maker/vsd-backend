# ADR 0040: La baja de la cuenta deja una marca antes de lo irreversible y termina fuera de la transacción

- **Estado:** propuesta (SCRUM-267). **Diego la confirma al fusionar.** Reemplaza en parte al
  [ADR 0026](0026-la-baja-de-la-cuenta-borra-todo-y-deja-una-constancia-minima.md): solo su punto 2
  (en qué orden y dentro de qué transacción se borra). La constancia mínima, el rechazo del token
  viejo (`401 CUENTA_INACTIVA`), el correo libre y todo lo demás de aquel ADR siguen igual.
- **Fecha:** 2026-10-25
- **Se relaciona con:** ADR 0010 (el aislamiento lo impone la base), ADR 0038 (primera tanda de la
  auditoría) y SCRUM-260 (los tiempos propios de la transacción de borrado).

## Contexto

El ADR 0026 hace la baja **en una sola transacción**: se anota la constancia, se borra la fila de
`usuario` (y por cascada todo lo suyo) y, **dentro** de ella y antes de confirmar, se borran los
archivos de la persona (foto y mascota, en Storage) y su identidad en Supabase Auth. Si algo falla,
todo se deshace. La auditoría de código del backend (hallazgo 7) encontró dos problemas:

1. **La transacción retiene una conexión de la base mientras espera a la red.** Con los dos
   almacenes de 5 s de tope y la identidad de 4 s caben 14 s. SCRUM-260 subió el tiempo de la
   transacción a 20 s para que no venciera con lo irreversible ya hecho, pero no cambió que una
   conexión queda ocupada todo ese rato. Con el pooler de Supabase en `connection_limit=1` (es lo que
   trae `.env.example`), una baja lenta puede bloquear a todo el servicio.
2. **El hueco que el propio código documentaba no se cierra:** que la base falle al confirmar
   **después** de que el proveedor ya borró la identidad. La persona ya no puede entrar, sus filas
   quedan sin dueño y el único remedio era «limpiarlas a mano».

## Decisión

La baja se hace en tres pasos, y **lo externo ya no corre dentro de ninguna transacción**
(`BajaDeCuenta`, que comparten `InactivarCuentaUseCaseImpl` —la que pide la persona, con
constancia— y `BorrarCuentaUseCaseImpl` —el rechazo de un menor, sin ella—):

1. **Se deja una marca.** Una fila en `baja_pendiente` (identificador de la persona, si lleva
   constancia y cuándo se pidió), en una transacción corta. La fila lleva clave foránea con
   `ON DELETE CASCADE` a `usuario`: desaparece sola cuando la baja termina. La primera marca manda:
   pedir la baja otra vez no la cambia.
2. **Se borra lo de fuera**, sin transacción: los archivos de la persona y después su identidad en el
   proveedor. Los dos pasos son **idempotentes** (que ya no existiera cuenta como hecho), así que se
   pueden repetir.
3. **Se borran las filas**, en una transacción corta: la constancia (si corresponde) y la fila de
   `usuario`. La marca se va con ella. La constancia lleva como fecha de baja el momento en que
   termina, no el de la marca.

**Si algo falla después de la marca, la marca se queda y la baja se termina sola.** Una tarea del API
(`RelojDeBajas`, como la de los avisos) toma cada minuto, y una vez al arrancar, las bajas con más de
2 minutos de pedidas (hasta 20 por vuelta, las más antiguas primero) y repite los pasos 2 y 3. Quien
pidió la baja recibe el mismo código de error de siempre (`BORRADO_NO_COMPLETADO`, 503), con un mensaje
que dice si la baja **quedó pedida** (se termina sola) o si falló **antes** de la marca (no se borró
nada y puede reintentar). Si reintenta, el reintento sigue el mismo camino.

La tarea solo ve la tabla de marcas: el rol de la sesión (`vsd.tarea_actual = 'bajas'`) puede leerla,
y para actuar en nombre de cada persona usa la sesión de esa persona, como todo lo demás. Las personas
solo pueden añadir y ver **su** marca; nadie la edita ni la borra desde la aplicación.

## Alternativas consideradas

- **Dejar la transacción con tiempos largos (SCRUM-260).** Es lo que había. Descartada: retiene la
  conexión y no cierra el hueco.
- **Quitar la marca si lo externo falla** (compensar, para que un error siga significando «no pasó
  nada»). Descartada: un fallo ambiguo (el proveedor sí borró, pero la respuesta se perdió) dejaría
  filas sin dueño y sin marca, que es el hueco original; y no cubre que el proceso se caiga a mitad.
- **El orden inverso: filas primero, lo externo después.** Descartada: si lo externo falla, quedan
  archivos y una identidad vivos sin cuenta ni marca que digan de quién son.
- **Una cola externa** (otro servicio o un cron del proveedor). Descartada: infraestructura nueva
  para algo que el propio API ya sabe hacer cada minuto.
- **Una columna `estado` en `usuario`.** Descartada por lo que ya dice el ADR 0026: falla hacia el lado
  malo (cada tabla nueva tendría que acordarse de limpiarse).

## Consecuencias

**Lo que se gana**

- Ninguna transacción espera a la red: no hay conexión de la base retenida durante una baja.
- El hueco se cierra: toda baja que llegó a dejar su marca **termina**, aunque el proceso se caiga o
  la base falle al confirmar. Un reinicio del API la termina al arrancar.
- Los pasos de lo externo ya eran idempotentes; ahora se aprovecha.

**Lo que se pierde o queda abierto**

- **Cambia lo que significa un error.** Antes, un error al dar de baja quería decir «no pasó nada».
  Ahora, si la marca llegó a quedar, quiere decir «se está terminando»: la baja se completa en
  minutos aunque la persona no reintente. Es lo que ella pidió, pero **un texto del frontend que
  diga «tu cuenta sigue intacta» ya no sería cierto**. El frontend no se tocó en este cambio; el
  texto hay que decidirlo con Diego.
- **No hay un estado visible.** Mientras la marca existe, la cuenta sigue respondiendo con normalidad
  (con una identidad que puede estar ya borrada, y un token que sigue valiendo hasta que caduque). Lo
  que escriba en ese rato se borra con todo lo demás.
- **El plan gratuito de Render duerme el servicio.** Si la baja se corta a mitad y el servicio se
  duerme, espera a que despierte (la tarea corre al arrancar).
- **Hasta 20 bajas por vuelta, las más antiguas primero.** Si muchas fallan a la vez (el proveedor
  caído), se terminan por turnos. Si 20 fallaran **para siempre** (un error que no se arregla solo),
  taparían a las nuevas: es un atajo conocido, y la señal es el aviso del registro «con fallo» cada
  minuto. Subir el límite o quitar la marca a mano es la salida.
- **Dos instancias pueden tomar la misma baja.** No importa: los pasos son idempotentes y la segunda no
  encuentra la cuenta.
- **Una tabla y un acceso nuevos**, `baja_pendiente` y `vsd.tarea_actual = 'bajas'`: es una migración
  aditiva (`20261025200000_baja_pendiente`) que **aplica una persona**, con `db:estado` antes y después.
  El código nuevo falla sin ella al dar de baja.
- **`TRANSACCION_DE_BORRADO` (SCRUM-260) se queda**, pero ya no por esperar a la red: cubre el borrado
  en cascada de una cuenta con mucho historial, que puede pasar de los 5 s de Prisma. La prueba de
  los tiempos ahora vigila otra cosa: que la espera de la tarea (2 minutos) sea mayor que el peor caso
  de una baja en curso, para que no la pise.

## Cómo se comprobó

- Contrato común del repositorio (memoria y PostgreSQL): la marca se guarda y se lista por antigüedad
  con corte y límite, no se duplica (la primera manda), no se crea para una cuenta que no existe, lleva
  si hay constancia, y se va con la baja (con constancia y sin ella).
- `BajaDeCuenta`, con un doble que falla en cada paso: antes de la marca (no se toca nada y el error
  dice «no se borró nada»), en los archivos, en la identidad y al borrar las filas (la marca se queda,
  la cuenta sigue entera y el error dice que se termina sola). Un reintento después de cada fallo
  termina la baja, y lo de fuera va entre dos pasos de la base, nunca dentro de uno.
- La tarea: toma solo lo que lleva más de 2 minutos, respeta si lleva constancia, sigue con la
  siguiente cuando una falla, respeta el tope por vuelta y no deja decir de quién es el fallo. El reloj
  corre al arrancar y cada minuto, no empieza una vuelta sobre otra y no tumba el servicio si falla.
- Integración contra PostgreSQL con la aplicación como `vsd_app`: la sesión de la persona solo puede
  poner y ver su propia marca y no puede editarla ni borrarla, la de las tareas solo puede leerlas, y
  el borrado de cuenta sigue sin dejar ninguna fila con `id_usuario`, la marca incluida.
