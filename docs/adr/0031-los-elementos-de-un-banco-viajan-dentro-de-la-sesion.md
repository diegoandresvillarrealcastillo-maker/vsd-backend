# ADR 0031: Los elementos de un banco viajan dentro de la sesión

- **Estado:** propuesta (SCRUM-220, `[C7-50]`). Cierra el punto que el ADR 0030 dejó fuera a propósito
  («los bancos de elementos... se decide en un ADR propio antes del primer lote que los necesite»).
- **Fecha:** 2026-10-18
- **Relacionados:** [ADR 0030](0030-una-actividad-es-una-mecanica-y-lo-que-cambia-cada-dia-es-su-sesion.md),
  [ADR 0025](0025-los-datos-curiosos-recorren-su-ciclo-sin-repetirse.md), ADR 0019 (modo sin conexión),
  `CATALOGO-FICHAS-DE-MECANICAS.md` §0.2.

## Contexto

Cinco mecánicas de Cognición y varias de Emociones se juegan con un **banco** de elementos: las palabras de
«La palabra que sobra» (COG-02) y de «Completa la palabra» (COG-07), las mesas de «Ordena por categoría»
(COG-03), las listas de «Recuerda la lista» (COG-06), las situaciones de «Lo que sí controlo» (EMO-04). Las
fichas piden que **una persona no vea el mismo elemento más de dos veces en un año**, y calculan el banco
mínimo como `⌈40 × rondas ÷ 2⌉` elementos.

El ADR 0030 resolvió la repetición de **sesiones** con una consulta sobre `resultado` (la persona hizo la
sesión X hace menos de 365 días), sin cursor ni tabla personal. Para los elementos, la pregunta es la misma:
¿cómo se evita repetirlos sin guardar qué vio cada persona?

## Decisión

1. **Cada sesión lleva sus elementos dentro de `parametros`.** Una sesión de COG-02 trae sus seis grupos de
   cuatro palabras; una de COG-07, sus seis palabras; una de COG-06, su lista y sus distractores. **No hay una
   tabla de elementos, ni un banco que se consulte, ni un cursor por persona.** El banco es una propiedad
   del conjunto de sesiones de la mecánica, no una entidad.

2. **Repartir el banco entre las sesiones es trabajo de quien escribe el lote**, y una prueba lo comprueba:
   **ningún elemento aparece en más de dos sesiones de su mecánica.** Con 40 sesiones de seis rondas, 240
   plazas, el banco mínimo es de 120 elementos, tal como pedía la ficha.

3. **La garantía de «no más de dos veces al año» es la de las sesiones.** La rotación del ADR 0030 no repite
   una sesión de una mecánica en 365 días mientras la persona no la haya agotado. Si cada elemento está en a lo
   sumo dos sesiones, lo verá a lo sumo dos veces en ese periodo.

4. **Los elementos se escriben una vez y se arman en sesiones.** Las sesiones se generan desde el contenido
   del repositorio (`src/pruebas/catalogo`), no se escriben a mano en SQL. Un elemento corregido se retira y se
   repone en las sesiones que lo llevan, como cualquier sesión revisada (ADR 0030, «una revisada no se edita»).

## Alternativas consideradas

- **Una tabla `elemento_de_banco` con `publicado` y `revisada_por`, y un registro de lo que vio cada
  persona.** Es lo que haría falta para garantizar la regla con **cualquier** uso (una persona que juega la
  misma mecánica cada día durante dos años). Cuesta una tabla personal más que exportar y borrar (Ley 1581), una
  consulta mucho más cara y una segunda verdad que puede desincronizarse de `resultado`. **Descartada** para
  esta tanda; se retoma si el uso real la pide.
- **Elegir los elementos en el teléfono, con una semilla (persona + día).** No hay nada que guardar, pero la
  sesión deja de ser un contenido que alguien revisó: lo que ve la persona lo decide un algoritmo, no una
  hoja de aprobación. **Descartada**: contradice la regla de que lo revisado es lo que se sirve.
- **Un banco por módulo compartido entre mecánicas.** Reutiliza elementos, pero ata la revisión de una mecánica
  a la de otra. **Descartada.**

## Consecuencias

**Lo que se gana**

- Todo lo que ve una persona está en una fila de `sesion_de_actividad`, con su revisión y su historial. La
  hoja de aprobación de un lote es una lista de sesiones, no de piezas sueltas.
- Funciona sin conexión con lo que el sendero ya guarda (ADR 0019): la sesión de hoy trae sus elementos.
- No hay tablas ni columnas nuevas.

**Lo que se pierde o se acepta**

- **La garantía es la de las sesiones, y no más.** Con 40 sesiones por mecánica y tres mecánicas por día en un
  módulo, una mecánica sale cada tres días en promedio y sus 40 sesiones duran unos 120 días; después empieza
  el ciclo y un elemento se repite. A uso intensivo, «dos veces al año» no se cumple para quien hace todo
  cada día. Es la misma cuenta que dejó abierta el ADR 0030 (hacen falta unas 1.100 sesiones por módulo para
  garantizar 365 días a tres por día), y la decisión de producto sigue siendo de Diego.
- **Se repite contenido entre sesiones.** Cada elemento está en hasta dos filas. Ocupa más espacio que un
  banco, pero la sesión pesa de 1 a 3 KB y el catálogo no viaja entero al dispositivo, solo la sesión de hoy.
- **Corregir un elemento toca varias sesiones**, y las que ya se revisaron se retiran y se reponen.
