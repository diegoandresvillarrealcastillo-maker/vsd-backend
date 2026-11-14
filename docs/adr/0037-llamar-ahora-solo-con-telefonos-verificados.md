# ADR 0037: «Llamar ahora» solo con teléfonos verificados

- **Estado:** aceptada (SCRUM-257). Cumple el punto 4 del [ADR 0034](0034-acompanamiento-por-dias-seguidos-con-atencion.md).
  **Diego la confirma al fusionar.**
- **Fecha:** 2026-10-24
- **Se relaciona con:** ADR 0015 (las líneas de ayuda por país), ADR 0034 (el acompañamiento) y
  SCRUM-124 (cada línea con fuente y fecha de verificación).

## Contexto

Las líneas de atención se ven dentro de un texto («Línea 192, opción 4», «Se marca 800 911 2000») y
quien las necesita tiene que copiar el número y pegarlo en el marcador. En una crisis eso es una
fricción grave, y el ADR 0034 lo dejó anotado: hacía falta un botón «Llamar ahora», pero **solo con
números que una persona hubiera confirmado**, porque un número equivocado en ese momento es el peor
error posible (ADR 0015).

Samuel pidió además que los números de Diego y Samuel se muestren como **números del equipo de
VSD / desarrolladores, solo para problemas técnicos**, y que «Llamar ahora» sea solo para las líneas
verificadas, las de Colombia o las del país de cada persona.

## Decisión

1. **Una columna `recurso_apoyo.telefono`**, con lo que se marca y nada más: cifras, con un `+`
   delante si lleva prefijo de país. La base impone el formato (`recurso_apoyo_telefono_formato`) y que
   solo la tenga un contacto (`recurso_apoyo_telefono_solo_en_contactos`). El dominio impone lo mismo
   antes de llegar a la base (`RecursoApoyo.create`).
2. **Un número que se marca con un botón siempre viene de una línea verificada.** Un contacto no
   entra sin fuente y fecha de verificación (ADR 0015) y solo un contacto puede llevar teléfono. No hay
   forma de tener un botón sobre un número que nadie confirmó.
3. **No se anade ningún número nuevo.** La migración copia a la columna lo que cada fila ya dice en su
   título o su descripción, que una persona confirmó en su fuente oficial. Una prueba comprueba que el
   número de la columna es siempre el que dice el texto de la línea; otra, que son exactamente estos
   nueve y que ninguna otra línea lleva uno.

   | País | Línea                    | Se marca     |
   | ---- | ------------------------ | ------------ |
   | CO   | Línea 192, opción 4      | `192`        |
   | CO   | Línea 123                | `123`        |
   | CO   | Línea 106 (desde Bogotá) | `106`        |
   | MX   | Línea de la Vida         | `8009112000` |
   | MX   | Línea 911                | `911`        |
   | ES   | Línea 024                | `024`        |
   | ES   | Línea 112                | `112`        |
   | US   | Línea 988                | `988`        |
   | US   | Línea 911                | `911`        |

4. **El directorio internacional no lleva teléfono**, a propósito: quien está en un lugar sin líneas
   verificadas no recibe un número que podría no ser el suyo (ADR 0015). Sin teléfono, no hay botón.
5. **Una opción que se elige al contestar no se marca sola.** El 192 pide la opción 4 y el 988 pide
   «2» para español: el botón marca `192` y la persona elige la opción que ve escrita en la línea.
   No se usan pausas (`,`) ni teclas automáticas: el tiempo de espera cambia de un operador a otro y
   una opción marcada antes de tiempo es peor que ninguna.
6. **El país sigue saliendo de la zona horaria** (ADR 0015). No se pide ubicación. Quien está en un
   país con líneas ve los botones de las de su país y nada más.
7. **Los números del equipo no son una línea de ayuda ni van en esta tabla.** Son un contacto técnico
   fijo del frontend, con la aclaración «solo para problemas técnicos», y nunca llevan «Llamar ahora»:
   ese botón es el de una crisis y no puede mandar a nadie con un desarrollador.
8. **Migración** `20261024170000_telefono_verificado_de_las_lineas`: una columna, nueve `UPDATE` con
   los números de arriba y las dos restricciones. Sin datos que mover, sin cambiar permisos ni el
   aislamiento. **La aplica una persona, antes de desplegar el backend.** Sin migrar, el campo no
   existe y el frontend no muestra ningún botón: no se rompe nada.

## Alternativas consideradas

- **Sacar el número del título con una expresión regular en el frontend.** Descartada: es adivinar. Un
  título como «Línea 192, opción 4» o «Línea de la Vida, 800 911 2000» se parte mal en cualquier
  expresión, y el error caería en el momento en que no puede.
- **Marcar la opción con una pausa** (`192,4`). Descartada: la pausa dura distinto según el teléfono y
  el operador. Si marca la 4 antes de que termine el mensaje, no hace nada; si marca otra cosa,
  conecta con otro servicio.
- **Poner el botón también en el directorio internacional.** No hay un número que ofrecer.
- **Guardar el teléfono dentro de `enlace` como `tel:...`.** Descartada: mezcla dos cosas (la página
  del servicio y lo que se marca) y obliga a cada pantalla a distinguirlas.

## Consecuencias

- **Se gana:** un toque en lugar de copiar y pegar, en las cinco pantallas que muestran líneas, sin
  cambiar el criterio de qué línea ve cada persona.
- **Se pierde:**
  - **Los números caducan** (ADR 0015). Si una línea cambia, el botón marca el número viejo hasta que
    alguien corrija la fila con una migración. La fecha de verificación sigue ahí para verlo.
  - **Una línea con opción** (192, 988) hace un paso más que las demás; el texto lo dice.
  - Un teléfono sin saldo o sin línea no puede llamar; el texto con el número sigue ahí para
    anotarlo.
- **El frontend tiene su parte** (PR aparte): el botón «Llamar ahora» solo con un teléfono de formato
  válido, y el contacto técnico del equipo. **Orden:** primero la migración en PRE (la aplica una
  persona), después este backend y al final el frontend.
