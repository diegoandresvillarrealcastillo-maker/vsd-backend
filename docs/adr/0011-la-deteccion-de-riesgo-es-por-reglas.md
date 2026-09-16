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
