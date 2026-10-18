# Revisar y publicar el catálogo (SCRUM-228)

El catálogo se siembra **pendiente y sin publicar** salvo lo que no pide revisión (ADR 0030). Este documento
explica cómo se pasa de «sembrado» a «publicado» sin que nadie tenga que adivinar nada: una hoja para quien
revisa, y **una migración** que sale de sus respuestas.

> **Lo que no cambia:** nada se publica sin una revisión hecha por una persona, que queda escrita con su nombre o
> rol y su fecha. La base lo impone (`CHECK sesion_de_actividad_publicada_revisada`), y una sesión ya revisada no
> se vuelve a editar (disparador). Ni la hoja ni el generador publican nada por sí solos.

## Qué hay por revisar

18 mecánicas y **714 sesiones nuevas** (las 6 sesiones del piloto se revisan con su propia hoja, la de `piloto/`):

| Módulo    | Mecánicas                | Sesiones                | Revisión                                    |
| --------- | ------------------------ | ----------------------- | ------------------------------------------- |
| Cognición | COG-08                   | 40                      | ligera                                      |
| Bienestar | BIE-01 a BIE-09          | 357 (BIE-01: 37 nuevas) | profesional, salvo BIE-05, 08 y 09 (ligera) |
| Emociones | EMO-01 a 05, 07, 08 y 09 | 317 (EMO-02: 37 nuevas) | profesional, salvo EMO-05 y 09 (ligera)     |

EMO-06 se difiere (D-C4). Lo que cada ficha pide mirar con más cuidado está en
`src/pruebas/catalogo/revision/pedidos.ts`, tomado de las barandas de `CATALOGO-FICHAS-DE-MECANICAS.md`.

## Paso 1 · Generar las hojas

```bash
node src/pruebas/catalogo/revision/hoja-cli.ts ../revision-del-catalogo
```

Escribe una hoja por módulo. Para darle a cada persona solo lo suyo (por ejemplo, a quien revisa el estiramiento):

```bash
node src/pruebas/catalogo/revision/hoja-cli.ts ../revision-del-catalogo --mecanicas=BIE-02 --nombre=hoja-de-fisioterapia
```

Cada hoja es **un solo archivo HTML**: se abre con doble clic, sin internet. Quien revisa lee **lo que va a leer la
persona** (no JSON), mecánica por mecánica, y marca una decisión por mecánica:

- **Aprobada**: puede salir tal cual (con la opción de dejar fuera sesiones sueltas, «Esta no sale»).
- **Aprobada con cambios**: hay que cambiar algo antes; lo cambia una persona del equipo y nada de esa mecánica sale.
- **No sale**: queda pendiente.
- **Sin marcar** (lo que trae por defecto): todavía no la revisó; queda pendiente.

Al final, «Copiar mis respuestas» (o «Descargar»). Ese texto es lo que se le devuelve a Samuel.

Una prueba comprueba que **todo texto que la persona va a leer sale en la hoja** (`texto.ts`): un texto que nadie vio
no está revisado. Lo técnico (claves, nombres de dibujos, coordenadas) no se enseña.

## Paso 2 · Escribir la migración con lo revisado

Una hoja por persona que revisó (cada una dice a nombre de quién es y la fecha):

```bash
node src/pruebas/catalogo/revision/publicar-cli.ts respuestas-fisioterapia.txt respuestas-psicologia.txt \
  --escribir=20261024120000_publicar_el_catalogo_revisado
```

- Sin `--escribir`, el SQL sale por pantalla y el resumen por la salida de errores.
- Con `--escribir`, el nombre tiene que ser **posterior a la última migración** y no existir: no pisa nada ni
  escribe una migración fuera de orden.
- `--fecha=2026-10-24T10:00:00-05:00` pisa la fecha de cada hoja; `--exigir-todo` detiene si algo queda sin marcar.

**Se detiene, sin escribir nada, si:** una hoja no dice a nombre de quién es; no dice la fecha; hay una mecánica
«con cambios»; la misma mecánica está aprobada en dos hojas; una hoja habla de una sesión o mecánica que no existe;
o nada quedó aprobado. Lo «No sale» y lo «Sin marcar» **no generan ninguna sentencia**.

La migración es solo datos: un `UPDATE` por mecánica y por revisor, que nombra **las sesiones una por una** y exige
`revision = 'pendiente'`. Aplicarla dos veces no hace nada la segunda vez. Los comentarios de quien revisó salen
como avisos en el resumen: no se pierden.

Si en la misma entrega van filas de la hoja del piloto (`BIE-01-001 · …: Aprobada`), la migración las incluye en la
sentencia de su mecánica; las del piloto que no se aprueban no salen aunque la mecánica sí.

## Paso 3 · Aplicarla

Como cualquier migración de datos: **por PR y por una persona**, nunca a mano en el panel de Supabase.

1. PR de la migración en borrador a `desarrollo` (CI con la base de pruebas).
2. Promoción a PRE, y **Diego aplica** con `npm run db:aplicar` (después `npm run db:estado`).
3. Probar en PRE lo que acaba de salir (la guía del catálogo).

La hoja y el generador no tocan ninguna base. Lo que cambia en una base es siempre una migración que revisa y aplica
una persona.

## Pruebas

- `revision/revision.spec.ts`: qué hay por revisar, el texto que lee quien revisa (completo en cada sesión), la
  hoja (un solo archivo, sin recursos externos, escapada, todo sin marcar), el formato de las respuestas y la
  migración (qué detiene, qué deja pendiente, el SQL).
- `PublicacionDelCatalogo.integracion.spec.ts`: la migración aplicada a PostgreSQL de verdad **dentro de una
  transacción que se deshace**: publica las 714, con su revisor y su fecha; aplicarla dos veces no cambia nada; lo que
  se deja fuera se queda pendiente; la base no deja editar una sesión revisada.
