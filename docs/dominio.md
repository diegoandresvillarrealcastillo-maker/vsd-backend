# El dominio

Este documento describe lo que hay hoy dentro de `src/domain/`: que reglas
existen y por que. Se actualiza en el mismo Pull Request que cambia el codigo.

## Que hay construido

El primer recorrido vertical del sistema es **registrar el resultado de una
actividad**, que corresponde a RF5 y RF6, a la historia HU_MF03_001 y al caso
de uso CU-003.

Se eligio ese recorrido y no otro porque contiene la regla de mayor riesgo del
proyecto: que un reintento de sincronizacion no duplique un resultado en el
historial.

## Identificadores

Los cuatro identificadores (`ResultId`, `UserId`, `ActivityId` y
`ClientOperationId`) son UUID y se validan al construirse. Un texto mal formado
falla ahi mismo, no mas adelante con datos ya escritos a medias.

Cada uno es una clase distinta aunque por dentro los cuatro sean texto. Asi
pasar un `ActivityId` donde se espera un `UserId` no compila. Confundirlos
seria un error caro y silencioso.

Por que UUID y no un entero autoincremental: el dispositivo puede crear
registros sin conexion, antes de hablar con el servidor, y un identificador no
consecutivo no se puede enumerar para tantear datos ajenos. Ver
[ADR 0003](adr/0003-uuid-como-clave-primaria.md).

### `ClientOperationId`

Es la pieza que sostiene la sincronizacion. El dispositivo lo genera una sola
vez por intento y lo reenvia en cada reintento. El servidor lo usa para
reconocer que una peticion repetida es la misma operacion y no una nueva.

En base de datos llevara una restriccion UNIQUE. Esa restriccion, y no el
codigo, es la garantia ultima de que no haya duplicados cuando haya
concurrencia real.

## `OrientativeScore`

Guarda el puntaje obtenido y deriva de el un **nivel orientativo** por bandas:
hasta un tercio del maximo requiere atencion, hasta dos tercios queda en
seguimiento, y por encima es favorable.

El nivel no se puede fijar a mano, se deriva siempre. Asi dos resultados con el
mismo puntaje significan lo mismo, sin depender de quien construya el objeto.

**Las etiquetas son deliberadamente descriptivas y no clinicas.** VSD Health no
diagnostica: un resultado describe como le fue a la persona en la actividad y,
cuando corresponde, sugiere buscar acompanamiento. Nunca nombra un trastorno.

Esa restriccion vive en el dominio y no en la capa de presentacion, y hay una
prueba que falla si alguien introduce terminologia diagnostica en los niveles.

Las bandas son una escala de producto, no un instrumento clinico validado. Los
instrumentos con licencia restringida quedan fuera del alcance del proyecto.

## `ActivityResult`

Es la entidad central. Hace cumplir tres reglas:

1. El identificador de operacion del cliente es obligatorio.
2. La fecha de realizacion no puede estar en el futuro. Importa en modo sin
   conexion: el reloj del dispositivo puede estar desajustado, y aceptar una
   fecha futura desordenaria el historial.
3. El puntaje debe caer dentro del rango de la actividad, regla que delega en
   `OrientativeScore`.

Se trata como **un hecho ocurrido, no como un registro editable**. No expone
metodos para cambiar el puntaje ni la fecha. Si algo se registro mal, se
registra una actividad nueva. Un historial que se puede reescribir no sirve
para observar como ha cambiado alguien con el tiempo.

El instante actual se recibe como parametro en lugar de leer el reloj del
sistema, para que la regla de la fecha futura se pueda probar sin depender de
la hora a la que se ejecuten las pruebas.

## La regla de idempotencia

Vive en `application/usecases/RegisterActivityResultUseCaseImpl` y es la mas
importante del ciclo. Al registrar un resultado:

1. Si no existe ninguno con ese identificador de operacion, se crea y se guarda.
2. Si ya existe uno **del mismo usuario**, se devuelve el existente sin crear
   otro. Reintentar es seguro.
3. Si ya existe uno **de otro usuario**, se rechaza.

### Por que la tercera regla es de seguridad y no de integridad

Las dos primeras evitan duplicados. La tercera evita algo distinto: que alguien
que conozca un identificador de operacion ajeno pueda usarlo para escribir
sobre datos de otra persona, o para deducir que ese registro existe.

Por eso el mensaje de error es neutro —"la operacion solicitada no esta
disponible"— y no confirma que la operacion exista. Hay una prueba que lo
verifica.

Es un ejemplo concreto del principio de [seguridad.md](seguridad.md): la
autorizacion vive en la capa de aplicacion, y se comprueba antes de devolver
nada.

## Errores

Todos heredan de `DomainError` y llevan un codigo estable. El dominio no
conoce HTTP ni codigos de estado: lanza errores propios, y sera la
infraestructura del Ciclo 3 la que decida como traducirlos a una respuesta.

| Error                                | Codigo                      | Cuando ocurre                          |
| ------------------------------------ | --------------------------- | -------------------------------------- |
| `InvalidIdentifierError`             | `IDENTIFICADOR_INVALIDO`    | El texto no tiene forma de UUID        |
| `ScoreOutOfRangeError`               | `PUNTAJE_FUERA_DE_RANGO`    | El puntaje esta fuera del rango        |
| `InvalidScoreRangeError`             | `RANGO_DE_PUNTAJE_INVALIDO` | El maximo de la actividad no es usable |
| `FutureCompletionDateError`          | `FECHA_EN_EL_FUTURO`        | La fecha de realizacion es futura      |
| `OperationBelongsToAnotherUserError` | `OPERACION_DE_OTRO_USUARIO` | La operacion pertenece a otra persona  |

## Lo que todavia no existe

No hay entidades `Usuario`, `Categoria`, `Actividad` ni `RecursoApoyo`. Se
incorporan cuando se necesiten, no antes. Tampoco hay persistencia real: el
unico adaptador es en memoria, y el de Prisma llega en el Ciclo 4.
