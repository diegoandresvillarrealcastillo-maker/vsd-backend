# ADR 0035: Acompañamiento por abandono: avisar al volver a quien se fue después de varios días con atención

- **Estado:** propuesta (SCRUM-256). La escribió Samuel con libertad de decisión (24/10); **la
  confirma Diego**. **El criterio (3 días previos, 3 de silencio, 30 de vigencia) es de producto y
  sigue pendiente de la revisión de una persona de salud**: no es una validación clínica.
- **Fecha:** 2026-10-24
- **Se relaciona con:** ADR 0034 (acompañamiento por días seguidos, pregunta 2: «eso debe ser una
  regla de abandono independiente, en un ticket propio»), ADR 0028 (el diario no manda líneas de
  atención) y ADR 0024 (la racha como función de los resultados).
- **Infiere algo sobre la persona a partir de sus resultados:** por eso va con un ADR y detrás del
  mismo permiso que el acompañamiento por días.

## Contexto

El acompañamiento por días seguidos (ADR 0034) mira lo que pasa **mientras la persona usa la
aplicación**. Si deja de usarla, un día sin datos rompe la cadena y el aviso desaparece **justo
cuando ella se fue**. Diego lo señaló al responder la pregunta 2: quien está peor puede dejar de
abrirla, y esa ausencia merece una regla propia, con su ticket, y no un parche sobre la de
continuidad.

Dos límites que ya estaban decididos y esta regla respeta:

- **No sale por notificación ni por otro canal que no sea la aplicación abierta** (ADR 0034, punto
  6): la pantalla bloqueada la puede ver otra persona. Por eso el aviso de abandono **no puede
  buscar a quien se fue**: solo puede estar esperándola cuando vuelva.
- **Es una inferencia sobre la salud mental**: va detrás del permiso `acompanamientoPorDias`, apagado
  por defecto.

## Decisión

1. **Hay abandono cuando se cumplen tres cosas a la vez**
   (`AbandonoTrasAtencion.ts`, función `abandonoTrasAtencion`):
   1. **Lo último que la persona registró requirió atención**: su último día con actividad es un día
      con atención (las mismas actividades de «mayor requiere atención» del ADR 0034). Si después de
      la mala racha hizo algo que no la requirió, no se fue mal.
   2. **Venía de al menos 3 días seguidos así** (`DIAS_PARA_ACOMPANAR`). Con 7 o más
      (`DIAS_PARA_LAS_LINEAS`) el nivel es crítico. Son las mismas varas del acompañamiento por
      días, a propósito: una sola idea de «qué es una mala racha».
   3. **Lleva al menos 3 días sin registrar nada** (`DIAS_SIN_REGISTRAR_PARA_AVISAR`, hoy cuenta) **y
      no más de 30** (`DIAS_QUE_VALE_EL_AVISO_DE_ABANDONO`): pasado un mes ya no se le habla de
      «hace unos días».
2. **Se apaga solo.** En cuanto la persona registra cualquier cosa, su último día con actividad es
   hoy y el aviso desaparece. No hay nada que cerrar en el servidor ni nada que borrar.
3. **Es una función de los resultados**, como la racha y los días seguidos: no se guarda ningún
   contador, **no hay migración** y nada puede desincronizarse. Reutiliza `diasConAtencion` y
   `diasConActividad`, que ya existían.
4. **Mismo permiso.** Sin `acompanamientoPorDias` no se lee un solo resultado. El texto del permiso
   en el perfil (frontend) dice que también cubre este aviso, para que quien lo encienda sepa lo que
   enciende.
5. **Va en la misma respuesta**, `GET /api/acompanamiento`, como un campo aparte:
   `{ nivel, abandono, lineasDeAtencion }`. Un viaje y una lectura de permisos, pero **dos reglas
   que no se tocan**: `nivel` sigue siendo el de los días seguidos. Es **aditivo**: un frontend viejo
   ignora `abandono`.
   - Los dos **nunca son distintos de `ninguno` a la vez**: con la cadena en pie no pueden pasar 3
     días sin registrar. Por eso `abandono` solo se calcula (y solo se pide la lista de días con
     actividad) cuando `nivel` es `ninguno`.
   - `lineasDeAtencion` viene cuando `nivel` **o** `abandono` son críticos: las del país de la
     persona, igual que antes.
6. **No sale ningún puntaje ni cuántos días fueron**: solo los niveles.
7. **Siempre se puede cerrar** (frontend): el moderado y también el crítico. A diferencia del banner
   crítico por días seguidos, este es una **bienvenida**, no una vigilancia: quien vuelve tras una
   mala racha y lo primero que ve es un aviso que no puede quitar puede no volver a volver.

## Alternativas consideradas

- **Una notificación para quien se fue.** Descartada: es exactamente lo que el ADR 0034 prohíbe (la
  pantalla bloqueada). Si Diego quiere abrir ese debate, es otra decisión, con consentimiento propio
  y un texto que no diga nada de cómo está la persona.
- **Contar el silencio como señal dentro de los días seguidos.** Descartada por Diego en el ADR 0034
  (fatiga de alertas: se trataría como alerta a quien solo olvidó abrir la aplicación).
- **Avisar con 2 días de silencio.** Descartada: una persona con 3 días malos que no abre la
  aplicación un fin de semana no está «abandonando». Con 3 se pide más para hablarle.
- **Sin límite de vigencia.** Descartada: tres meses después, «hace unos días» es falso y el aviso
  se vuelve ruido.
- **Un permiso nuevo y su columna.** Descartada por ahora: es la misma inferencia sobre la misma
  persona, y un segundo interruptor pide una migración y una pantalla más. Si Diego prefiere
  separarlos, es una columna más, sin tocar la regla.
- **Contar las entradas del diario como presencia.** Descartada en esta versión: leería (o al
  menos recorrería) un contenido que el acompañamiento no mira. Es la limitación de abajo.

## Consecuencias

- **Se gana:** quien se fue después de una mala racha **no se encuentra con el silencio** cuando
  vuelve: encuentra una invitación, y las líneas de su país si fue una semana larga. Sin guardar nada,
  sin migración y sin sumar ninguna notificación.
- **Se pierde:**
  - **Solo funciona si la persona vuelve.** No alcanza a quien nunca regresa: esa es la
    consecuencia directa de «nunca por notificación», y se asume.
  - **Quien sigue escribiendo en el diario pero no registra actividades cuenta como ausente**
    (`shortcut` en el código). El texto del aviso no afirma «no has vuelto»: dice «no has registrado
    nada». Si Diego quiere contarlo, se pasa el calendario de las entradas como un tercer parámetro.
  - **Es una inferencia sobre la persona** y el criterio (3, 3 y 30) es de quien sabe de salud: por eso
    son tres constantes con su prueba y no una frase en una pantalla.
  - Un falso positivo es un aviso que se cierra con un toque.
- **El frontend tiene su parte** (PR aparte): el aviso de bienvenida, la copia local con `abandono`
  y el texto del permiso. **Orden:** primero este backend (aditivo, no cambia nada para quien no ha
  encendido el permiso), después el frontend. Sin el permiso encendido, nada cambia para nadie.
- **Tres constantes y una función:** cambiar los umbrales es cambiar tres números y su prueba.
