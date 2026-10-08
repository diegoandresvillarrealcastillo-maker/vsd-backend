# ADR 0021: La sesion de Supabase vive en localStorage

- **Estado:** aceptado
- **Fecha:** 2026-10-08
- **Tarea:** SCRUM-143. Deja por escrito lo que se decidio al construir el acceso
  (Ciclo 5) y al abrir la aplicacion sin conexion (SCRUM-137), y que se aparta de lo
  que pide HU_MF09_001.

## Contexto

La historia HU_MF09_001 («Usar funciones habilitadas sin conexion») dice, en su
seguridad y privacidad: **«No guardar tokens en LocalStorage; separar datos por
usuario y limpiar al cerrar sesion»**.

Lo que hace el sistema hoy:

- El acceso lo resuelve Supabase Auth **desde el navegador** (ADR 0012). La
  aplicacion no tiene un servidor propio en el camino del inicio de sesion, y la API
  solo verifica el token que le llega (ADR 0013).
- El cliente de Supabase guarda la sesion —el token de acceso (una hora) y el de
  refresco (treinta dias)— en el almacenamiento del navegador, bajo la clave
  `vsd.sesion`. Un adaptador (`infraestructura/supabase/almacenamiento.ts`) la
  enruta a `localStorage` o a `sessionStorage`.
- La sesion **se recuerda por omision**: la pantalla de acceso trae marcada
  «Recordar en este dispositivo» («Si lo desmarcas, la sesion se cierra al cerrar la
  pestana. Usalo en computadores compartidos.»). Quien la desmarca guarda la sesion en
  `sessionStorage`. Al crear la cuenta siempre se recuerda.
- **Lo demas que es de una persona no esta en `localStorage`.** Esta en IndexedDB,
  una base por persona y cifrada (ADR 0019). En `localStorage` solo quedan el token
  y preferencias del dispositivo que no dicen nada de nadie: el tema, donde dejo la
  mascota y si vio la induccion del semaforo.

Lo que obliga a que la sesion sea legible **sin red**: para abrir la aplicacion sin
conexion hay que saber **de quien es** el almacen que se abre (SCRUM-137). Esa
respuesta sale de la sesion guardada; la API no puede darla, porque no hay red.

## Decision

**La sesion de Supabase se queda en `localStorage`, y solo ella.** Es una
divergencia deliberada de HU_MF09_001, y se cumple el resto de esa linea: los datos
estan separados por persona y se limpian al cerrar sesion.

Lo que acota el riesgo:

1. **Solo el token.** Ninguna informacion de la persona va en `localStorage`. Una
   prueba de `ProveedorDeSesion.spec.tsx` fija que, al terminar la sesion, lo que
   era de la persona (lo que la mascota ya le dijo, SCRUM-142) se va y solo quedan
   las preferencias del dispositivo. Vale para las claves que la prueba conoce.
2. **El token de acceso dura una hora.** Es la ventana de uso directo si alguna vez
   se filtra.
3. **Al cerrar sesion se borra** la sesion (la clave `vsd.sesion`, que borra
   `signOut` de Supabase), la base de la persona y la clave que la cifraba (ADR
   0019). Si la sesion termina sola (caduco, se revoco) no se borra lo guardado
   en IndexedDB, pero la sesion se cierra.
4. **Quien lo necesite puede no dejar el token en `localStorage`**: desmarcando
   «Recordar en este dispositivo» la sesion vive en `sessionStorage` y desaparece al
   cerrar la pestana. Es la salida para un computador compartido.
5. **Lo que se muestra se sanea** (el diario, el SVG propio —ADR 0017—), porque el
   riesgo real de `localStorage` es codigo que corra dentro de la pagina.

## Alternativas consideradas

**Solo en memoria.** Es lo que pide el criterio, y es lo mas seguro: el token
desaparece al cerrar la pestana. Se descarta porque **rompe el requisito que el
criterio acompana**: recargar la pagina, o abrirla sin red, obligaria a entrar de
nuevo, y entrar necesita conexion. Sin sesion guardada no se sabria de quien es lo
que esta en el equipo.

**Una cookie `httpOnly` que emita un servidor nuestro.** Es la forma recomendada de
que el JavaScript de la pagina no pueda leer el token. Se descarta por tres razones:
el inicio de sesion pasaria por nuestra API, que en el plan gratuito se duerme y
tarda cerca de un minuto en despertar (`ambientes.md`); cambia el ADR 0012 y el 0013
(hoy el navegador habla con Supabase y la API solo verifica); y **tampoco resuelve
abrir sin red**: una cookie `httpOnly` no la puede leer la pagina, asi que habria
que guardar aparte, en algo legible, quien es la persona.

**IndexedDB con la clave no extraible del ADR 0019.** Protege de quien copia el
perfil del navegador y lo lee sin la pagina. No protege de lo que el criterio
quiere evitar, que es codigo inyectado: es la pagina la que usa la clave, y un
script que corra en ella descifraria el token igual que lo leeria de
`localStorage`. Anade una pieza que puede fallar al abrir sin red, a cambio de
una mejora que no cubre la amenaza principal.

## Consecuencias

**A favor.** La aplicacion abre sin red sabiendo de quien es cada almacen, y no hay
una pieza mas en el camino del inicio de sesion. Lo que es de una persona no esta
en `localStorage`.

**En contra.**

- **Un script inyectado en la pagina puede leer el token**, y con el de refresco
  podria renovarlo durante treinta dias. Es el riesgo que el criterio quiere evitar
  y esta decision lo acepta. Lo acota que el token de acceso dure una hora, no lo
  elimina.
- **Hoy no hay una politica de contenido (CSP)** en `vercel.json` ni en la
  configuracion de nginx de la imagen del frontend. Es la defensa que mas reduciria
  este riesgo y **no esta puesta**. El ADR 0019 ya la nombra como necesaria. Queda
  para la auditoria de seguridad, no se hizo en este ticket.
- **Como la casilla viene marcada, en una sala de computo quien no la desmarca ni
  cierra sesion deja la suya abierta hasta treinta dias** para la persona que se
  siente despues. La salida existe, pero depende de que la persona la use; si se
  quisiera que viniera desmarcada, es un cambio de pantalla, no de arquitectura.
- **No se ha comprobado** la rotacion de tokens de refresco ni su tiempo de reuso en
  el panel de Supabase de cada ambiente. Conviene revisarlo.

**A vigilar.** Que ninguna pieza nueva escriba en `localStorage` algo que sea de una
persona. La prueba de `ProveedorDeSesion.spec.tsx` solo conoce las claves de hoy:
**no descubre una clave nueva**, asi que quien agregue una tiene que sumarla ahi,
como preferencia del dispositivo o como algo de la persona que se borra al salir.
