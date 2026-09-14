# ADR 0001 — Dos repositorios separados en lugar de un monorepo

- **Estado:** Aceptada
- **Fecha:** 2026-09-14
- **Ciclo:** 0

## Contexto

VSD Health tiene dos piezas desplegables: una PWA en React y una API en
NestJS. Comparten conceptos de dominio y, sobre todo, comparten el
contrato de la API: los tipos de lo que una envia y la otra recibe.

Hay dos formas de organizarlo: un unico repositorio con las dos partes
dentro, o dos repositorios independientes.

## Decision

**Dos repositorios separados:** `vsd-frontend` y `vsd-backend`.

## Alternativas consideradas

### Monorepo

Era la opcion tecnicamente recomendada. Con un solo repositorio, los
tipos compartidos viven en un paquete comun y es imposible que el
frontend y el backend se desincronicen sin que el compilador lo note.

Se descarto porque el equipo lo decidio asi por razones de organizacion
del trabajo academico y porque los repositorios ya estaban creados y
compartidos con el docente.

### Dos repositorios con un tercero para tipos compartidos

Anade un tercer repositorio que hay que versionar y publicar para un
equipo de dos personas. Demasiada ceremonia para el tamano del proyecto.

## Consecuencias

### A favor

- Cada parte se despliega por separado: la PWA en Vercel, la API en
  Render, sin que un cambio en una dispare el despliegue de la otra.
- Los permisos y el historial de cada parte quedan separados.
- El CI de cada repositorio es mas pequeno y mas rapido.

### En contra

- **Riesgo principal: los tipos se desincronizan.** El backend puede
  cambiar la forma de una respuesta y el frontend seguir compilando
  contra la forma vieja. El error solo aparece en tiempo de ejecucion.
- Un cambio que toca las dos partes necesita dos Pull Requests, y
  fusionarlos en el orden equivocado rompe la aplicacion.

### Mitigacion acordada

NestJS genera el contrato OpenAPI a partir del codigo. El frontend
deriva sus tipos de TypeScript de ese contrato, en lugar de escribirlos
a mano. Una comprobacion del CI falla si el contrato publicado y el
codigo dejan de coincidir.

Esto no elimina el riesgo, pero lo convierte en un fallo de compilacion
en lugar de un fallo en produccion. Se implementa en el Ciclo 4.
