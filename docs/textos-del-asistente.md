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
