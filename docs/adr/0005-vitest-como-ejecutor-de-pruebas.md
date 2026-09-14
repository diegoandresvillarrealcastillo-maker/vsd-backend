# ADR 0005 — Vitest como ejecutor de pruebas

**Estado:** Aceptado
**Fecha:** 14/09/2026

## Contexto

El Ciclo 2 construye el dominio en TypeScript puro y necesita un ejecutor de
pruebas. La eleccion condiciona el resto del proyecto, porque en el Ciclo 3
entra NestJS y en el Ciclo 4 aparecen pruebas de integracion contra PostgreSQL.

El equipo es de dos personas y el ciclo de trabajo es corto: las pruebas se
ejecutan muchas veces al dia, asi que su velocidad importa mas de lo que suele
parecer al principio.

## Decision

Se usa **Vitest** como unico ejecutor de pruebas del proyecto.

## Alternativas consideradas

**Jest.** Es el valor por defecto de NestJS: `nest new` lo configura solo, y la
mayor parte de la documentacion y de las respuestas en foros lo asumen. A favor
de Jest juega precisamente eso, que es el camino trillado.

En contra: necesita `ts-jest` o Babel para entender TypeScript, lo que anade
configuracion y lentitud. En un proyecto que va a ejecutar las pruebas en cada
guardado, esa diferencia se nota.

**Node test runner.** Viene incluido en Node y no requiere dependencias. Se
descarto porque su ecosistema de cobertura y de dobles es mas pobre, y
tendriamos que resolver a mano cosas que las otras dos opciones ya traen.

## Consecuencias

A favor: arranque y ejecucion notablemente mas rapidos, entiende TypeScript sin
capa intermedia, la configuracion cabe en un archivo corto, y la cobertura por
rutas con umbrales distintos por capa funciona de fabrica.

En contra, y hay que vigilarlo: **en el Ciclo 3 hay que integrar NestJS sin
arrastrar Jest.** Si se ejecuta `nest new` sobre el proyecto, traera su propia
configuracion de Jest y acabaremos con dos ejecutores. Las dependencias de
NestJS se anadiran a mano sobre la estructura que ya existe.

Segundo riesgo: menos respuestas disponibles cuando algo falle, por ser menos
usado con NestJS que Jest. Se asume conscientemente.

Si en el Ciclo 3 la integracion resulta costosa, esta decision se revisa con un
ADR nuevo que lo reemplace. No se edita este.
