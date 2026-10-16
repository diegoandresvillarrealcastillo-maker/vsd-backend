# ADR 0030: Una actividad es una mecánica, y lo que cambia cada día es su sesión

- **Estado:** propuesta (SCRUM-203, `[C7-33]`; punto de mejora de Diego, modelo aprobado por Samuel el
  15/10/2026; las fichas y las decisiones D-C1 a D-C4 y D-C6 el 15/10/2026). **Para revisar con Diego antes de
  implementar nada.**
- **Fecha:** 2026-10-15
- **Fichas:** `CATALOGO-FICHAS-DE-MECANICAS.md` (27 mecánicas, 9 motores, reglas R1 a R14).
- **No cambia nada hoy:** este ADR no trae código ni migración. Lo que dice «se añade» es lo que haría la
  implementación, en tickets aparte, después de aprobarlo.

## Contexto

El encargo es que cada módulo ofrezca **365 actividades distintas al año**, «únicas» para cada persona
(no se repite en 365 días). Hoy hay 9 actividades, 3 por módulo, y cada una es una fila de `actividad`
con su pantalla escrita a mano en el frontend (`registro.tsx` la elige por el identificador).

Lo que se verificó en el código y condiciona la decisión:

- **El catálogo, el sendero y los resultados se apoyan en `actividad`.** `resultado.id_actividad` es una
  clave foránea, `GET /api/catalogo` ofrece cada fila y el sendero cuenta una sesión por día con algo
  hecho. Si cada «actividad del día» fuera una fila, serían unas **1.080 filas** en el catálogo
  (27 mecánicas × 40), que también se guardan en el dispositivo (ADR 0019) y se pintan en el sendero.
- **La interpretación del resultado es de la mecánica, no de la sesión.** `puntaje_maximo`, `umbrales`,
  `textos_nivel` y `direccion_escala` están en `actividad`, y el servidor es el único que deriva el
  nivel (la clase `Activity` y el comentario de `ActividadDelCatalogoDto`).
- **Las 5 actividades de Bienestar y Emociones con preguntas fijas lo son a propósito:** su tendencia
  semanal compara lo mismo día a día. No admiten variantes. Las que sí varían son las **27 mecánicas
  nuevas** de las fichas, que comparten **9 motores** (4 ya existen en el frontend).
- **Los datos que varían por actividad van en JSONB** (ADR 0008) y **un contenido que rota sin repetirse
  se calcula, no se guarda** (ADR 0025 y 0024). Aquí no hace falta un cursor, como se verá.
- **El contenido pasa por una revisión profesional.** Samuel lo fijó el 15/10: lo que pide revisión no
  sale hasta que una persona con formación lo apruebe, y después se prueba en PRE y se ajusta. Eso tiene
  que ser una garantía, no una costumbre.
- **Las cuentas importan:** un año a **una sesión por módulo y por día** son 365; con las 9 mecánicas
  nuevas de cada módulo, cada una se hace unas 40 veces al año. A tres por día alcanzan 4 meses
  (ver Consecuencias).

## Decisión

1. **Una actividad es una mecánica; la sesión es contenido.** (En el sendero, «sesión» ya es un día con
   algo hecho; aquí «sesión de actividad» es el contenido de una vez. Los dos usos conviven y el código
   los llama distinto: `Sesiones` en el progreso y `SesionDeActividad` en el contenido.) Se mantiene una fila de `actividad` por
   mecánica (27 más las 9 actuales). El catálogo, el sendero, los resultados y la exportación **siguen
   hablando de actividades**. Una sesión **no** es una actividad: no sale en el catálogo ni en el
   sendero como un elemento propio.

2. **`actividad.motor`** (texto, nullable, con `CHECK` sobre los 9 valores de las fichas: `secuencia`,
   `tocar_el_objetivo`, `ver_ocultar_recordar`, `clasificar`, `palabras`, `calculo`, `guia_paso_a_paso`,
   `cuestionario_corto`, `escritura_breve`). Dice **qué componente** pinta la mecánica y **cómo se
   interpretan los parámetros de sus sesiones**. Las 9 actuales quedan en `NULL` hasta la Fase 0. Sumar
   una mecánica que reutiliza un motor no pide código de pantalla nuevo en el frontend.

3. **Tabla `sesion_de_actividad`** (el contenido de un día):

   | Columna                       | Para qué                                                                        |
   | ----------------------------- | ------------------------------------------------------------------------------- |
   | `id_sesion` (uuid)            | clave estable (ADR 0003); es la que viaja al dispositivo                        |
   | `id_actividad`                | la mecánica (FK, `ON DELETE RESTRICT`)                                          |
   | `titulo`                      | nombre corto para la exportación y la revisión                                  |
   | `nivel` (1 a 3)               | dificultad o profundidad, para las que tienen niveles                           |
   | `parametros` (JSONB)          | lo que el motor necesita: tamaño, símbolos, guion, invitación, pasos (ADR 0008) |
   | `publicado`                   | solo se sirven las publicadas; retirar no borra (ADR 0025)                      |
   | `revision`                    | `no_requiere`, `pendiente` o `revisada`                                         |
   | `revisada_por`, `revisada_el` | constancia de quién y cuándo (rol o nombre; sin datos de contacto)              |
   | `creada_en`                   | auditoría                                                                       |
   - **Un `CHECK` impide publicar sin revisar:** `NOT publicado OR revision IN ('no_requiere','revisada')`.
     Es la regla de Samuel convertida en garantía de la base, igual que el `UNIQUE` de la idempotencia.
   - **Una sesión revisada no se edita.** Si el texto cambia, se retira y se agrega otra con otro
     identificador (queda `pendiente` hasta que se revise). Así el historial de una persona siempre apunta
     al contenido que de verdad vio.
   - **La base no valida `parametros`; el dominio sí.** Cada motor tiene su validación al cargar
     (`SesionDeActividad.create`, como `Activity.create`), y una prueba recorre todo el contenido
     sembrado: máximo igual al de la mecánica (punto 5), prueba automática de lenguaje clínico (regla R6),
     lista de palabras excluidas (R14) y longitud de los textos.
   - **Lectura abierta y escritura de administrador**, como `recurso_apoyo` y `dato_curioso` (ADR 0010):
     no es un dato personal.

4. **`resultado.id_sesion`** (uuid, nullable, FK `ON DELETE RESTRICT`, indexado con `id_usuario` y `dia`).
   Se manda al registrar el resultado. **Lo que la persona hizo es lo que queda**: no hay cursor ni tabla
   personal nueva. Una sesión retirada después de servirse **se sigue aceptando**: quien la tenía abierta
   puede terminarla. Una sesión que no es de esa actividad se rechaza con 400.

5. **El máximo es de la mecánica, no de la sesión.** Todas las sesiones de una mecánica puntúan sobre el
   mismo `puntaje_maximo`; una sesión más larga o más difícil cambia cómo se gana el puntaje, no el
   máximo. Así el servidor sigue siendo el único que interpreta el nivel y la tendencia sigue comparando
   lo mismo. (El nivel de dificultad queda en `sesion.nivel`, no en el puntaje.)

6. **Qué sesión toca.** Para una persona y una mecánica, **hoy**:
   1. si ya hizo una sesión de esa mecánica hoy, es esa (la última, si la repitió; la actividad sale como hecha y no se le ofrece
      otra el mismo día);
   2. si no, entre las publicadas, **la de menor clave que no hizo en los últimos 365 días**, con la
      clave `hashtextextended(id_sesion || ':' || id_usuario, 0)` y el identificador como desempate (ADR 0025);
   3. si ya las hizo todas, **la que hizo hace más tiempo**: el ciclo empieza otra vez, en el mismo orden.

   «Los últimos 365 días» se miden contra `resultado.dia` (la zona de la persona, ADR 0014). Es una
   función de lo que hay en `resultado`, así que no depende del orden en que llegan los resultados sin
   conexión (ADR 0019) y se puede probar sin base de datos. Una sesión nueva entra donde le toca por su
   clave; una retirada se salta.

7. **Qué mecánicas tocan hoy.** Se añade `rotativa` a `FrecuenciaActividad` (valor nuevo del enum; la
   migración es aditiva). Las mecánicas `rotativa` de un módulo se ofrecen **hasta 3 por día** (constante
   `MECANICAS_ROTATIVAS_POR_DIA = 3`), elegidas por: primero las **hechas hoy** (siguen visibles), luego las
   **que hace más días que no hace** (las nunca hechas, antes), y por último la clave
   `hashtextextended(id_actividad || ':' || id_usuario || ':' || dia, 0)`. Las diarias, semanales y únicas
   siguen igual que hoy. La rotación **no limita** lo que la persona puede hacer: las demás mecánicas
   siguen en el catálogo y hacerlas no tiene tope (SCRUM-184).

8. **Una franja horaria opcional** (`franja`: `manana`, `tarde`, `noche`, `NULL` = cualquiera) en la
   mecánica, para las que solo tienen sentido a una hora (BIE-07 «Antes de dormir», EMO-09 «El cierre del
   día»). Se calcula con la hora de la persona (ADR 0014). Es una columna nullable y se añade con la
   primera mecánica que la use, no antes.

9. **La API crece sin romper nada.** `ActividadDeHoyDto` (sendero) y la actividad del catálogo ganan
   `motor` y, en el sendero, `sesion` (`{ id, titulo, nivel, parametros }`) con **el contenido de hoy**: así
   viaja de una sola vez con el sendero que el dispositivo ya guarda (ADR 0019) y se puede hacer la
   actividad sin conexión. `POST` del resultado acepta `idSesion` opcional. Un cliente anterior ignora
   los campos nuevos y las 9 actuales siguen sin sesión.

10. **Exportación y borrado (Ley 1581).** Los resultados ya se borran con la cuenta; la exportación suma el
    **título de la sesión** (no el identificador ni los parámetros). No se crea ninguna tabla personal.

11. **Fuera de este ADR, a propósito:**
    - **Los bancos de elementos** (palabras, listas, categorías: COG-02, 03, 06, 07, 09 y algunas de
      Emociones) piden recordar qué elemento vio cada persona y tienen su propia cuenta de tamaños. El piloto
      (COG-01, BIE-01, EMO-02) **no usa ninguno**. Se decide en un ADR propio antes del primer lote que los necesite.
    - **Las sesiones de temporada** (~5 por módulo). Se añaden como columnas nullable de ventana cuando
      haya una.
    - **Cuáles son las sesiones** y su texto: es contenido y pasa por la hoja de aprobación de cada lote.

## Alternativas consideradas

- **Una fila de `actividad` por sesión.** Es lo más corto de escribir (el modelo ya existe), pero lleva el
  catálogo a unas 1.080 filas en el dispositivo de cada persona, llena el sendero y
  repite en cada fila `puntaje_maximo`, `umbrales` y `textos_nivel`, que son de la mecánica: la misma
  interpretación en mil sitios. **Descartada.**
- **Un cursor por persona y mecánica** (como `dato_curioso_cursor`). Es lo que se hizo con los datos
  curiosos, pero allí el dato se sirve al pedirlo; aquí hay una acción real (hacer la sesión) que ya
  queda en `resultado`. Un cursor sería una segunda verdad que puede desincronizarse del historial, y
  una tabla personal más que exportar y borrar. **Descartada.**
- **«La sesión número N» (`catalogo[(a·N + b) mod tamaño]`).** Sin guardar nada, pero al agregar o retirar
  sesiones repite o salta una: es exactamente lo que descartó el ADR 0025. **Descartada.**
- **Una tabla por motor** (parámetros como columnas). Normaliza y valida con la base, pero exige una
  migración por cada mecánica nueva; es la alternativa que descartó el ADR 0008 por la misma razón.
- **Un solo máximo por sesión** (cada sesión declara el suyo). Permite mezclar longitudes, pero obliga a
  que el servidor sepa cuál sesión se hizo para interpretar el nivel y rompe la comparación de la
  tendencia entre días. **Descartada** mientras el máximo sea de la mecánica.
- **Revisión como etiqueta, sin `CHECK`.** Más flexible, pero depende de que nadie publique sin
  querer. Para este contenido, ya fijado por Samuel, se prefiere la garantía.

## Consecuencias

**Lo que se gana**

- El catálogo, el sendero, las rachas y los resultados **no cambian de forma**: un cambio mínimo en el
  dominio y una columna nueva en `resultado`.
- **Sumar una sesión es una fila** (en un lote, con la hoja de aprobación de las fichas); sumar una
  mecánica que reutiliza un motor es una fila de `actividad` y sus sesiones. Ninguna lleva código de
  pantalla nuevo.
- «Única en 365 días» es **una propiedad de una consulta**, probada contra PostgreSQL de verdad, y no
  de un contador.
- **Lo que no está revisado no puede estar publicado**, y la base lo impone.

**Lo que se pierde o se acepta**

- **La cifra de «365 al año» supone una sesión por módulo y por día.** Con las 9 mecánicas nuevas de un
  módulo y 40 sesiones cada una, hay 360 sesiones. A **una por día** duran el año y cada mecánica sale
  unas 40 veces. A **tres por día** (el máximo de la rotación) un módulo se consume en **unos 120 días**
  y después empieza el ciclo otra vez: la regla 6.3 lo permite, pero ya no es «única en 365 días».
  Si se quiere esa garantía a tres por día, hacen falta unas 1.100 sesiones por módulo. **Es una decisión
  de producto que Diego debe confirmar.**
- **«Hasta 3 mecánicas rotativas por día» cambia el sendero:** hoy `hoy` muestra todo lo que toca por
  frecuencia. Con 9 rotativas por módulo, mostrarlas todas sería una lista de 12; la rotación las reparte.
  Es la decisión D-C7 de las fichas, que Samuel no respondió: **este ADR la propone, no la da por
  aprobada.**
- **El mismo sendero lleva ahora el contenido.** `sesion.parametros` pesa 1 a 3 KB por actividad: con 3
  rotativas por módulo y 3 módulos son entre 10 y 30 KB más en cada lectura del sendero. Se mide en el piloto
  antes de crecer. Sin conexión, el dispositivo tiene **el contenido del día que descargó**; no el de mañana.
  Precargar «las próximas sesiones» es una mejora posterior.
- **Hay un costo de consulta:** para elegir la sesión se cruzan las publicadas con los resultados de la
  persona en esa mecánica durante un año (decenas de filas). Se indexa por `(id_usuario, id_actividad, dia)`
  y se mide en el piloto.
- **Retirar y reponer cambia lo «nuevo».** Una sesión corregida es otra para quien ya hizo la anterior,
  que la vuelve a ver: es el precio de que el historial apunte siempre a lo que de verdad vio.
- **El `CHECK` frena a quien quiera publicar rápido.** Es lo que se busca, y exige que la revisión tenga
  una persona y un tiempo: es el cuello de botella real de las fichas (13 piden revisión profesional y 6
  una ligera).
- **La base no valida el contenido de `parametros`** (ADR 0008): lo hacen el dominio y la prueba del
  contenido sembrado, y la revisión de cada lote.
- **Hay una tabla más, una columna en `actividad` y otra en `resultado`:** una migración **aditiva** que
  aplica una persona. Nada se borra ni se reescribe.

## Pendiente fuera de este ADR

- Implementación en tickets aparte: migración y dominio; API; Fase 0 (las 9 actuales bajo el modelo, sin
  cambiar lo que se ve); motores nuevos en el frontend (M3 a M7); piloto de 10 sesiones en PRE.
- Confirmar con Diego: las cifras de arriba (una o tres sesiones por día), D-C5 (dónde se guarda «Carta a
  mí de mañana») y D-C7 (rotación y franja horaria).
- Quién es la persona de **revisión profesional** y cuánto tiempo puede dar (D-C2): la respuesta de Samuel
  fija el orden (revisión, aprobación, prueba en PRE, ajustes) pero no nombra a la persona.
- El ADR de los bancos de elementos.
