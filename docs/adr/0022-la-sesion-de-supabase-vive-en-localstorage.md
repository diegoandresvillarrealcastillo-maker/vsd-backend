# ADR 0022: La sesion de Supabase vive en localStorage

- **Estado:** aceptado
- **Fecha:** 2026-10-08
- **Tarea:** SCRUM-143. Deja por escrito lo que se decidio al construir el acceso
  (Ciclo 5) y al abrir la aplicacion sin conexion (SCRUM-137), y que se aparta de lo
  que pide HU_MF09_001. Se puso al dia con SCRUM-152 (la CSP) y SCRUM-164 (la casilla
  de la sesion) de la Auditoria 360.

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
- La sesion **no se recuerda por omision** (SCRUM-164): la pantalla de acceso trae
  **desmarcada** «Mantener la sesion en este equipo». Con la casilla sin tocar, que es
  lo que pasa si la persona no hace nada, la sesion se guarda en `sessionStorage` y se
  cierra al cerrar la pestana; marcada, se guarda en `localStorage`. Al crear la cuenta
  con correo se usa `localStorage` por una razon tecnica (`RECORDAR_SIEMPRE`, en
  `ProveedorDeSesion`).
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
4. **Por omision el token no queda en `localStorage`**: sin marcar «Mantener la
   sesion en este equipo», la sesion vive en `sessionStorage` y desaparece al cerrar la
   pestana. Solo queda en `localStorage` si la persona marca la casilla o se registra
   con correo.
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
- **La politica de contenido (CSP) existe pero todavia no bloquea.** SCRUM-152 la manda
  en modo «solo informar» (`Content-Security-Policy-Report-Only`) desde `vercel.json` y
  desde la imagen de nginx del frontend, con el mismo valor: el script
  `comprobar-las-cabeceras.mjs` falla la compilacion si difieren. Dice en la consola
  que habria bloqueado sin romper nada; el plan que deja escrito es una semana asi en
  PRE y despues pasarla a `Content-Security-Policy`. Mientras siga en «solo informar»
  **no frena a un script inyectado**. Es la defensa que mas reduciria este riesgo, y el
  ADR 0019 ya la nombra como necesaria.
- **El riesgo de una sala de computo bajo con SCRUM-164**, porque la casilla viene
  desmarcada y quien no hace nada deja la sesion en `sessionStorage`. Lo que queda es
  quien marca «Mantener la sesion en este equipo» en un equipo compartido y no cierra
  sesion: la suya queda abierta hasta treinta dias para la persona que se siente
  despues. Y el registro con correo, que usa `localStorage`.
- **No se ha comprobado** la rotacion de tokens de refresco ni su tiempo de reuso en
  el panel de Supabase de cada ambiente. Conviene revisarlo.

**A vigilar.** Que ninguna pieza nueva escriba en `localStorage` algo que sea de una
persona. La prueba de `ProveedorDeSesion.spec.tsx` solo conoce las claves de hoy:
**no descubre una clave nueva**, asi que quien agregue una tiene que sumarla ahi,
como preferencia del dispositivo o como algo de la persona que se borra al salir.
