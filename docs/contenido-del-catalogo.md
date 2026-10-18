# El contenido del catálogo «mecánica × sesión»

Cómo se escribe, se comprueba y se siembra el contenido de las 26 mecánicas de `CATALOGO-FICHAS-DE-MECANICAS.md`
(ADR [0030](adr/0030-una-actividad-es-una-mecanica-y-lo-que-cambia-cada-dia-es-su-sesion.md) y
[0031](adr/0031-los-elementos-de-un-banco-viajan-dentro-de-la-sesion.md)). SCRUM-222, 223 y 224.

## Dónde está

| Qué                                      | Dónde                                                        |
| ---------------------------------------- | ------------------------------------------------------------ |
| El contenido, como datos y generadores   | `src/pruebas/catalogo/<módulo>/`                             |
| Los identificadores, el azar con semilla | `src/pruebas/catalogo/ids.ts`, `azar.ts`                     |
| La biblioteca de pictogramas (claves)    | `src/pruebas/catalogo/pictogramas.ts`                        |
| El generador de las migraciones          | `src/pruebas/catalogo/generar.ts`                            |
| Las pruebas del contenido                | `src/pruebas/catalogo/catalogo.spec.ts` y las de cada módulo |
| Lo que se siembra                        | `prisma/migrations/<fecha>_catalogo_de_<módulo>/`            |

## El flujo

1. Se escribe o se corrige el contenido en `src/pruebas/catalogo/`.
2. `node src/pruebas/catalogo/generar.ts` escribe las migraciones. (Node 24 ejecuta TypeScript sin compilar, por
   eso los módulos de esa carpeta se importan con `.ts` y no usan nada del dominio.)
3. `npm test` recorre **cada sesión**: contrato de su motor, lenguaje clínico (R6), lista de exclusión (R14),
   máximo igual al de la mecánica, ningún elemento en más de dos sesiones, la cuenta recalculada aparte, y que
   el SQL del repositorio es el que produce el generador. Si alguien cambia un texto y olvida generar, falla.
4. Una persona aplica la migración (`npm run db:aplicar`). Es de **solo datos, aditiva e idempotente**: los
   `INSERT` ignoran un identificador ya sembrado.

**Una sesión ya sembrada no se edita** (ADR 0030): si cambia, se retira (`publicado = FALSE`) y se agrega otra con
otro identificador. El generador sobrescribe el archivo, así que solo se usa mientras la migración no se haya
aplicado en ningún ambiente.

## Identificadores

| Qué      | Forma                                  | Ejemplo                                                   |
| -------- | -------------------------------------- | --------------------------------------------------------- |
| Mecánica | `0acd0000-0000-4000-8000-000000000CNN` | COG-02 → `…000000000102`, EMO-03 → `…000000000303`        |
| Sesión   | `5e51CCNN-0000-4000-8000-0000000000SS` | COG-02, sesión 7 → `5e510102-0000-4000-8000-000000000007` |

`C` es la categoría (1 Cognición, 2 Bienestar, 3 Emociones), `NN` el número de la ficha y `SS` la sesión, de 01 a 40.

## Qué sale publicado

Solo lo que **no pide revisión profesional** (`revision = 'no_requiere'`). Lo que la pide entra `pendiente` y sin
publicar, y la base impide publicarlo así (`sesion_de_actividad_publicada_revisada`). Publicarlo es una migración
aparte, que se genera de la hoja de aprobación cuando una persona con formación lo revisa y queda dicho quién y
cuándo.

## Una restricción del PostgreSQL local de Windows

`npm run db:local` crea la base en **WIN1252**. Un carácter que esa codificación no tiene (por ejemplo el signo
menos «−», U+2212) hace fallar la migración **a mitad** y deja la base local a medias: Prisma no aplica el archivo
en una sola transacción. Supabase es UTF-8 y no tiene el problema, pero el contenido se escribe para que se pueda
aplicar en las dos: una prueba comprueba que el SQL solo usa caracteres que WIN1252 entiende.

Si una migración de contenido quedó a medias en la base local: `npx prisma migrate resolve --rolled-back
<nombre>`, se borran las filas sembradas y se vuelve a aplicar (es idempotente, así que repetirla no duplica).

## Revisar y publicar

Que las sesiones lleguen a la base no las aprueba. Como se les da a quien revisa y como se publican, en una sola
migracion, lo revisado: `docs/revision-del-catalogo.md` (SCRUM-228).
