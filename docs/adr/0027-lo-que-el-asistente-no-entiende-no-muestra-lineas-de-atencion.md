# ADR 0027: Lo que el asistente no entiende no muestra líneas de atención

- **Estado:** aceptada (SCRUM-176 y SCRUM-193, ciclo 7, **corregible al probar y a revisar con
  Diego**)
- **Fecha:** 2026-10-14
- **Reemplaza en parte a:** [0011](0011-la-deteccion-de-riesgo-es-por-reglas.md): solo el punto de
  que «cuando no entiende, enseña las líneas». La detección de riesgo por reglas, y que va primero y
  aparte, **no cambia**.
- **Cambia un comportamiento clínico:** por eso va con un ADR.

## Contexto

Hasta ahora, cuando el asistente no reconocía lo que la persona escribía, **respondía con las
líneas de atención**. Era una red de seguridad deliberada (ADR 0011): ante una frase que no se
entendía, el error se quedaba del lado de enseñarlas. Había pruebas que lo fijaban.

Con el uso, esa red tiene un costo que el sprint quiso corregir:

- **Convierte una pregunta cualquiera en un mensaje de crisis.** «¿A qué hora abre la biblioteca?»
  recibía «Estas líneas atienden ahora mismo y son gratuitas». Para quien no está en crisis es
  incoherente, y a la larga enseña a ignorar las líneas, que es lo que el ADR 0011 quería evitar.
- **No dice qué sí puede hacer el asistente.** Un «no te entendí» sin salida.
- **Quien escribe de prisa, desde el teléfono, queda sin respuesta.** «ola», «cómo bamos»,
  «grasias»: el asistente solo entiende la ortografía perfecta. Peor: una errata en una palabra de
  riesgo («kiero morirme», «suisidarme») no se detectaba.

## Decisión

1. **Lo que no se reconoce no muestra líneas de atención.** Responde «No puedo ayudarte con ese tema
   en este momento, pero estas son algunas opciones con las que sí puedo orientarte:» y un
   **catálogo de temas** que la persona puede tocar (`sugerencias`, campo nuevo de la respuesta). No
   suma el historial ni dice nada de crisis.
2. **«¿Dónde busco ayuda?» es una sugerencia fija**, a un toque, para quien sí la necesita y no la
   dijo con las palabras de la lista.
3. **La detección de riesgo sigue primero y aparte, y gana frases.** Lo que la red de seguridad
   protegía y es **inequívoco** pasa a la lista de riesgo: _quiero desaparecer_, _no quiero
   despertar_, _adiós a todo_, _adiós para siempre_, _hasta nunca_, _que nadie me busque_, _me
   despido de este mundo_. Sin esto, al quitar la red se quedaban sin teléfono justo las frases más
   peligrosas, que las pruebas de SCRUM-128 fijaban una por una. SCRUM-176 dejaba fuera de alcance
   «cambiar la lista de riesgo»; se cambió **en la dirección más protectora y solo para no perder lo
   que ya había**.
4. **Tres frases ambiguas se quedan fuera de la lista**, y por tanto sin líneas por sí solas:
   «gracias por todo», «adiós, y gracias por todo» y «chao, ya no estoy». Son, casi siempre,
   cortesías o hechos cotidianos, y meterlas en la lista convertiría las líneas en decorado. Quien
   las escribe recibe el catálogo, con «¿Dónde busco ayuda?» a un toque. **Es el compromiso que
   Diego aceptó en SCRUM-176, y está fijado en pruebas para que no cambie sin que se vea.**
5. **Se toleran las erratas**, con dos mecanismos cortos y legibles (`LecturaDelTexto.ts`):
   - **Una tabla de erratas frecuentes** («ola» → «hola», «bamos» → «vamos», «kiero» → «quiero»,
     «sicologo» → «psicologo»), para las palabras cortas.
   - **Distancia de edición de uno** hacia una palabra que ya está en el vocabulario del asistente,
     y **solo si**: tiene cinco letras o más; empieza y termina con las mismas letras; y hay **un
     solo** candidato. Lo que cambia al final suele ser de quién se habla («aguanto» y «aguanta» no
     se confunden), y ante la duda se deja como está.
6. **La tolerancia amplía el riesgo y nunca lo debilita.** `hayRiesgo` busca primero el texto tal
   cual, como siempre, y después con las erratas leídas como se quisieron escribir. La segunda
   búsqueda **solo suma**.
7. **El lenguaje ofensivo no se corrige por distancia**: solo usa la tabla. «tanto» está a una
   letra de «tonto», y una errata no puede volver un insulto una frase cualquiera.
8. **Sin conexión responde igual.** El paquete de reglas locales trae la tabla de erratas y el
   fallback (aditivo: el `esquema` sigue en 1), el dispositivo deriva el mismo vocabulario de las
   propias reglas, y una prueba de conformidad compara servidor y dispositivo frase por frase.

## Alternativas consideradas

- **Dejar las líneas en «no reconocida».** Es lo que había. Descartada por las tres razones del
  contexto, y porque el catálogo es mejor para quien solo preguntó otra cosa.
- **Quitar las líneas sin tocar la lista de riesgo** (lo que decía el ticket al pie de la letra).
  Descartada: dejaba sin teléfono, por el cambio y sin que nadie lo decidiera, frases que el propio
  equipo había protegido a propósito.
- **Meter también las tres ambiguas en la lista de riesgo.** Descartada por el efecto contrario: si
  «gracias por todo» muestra líneas de crisis, dejan de significar algo.
- **Corrección ortográfica general** (un diccionario del español). Descartada: es otra dependencia,
  se equivoca de formas que no se pueden revisar, y aquí cada corrección equivocada es una frase
  leída distinto de lo que dijo la persona.
- **Distancia de edición sin condiciones.** Descartada: «aguanta» (alguien más) se leería «aguanto»
  (quien escribe) y «tanto» se leería «tonto».
- **Un modelo de lenguaje.** Mismo argumento del ADR 0011: no se puede revisar ni explicar.

## Consecuencias

**Lo que se gana**

- Una pregunta ordinaria deja de recibir un mensaje de crisis, y las líneas vuelven a significar
  algo.
- La persona ve qué sí puede preguntar, con un toque.
- Quien escribe de prisa (o mal) recibe respuesta, y su riesgo se detecta igual.
- Todo lo que protegía la red sigue protegido, salvo las tres frases ambiguas, que quedan escritas.

**Lo que se pierde o queda abierto**

- **Tres frases dejan de enseñar las líneas por sí solas.** Quien escribe «gracias por todo» o «chao,
  ya no estoy» con una intención seria recibe el catálogo, no un teléfono. Está mitigado (a un toque
  de «¿Dónde busco ayuda?»), no eliminado. **Si Diego prefiere el falso positivo, basta con añadir
  esas frases a `EXPRESIONES_DE_RIESGO`.**
- **Falsos positivos por erratas.** Una palabra real a una letra de una palabra de riesgo (por
  ejemplo, «morar» y «morir») dispara el riesgo. Se acepta: es el mismo trueque del ADR 0011.
- **Las palabras de menos de cinco letras no se corrigen por distancia.** Solo la tabla las alcanza,
  y la tabla es lo que se ve que la gente escribe, no lo que podría escribirse.
- **Mantenimiento:** la tabla de erratas y las siete frases nuevas son una lista que alguien
  revisa. Se amplían con una línea y una prueba.
- **Menos redundancia sin conexión:** el dispositivo ahora responde el fallback cuando nada se
  reconoce, en lugar de decir «esto lo puedo responder cuando tengas conexión». Es lo mismo que
  responde el servidor, porque son las mismas reglas.

## Cómo se comprobó

- `LecturaDelTexto.spec.ts`: lectura de palabras, distancia, tabla de erratas y cada condición de
  la corrección (palabras cortas, primera y última letra, candidato único).
- Riesgo: cada expresión se sigue detectando (incluso con un saludo y una cortesía alrededor), las
  erratas de riesgo se detectan y las frases de otra persona («mi abuela no aguanta más») no.
- Asistente: el fallback no trae líneas ni historial; cada sugerencia del catálogo lleva a la
  intención que dice; las frases que la red protegía siguen mostrando las líneas, salvo las tres.
- Conformidad servidor ↔ dispositivo: el conjunto de frases, cada errata sola y en frase, y que el
  paquete trae la misma tabla que usa el servidor.
