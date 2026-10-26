# ADR 0038: Auditoría parte 1: invisibles, permisos pisados y reintentos

- **Estado:** propuesta (SCRUM-258). **Diego la confirma al fusionar.**
- **Fecha:** 2026-10-25
- **Se relaciona con:** ADR 0010 (la idempotencia es por persona), ADR 0026 (la baja de la cuenta) y
  ADR 0027 (qué dispara las líneas de atención).

## Contexto

Una auditoría del código del backend dejó siete hallazgos. Esta primera tanda cubre tres que pueden
hacer daño a una persona sin dejar rastro:

1. **Un carácter invisible esconde lo que se escribe.** `normalizar` quitaba las tildes y nada más:
   «mo» + U+200B (espacio de ancho cero) + «rir» no se parecía a «morir» para una comparación de
   texto, aunque para quien lo lee es idéntico. La detección de riesgo es lo primero que corre, y
   fallaba justo ahí.
2. **Una petición concurrente puede reactivar un permiso que la persona acababa de apagar.** Subir la
   foto, la mascota, cambiar las preferencias o aceptar los textos leían la cuenta, la cambiaban y la
   guardaban **entera** (`UPDATE` de todas las columnas). Entre leer y guardar hay un archivo que
   subir o una red lenta: si en ese tiempo la persona apagaba «acompañamiento por días» o «el diario
   con recomendaciones», el guardado los dejaba otra vez encendidos con lo que se había leído.
   `save` además podía volver a crear una cuenta borrada entretanto.
3. **Dos reintentos simultáneos de un resultado rompían la idempotencia.** Los dos miraban si la
   operación existía, no la veían, y los dos intentaban guardar. La clave única dejaba pasar a uno y el
   otro recibía un 500, justo cuando la persona reintentaba porque la red se había caído.

## Decisión

1. **`normalizar` quita lo invisible y se lee en las dos formas.** NFKD (que además lleva las letras
   de ancho completo y las matemáticas a las corrientes), se quitan los `Default_Ignorable_Code_Point` y
   **todas** las marcas combinadas (`\p{M}`), no solo el rango de las tildes. Un invisible también puede
   usarse **en lugar de** el espacio («quiero» + U+200B + «morir»): quitado quedaría «quieromorir».
   Por eso `hayRiesgo` mira además el texto con los invisibles convertidos en espacio. **La segunda
   lectura solo suma**, como la de las erratas (ADR 0027).
2. **Una cuenta que ya existe se cambia con `guardarCambios(antes, despues)`, no con `save`.** El
   puerto escribe **solo las columnas que cambiaron** entre las dos versiones, devuelve la cuenta
   **tal como quedó** (con lo que otras peticiones hayan cambiado: es lo que la respuesta tiene que
   contar) y devuelve `null`, sin crearla, si la cuenta ya no existe. `save` queda para el alta.
   Qué campos se pueden cambiar vive en `User` (`CAMPOS_MODIFICABLES`, `camposCambiadosDesde`,
   `conLosCamposDe`), y una prueba falla si la cuenta gana un campo que no está en la lista. Si la
   cuenta desaparece mientras se sube un archivo, el archivo se borra: no queda la foto de quien ya no
   existe.
3. **Guardar un resultado devuelve lo que quedó guardado.** Si la operación de esa persona ya estaba
   (la clave única protesta), el adaptador devuelve la fila ganadora en lugar de un error. Es lo que ya
   hacían el diario y el semáforo; la comprobación del error se comparte (`esOperacionRepetida`).

## Consecuencias

- **Sin migraciones y sin cambios de API.** El frontend no cambia, salvo que el motor local del
  asistente (`src/asistente/reglasLocales.ts`) tiene su propia copia de `normalizar` y de la búsqueda
  de riesgo: **tiene que quedar igual** o el dispositivo sin conexión detectaría menos que el servidor.
  Los casos nuevos están en el contrato de las reglas locales (`docs/contratos/reglas-locales.json`).
- **Los campos que cambian a la vez en dos peticiones los gana la última**, campo por campo. Antes
  ganaba la última petición entera. Es lo que se quiere para dos cosas distintas (una foto y un
  permiso) y lo mismo que antes para la misma.
- **No se resuelve** (y queda anotado): un homoglifo (una «о» cirílica por la «o» latina) sigue sin
  leerse como la letra latina, y elegir como mascota la propia mientras otra petición la quita puede
  dejar la elección sin dibujo. Ninguno de los dos entra en esta tanda.
- Las demás partes de la auditoría (pruebas de integración contra una base remota, exportación y
  historial sin tope de memoria, el nivel del historial frente al acompañamiento, y las transacciones
  de borrado con esperas externas) van en sus propios cambios.
