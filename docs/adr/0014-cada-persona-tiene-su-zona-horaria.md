# ADR 0014: Cada persona tiene su zona horaria

- **Estado:** aceptado
- **Fecha:** 2026-10-07
- **Tarea:** SCRUM-123
- **Reemplaza:** lo decidido en SCRUM-87 (el dia se cuenta en hora de Colombia
  para todo el sistema), que vivia en `dominio.md` y no en un ADR.

## Contexto

Hasta ahora el servicio tenia **una** zona horaria, `America/Bogota`, fijada por
la variable `ZONA_HORARIA`. Con ella se decidia que dia es para las actividades,
el sendero, el diario, el semaforo y la hora de los avisos.

Servia mientras todas las personas estuvieran en Colombia. Deja de servir en
cuanto alguien viaja o vive en otro pais, y los fallos no dan error:

- A las 8 p. m. en Madrid, para una cuenta en hora de Bogota todavia es "hoy"
  a las 2 p. m. El aviso de las 8:00 llegaria a las 15:00.
- Una actividad hecha el lunes por la tarde en Tokio contaria para el domingo.
- La racha de alguien que cruza una zona se rompe o se regala un dia, sin que
  nadie lo vea.

Y las lineas de ayuda dependen del pais (SCRUM-124): para saber a que pais
pertenece alguien, primero hay que saber donde esta.

## Decision

**Cada cuenta guarda su zona horaria, la informa el dispositivo en cada entrada,
y es la que decide que dia es para ella.**

1. **`usuario.zona_horaria`**, una zona IANA como `America/Bogota`. Las cuentas
   anteriores quedan en esa, que es lo que venian usando.
2. **La informa el dispositivo**, no la elige la persona. El frontend manda
   `Intl.DateTimeFormat().resolvedOptions().timeZone` en `POST /api/cuenta`, que
   ya se llama en cada inicio de sesion. Si la cuenta existe y la zona es otra,
   se actualiza. Viajar no obliga a configurar nada.
3. **Se pide con `Calendario.de(zona)`**, que guarda un calendario por zona. La
   API valida la zona contra la base de zonas del servidor: una que no conoce se
   rechaza con `ZONA_HORARIA_INVALIDA` (400).
4. **El dia de un resultado se guarda** en `resultado.dia` cuando se registra.
   No se recalcula al leer (ver "Lo que se pierde").
5. **La hora de los avisos se lee en la zona de cada persona.** La tarea de
   avisos mira primero las zonas en uso (son pocas) y, para cada una, a quien le
   toca en su minuto local.
6. **Desaparece la variable `ZONA_HORARIA`.** Ya no hay una zona del servicio.

### La zona de los avisos la copia la base

La tarea de avisos solo puede leer `preferencia_aviso` (ADR 0010 y la migracion
de los avisos). Para leer cada hora en su zona necesita la zona en esa misma
tabla. Abrirle `usuario` le daria acceso al correo y a todo lo demas de cada
cuenta, y la tarea esta hecha justo para no tenerlo.

Por eso `preferencia_aviso.zona_horaria` es una copia, y **la hace la base** con
dos disparadores: al crear las preferencias nacen en la zona de la cuenta, y si
la cuenta cambia de zona, la copia la sigue. Hay una sola fuente y ningun
camino de codigo que pueda olvidarse de mantenerla. La aplicacion no la escribe.

## Alternativas descartadas

- **Una zona global configurable (lo que habia).** No resuelve nada: es la misma
  para todos.
- **Que la persona la elija en el perfil.** Obliga a acordarse de cambiarla al
  viajar, y quien se olvida recibe los avisos a deshoras sin saber por que.
- **Pedir la ubicacion (GPS).** Es un dato personal, pide un permiso invasivo y
  no hace falta: la zona del dispositivo basta para saber que dia es y a que pais
  corresponde.
- **Guardar las horas de los avisos en UTC.** "A las 8:00" no es un instante
  fijo: cambia con el horario de verano. Habria que reescribirlas dos veces al
  ano.
- **Abrir `usuario` a la tarea de avisos.** Rompe la estrechez que se le dio a
  proposito. Ver arriba.

## Consecuencias

**Lo que se gana**

- Cada persona ve su dia, recibe sus avisos a su hora y conserva su racha
  viajando.
- Es la base de las lineas de ayuda por pais (SCRUM-124) y de los recordatorios
  de las 8:00 y las 20:00 (SCRUM-126).

**Lo que se pierde**

- **La zona la informa un dispositivo y no se puede comprobar.** Quien la
  falsee solo se perjudica a si mismo (sus dias y sus avisos); no afecta a nadie
  mas. Pero tampoco es un dato fiable para nada sensible.
- **Un dia ya registrado no se mueve cuando la persona cambia de zona.** Es lo
  deseado, y es la razon de guardar `resultado.dia`. El precio es una columna
  mas y que, si alguien registra tarde desde el sistema sin conexion, el dia sea
  el de la zona en que sincroniza y no el de donde ocurrio. Es una
  aproximacion razonable y no se corrige.
- **El diario sigue sin cambiar de dia solo.** Cada anotacion ya guardaba su
  dia (ADR 0009); no se reescribe.
- **Una zona que el servidor no conoce se rechaza.** Es raro, porque el servidor
  y los navegadores usan la misma base IANA, pero una zona muy reciente podria
  no estar. El frontend lo trata como no fatal: entra igual y reintenta sin
  zona.
- **En memoria, la copia de la zona de los avisos no es automatica.** El
  adaptador en memoria existe para desarrollo y pruebas y la deja como la traia
  el ultimo cambio de horas. En PostgreSQL la garantiza la base.
- **Una migracion mas que aplicar a mano en PRE y PROD**, con un `UPDATE` sobre
  `resultado` que suspende un momento `FORCE ROW LEVEL SECURITY` (como el del
  diario, SCRUM-95).
