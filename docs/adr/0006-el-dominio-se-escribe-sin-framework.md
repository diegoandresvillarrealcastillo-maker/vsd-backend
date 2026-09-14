# ADR 0006 — El dominio se escribe sin framework

**Estado:** Aceptado
**Fecha:** 14/09/2026

## Contexto

El orden de los ciclos se reordeno para construir el sistema de dentro hacia
afuera: primero la arquitectura, despues el backend, la base de datos, la
autenticacion y por ultimo la interfaz.

Eso abrio una pregunta: si el Ciclo 2 es "arquitectura hexagonal" y el Ciclo 3
es "backend NestJS", que contiene exactamente el Ciclo 2. La respuesta facil
seria crear el proyecto de NestJS y dentro de el las carpetas de las tres
capas, pero entonces el dominio nace ya dependiendo de un framework.

## Decision

El Ciclo 2 construye `domain/` y `application/` en **TypeScript puro, sin
NestJS y sin ninguna biblioteca externa**. NestJS entra en el Ciclo 3 como una
capa de infraestructura que se conecta a los puertos que ya existen.

Una regla de ESLint impide que `domain/` importe cualquier cosa que no sea el
propio dominio, y hace fallar la construccion si alguien lo intenta.

## Alternativas consideradas

**Crear el proyecto de NestJS primero y organizar las carpetas dentro.** Es lo
habitual y lo mas rapido de arrancar. Se descarto porque invierte el orden: el
framework quedaria primero y el dominio se acomodaria a el. La prueba de que la
arquitectura funciona es precisamente que el nucleo no lo necesite.

**Escribir el dominio sin regla automatica, confiando en la disciplina.** Se
descarto por lo mismo que la proteccion de ramas: una regla que depende de que
alguien se acuerde no es una regla. La arquitectura se erosiona sin que nadie
lo note.

## Consecuencias

A favor: al terminar el Ciclo 2 queda demostrado, y no solo afirmado, que la
logica de negocio se ejecuta y se prueba sin levantar nada. Las pruebas del
dominio tardan milisegundos. Y cuando NestJS entre en el Ciclo 3, si hubiera
que tocar el dominio para que encaje, sabremos de inmediato que el diseno
estaba mal.

Es tambien el argumento que se puede defender ante el Comite de Arquitectura:
la separacion es verificable, no es un diagrama.

En contra: el Ciclo 2 no produce nada ejecutable para un usuario. No hay
servidor ni endpoint, solo codigo y pruebas. Para quien espera ver una pantalla,
el avance no se aprecia. Es el costo de construir de dentro hacia afuera y se
asume.

Segunda consecuencia: hay que mantener la regla de ESLint al dia. Si aparece un
caso legitimo en que el dominio necesita algo externo, la solucion no es anadir
una excepcion sino declarar un puerto de salida.
