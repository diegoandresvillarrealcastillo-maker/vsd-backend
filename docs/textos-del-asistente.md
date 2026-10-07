# Todo lo que VSD IA le puede decir a una persona

Esta es la superficie de revisión del asistente. Está aquí porque **el Ciclo 4
declaró que estos textos se revisan antes de publicarse, y esa revisión todavía
no ha ocurrido.**

No hace falta leer código: todo lo que el asistente puede responder cabe en esta
página. Si algo suena mal, se corrige aquí y en su origen.

> **Regla:** ningún texto nuevo llega al usuario sin pasar por esta página. Si
> se añade una respuesta y no se anota, la revisión deja de significar algo.

---

## 1. Cuando detecta una señal de riesgo

Es el único mensaje que no depende de que se entienda la pregunta. Va siempre
acompañado de las tres líneas de atención, ordenadas con las nacionales
primero.

> Lo que escribiste es importante y no deberías cargarlo en solitario. Estas
> líneas atienden ahora mismo y son gratuitas.

**Qué se buscó al escribirlo:** no preguntar, no matizar, no interpretar. Decir
lo único que hace falta y poner los teléfonos delante. No usa la palabra
"crisis", no nombra ninguna condición y no pide que la persona explique nada.

**Origen:** `MENSAJE_DE_RIESGO` en `src/infrastructure/asistente/AsistentePorReglas.ts`

## 2. Respuestas por intención

| Cuando la persona pregunta | El asistente responde                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------- |
| Qué significa su resultado | Tu nivel resume cómo te fue en esa actividad, ese día. No dice nada sobre ti como persona.         |
| Cómo dormir mejor          | Descansar mejor casi siempre empieza por la rutina, no por la fuerza de voluntad.                  |
| Que se siente mal          | Gracias por escribirlo. Sentirte así no necesita justificación, y no tienes que resolverlo hoy.    |
| Dónde buscar ayuda         | Pedir ayuda es una buena decisión. Estos son lugares donde te van a escuchar.                      |
| Algo que no se reconoce    | No estoy seguro de haberte entendido, pero esto suele servir. Si quieres, escríbelo de otra forma. |

**Origen:** `MENSAJES` en el mismo archivo.

### La charla de todos los días (SCRUM-128)

Cinco intenciones nuevas. **Ninguna lleva líneas de atención ni la frase del
historial**: quien dice «gracias» no necesita un teléfono, y enseñarlo en cada
saludo lo convertiría en decorado. Ninguna hace una pregunta: el asistente no
sabría contestar un «bien» o un «más o menos».

| Cuando la persona escribe                                    | El asistente responde                                                                                                                                                                                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Un saludo («hola», «buenos días», «buenas tardes»)           | ¡Hola! Qué bueno tenerte por aquí. Puedes preguntarme por tu descanso, por lo que significa un resultado o por dónde buscar ayuda.                                                                                                         |
| Un agradecimiento («gracias», «mil gracias», «te agradezco») | ¡Con gusto! Si te surge otra duda, aquí estoy.                                                                                                                                                                                             |
| Una despedida («adiós», «hasta mañana», «nos vemos»)         | Hasta pronto. Aquí estaré cuando quieras volver.                                                                                                                                                                                           |
| «Buenas noches»                                              | ¡Buenas noches! Aquí estoy si quieres preguntarme algo. Y si ya vas a descansar, que sea una noche tranquila.                                                                                                                              |
| «¿Cómo estás?», «¿qué tal?»                                  | Gracias por preguntar. Por aquí todo en orden, listo para acompañarte. Si quieres contarme cómo vas tú, te leo.                                                                                                                            |
| «¿Qué puedes hacer?», «¿quién eres?»                         | Soy VSD IA. Te puedo explicar qué significa tu nivel en una actividad, darte ideas para descansar mejor y decirte dónde buscar ayuda cuando la necesites. No reemplazo a un profesional: si quieres hablar con alguien, te digo con quién. |

«Buenas noches» va con las despedidas porque es lo que más se escribe al cerrar
el día; su respuesta está escrita para servir también a quien lo escribe al
llegar.

**Origen:** `MENSAJES` y `MENSAJE_DE_LAS_NOCHES` en el mismo archivo. Las
palabras que las disparan están en `REGLAS_DE_CHARLA`.

#### Cuándo cuenta como charla, y cuándo no

**Solo cuando el mensaje entero es charla.** Cada palabra tiene que ser de un
patrón de la lista o una de las pocas palabras de relleno que la acompañan
(«muchas», «por favor», «de nuevo», «solo quería»). También vale el nombre que la
persona le puso a su mascota: «hola, Luma».

Una sola palabra de más y ya no es charla, y sigue el camino de siempre. Eso es
a propósito: la lista de riesgo (punto 5) es un suelo, no un techo, y un saludo
delante no puede dejar sin teléfonos a una frase seria que la lista no tiene.

| Mensaje                             | Qué pasa                                                            |
| ----------------------------------- | ------------------------------------------------------------------- |
| «hola»                              | Saludo, sin líneas                                                  |
| «hola, ¿cómo estás hoy?»            | «Cómo estás», sin líneas                                            |
| «hola, quiero desaparecer»          | **No es charla**: respuesta genérica **con** las líneas de atención |
| «adiós a todo»                      | **No es charla**: respuesta genérica **con** las líneas de atención |
| «adiós, y gracias por todo»         | **No es charla**: respuesta genérica **con** las líneas de atención |
| «gracias por todo»                  | **No es charla**, por la misma razón; es el precio de la cautela    |
| «gracias, ¿qué significa mi nivel?» | La pregunta gana: responde lo del resultado                         |
| «hola, me siento triste»            | Gana lo que importa: responde a «me siento mal»                     |

Y la señal de riesgo se sigue mirando **antes y aparte** de todo esto, sin
cambios: hay una prueba que pone cada una de las 23 frases con saludos,
despedidas y agradecimientos alrededor.

### Palabras completas, no pedazos (SCRUM-128)

Antes, el asistente buscaba pedazos de texto: «mal» coincidía dentro de
«normal», y «solo» dentro de «solo quería saludar». Ahora se comparan palabras
completas. Las raíces que dan una familia (psicólogo, psicóloga, psicología)
se escriben con `*` y siguen exigiendo que la palabra **empiece** así.

Un cambio de comportamiento que conviene saber:

- **«solo» y «sola» ya no bastan por sí solos** para entender que la persona se
  siente mal. Se reconocen cuando dicen cómo está («estoy solo», «muy sola»,
  «me siento solo»). Una palabra suelta sin contexto cae en la respuesta
  genérica, que sí lleva las líneas de atención.

### La frase que se añade con el historial

Cuando la persona ha registrado actividades en los últimos 30 días, se añade al
final del mensaje:

> En el último mes registraste **N** actividades.

Sale de contar filas suyas, por eso es cierto. **Nunca se añade a la respuesta
de riesgo:** convertiría un momento serio en una ficha de seguimiento.

## 3. Contenido de apoyo

Vive en la tabla `RECURSO_APOYO`, así que se puede corregir sin desplegar.

| Título                      | Texto                                                                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Qué significa tu nivel      | El nivel resume cómo te fue en esa actividad concreta, ese día. No dice nada sobre ti como persona, y un mismo nivel puede significar cosas distintas según la actividad.       |
| Rutina para descansar mejor | Acostarte y levantarte a la misma hora, dejar las pantallas media hora antes y bajar la luz de la habitación son los tres cambios con más efecto y los más fáciles de sostener. |
| Cuando el día viene pesado  | Sentirte mal un día no requiere explicación ni solución inmediata. Ayuda moverte un rato, tomar agua, y contárselo a alguien de confianza antes de que se acumule.              |

## 4. Líneas de atención

| Línea             | Texto                                                                                                                                                                                                             | Cobertura   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **192, opción 4** | Orientación en salud mental del Ministerio de Salud. Funciona en todo el país: se marca 192 y se elige la opción 4. Atiende un equipo de profesionales.                                                           | Nacional    |
| **123**           | Línea única de emergencias, en todo el país. Es la que hay que marcar si hay riesgo inmediato para la vida de alguien.                                                                                            | Nacional    |
| **106**           | Apoyo psicológico gratuito de la Secretaría Distrital de Salud, las 24 horas, todos los días del año. Se marca 106 desde Bogotá; también responde por WhatsApp al 300 754 8933 y en linea106@saludcapital.gov.co. | Solo Bogotá |

Datos verificados en fuentes oficiales el 2026-09-16.

**Falta el recurso de la universidad.** Se retiró por no estar confirmado. Ver
el final de esta página.

## 5. Las frases que disparan las líneas de atención

Son 23 y están en `src/domain/model/SenalesDeRiesgo.ts`, ya normalizadas: sin
tildes y en minúscula, porque nadie escribe con tildes cuando está mal.

```
quiero morir · quiero morirme · me quiero morir · quiero matarme
me quiero matar · voy a matarme · matarme · suicidarme · suicidio
quitarme la vida · acabar con todo · no quiero seguir viviendo
no quiero vivir · no vale la pena vivir · estaria mejor muerto
estaria mejor muerta · seria mejor no estar · hacerme dano
lastimarme · cortarme · nadie me va a extranar · ya no puedo mas
no aguanto mas
```

**Se equivoca por exceso a propósito.** No interpreta negaciones: _"no quiero
morirme"_ contiene _"quiero morirme"_ y dispara igual. Enseñar teléfonos a quien
no los necesita es una pantalla que se ignora; no enseñárselos a quien sí, no
tiene arreglo.

**Y no es exhaustiva.** Es un suelo, no un techo. Alguien puede expresar un
dolor serio sin usar ninguna de estas frases. Por eso el asistente nunca es la
única vía de ayuda de la aplicación.

---

## Qué mirar al revisar

1. **¿Algún texto suena a diagnóstico?** Hay una prueba automática que falla
   con "depresión", "ansiedad", "trastorno", "diagnóstico" y similares, pero una
   prueba no detecta un tono clínico escrito con otras palabras.
2. **¿Alguno suena a que el sistema opina sobre la persona?** Todos deberían
   hablar de la actividad o del día, nunca de quien la hizo.
3. **¿El de riesgo es el que querrías leer** si estuvieras mal a las tres de la
   mañana?
4. **¿Falta alguna frase** en la lista del punto 5? Cada línea de esa lista es
   una persona que recibe un teléfono o no lo recibe.
5. **¿Alguna palabra de la charla puede ir pegada a algo serio?** Las de
   `RELLENO_DE_LA_CHARLA` son pocas a propósito: cada una que se añade es una
   que puede acompañar a una frase difícil sin que el asistente lo note.

## Pendiente: el recurso de la universidad

La Universidad de Cundinamarca tiene un servicio de orientación psicológica
llamado **Bienestar Psico_Orienta**, al que se accede por Microsoft Teams desde
el correo institucional. Según su sitio, se agenda escribiendo a
`saludbienestar.fusagasuga@ucundinamarca.edu.co`.

**No está sembrado**, y no lo estará hasta que alguien del equipo lo confirme
con Bienestar directamente. El sitio de la universidad tiene el certificado mal
configurado y no se pudo leer de primera mano.

Hay que confirmar tres cosas: que el servicio sigue activo, que ese es el canal
correcto, y **qué contacto corresponde a cada sede** — ese correo es el de
Fusagasugá, y el sistema ya distingue coberturas precisamente por esto.

Un dato sin confirmar en esta tabla no es un detalle: mandar a alguien que está
pidiendo ayuda a una puerta que quizá no existe es peor que no decirle nada.
