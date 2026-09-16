# Modelo de datos

Estado: vigente · Ciclo 4 · 15/09/2026

Este documento es la fuente de verdad del esquema. Si el esquema de Prisma y
este documento discrepan, se corrige el esquema.

El modelo procede del entregable de levantamiento de requerimientos, que define
cinco tablas. Aquí se añade una sexta, `ENTRADA_DIARIO`, correspondiente al
RF14, y se explican las decisiones que el entregable no alcanza a justificar.

## Principios

**Claves primarias UUID, nunca enteros consecutivos.** Por dos razones. La
primera es el funcionamiento sin conexión: cuando alguien termina una actividad
sin internet, el resultado se guarda en el dispositivo, y ahí el navegador no
puede generar un número autoincremental porque ese valor lo asigna la base al
insertar. Con UUID el registro nace con su identificador definitivo. La segunda
es de seguridad: los identificadores consecutivos permiten recorrer registros
ajenos probando números seguidos. Ver [ADR 0003](adr/0003-uuid-como-clave-primaria.md).

**Idempotencia garantizada por la base, no solo por el código.** Las dos tablas
que reciben datos creados en el dispositivo —`RESULTADO` y `ENTRADA_DIARIO`—
llevan `id_operacion_cliente` con restricción `UNIQUE`. Aunque el código falle,
la base rechaza el duplicado.

**El historial no es una tabla.** Se deriva de `RESULTADO`. Guardar un
resumen aparte crearía dos verdades que se desincronizan.

**Aislamiento impuesto abajo.** La regla de que nadie ve datos de otro se aplica
con políticas a nivel de fila, no solo en el caso de uso. La seguridad no puede
depender de que quien escriba la próxima consulta se acuerde de filtrar.

## Entidades y relaciones

```
CATEGORIA ──< ACTIVIDAD ──< RESULTADO >── USUARIO
    │                                        │
    └──< RECURSO_APOYO                        └──< ENTRADA_DIARIO
```

| Relación                      | Cardinalidad                    |
| ----------------------------- | ------------------------------- |
| Categoría → actividades       | una a muchas                    |
| Categoría → recursos de apoyo | una a muchas                    |
| Usuario → resultados          | una a muchas                    |
| Actividad → resultados        | una a muchas, uno por ejecución |
| Usuario → entradas de diario  | una a muchas                    |

**`ENTRADA_DIARIO` no se relaciona con categoría ni con actividad, y es
deliberado.** El diario no es una evaluación: no pertenece a ningún módulo, no
produce puntaje y no alimenta el historial de resultados. Es un espacio aparte.

**El rol de administrador es un campo de `USUARIO`,** no una tabla. El
entregable lo define así y no hay razón para complicarlo con dos personas en el
equipo.

**IndexedDB no aparece aquí.** Es almacenamiento local del dispositivo para
caché y pendientes de sincronización, no parte del modelo del servidor.

## Trazabilidad

| Tabla            | Requerimientos que sostiene |
| ---------------- | --------------------------- |
| `USUARIO`        | RF1, RF2, RF3, RF12         |
| `CATEGORIA`      | RF4, RF11                   |
| `ACTIVIDAD`      | RF4, RF5, RF11              |
| `RESULTADO`      | RF6, RF7, RF9, RF10         |
| `RECURSO_APOYO`  | RF8, RF11                   |
| `ENTRADA_DIARIO` | RF14, RF9, RF10             |

## USUARIO

Identidad de la persona y su consentimiento. No guarda contraseñas: la
autenticación la resuelve el proveedor externo y aquí solo queda su
identificador. Ver [ADR 0004](adr/0004-autenticacion-sin-contrasenas.md).

| Campo                       | Tipo         | Nulo | Descripción                                                           |
| --------------------------- | ------------ | ---- | --------------------------------------------------------------------- |
| `id_usuario`                | UUID         | no   | Clave primaria.                                                       |
| `nombre`                    | VARCHAR(100) | sí   | Nombre con el que la persona quiere que la llamen.                    |
| `correo`                    | VARCHAR(120) | no   | Único. Es la vía de acceso al sistema.                                |
| `id_proveedor_auth`         | VARCHAR(255) | no   | Identificador que entrega el proveedor al verificar el correo. Único. |
| `rol`                       | VARCHAR(20)  | no   | `usuario` o `administrador`.                                          |
| `version_politica_aceptada` | VARCHAR(20)  | no   | Versión de la política de tratamiento de datos que aceptó.            |
| `fecha_aceptacion_politica` | TIMESTAMP    | no   | Cuándo la aceptó.                                                     |
| `fecha_registro`            | TIMESTAMP    | no   | Cuándo se creó la cuenta.                                             |

**El consentimiento es obligatorio, no opcional.** VSD Health trata datos
relacionados con salud, que la Ley 1581 de 2012 clasifica como sensibles. Una
cuenta sin consentimiento registrado no puede realizar actividades ni guardar
resultados. Guardar la versión y la fecha permite saber exactamente qué aceptó
cada persona y cuándo, que es lo que exige poder demostrar.

**Edad mínima 18 años**, declarada al registrarse. Decisión del equipo del
15/09/2026: el tratamiento de datos sensibles de menores exige garantías
adicionales que quedan fuera del alcance de esta versión.

**Política de acceso:** cada persona lee y modifica únicamente su propia fila.
El administrador **no** puede leer filas de `USUARIO` ajenas.

## CATEGORIA

Las tres áreas del sistema: cognición, bienestar y emociones.

| Campo          | Tipo        | Nulo | Descripción                       |
| -------------- | ----------- | ---- | --------------------------------- |
| `id_categoria` | UUID        | no   | Clave primaria.                   |
| `nombre`       | VARCHAR(50) | no   | Cognición, Bienestar o Emociones. |
| `descripcion`  | TEXT        | sí   | Descripción corta del área.       |

**Política de acceso:** catálogo. Cualquier sesión autenticada lee; solo el
administrador escribe.

## ACTIVIDAD

Lo que la persona hace: un juego, unas preguntas orientativas o un registro.
Además de describirse a sí misma, **declara cómo se interpreta su puntaje**.

| Campo              | Tipo         | Nulo | Descripción                                                  |
| ------------------ | ------------ | ---- | ------------------------------------------------------------ |
| `id_actividad`     | UUID         | no   | Clave primaria.                                              |
| `id_categoria`     | UUID         | no   | Categoría a la que pertenece.                                |
| `nombre`           | VARCHAR(100) | no   | Nombre visible.                                              |
| `tipo`             | VARCHAR(30)  | no   | `juego`, `preguntas` o `registro`.                           |
| `descripcion`      | TEXT         | sí   | Explicación de la actividad.                                 |
| `estado`           | BOOLEAN      | no   | Si está disponible.                                          |
| `direccion_escala` | VARCHAR(30)  | no   | `mayor_es_mejor`, `mayor_requiere_atencion` o `sin_puntaje`. |
| `puntaje_maximo`   | DECIMAL(5,2) | sí   | Máximo posible. Vacío cuando no hay puntaje.                 |
| `umbrales`         | JSONB        | sí   | Cortes de nivel propios de esta actividad.                   |
| `textos_nivel`     | JSONB        | sí   | Textos que ve la persona para cada nivel.                    |

### Por qué la actividad declara la dirección de su escala

Es la corrección de un error silencioso: no rompe ninguna prueba, no falla la
compilación, y solo se nota cuando alguien lee un resultado que dice lo
contrario de lo que siente.

En un juego de memoria, un puntaje alto significa que le fue bien. En un
cuestionario sobre la carga de la semana, significa lo contrario. Derivar el
nivel de la misma forma para todas las actividades le mostraría un resultado
favorable justamente a quien peor está.

Los umbrales tampoco son comunes. Partir en tercios es arbitrario: no hay razón
para que una bitácora de sueño y un juego de atención quiebren en el mismo
punto.

### Por qué cada actividad trae sus propios textos

La base guarda tres niveles estables —`favorable`, `en_seguimiento`,
`requiere_atencion`— que son los que permiten consultar y comparar. Lo que ve la
persona lo define cada actividad:

| Actividad             | favorable        | en_seguimiento     | requiere_atencion |
| --------------------- | ---------------- | ------------------ | ----------------- |
| Secuencias            | Muy afinado      | Con altibajos      | Cuesta sostenerlo |
| Tu semana en una hoja | Semana tranquila | Semana con tensión | Semana pesada     |
| Bitácora de sueño     | Descanso estable | Sueño irregular    | Poco descanso     |

Datos limpios por dentro, lenguaje humano por fuera. Y a nadie se le dice que
su memoria «requiere atención», que suena a dictamen.

**Política de acceso:** catálogo. Cualquier sesión autenticada lee; solo el
administrador escribe.

## RESULTADO

Una ejecución de una actividad. Se crea una vez y no se edita nunca.

| Campo                  | Tipo         | Nulo   | Descripción                                                                   |
| ---------------------- | ------------ | ------ | ----------------------------------------------------------------------------- |
| `id_resultado`         | UUID         | no     | Clave primaria.                                                               |
| `id_usuario`           | UUID         | no     | Quién la realizó.                                                             |
| `id_actividad`         | UUID         | no     | Qué actividad.                                                                |
| `puntaje`              | DECIMAL(5,2) | **sí** | Normalizado de 0 a 100. Vacío en actividades de registro.                     |
| `nivel_orientativo`    | VARCHAR(50)  | sí     | `favorable`, `en_seguimiento` o `requiere_atencion`. Vacío si no hay puntaje. |
| `metadata`             | JSONB        | sí     | Información propia del tipo de actividad.                                     |
| `id_operacion_cliente` | UUID         | no     | **UNIQUE.** Generado en el dispositivo.                                       |
| `fecha`                | TIMESTAMP    | no     | Cuándo se realizó.                                                            |

### Por qué el puntaje admite nulo

El entregable ya lo dice —«cuando aplique»— pero conviene dejar claro el caso:
una bitácora de sueño o un registro de ánimo no producen puntaje, producen
datos. El resultado sigue siendo válido y sigue teniendo fecha, usuario,
actividad e identificador de operación.

### Por qué se normaliza a 0 a 100

Sin normalizar no se puede cumplir el RF7. No hay forma de dibujar el progreso
de alguien si una actividad va de 0 a 20 y otra de 0 a 40. El valor sin
normalizar no se pierde: queda en `metadata`.

### El puntaje no se le muestra a la persona. Nunca

Vive aquí para calcular tendencias. Lo que ve es el nivel, redactado con el
lenguaje de su actividad.

Mostrar «38 sobre 100» en algo relacionado con el ánimo no es informar. Es
arriesgarse a que alguien lo lea como una calificación sobre sí mismo, y esta
aplicación existe para acompañar, no para calificar. Ninguna respuesta de la API
expone este campo.

### Por qué `id_operacion_cliente` es UNIQUE

Es lo que sostiene la sincronización. El dispositivo genera ese identificador al
terminar la actividad, incluso sin conexión. Si la respuesta del servidor se
pierde y el dispositivo reintenta, la restricción impide que el resultado quede
duplicado. La regla vive también en el caso de uso, pero aquí abajo es donde se
garantiza aunque el código falle.

Un identificador de operación que pertenece a otra persona se responde **404**,
no 403: un 403 confirmaría que existe.

**Política de acceso:** cada persona lee y escribe únicamente sus propios
resultados. El administrador **no** tiene acceso a ninguno.

## RECURSO_APOYO

Información de orientación y contactos de ayuda. Es también la base de
conocimiento del asistente.

| Campo          | Tipo         | Nulo | Descripción                                                 |
| -------------- | ------------ | ---- | ----------------------------------------------------------- |
| `id_recurso`   | UUID         | no   | Clave primaria.                                             |
| `id_categoria` | UUID         | sí   | Categoría con la que se relaciona. Vacío si es transversal. |
| `titulo`       | VARCHAR(120) | no   | Nombre del recurso.                                         |
| `descripcion`  | TEXT         | sí   | Información breve.                                          |
| `tipo`         | VARCHAR(30)  | no   | `guia`, `enlace` o `contacto`.                              |
| `enlace`       | VARCHAR(255) | sí   | Dirección web cuando la necesita.                           |

Los recursos de tipo `contacto` incluyen las líneas de atención en salud mental
de Colombia. Se cargan con `id_categoria` vacío porque aplican siempre, y son lo
que el asistente devuelve ante cualquier expresión que sugiera riesgo.

**Política de acceso:** catálogo. Cualquier sesión autenticada lee; solo el
administrador escribe.

## ENTRADA_DIARIO

Lo que la persona escribe por su cuenta. Corresponde al RF14.

| Campo                  | Tipo         | Nulo | Descripción                                |
| ---------------------- | ------------ | ---- | ------------------------------------------ |
| `id_entrada`           | UUID         | no   | Clave primaria.                            |
| `id_usuario`           | UUID         | no   | A quién pertenece.                         |
| `titulo`               | VARCHAR(120) | sí   | Título opcional.                           |
| `contenido`            | TEXT         | no   | Lo que escribió.                           |
| `formato`              | VARCHAR(20)  | no   | `texto_plano` o `enriquecido`.             |
| `etiquetas`            | JSONB        | sí   | Etiquetas de ánimo. Solo con conexión.     |
| `adjuntos`             | JSONB        | sí   | Referencias a imágenes. Solo con conexión. |
| `id_operacion_cliente` | UUID         | no   | **UNIQUE.** Generado en el dispositivo.    |
| `version`              | INTEGER      | no   | Aumenta con cada edición.                  |
| `fecha_creacion`       | TIMESTAMP    | no   | Cuándo se creó.                            |
| `fecha_edicion`        | TIMESTAMP    | no   | Última edición.                            |

### El contenido del diario no se evalúa

Ninguna entrada produce puntaje ni nivel orientativo, y ninguna alimenta
estadística alguna. Es un diario, no un instrumento. El valor de desahogarse no
está en que alguien lo califique.

Por eso tampoco se relaciona con `ACTIVIDAD` ni con `CATEGORIA`.

### Por qué sin conexión solo hay texto plano

Sin red, el diario es deliberadamente sencillo: texto, para poder escribir en
cualquier momento. Es justo cuando más falta hace.

Con conexión se habilitan el formato, las etiquetas y las imágenes. No es una
limitación disfrazada: es lo que hace viable la sincronización. El texto plano
viaja y se reconcilia fácil; un adjunto necesita subirse, y subir algo ya
requiere conexión por definición.

### Por qué lleva número de versión, y la regla que lo acompaña

Un resultado se crea una vez y no se toca, por eso le basta el identificador de
operación. Una entrada de diario **se edita**. Escribirla en el celular sin
conexión y editarla en el computador antes de sincronizar produce dos versiones
de lo mismo, y el identificador de operación no distingue cuál es más reciente.

**La sincronización nunca sobrescribe.** Si al llegar la entrada local el
servidor tiene una versión más reciente, la local se guarda como una **entrada
aparte marcada como copia** y se le avisa a la persona.

Perder un párrafo que alguien escribió en un mal momento no es un error de
datos. Preferimos dos copias antes que un texto perdido. Ver
[ADR 0009](adr/0009-versionado-de-entradas-de-diario.md).

### Privacidad

Es el contenido más sensible de toda la aplicación, por encima de cualquier
puntaje. Cifrado en reposo. Ningún administrador puede leerlo. El RF12 debe
descargarlo y eliminarlo junto con el resto de la cuenta.

**Política de acceso:** cada persona lee y escribe únicamente sus propias
entradas. El administrador **no** tiene acceso a ninguna.

## Resumen de políticas de acceso

| Tabla            | Persona dueña           | Otra persona | Administrador |
| ---------------- | ----------------------- | ------------ | ------------- |
| `USUARIO`        | lee y escribe su fila   | nada         | nada          |
| `CATEGORIA`      | lee                     | lee          | lee y escribe |
| `ACTIVIDAD`      | lee                     | lee          | lee y escribe |
| `RESULTADO`      | lee y escribe los suyos | nada         | **nada**      |
| `RECURSO_APOYO`  | lee                     | lee          | lee y escribe |
| `ENTRADA_DIARIO` | lee y escribe las suyas | nada         | **nada**      |

El administrador gestiona contenidos, no personas. Es lo que declara el
entregable y lo que imponen las políticas.

## Documentos relacionados

- [Arquitectura](arquitectura.md) — dónde encaja la persistencia como adaptador
- [Seguridad](seguridad.md) — aislamiento entre usuarios y manejo de secretos
- [Dominio](dominio.md) — las reglas que estas tablas sostienen
- [ADR 0003](adr/0003-uuid-como-clave-primaria.md) — UUID como clave primaria
- [ADR 0008](adr/0008-campos-jsonb-para-datos-variables.md) — por qué JSONB
- [ADR 0009](adr/0009-versionado-de-entradas-de-diario.md) — versionado del diario
