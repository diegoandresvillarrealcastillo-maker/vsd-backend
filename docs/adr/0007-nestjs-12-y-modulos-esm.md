# ADR 0007 — NestJS 12 y modulos ESM

**Estado:** Aceptado
**Fecha:** 15/09/2026

## Contexto

El Ciclo 2 dejo el proyecto en CommonJS, con una nota en `tsconfig.json` que
decia que era "lo que NestJS admite sin friccion". Al integrar NestJS en el
Ciclo 3 resulto que eso ya no es cierto: **NestJS 12 se publica solo como ESM**
(`"type": "module"` en su `package.json`), y TypeScript se niega a generar un
`require` sobre un modulo ESM.

Habia que elegir entre dos caminos, y ninguno era obviamente mejor.

## Decision

Se adopta **NestJS 12 y se convierte el proyecto a modulos ESM**:
`"type": "module"` en `package.json`, `module` y `moduleResolution` en
`nodenext`, y extension `.js` explicita en los imports relativos.

## Alternativas consideradas

**Quedarse en NestJS 11, que es CommonJS.** Habria sido cero trabajo: no habia
que tocar ni un import. A su favor, la practica totalidad de la documentacion,
los tutoriales y las respuestas en foros que el equipo va a encontrar asumen
CommonJS y NestJS 10 u 11. Ademas `@nestjs/throttler` funciona en la 11.

Se descarto porque significaria empezar un proyecto nuevo, con un solo
endpoint escrito, sobre la version anterior del framework. La migracion a ESM
no va a ser nunca mas barata que ahora: cuanto mas codigo haya, mas cara sera.

**Usar `--legacy-peer-deps` para forzar la instalacion.** Se descarto sin mucha
discusion: esa bandera no resuelve la incompatibilidad, solo hace que npm deje
de avisar de ella.

## Como se decidio

No por intuicion. Se convirtio el proyecto a ESM como experimento acotado y se
midio el resultado: un script anadio la extension `.js` a los imports
relativos de 22 archivos, y el chequeo de tipos dejo **un unico error**, que
ademas no tenia nada que ver con ESM (un arreglo de solo lectura asignado
donde se esperaba uno mutable). Las 48 pruebas del Ciclo 2 siguieron pasando
sin tocarlas.

Con ese dato, el coste real de ESM quedo claro y la decision dejo de ser una
apuesta.

## Consecuencias

A favor: el proyecto queda en la version actual del framework, sin deuda de
migracion. Vitest, que ya era ESM de forma nativa, encaja mejor. Y el codigo
compilado se ejecuta en Node sin capas intermedias.

En contra, y hay que tenerlo presente:

**Los imports relativos llevan `.js` aunque el archivo sea `.ts`.** Es lo que
exige Node en ESM y desconcierta la primera vez que se ve. Si alguien escribe
`from './Algo'` sin extension, el chequeo de tipos falla con un mensaje poco
claro.

**Parte del ecosistema de NestJS va por detras.** `@nestjs/throttler` todavia
no soporta la 12, y por eso el limite de peticiones se resolvio con
`express-rate-limit`, que solo depende de Express. Es previsible que vuelva a
pasar con otros paquetes, y la respuesta sera la misma: buscar una alternativa
que no dependa de NestJS antes que bajar de version.

**La mayor parte de la documentacion que encuentren en internet sera CommonJS.**
Cuando un ejemplo no funcione, lo primero que hay que mirar es si viene de un
proyecto CommonJS.

Esta decision reemplaza la nota del Ciclo 2 que daba por hecho que NestJS
necesitaba CommonJS.
