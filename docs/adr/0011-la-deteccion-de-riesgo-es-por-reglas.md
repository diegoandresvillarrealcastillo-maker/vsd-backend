# ADR 0011: La deteccion de riesgo es por reglas, y lo seguira siendo

- **Estado:** aceptado
- **Fecha:** 2026-09-16
- **Tarea:** SCRUM-60

## Contexto

VSD Health necesita un asistente que acompane despues de una actividad y
responda dudas frecuentes. Y necesita, sobre todo, reaccionar cuando alguien
escribe algo que sugiere que esta en riesgo.

Lo segundo no se parece en nada a lo primero. Responder mal a "como duermo
mejor" es una molestia. Responder mal a "ya no aguanto mas" es una persona que
pidio ayuda y no la recibio.

La restriccion economica ademas es dura: el proyecto no tiene presupuesto, y el
RF9 dice que la aplicacion funciona sin conexion. Una llamada a una API de pago
incumple las dos cosas.

## Decision

**Un puerto, `AsistentePort`, y un adaptador por reglas que lo implementa. La
deteccion de senales de riesgo es una lista explicita de expresiones, se ejecuta
antes que cualquier otra cosa, y su resultado no se negocia.**

Cuando en la Fase 2 exista un adaptador que use un modelo de lenguaje para
redactar el mensaje, **esta comprobacion se seguira ejecutando antes que el**.
Un modelo puede escribir mejor; no puede decidir si alguien recibe un telefono
de ayuda.

El adaptador de reglas tampoco se retira ese dia: se queda como respaldo
permanente, porque un modelo necesita conexion y el RF9 no la garantiza.

Lo que el asistente responde sale de `RECURSO_APOYO`, que pasa de ser un
catalogo de enlaces a ser su base de conocimiento. Cambiar un texto es cambiar
una fila: sin desplegar, y sin que tenga que hacerlo un programador.

## Alternativas descartadas

**Un modelo de lenguaje, gratuito o no, para detectar el riesgo.** Acertaria mas
veces que la lista. Acertaria casi siempre. El problema es el casi: cuando falla
no hay error, no hay registro y no hay forma de enterarse. Lo unico que queda es
alguien al otro lado que no recibio nada.

Tambien hay un problema de gobierno, no solo de acierto. Una lista se lee
entera, se discute en una reunion, se prueba frase por frase y hace lo mismo
dentro de un ano. Un modelo cambia de version y cambia de comportamiento sin
avisar. En una herramienta de bienestar, poder explicar por que salio cada
respuesta no es un lujo burocratico: es lo que permite revisar lo que la
aplicacion le dice a la gente **antes** de decirselo.

**Analisis de sentimiento con una libreria local.** Mas barato que una API y
peor que la lista: sigue siendo probabilistico, y encima nadie del equipo puede
auditar el modelo que trae dentro.

**No hacer deteccion y remitir siempre a los recursos.** Ensenar las lineas de
atencion en cada respuesta las convierte en decorado. Cuando algo esta siempre,
deja de verse.

## Como se equivoca a proposito

**Se prefiere el falso positivo.** No se interpretan negaciones: "no quiero
morirme" contiene "quiero morirme" y dispara igual. El coste de ensenarle
telefonos a quien no los necesita es una pantalla que se ignora; el coste de no
ensenarselos a quien si, no tiene arreglo.

**La lista no es exhaustiva y no pretende serlo.** Es un suelo, no un techo. Que
una frase no este no significa que no haya riesgo: significa que esta capa no lo
vio. Por eso el asistente nunca es la unica via de ayuda de la aplicacion.

## Consecuencias

**A favor**

- Se puede explicar. Ante cualquier respuesta se senala la regla exacta que la
  produjo.
- Cuesta cero y funciona sin conexion.
- Se comporta igual hoy que dentro de un ano.
- Hay una prueba por cada expresion de la lista. Cortar la lista a tres
  expresiones hace fallar 81 pruebas.
- Los textos viven en la base, asi que los puede revisar y corregir alguien que
  no programa. Tambien se comprueban desde ahi: hay una prueba que falla si un
  texto de la base empieza a usar terminologia diagnostica.

**En contra, y hay que decirlo**

- **Reconoce bastante menos que un modelo.** Alguien puede expresar un dolor
  serio sin usar ninguna de estas frases y el asistente no lo vera. Es la
  limitacion principal y se asume a sabiendas.
- Solo entiende cuatro intenciones. Todo lo demas cae en la respuesta generica.
- Esta escrito para el espanol de Colombia. Otra variante o un anglicismo se le
  escapan.
- La lista hay que mantenerla a mano, y esa revision no la puede hacer solo el
  equipo tecnico.

## Actualizacion: la charla de todos los dias (SCRUM-128, 2026-10-06)

El asistente sigue siendo por reglas, y esta decision no cambia. Lo que cambia
es lo que entiende: ahora reconoce saludos, agradecimientos, despedidas,
"como estas" y "que puedes hacer", y lee **palabras completas** en lugar de
pedazos de texto ("mal" ya no se lee dentro de "normal").

Lo nuevo no toca la deteccion de riesgo, que se sigue ejecutando primero y
aparte, sobre el mismo texto y con la misma lista.

La charla se responde **sin lineas de atencion**, y eso es lo delicado: es la
primera vez que el asistente deja de ensenarlas ante algo que no entiende del
todo. Se hizo con una sola regla que lo acota: **la charla solo cuenta cuando el
mensaje entero es charla**. Una palabra que no es de ninguna lista y el mensaje
sigue el camino de siempre, que cuando no entiende ensena las lineas. Asi
"hola, quiero desaparecer" o "adios y gracias por todo", que la lista de riesgo
no tiene, no se quedan sin telefono por llevar un saludo delante.

El precio esta a la vista: "gracias por todo" tampoco es charla. Es una frase
corriente y tambien una despedida, y se prefiere el falso positivo.

Una cosa se acepta con los ojos abiertos: "adios" o "chao" solos son charla.
Alguien podria escribirlos como despedida de otra cosa. Se asume porque
ensenar las lineas en cada despedida de cada conversacion las convertiria en
decorado, que es exactamente lo que este ADR descarto desde el principio. La
respuesta no cierra nada: dice que el asistente sigue ahi cuando la persona
quiera volver.

Los textos nuevos estan en `docs/textos-del-asistente.md`.

## Actualizacion: el asistente mixto, sin conexion (SCRUM-141, 2026-10-08)

Esta decision dice, desde el principio, que el adaptador de reglas "funciona sin
conexion": las reglas y los recursos caben en el dispositivo. Era cierto del
codigo y no de la aplicacion: la pantalla de VSD IA siempre llamaba al servidor,
y sin red solo decia "no pude responderte". Con el modo sin conexion (ADR 0019)
hay que decidir **que** responde el asistente cuando no hay red.

**La deteccion de riesgo no cambia.** Es la misma lista, la misma normalizacion
(sin tildes, en minusculas), se sigue ejecutando primero y aparte, y sigue
siendo por reglas. Lo que cambia es **donde** se aplica.

### Decision

**Un asistente mixto.** Sin conexion responde lo que no necesita nada del
servidor, y todo lo demas exige conexion y lo dice.

| Sin conexion, la persona escribe                   | Pasa                                                                             |
| -------------------------------------------------- | -------------------------------------------------------------------------------- |
| Una expresion de riesgo                            | El mismo mensaje y las lineas de su pais, **sin esperar red**                    |
| "¿Donde busco ayuda?", "¿que lineas de ayuda hay?" | El mismo mensaje y las lineas de su pais                                         |
| Un saludo, un agradecimiento, una despedida        | Su respuesta, de un solo mensaje                                                 |
| Cualquier otra cosa                                | "Esto lo puedo responder cuando tengas conexion." Nunca se inventa una respuesta |

- **Un solo origen.** El servidor publica **los mismos datos** que usa para
  responder, en una ruta publica y versionada: `GET /api/asistente/reglas-locales`
  (la deteccion de riesgo, las reglas de la charla, los paises con sus zonas y las
  lineas de cada uno). No hay una segunda lista escrita en el frontend. Las reglas y
  los textos viven en un solo archivo del dominio (`ReglasDelAsistente.ts`), que
  importan tanto el adaptador de reglas como el caso de uso que las publica.
- **Una prueba que falla si se separan.** `ReglasLocalesYAsistente.spec.ts` le
  pregunta lo mismo al asistente de verdad y a un motor de referencia que **solo
  conoce el paquete publicado**: cada expresion de riesgo, cada patron de cada
  regla, cada zona y un conjunto de frases dificiles. Si algo se agrega en un sitio
  y no en el otro, se rompe y dice cual. El paquete y las respuestas que debe dar el
  dispositivo se guardan ademas como archivo (`docs/contratos/reglas-locales.json`):
  el frontend prueba su motor contra una copia, y cambiar lo que se publica sin
  regenerarlo hace fallar la prueba.
- **Que se responde sin conexion lo dice el dato**, no el cliente: cada regla lleva
  `sinConexion`. Una regla que no se responde sin red **se publica igual**, porque su
  sitio en el orden es lo que impide que "hola, ¿como estas?" se lea como un saludo.
- **Lo que se escribe sin conexion no se envia despues.** No entra a la cola de
  ADR 0019. Un mensaje a un asistente no tiene sentido horas mas tarde, y es lo mas
  intimo que escribe alguien: se queda en la pantalla, la persona decide si lo
  reenvia, y al cerrar el asistente se olvida, como siempre.
- **El paquete se guarda en el dispositivo, por persona, con ETag**, como el resto
  de las lecturas con copia (ADR 0019). Sin red y sin paquete, el asistente se
  comporta como antes: lo dice, y deja a mano las lineas de respaldo.

### Alternativas descartadas

**Una copia de las reglas escrita en el frontend.** Es lo mas facil y es justo lo
que este ADR evita desde el principio: dos listas que alguien tiene que acordarse de
mantener juntas, en un asunto en el que una diferencia es una persona sin telefono.

**Guardar la ruta en la cache del service worker.** El service worker no toca la API
por diseno (SCRUM-135): ninguna respuesta de la API pasa por su cache, y esta
garantia es mas facil de sostener sin excepciones. El paquete no es personal, pero
las copias de la aplicacion viven todas en el mismo sitio.

**Encolar lo que se escribe sin red y enviarlo despues.** Ver arriba.

**Responder sin conexion tambien "¿como estas?" y "¿que puedes hacer?".** Es
posible, y es cambiar un valor en un solo archivo. No se hizo porque no es lo que
se decidio: sin conexion el asistente es honesto sobre lo poco que hace.

### Consecuencias

**A favor**

- Quien esta mal y sin red recibe sus lineas **sin esperar**, que es lo que el RF9
  prometia desde el principio.
- Sin conexion el asistente nunca inventa: o responde lo basico, o dice que lo
  respondera cuando haya conexion.
- La deteccion de riesgo sigue siendo una lista que se lee entera y se prueba frase
  por frase, ahora tambien en el dispositivo.

**En contra, y hay que decirlo**

- **Hay que haber abierto la aplicacion con conexion al menos una vez** para tener
  el paquete. Quien nunca lo tuvo recibe lo de antes.
- **Las lineas del dispositivo pueden estar desactualizadas.** Llevan fecha de
  verificacion en el servidor y se renuevan solas, con ETag, al volver la red.
- **El algoritmo existe dos veces** (servidor y aplicacion). Los datos no: el
  algoritmo se comprueba con el contrato y el conjunto de frases.
- Cambiar una regla, un texto o una linea cambia el contrato: hay que regenerarlo y
  copiarlo al frontend, y la prueba lo recuerda.
- Los falsos positivos del riesgo siguen siendo los de siempre, y ahora tambien
  ocurren sin red.

Los textos nuevos estan en `docs/textos-del-asistente.md`, seccion 6.
