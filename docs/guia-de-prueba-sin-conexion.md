# Guía de prueba manual del modo sin conexión

Cómo comprobar a mano, en un navegador y en un teléfono, que VSD Health funciona sin
conexión: qué hacer, qué debería pasar y dónde anotar lo que pasó de verdad. Complementa
a las pruebas automáticas, que no pueden probar lo que importa de este modo: un
navegador real, una red que se cae de verdad y un teléfono.

> **Estado de esta guía (08/10/2026): escrita, y NO seguida de principio a fin.**
> El criterio de SCRUM-143 pide seguirla una vez completa y anotar lo que falle; **eso
> no se ha hecho**, porque exige un iPhone, un Android y una cuenta de prueba en PRE, y
> quien la escribió no tiene nada de eso a mano. Lo que sí se comprobó, con un arnés y no
> con esta guía, está en «Lo que ya se comprobó». **Todo lo demás está sin hacer** y la
> tabla de resultados lo dice así.

## Antes de empezar

- **Una cuenta de prueba en PRE**, creada para esto. No uses la de una persona real:
  esta guía hace que se guarden diarios y resultados. Las credenciales están en el
  gestor del equipo y **no se escriben en esta página**.
- **Un navegador por entorno**, con la versión anotada en la tabla de resultados.
- **Lo que se prueba es el despliegue de PRE** (`vsd-health-pre.vercel.app`), no el
  computador de quien prueba. Antes: que el backend de PRE tenga las migraciones al día
  (`npm run db:revisar`; ver [ambientes.md](ambientes.md)). Si no, fallarán los
  pendientes y el diario por una razón que no es de esta guía.
- **Entra una vez con conexión** y deja que la aplicación termine de cargar (unos
  segundos). Lo que se guarda para usar sin red **solo se guarda si se abrió con
  conexión antes**.

### Cómo quedarse sin conexión

| Entorno              | Forma recomendada                                                                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chrome de escritorio | Herramientas de desarrollo → _Network_ → _Offline_. Para el service worker: _Application_ → _Service Workers_ → _Offline_. **No es lo mismo que una red real** |
| Android (Chrome)     | **Modo avión**. Para ver IndexedDB y `localStorage`: `chrome://inspect` desde un computador                                                                    |
| iPhone (Safari)      | **Modo avión**. Para ver el almacenamiento: Safari en un Mac, menú _Desarrollo_ → el iPhone                                                                    |
| PWA instalada        | La misma forma del sistema; ábrela **desde el icono**, no desde el navegador                                                                                   |

Una wifi sin salida (conectada pero sin internet) es un caso distinto del modo avión y
también se prueba, en el caso 12.

## Los casos

Cada caso dice qué hacer y qué debería pasar. **Si pasa otra cosa, es un hallazgo:
anótalo en la tabla de resultados con lo que viste.** No lo corrijas en el momento.

### 1. Abrir la aplicación sin conexión

1. Con conexión, abre la aplicación y espera unos segundos.
2. Quédate sin conexión y **recarga**.

**Debería:** abrir la portada y `/acceso`. Si ya habías entrado, ver el panel (caso 2).
**No debería:** mostrar la página de error del navegador.

### 2. Una sesión ya iniciada, sin conexión

1. Entra con la cuenta de prueba, con conexión. Cierra la pestaña.
2. Quédate sin conexión y abre la aplicación.

**Debería:** entrar al panel **sin pedir contraseña**, con «Datos de hace…» y las
actividades de hoy. El indicador de arriba dice «Sin conexión».
**Variante larga:** repite después de **más de una hora** sin red (el token de acceso
dura una hora). **Debería** seguir abriendo la sesión guardada y, al volver la red,
renovarla sola.

### 3. Terminar una actividad sin conexión

1. Sin conexión, abre una actividad del plan de hoy y termínala.
2. Mira la pantalla de resultado y el indicador.
3. Recupera la conexión sin cerrar la aplicación.

**Debería:** al terminar, decir «Guardado en este equipo» y **no prometer** una
orientación; el indicador cuenta 1 cambio. Al volver la red: «Volviste a tener
conexión. Enviamos 1 cambio…» y, si esperó más de 30 s, la orientación de la actividad.
**No debería:** repetir el resultado (míralo en el historial y en el progreso: **una
sola vez**), ni cambiar la hora a la de cuando llegó.

### 4. Escribir en el diario sin conexión

1. Sin conexión, escribe una anotación y guárdala.
2. **Cierra el navegador por completo** y ábrelo otra vez, aún sin conexión.
3. Recupera la conexión.

**Debería:** la anotación aparece al instante con «Guardada en este equipo…», **sigue
ahí tras cerrar el navegador**, y al volver la red llega **una sola vez** con la hora en
que se escribió. Si no se pudo guardar en el equipo, lo dice y **deja lo escrito**.

### 5. Corregir una anotación y el choque entre dos dispositivos

1. En el dispositivo A, con conexión, escribe una anotación. Ábrela en el B.
2. Deja B sin conexión y corrígela. Corrígela también en A, con conexión.
3. Recupera la conexión en B.

**Debería:** la corrección de B **no pisa** la de A: se guarda como una **anotación
nueva marcada como «Copia»**, con el aviso de que la original se había cambiado desde
otro dispositivo. Pasada **una hora** de la anotación pasa lo mismo.

### 6. Pendientes sin conexión y el choque entre dos dispositivos

1. Sin conexión, anota un pendiente, cámbialo y bórralo otro.
2. Con un pendiente existente en A y B, cámbialo en A (con red) y en B (sin red).
   Recupera la conexión en B.

**Debería:** cada pendiente dice en qué punto está («Guardado en este equipo…»,
«Guardando…», «No se pudo enviar…»). En el choque, el semáforo muestra **lado a lado**
«En el otro dispositivo» y «Tu cambio», con **«Quedarme con lo del otro dispositivo»** y
**«Aplicar mi cambio»**. Marcar algo como hecho **no choca**.

### 7. VSD IA sin conexión

Sin conexión, escribe en VSD IA: (a) «hola»; (b) una frase de las que disparan las
líneas de atención (la lista de pruebas está en
[textos-del-asistente.md](textos-del-asistente.md), sección 5); (c) «¿dónde busco
ayuda?»; (d) cualquier otra pregunta.

**Debería:** (a) saludo; (b) el mensaje de siempre y **las líneas de su país**, sin
esperar; (c) el mismo mensaje y las líneas; (d) «Esto lo puedo responder cuando tengas
conexión.» con «Reintentar». Cada respuesta dice «Respondido sin conexión».
**No debería:** enviar nada al volver la red por sí solo (solo si pulsas «Reintentar»), ni
mostrar un teléfono de otro país.

### 8. Lo que exige conexión

Sin conexión, recorre: el **perfil** (todos los apartados), la pantalla de **acceso**
(cerrando sesión antes con conexión), **«Añadir módulo»** en el panel.

**Debería:** todo deshabilitado con «Necesitas conexión para esto.»; **el correo** solo se
muestra. Lo que habías escrito **no se pierde** al volver la conexión. El perfil se abre
con la copia de la cuenta y dice de cuándo es.
**No debería:** poder enviar nada, ni decir «Listo».

### 9. El arranque en frío (solo PRE)

1. Deja la aplicación **sin usar 20 minutos** (el servicio gratuito se duerme a los 15).
2. Ábrela con conexión y **cronométrala**.
3. Haz algo (termina una actividad) mientras el servicio todavía despierta.

**Debería:** poder abrir y usar lo que está en la copia; el indicador puede decir «Sin
conexión» hasta que el servicio responda a `/health` (hasta unos 15 s por intento) y, en
cuanto responde, **enviar lo guardado solo**. **Anota** cuánto tarda de verdad: no está
medido.

### 10. Cerrar sesión con cambios sin enviar, y lo que queda

1. Sin conexión, deja 2 o 3 cambios sin enviar y pulsa _Cerrar sesión_.
2. Prueba **Esperar**, y luego otra vez: **Salir y perderlos**.
3. Con conexión, repite el paso 1 y pulsa **Enviarlos ahora**.
4. Tras salir, mira el almacenamiento del navegador.

**Debería:** «Tienes N cambios guardados en este equipo que no se han enviado…», con el
foco en **Esperar**; sin conexión **no** ofrece «Enviarlos ahora». Sin cambios pendientes,
sale de una vez. **Tras salir no debe quedar** la base `vsd-<id>` de la persona en
IndexedDB, ni nada de la persona en la Cache Storage; en `localStorage` solo
`vsd.tema`, `vsd-h:mascota-posicion` y `vsd-h:semaforo-induccion-vista`.

### 11. Un equipo compartido

1. Entra con la cuenta A **sin marcar** «Mantener la sesión en este equipo» (así viene
   desde SCRUM-164). Cierra la pestaña. **Debería:** no seguir con la sesión abierta.
2. Entra con la A, haz algo sin enviar y deja que **su sesión termine sola** (que
   caduque o se revoque desde el panel de Supabase). Entra después con la cuenta B.

**Debería:** en el paso 1, `sessionStorage` y no `localStorage` para la sesión; en el
paso 2, **no ver nada de la A** (al entrar otra persona se borra lo de la anterior).
El paso 2 es difícil de provocar a mano: hoy lo cubren las pruebas automáticas.

### 12. Una red que no llega a la API

Conéctate a una wifi **sin salida a internet** (o apaga los datos con la wifi puesta).

**Debería:** el indicador dice «Sin conexión» aunque el navegador crea que hay red; las
cosas se guardan y se envían al volver. Un error **del servidor** (un 500) se respeta tal
cual: no se tapa con la copia.

### 13. Reloj desajustado

Adelanta el reloj del dispositivo **más de 5 minutos** y escribe en el diario sin conexión;
recupera la conexión.

**Debería:** la API **rechaza** la anotación por la hora y queda en «requiere atención»
con su motivo, **sin descartarse**. Con menos de 5 minutos, se acepta.

### 14. Un almacenamiento lleno

Con las herramientas de desarrollo, limita la cuota del sitio y escribe en el diario.

**Debería:** decir que no se pudo guardar en el equipo y **dejar lo escrito**. No perder
nada en silencio.

### 15. Lo que solo se puede esperar

- **Safari y el almacenamiento.** Usa la aplicación **sin abrirla durante 7 días** y
  ábrela: ¿sigue lo guardado? Instalada en la pantalla de inicio, no debería borrarse.
- **La renovación del token** pasada la hora con una sesión real (caso 2, variante larga).

## Lo que ya se comprobó (con un arnés, no con esta guía)

Al construir cada parte (SCRUM-137 a SCRUM-142) se revisó a mano en un navegador de
escritorio, **con IndexedDB real** y un arnés temporal que simulaba la API dentro de la
página y la red con `navigator.onLine`. **No es lo mismo que esta guía**: la API no era
la de PRE, la red no se cortaba de verdad y no había teléfono.

| Caso | Qué se vio en el arnés                                                                                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3, 4 | Lo hecho sin red entra a la cola con el aviso correcto, se ve al instante y sale **una sola vez**; la anotación del diario sobrevive a cerrar y abrir                                 |
| 7    | Los cuatro tipos de respuesta de VSD IA sin red, las líneas de Bogotá y de Madrid, y que **no sale ninguna petición sola** al volver la red                                           |
| 8    | El perfil sin red con la copia («Datos de hace…») y 10 avisos; el acceso con 5 de 5 controles deshabilitados; «Añadir módulo» y «Empezar» bloqueados y desbloqueados al volver la red |
| 10   | El diálogo de salir con cambios (foco en «Esperar», sin «Enviarlos ahora» sin red), y «Descartar» una anotación con «Copiar el texto»                                                 |
| —    | **Móvil de 375 px** sin desborde en el perfil, el panel y los diálogos                                                                                                                |

El navegador de la aplicación **no da permiso de portapapeles**, así que ahí se vio el
camino de fallo de «Copiar el texto»; el de éxito se comprobó sustituyendo `writeText`.

## Registro de resultados

Marca ✔ si pasó lo esperado, ✘ si no (y escribe qué pasó en _Notas_), — si no se hizo.
Escribe también la versión del navegador y la fecha.

| Caso | Chrome escritorio | Chrome Android | Safari iPhone | PWA instalada | Notas                                                            |
| ---- | ----------------- | -------------- | ------------- | ------------- | ---------------------------------------------------------------- |
| 1    | —                 | —              | —             | —             |                                                                  |
| 2    | —                 | —              | —             | —             |                                                                  |
| 3    | arnés ✔           | —              | —             | —             |                                                                  |
| 4    | arnés ✔           | —              | —             | —             |                                                                  |
| 5    | —                 | —              | —             | —             | Solo pruebas automáticas; con dos dispositivos reales: sin hacer |
| 6    | —                 | —              | —             | —             | Solo pruebas automáticas; con dos dispositivos reales: sin hacer |
| 7    | arnés ✔           | —              | —             | —             |                                                                  |
| 8    | arnés ✔           | —              | —             | —             |                                                                  |
| 9    | —                 | —              | —             | —             | No está medido en PRE                                            |
| 10   | arnés ✔           | —              | —             | —             |                                                                  |
| 11   | —                 | —              | —             | —             | Solo con pruebas automáticas                                     |
| 12   | —                 | —              | —             | —             |                                                                  |
| 13   | —                 | —              | —             | —             |                                                                  |
| 14   | —                 | —              | —             | —             |                                                                  |
| 15   | —                 | —              | —             | —             | Necesita siete días                                              |

**Hallazgos de esta guía:** ninguno todavía, porque no se ha seguido. Cuando se siga,
cada cosa que falle se anota aquí con su caso, el entorno y lo que se vio.

## Documentos relacionados

- [Trazabilidad del modo sin conexión](trazabilidad-del-modo-sin-conexion.md): qué
  requisito cubre cada cosa y qué no se ha podido comprobar.
- [Divergencias con el entregable](divergencias-con-el-entregable.md)
- [ADR 0019](adr/0019-el-modo-sin-conexion-guarda-en-el-dispositivo-y-envia-una-cola-idempotente.md)
  y [ADR 0023](adr/0023-lo-que-exige-conexion-se-ve-deshabilitado-y-no-se-guarda-para-despues.md)
- [Ambientes](ambientes.md): el arranque en frío y las migraciones de PRE.
