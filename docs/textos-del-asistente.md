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

Se enseñan las del **país de la persona**, que sale de la zona horaria de su
cuenta (SCRUM-124, [ADR 0015](adr/0015-las-lineas-de-ayuda-segun-el-pais.md)).
Nunca se pide GPS ni ubicación.

**Cada línea tiene fuente y fecha de verificación**, y la base no deja guardar un
contacto sin ellas. La fecha es el día en que una persona abrió esa página
oficial y comprobó el número, el horario y que fuera gratuita. **Un país entra al
catálogo solo si sus líneas se leyeron en la fuente**: lo que no se pudo abrir no
se añade.

Quien está en un lugar sin líneas verificadas recibe el **directorio
internacional** y ningún teléfono, porque no se sabe cuál sería el suyo (ver más
abajo).

### Colombia (`America/Bogota`)

| Línea             | Texto                                                                                                                                                                                                             | Cobertura   | Fuente                                                                                                                                                             | Verificada |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| **192, opción 4** | Orientación en salud mental del Ministerio de Salud. Funciona en todo el país: se marca 192 y se elige la opción 4. Atiende un equipo de profesionales.                                                           | Nacional    | [Ministerio de Salud](https://www.minsalud.gov.co)                                                                                                                 | 2026-09-16 |
| **123**           | Línea única de emergencias, en todo el país. Es la que hay que marcar si hay riesgo inmediato para la vida de alguien.                                                                                            | Nacional    | [Función Pública](https://www1.funcionpublica.gov.co/preguntas-frecuentes/-/asset_publisher/sqxafjubsrEu/content/linea-unica-de-emergencias-nacional-123/28585938) | 2026-10-06 |
| **106**           | Apoyo psicológico gratuito de la Secretaría Distrital de Salud, las 24 horas, todos los días del año. Se marca 106 desde Bogotá; también responde por WhatsApp al 300 754 8933 y en linea106@saludcapital.gov.co. | Solo Bogotá | [Secretaría Distrital de Salud](https://literalmente.saludcapital.gov.co/salud-mental/que-tipo-de-ayuda-necesitas/lineas-de-atencion/)                             | 2026-10-06 |

Las tres existían desde SCRUM-60 y no cambian. **Dos de ellas tienen una duda
abierta**, que está más abajo en «Pendiente de verificación humana».

### México (`America/Mexico_City` y las demás zonas de México)

| Línea                | Texto                                                                                                                                                        | Cobertura | Fuente                                                                                                                                                      | Verificada |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Línea de la Vida** | Orientación gratuita en salud mental de la Secretaría de Salud, las 24 horas, todos los días del año. Se marca 800 911 2000.                                 | Nacional  | [Secretaría de Salud](https://www.gob.mx/salud/prensa/239-linea-de-la-vida-celebra-25-anos-de-servicio-humano-para-poblacion-con-problemas-de-salud-mental) | 2026-10-06 |
| **911**              | Línea única de emergencias, en todo el país, las 24 horas, todos los días del año. Es la que hay que marcar si hay riesgo inmediato para la vida de alguien. | Nacional  | [Gobierno de México, 9-1-1](https://www.gob.mx/911/articulos/que-es-9-1-1-conoce-mas-de-911emergencias)                                                     | 2026-10-06 |

### España (`Europe/Madrid`, `Atlantic/Canary`, `Africa/Ceuta`)

| Línea   | Texto                                                                                                                                                                                     | Cobertura | Fuente                                                                | Verificada |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------- | ---------- |
| **024** | Línea del Ministerio de Sanidad: gratuita, confidencial y las 24 horas, todos los días del año. Escucha a quien lo está pasando mal y también a su familia y sus allegados. Se marca 024. | Nacional  | [Ministerio de Sanidad](https://www.sanidad.gob.es/linea024/home.htm) | 2026-10-06 |
| **112** | Teléfono de emergencias. Es el que hay que marcar si hay riesgo inmediato para la vida de alguien.                                                                                        | Nacional  | [Ministerio de Sanidad](https://www.sanidad.gob.es/linea024/home.htm) | 2026-10-06 |

### Estados Unidos (las zonas de EE. UU., incluidas Alaska y Hawái)

| Línea   | Texto                                                                                                                                                                                                | Cobertura | Fuente                                                                                   | Verificada |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------- | ---------- |
| **988** | Apoyo gratuito y confidencial por llamada, mensaje de texto o chat, las 24 horas, todos los días del año. Para hablar en español, marca 988 y presiona 2, o envía AYUDA por mensaje de texto al 988. | Nacional  | [988 Lifeline](https://988lifeline.org/get-help/)                                        | 2026-10-06 |
| **911** | Número de emergencias, las 24 horas. Es el que hay que marcar si hay riesgo inmediato para la vida de alguien.                                                                                       | Nacional  | [USAGov](https://www.usa.gov/features/the-988-lifeline-and-other-mental-health-services) | 2026-10-06 |

### Cualquier otro lugar: el directorio internacional

> **Directorio internacional de líneas de ayuda.** Todavía no tenemos verificadas
> las líneas del lugar donde estás, y preferimos no darte un número que podría no
> ser el tuyo. Este directorio, que recomienda la Asociación Internacional para
> la Prevención del Suicidio, reúne líneas gratuitas de muchos países, por
> teléfono, chat o mensaje. Si hay riesgo inmediato para la vida de alguien,
> llama al número de emergencias del lugar donde estás.

Enlaza a [Find A Helpline](https://findahelpline.com/), de ThroughLine. La
[página de la IASP](https://www.iasp.info/crisis-centres-helplines/) (fuente,
2026-10-06) lo recomienda para encontrar líneas verificadas por país.

**No lleva ningún número de teléfono, a propósito**, y una prueba lo comprueba:
darle a alguien un número, cualquiera, es el error que SCRUM-124 existe para
evitar. Tampoco dice cuál es el número de emergencias del lugar: no se sabe
cuál es, y en las páginas de los dos directorios no se pudo confirmar que lo
muestren.

Es lo que reciben también quienes estén en Perú, Chile, Ecuador, Venezuela o
cualquier otro país que no esté arriba. **Esto no es un hueco: es el
comportamiento esperado**, hasta que un país tenga sus líneas verificadas.

### Cómo se deduce el país

De la zona horaria de la cuenta, con una lista escrita a mano
(`src/domain/model/PaisDeAyuda.ts`). **Misma hora no es mismo país**: Perú,
Ecuador y Panamá comparten la hora de Bogotá y reciben el directorio, no el 192.
Una zona desconocida o mal escrita tampoco tiene país, y no falla.

### Pendiente de verificación humana

Esto es lo que **no se pudo comprobar** y alguien del equipo debería mirar. Se
deja por escrito para que no se confunda lo que se verificó con lo que no.

1. **Colombia, Línea 192 opción 4.** La única fuente oficial que se pudo leer
   describe una estrategia de teleorientación de la pandemia (2020-2021). La
   página «Línea 106» del Ministerio de Salud y una nota de Señal Colombia de
   octubre de 2025 sobre dónde pedir ayuda gratis **no la mencionan**. No se
   pudo confirmar que siga activa. Lo que haría falta: llamar al 192, elegir la
   opción 4, y si no atiende, corregirla con una migración nueva.
2. **Colombia, Línea 106.** La página de la Secretaría Distrital de Salud la
   describe como servicio de Bogotá, pero la página «Línea 106» del Ministerio
   de Salud la presenta **sin límite a Bogotá** («marca 106 desde un teléfono
   fijo o celular»). Hoy se enseña con cobertura «Solo Bogotá». Si es nacional,
   quien esté fuera de Bogotá se está perdiendo una línea buena, no recibiendo
   un número equivocado. Lo que haría falta: confirmarlo con el Ministerio o
   llamando desde fuera de Bogotá.
3. **Perú (Línea 113, opción 5, del Ministerio de Salud) y Chile (\*4141, del
   Ministerio de Salud).** Las búsquedas las muestran en páginas oficiales
   (`gob.pe`, `minsal.cl`, `gob.cl`), pero esas páginas **no se pudieron abrir**
   (el servidor rechazó la lectura), así que no entran al catálogo. Una persona
   puede abrirlas, y agregar el país es una migración y tres líneas de código:
   ver el ADR 0015.
4. **Sin el recurso de la universidad.** Ver el final de esta página.

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
6. **¿Cada número del punto 4 sigue siendo cierto?** Abrir la fuente de cada
   línea y comprobar número, horario y que sea gratuita. La fecha de
   verificación dice cuánto hace de la última vez; nada la hace envejecer sola.

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
