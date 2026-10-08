# ADR 0022: Lo que exige conexion se ve deshabilitado y no se guarda para despues

- **Estado:** aceptado
- **Fecha:** 2026-10-08
- **Tarea:** SCRUM-142 (la interfaz) y SCRUM-143 (este registro). Complementa el
  [ADR 0019](0019-el-modo-sin-conexion-guarda-en-el-dispositivo-y-envia-una-cola-idempotente.md),
  que decide lo que **si** funciona sin red.

## Contexto

El entregable pide que la aplicacion funcione sin conexion (MR-09, MR-10) y fija una
regla para lo que no puede: HU_MF09_001, criterio 3, **«Dado que abro una funcion no
disponible offline, cuando intento continuar, entonces se informa la limitacion sin
simular exito»**. La lista de lo que exige conexion que se acordo con el equipo era
corta: el cambio de contrasena, el cambio de correo y la configuracion del perfil.

Al construirlo (SCRUM-137 a SCRUM-142) la lista real resulto distinta:

- **El correo no se puede cambiar desde la aplicacion.** La pantalla del perfil lo
  dice. No hay nada que bloquear; ver «Consecuencias».
- **Hay mas cosas que el servidor decide en el momento**, y guardarlas «para
  despues» seria decirle a la persona que algo ya paso cuando no ha pasado: entrar,
  registrarse, recuperar la contrasena, descargar los datos y borrar la cuenta,
  ademas de la configuracion del perfil (nombre, foto, modulos, mascota, diario con
  recomendaciones, avisos) y de **activar un modulo o completar la bienvenida**, que
  crean cosas en la cuenta y devuelven la cuenta nueva.
- Lo contrario tambien es cierto: **muchas cosas que parecian de servidor se pueden
  hacer sin red** sin mentirle a nadie, porque lo que la persona hace queda guardado
  y se envia despues, y la pantalla lo dice: las actividades, el diario, los
  pendientes y la lectura del panel y del semaforo.

## Decision

**Lo que exige conexion se ve, se deshabilita y dice por que. No se guarda para
despues, ni se simula que se hizo.**

1. **Un criterio para decidir.** Exige conexion lo que (a) prueba quien es la persona
   o (b) cambia la cuenta de una forma que el servidor decide en ese momento y que la
   persona espera ver hecha. Se puede hacer sin conexion lo que la API recibe de forma
   idempotente (ADR 0019) y cuya pantalla puede decir con verdad «guardado en este
   equipo».
2. **Se ve deshabilitado, con el motivo escrito.** `ExigeConexion` envuelve el
   contenido en un `<fieldset disabled>`: el navegador deshabilita por si solo todo lo
   de dentro y se lo dice a los lectores de pantalla. El aviso («Necesitas conexion
   para esto.») va **escrito y se anuncia solo**: un `title` no se ve en el movil.
3. **Lo escrito no se pierde.** Nada se desmonta: al volver la conexion se sigue
   donde se estaba.
4. **Lo nuevo exige conexion por omision.** Cada apartado del perfil la exige salvo
   que se diga lo contrario (`exigeConexion={false}`, hoy solo el correo, que solo se
   muestra). Es el sentido seguro: olvidarse deja una pantalla bloqueada sin red, que
   se nota; lo contrario deja una que simula exito, que no.
5. **La conexion se sabe por `navigator.onLine`**, que solo es una pista: cuando dice
   que no hay red es fiable; cuando dice que si, solo significa que hay una red. Si
   no llega, el envio falla como cualquier otro, con su mensaje y sin perder lo
   escrito.
6. **Una sesion ya iniciada sigue funcionando** sin conexion. Lo que el perfil
   muestra sin red es la copia de la cuenta que guardo el panel, diciendo de cuando
   es, con todo deshabilitado.

## Alternativas consideradas

**Guardar los cambios del perfil en la cola y enviarlos despues.** Seria coherente con
lo demas y parece mas amable. Se descarta: cambiar la contrasena, borrar la cuenta o
descargar los datos no pueden esperar ni deshacerse; y para el resto, la persona
vera «guardado» en una pantalla donde el servidor todavia puede decir que no, sin
una forma clara de saberlo despues.

**Ocultar lo que exige conexion.** La interfaz quedaria limpia, pero la persona no
sabria por que no esta, ni que vuelve. Deshabilitado y explicado respeta el criterio
3 de la historia («se informa la limitacion»).

**Dejar los controles activos y que falle al enviar.** Es lo mas simple. Se descarta:
la persona escribe, envia y pierde la espera para enterarse de algo que ya se sabia.
Y una contrasena nueva escrita para nada es lo peor que se le puede pedir.

**Una lista central de funciones «con» y «sin» conexion.** Se descarta por frágil:
una lista se desactualiza sin que nada falle. Cada pantalla declara lo suyo, con la
exigencia puesta por omision.

## Consecuencias

**A favor.** Nada se simula y todo se explica. Un apartado nuevo exige conexion sin
que nadie lo recuerde. Lo escrito sobrevive a un corte.

**En contra.**

- **La lista cambia con cada pantalla nueva** y hay que decidirla cada vez; no hay una
  lista unica que revisar. La documentacion de lo que funciona sin conexion esta en el
  README del frontend y en la [guia de prueba](../guia-de-prueba-sin-conexion.md).
- **«Cambio de correo» no existe.** El entregable lo nombra como una funcion que exige
  conexion; en la aplicacion no existe, asi que no hay nada que bloquear ni que
  probar. Cuando se construya, **debe exigir conexion** y entrar por el mismo
  componente.
- **Hay muchas veces el mismo aviso** en una pantalla con muchos apartados (el perfil
  repite «Necesitas conexion para esto.» en cada uno). Es ruido deliberado: cada
  apartado se entiende solo, tambien para quien llega a el con un lector de pantalla.
- **`navigator.onLine` puede decir que hay red cuando no llega a la API.** Ahi la
  persona ve el control activo y el fallo llega al enviar. No se ha buscado un mejor
  detector para los controles; para enviar lo hecho si se confirma con `/health` (ADR
  0019).

**A vigilar.** Que cada funcion nueva que cambie la cuenta decida si exige conexion y,
si no la exige, que pueda decir con verdad que quedo «guardado en este equipo».
