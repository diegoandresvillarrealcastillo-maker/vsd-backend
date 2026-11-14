# ADR 0024: La racha se calcula en el servidor y sin estado

- **Estado:** aceptada (decisiones D1 y D2 del ciclo 7, **corregibles al probar**)
- **Fecha:** 2026-10-13
- **Tarea:** SCRUM-186 (`[C7-16]`). Lo completa el frontend en `vsd-frontend` con `LlamaDeRacha`.

## Contexto

El sprint pidió una **racha**: una llama que crece con los días seguidos (7 días, 1 mes, de 3 a 6
meses, 1 año) y **tres congelamientos al mes**. Chocaba con tres cosas que ya están escritas:

- **El tono.** La ruta del día dice «Nada aquí castiga: no hay vidas, ni rachas que se rompan». Una
  racha que se rompe es lo contrario.
- **El encargo mismo.** Pedía a la vez «al menos una actividad por módulo activo» y «mínimo 3 para
  mantener la racha». Hay que escoger una.
- **Lo que ya se guarda.** `resultado.dia` se guardó a propósito «para no romper las rachas ya
  ganadas» (SCRUM-123): el día en que algo se hizo, en la zona de la persona de entonces. Todo lo que
  depende de los días lo calcula el servidor en hora de Colombia, nunca el reloj del dispositivo.

## Decisión

1. **Un día cuenta si hubo al menos una actividad, de cualquier módulo** (D1). El «mínimo 3» es la
   sugerencia de la ruta del día (SCRUM-184), no una condición de la racha: así no se castiga a quien
   solo pudo hacer una cosa.
2. **Es una función pura de los días en que hizo algo y del día de hoy** (`Racha.ts`). No hay un
   contador ni una tabla de congelamientos: todo se deduce de `resultado.dia`, igual que el sendero.
   Un contador guardado puede desincronizarse de los resultados, y entonces la llama diría una cosa y
   el historial otra.
3. **Hoy no rompe nada hasta que termina.** Si todavía no hizo algo hoy, la cadena de ayer sigue en
   pie y no se gasta un congelamiento por un día en curso.
4. **Los congelamientos son automáticos, tres por mes calendario** (D2). Cubren un día sin actividad
   _dentro de una cadena que ya empezó_; el día cubierto no suma. Se cuentan en el mes del propio día
   cubierto, en el calendario de la persona. No se acumulan de un mes a otro.
5. **Al cuarto hueco del mes la cadena se corta y la llama «descansa».** El estado se llama así y la
   app no dice «perdiste»: con la siguiente actividad vuelve con un día. No hay una notificación de
   pérdida.
6. **Niveles por días de la cadena:** 0 (ascua) menos de 7; 1 desde 7; 2 desde 30; 3 desde 90 (de 3 a
   6 meses y más); 4 desde 365.
7. **`GET /api/racha`**, de la cuenta propia, `Cache-Control: no-store`. El «hoy» sale del
   `Calendario` de la zona de la persona.

## Alternativas consideradas

- **Guardar la racha en una columna o tabla.** Más barato de leer, pero puede quedar distinta de los
  resultados y exige migrar y mantener un contador al registrar, al borrar y al sincronizar sin
  conexión. Descartada: este modo no necesita migración.
- **Exigir 3 actividades al día.** Es la lectura literal de la segunda condición del encargo, y la
  más punitiva: quien hace una cosa «pierde» el día. Descartada por el tono del proyecto.
- **Una por módulo activo.** Depende de qué módulos tenga cada persona y cambia al activar otro:
  la racha de ayer dejaría de valer hoy. Descartada.
- **Congelamientos manuales o con ventana móvil de 30 días.** Más control, pero exige que la persona
  los gestione y una tabla de usos. Descartada: se deduce todo y sin pedir nada.
- **Guardar los congelamientos usados.** Permitiría usar uno «hacia atrás» a voluntad. Descartada: sin
  estado no hay nada que explotar ni que borrar con la cuenta.

## Consecuencias

**Lo que se gana.** Nada nuevo que migrar, exportar ni borrar: la racha se recalcula siempre de datos
que ya están en la exportación y se borran con la cuenta (Ley 1581). Se comporta igual sin conexión y
tras un viaje, porque el día sale de `resultado.dia`. El mismo cálculo se prueba como función pura.

**Lo que se pierde o se acepta.**

- **Una racha larga se corta con el cuarto hueco del mes**, aunque el estado se llame «descanso». Es
  la parte que más se aparta de «nada castiga»: queda a juicio de quien pruebe si el tono alcanza o si
  conviene no mostrar el contador al reiniciar (D1, corregible).
- **Cambiar la regla recalcula el pasado.** No hay «rachas ya ganadas» congeladas: si mañana cambia el
  número de congelamientos, todas las cadenas se recalculan.
- **Lee todos los días distintos de la persona** en cada consulta (`DISTINCT dia`, con el índice
  `(id_usuario, dia)`). Para un año de uso son unas 365 filas; si algún día pesa, se agrega un
  resumen por día, no un contador.
- **El pasado cuenta con las reglas de hoy.** Un día sin actividad de hace meses puede haber
  «consumido» un congelamiento que la persona ni notó. Es inofensivo (solo explica por qué hoy no
  quedan), pero sorprende si se muestra.

## Pendiente fuera de este ADR

- La llama, sus cuatro niveles y los textos («descansa», «se cubrió un día»), en el frontend.
- Que Diego confirme D1 y D2 al probar.

## Addendum (SCRUM-242): hitos, semana y avisos con riesgo honesto

**Fecha:** 2026-10-21. **Pedido por:** Samuel. **Decidido el 2026-10-22:** Diego (PO) dejó en manos del equipo
técnico la regla de tono que este addendum cambia, y el equipo mantiene el «aviso honesto» tal como se describe aquí.

La racha se vuelve más visible: celebraciones por hito, una barra de progreso y avisos con la mascota. Sigue
siendo una función pura de los días con actividad y de hoy; **no se agrega estado, columna ni migración**.

1. **La escalera de hitos también se deduce.** `HITOS_DE_LA_RACHA` es `3, 7, 14, 30, 50, 100, 200, 365` y, pasado
   el primer año, uno cada 365 días. `GET /api/racha` la devuelve ya armada (`escalera`: todos los logrados y los
   tres que siguen) junto con `proximoHito`, así el frontend no repite la tabla. Los cuatro niveles de la llama
   (7, 30, 90 y 365 días) no cambian: son otra cosa que los hitos.
2. **La semana también.** `semana` trae los siete días de lunes a domingo de la semana de hoy, cada uno `hecho`,
   `cubierto` (por un congelamiento), `hoy` (todavía sin actividad), `sinActividad` o `futuro`.
   `congelamientosDisponibles` es lo que queda del mes. Todos los campos de antes se mantienen: un cliente viejo
   sigue funcionando.
3. **El aviso de la racha dice los días y habla con la voz de la mascota.** Cambia el punto 5 de la decisión
   original («no hay una notificación de pérdida»), con esta regla:

   > Un aviso **nunca culpa ni dramatiza y nunca dice que algo se perdió**. Puede decir qué está en juego **solo
   > cuando es verdad**, una vez al día, y se apaga con el mismo interruptor del aviso de la racha.

   Lo que dice el aviso de la racha (solo si ese día no hubo actividad), en este orden:

   | Situación                                    | Título                                                                          |
   | -------------------------------------------- | ------------------------------------------------------------------------------- |
   | La llama descansa                            | ¿Un momento para ti hoy? (como siempre)                                         |
   | Con una actividad hoy llegaría a un hito     | Hoy puedes llegar a 14 días                                                     |
   | 3 días o más, con congelamientos disponibles | Tu racha de 12 días («una actividad hoy y no gastas un congelamiento»)          |
   | 3 días o más, sin congelamientos             | Tu racha de 12 días está en juego («una actividad hoy la mantiene. Sin prisa.») |
   | Lo demás (1 o 2 días sin hito)               | ¿Un momento para ti hoy? (como siempre)                                         |

   «En juego» solo sale cuando los tres congelamientos del mes ya se usaron, que es cuando de verdad un día sin
   actividad cortaría la cadena. Con congelamientos disponibles decir «vas a perder tu racha» sería falso, y no se
   dice. «Perdiste» no existe: una racha que se corta sigue llamándose _descanso_.

4. **La mascota viaja solo como forma.** El payload de Web Push suma `mascota` (la forma elegida, p. ej. `sparky`)
   para que el service worker muestre su ícono. La mascota propia (un dibujo privado) no viaja: el aviso lleva el
   ícono de la aplicación. El cuerpo puede empezar con el nombre de la mascota («Sparky: …»), recortado a 20
   caracteres.
5. **Lo que no cambia.** Los recordatorios de la mañana y de la noche siguen sin número de días ni «no pierdas»
   (`TextosDeLosRecordatorios.ts`).

**Costos aceptados:** un número de días en la pantalla bloqueada es un dato de uso (no de salud) a la vista de quien
esté al lado; se apaga con el interruptor del aviso. Si más adelante se prefiere volver a «sin lenguaje de
pérdida», basta con quitar las dos filas de riesgo de `mensajeDeLaRacha` y dejar los hitos.
