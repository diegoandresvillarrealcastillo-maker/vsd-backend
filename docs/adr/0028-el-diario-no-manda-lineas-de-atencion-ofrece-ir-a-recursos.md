# ADR 0028: El diario no manda líneas de atención: ofrece ir a Recursos

- **Estado:** aceptada (SCRUM-194, ciclo 7, decisión D6, **corregible al probar y a revisar con
  Diego**)
- **Fecha:** 2026-10-13
- **Reemplaza en parte a:** [0011](0011-la-deteccion-de-riesgo-es-por-reglas.md): solo el punto de
  que la respuesta de una anotación con señal de riesgo trae las líneas de atención. La detección
  por reglas, y que solo ocurre con el permiso de SCRUM-108, **no cambian**.
- **Cambia un comportamiento clínico y de la API:** por eso va con un ADR.

## Contexto

Al guardar o corregir una anotación del diario, si la persona había dado el permiso de SCRUM-108 y
lo escrito traía una señal de riesgo, la respuesta incluía `sugiereAcompanamiento` y las líneas de
atención (`lineasDeAtencion`), y la pantalla las ponía junto a lo recién escrito.

Con el uso, eso tiene un costo que el sprint quiso corregir:

- **El diario es lo más personal que hay.** Quien acaba de contar algo difícil y recibe, pegada al
  texto, una lista de teléfonos de crisis, lo vive como una alarma y no como compañía. Muchas
  personas cierran el diario y no vuelven.
- **Las líneas ya tienen su lugar.** Recursos las muestra ordenadas, con el país de la persona, y
  es donde alguien las busca cuando las quiere.
- **La respuesta del servidor no debería decidir la pantalla.** Mandar los teléfonos hacía que el
  cliente tuviera que mostrarlos; un campo que no viaja no se puede mostrar por descuido.

## Decisión

1. **La respuesta de escribir y editar una anotación deja de mandar `lineasDeAtencion`.** Queda
   `sugiereAcompanamiento`, y solo eso: «hay una señal, conviene acompañar».
2. **El dispositivo ofrece, no impone.** La mascota muestra una burbuja con una oferta cálida que
   abre Recursos con un toque, y un «Ahora no» que la cierra. **Nunca lleva líneas de atención.**
3. **Sigue sin evaluarse nada sin permiso (SCRUM-108).** `acompanarAnotacion` no lee lo escrito si
   `conRecomendaciones` es falso: ni sugerencia ni burbuja. Es el mismo límite de siempre.
4. **No hay un segundo nivel de detección.** `hayRiesgo` solo reconoce frases explícitas, así que
   la burbuja solo aparece ante ellas y por eso lleva el texto más cálido. No se añadió ninguna
   detección de «ánimo bajo» o de tristeza: sería una decisión clínica y de privacidad nueva, y no
   se tomó aquí.
5. **El caso de uso ya no conoce las líneas.** `EscribirEnElDiarioUseCaseImpl` y
   `EditarAnotacionUseCaseImpl` dejan de recibir el repositorio de recursos, y
   `EditarAnotacionCommand` deja de llevar `zonaHoraria` (solo servía para elegir el país de las
   líneas). Que no puedan mandarlas es estructural, no una condición.

## Alternativas consideradas

- **Dejar el campo, siempre vacío.** Menos cambios, pero un contrato que dice «hay líneas» y nunca
  las trae confunde a quien lo lee, y deja la puerta abierta a que alguien las vuelva a llenar.
- **Mandarlas solo ante la frase más explícita.** Era la pregunta de D6. Se descartó: la lista de
  riesgo ya es de frases explícitas, y quien escribe «ya no puedo más» y recibe un teléfono pegado
  sigue sintiéndolo como una alarma. Recursos está a un toque.
- **Una burbuja para todo lo que se escriba.** Descartada: sin señal no hay nada que ofrecer, y
  «noté que escribiste algo» ante cada anotación vigila en lugar de acompañar.

## Consecuencias

**Lo que se gana**

- El diario deja de sentirse vigilado y alarmista; la oferta es de la mascota, con un lenguaje que
  no castiga ni diagnostica.
- El contrato es más chico y el caso de uso, más simple: dos dependencias menos.

**Lo que se pierde**

- **Un toque de distancia hasta las líneas.** Quien las necesita en ese momento las tiene a un
  toque (Recursos) y no ya a la vista. Es la decisión D6 y está en la revisión de Diego.
- **Un cliente antiguo que espere `lineasDeAtencion` no las muestra.** El servidor se despliega
  antes que el cliente; el cliente anterior las muestra solo si llegan (`Array.isArray`), así que
  sencillamente no aparecen hasta que se actualice.
- **El texto de la burbuja es de Diego**: queda en `docs/textos-del-asistente.md` y en una
  constante del frontend para que se cambie sin tocar la lógica.
