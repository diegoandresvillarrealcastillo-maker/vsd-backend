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

## `Activity`

Ademas de describirse a si misma, **declara como se interpreta su puntaje**:
hacia donde va su escala, cual es su maximo, donde estan sus cortes de nivel y
que textos ve la persona.

Esa responsabilidad vive aqui y no en el resultado porque la escala es una
propiedad de la actividad: no cambia de una ejecucion a otra.

### La inversion de escala

Es el defecto que corrige esta entidad, y es silencioso: no rompe ninguna
prueba, no falla la compilacion, y solo se nota cuando alguien lee un resultado
que dice lo contrario de lo que siente.

En un juego de memoria un puntaje alto significa que le fue bien. En un
cuestionario sobre la carga de la semana significa lo contrario. Derivar el
nivel igual para las dos le mostraria un resultado favorable justamente a quien
peor esta.

Por eso cada actividad declara `direccionEscala`: `mayor_es_mejor`,
`mayor_requiere_atencion` o `sin_puntaje`.

Los umbrales tampoco son comunes. Partir en tercios es arbitrario: no hay razon
para que una bitacora de sueno y un juego de atencion quiebren en el mismo
punto.

### Los textos los pone cada actividad

La base guarda tres niveles estables, que son los que se consultan y se
comparan. El texto lo define la actividad: la misma `requiere_atencion` se lee
como "Cuesta sostenerlo" en un juego de memoria y como "Semana pesada" en un
cuestionario de carga.

Datos limpios por dentro, lenguaje humano por fuera. Y a nadie se le dice que
su memoria "requiere atencion", que suena a dictamen.

Si una actividad no trae sus textos se devuelve el nivel tal cual, que es feo
pero honesto. Inventar una frase es como acaban saliendo las que suenan a
diagnostico.

## `OrientativeScore`

Guarda el puntaje **ya normalizado** a una escala de 0 a 100 y el nivel que la
actividad derivo de el.

Normalizar es lo que permite cumplir el RF7: no se puede dibujar el progreso de
alguien si una actividad va de 0 a 10 y otra de 0 a 20. El valor sin normalizar
no se pierde, queda en `metadata`.

El nivel no se puede fijar a mano y ya no se deriva aqui: lo calcula la
actividad. Asi dos resultados de la misma actividad con el mismo puntaje
significan siempre lo mismo, y dos actividades distintas pueden interpretar el
mismo numero de forma opuesta, que es justo lo que hace falta.

**Las etiquetas son deliberadamente descriptivas y no clinicas.** VSD Health no
diagnostica: un resultado describe como le fue a la persona en la actividad y,
cuando corresponde, sugiere buscar acompanamiento. Nunca nombra un trastorno.

Esa restriccion vive en el dominio y no en la capa de presentacion, y hay una
prueba que falla si alguien introduce terminologia diagnostica en los niveles.

Las bandas son una escala de producto, no un instrumento clinico validado. Los
instrumentos con licencia restringida quedan fuera del alcance del proyecto.

## `User`

La cuenta de una persona. No guarda contrasenas: la autenticacion la resuelve
el proveedor externo y aqui solo queda su identificador. Ver
[ADR 0004](adr/0004-autenticacion-sin-contrasenas.md).

### El consentimiento es parte del modelo, no un tramite

Se guarda **que version** de la politica acepto y **cuando**. No basta con un
si o un no: las politicas cambian, y ante una reclamacion hay que poder
demostrar exactamente a que dio permiso cada quien y en que momento. Es lo que
exige la Ley 1581 de 2012 para datos sensibles, categoria en la que entra la
informacion relacionada con salud que maneja la aplicacion.

Una cuenta sin consentimiento **no puede** tratar datos de salud. La regla vive
en `exigirConsentimiento()`, que falla en vez de devolver un booleano que
alguien pueda olvidarse de mirar. Aqui el olvido no seria un error de
programacion, seria un incumplimiento legal.

**Edad minima 18 anos**, declarada al registrarse. El tratamiento de datos
sensibles de menores exige garantias adicionales que quedan fuera del alcance
de esta version.

### El administrador gestiona contenidos, no personas

`puedeLeerDatosDe()` solo devuelve verdadero para el propio dueno. **El rol de
administrador no da acceso a nada ajeno**, y es deliberado: el entregable dice
que el administrador gestiona categorias, actividades y recursos, y que no
tiene acceso a los resultados, al historial ni a la informacion personal de
ningun usuario.

Ser administrador no es tener una llave maestra. Hay una prueba que lo
comprueba.

### Lo que falta por conectar

La regla del consentimiento esta modelada y probada en el dominio, pero
todavia no se aplica en el flujo HTTP: para exigirla hace falta saber quien
hace la peticion, y eso es autenticacion. Se conecta en el Ciclo 5.

## `ActivityResult`

Es la entidad central. Hace cumplir tres reglas:

1. El identificador de operacion del cliente es obligatorio.
2. La fecha de realizacion no puede estar en el futuro. Importa en modo sin
   conexion: el reloj del dispositivo puede estar desajustado, y aceptar una
   fecha futura desordenaria el historial.
3. El puntaje, **si lo hay**, debe caer dentro del rango de la actividad, regla
   que delega en `OrientativeScore`.
4. `metadata` no puede traer claves que ya sean campos propios.

### El puntaje es opcional

No todas las actividades califican. Una bitacora de sueno o una anotacion de
animo producen **datos**, no una nota: el diccionario del entregable lo dice
desde el principio, «cuando aplique». Un resultado sin puntaje es valido y
conserva usuario, actividad, fecha e identificador de operacion.

Un resultado sin puntaje tampoco sugiere acompanamiento por si solo. Un
registro cobra sentido en la tendencia, no en una anotacion suelta, y hacer que
una sola noche mala dispare una sugerencia seria leer de mas.

### `metadata`

Guarda lo propio de cada tipo de actividad: las horas de una bitacora de sueno,
las respuestas de un registro emocional. Es lo que permite anadir actividades
sin crear una tabla por cada una, y por tanto lo que cumple el requerimiento de
escalabilidad.

La regla que decide que va ahi y que va en un campo propio esta en el
[ADR 0008](adr/0008-campos-jsonb-para-datos-variables.md): si el sistema
necesita consultarlo, filtrarlo u ordenarlo, es un campo propio. Una clave
repetida se rechaza, porque dos verdades sobre el mismo dato acaban
divergiendo.

### El puntaje no sale por la API

Ninguna respuesta expone el numero ni el maximo. Vive en la base para calcular
tendencias; lo que ve la persona es el nivel. Un «8 sobre 10» en algo
relacionado con el animo no informa: se lee como una calificacion sobre uno
mismo, y esta aplicacion existe para acompanar y no para calificar.

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

| Error                               | Codigo                                | Cuando ocurre                                |
| ----------------------------------- | ------------------------------------- | -------------------------------------------- |
| `InvalidIdentifierError`            | `IDENTIFICADOR_INVALIDO`              | El texto no tiene forma de UUID              |
| `ScoreOutOfRangeError`              | `PUNTAJE_FUERA_DE_RANGO`              | El puntaje esta fuera del rango              |
| `InvalidScoreRangeError`            | `RANGO_DE_PUNTAJE_INVALIDO`           | El maximo de la actividad no es usable       |
| `FutureCompletionDateError`         | `FECHA_EN_EL_FUTURO`                  | La fecha de realizacion es futura            |
| `ReservedMetadataKeyError`          | `CLAVE_DE_METADATA_RESERVADA`         | metadata repite un campo propio              |
| `ActivityNotFoundError`             | `ACTIVIDAD_NO_ENCONTRADA`             | La actividad no esta en el catalogo          |
| `ScoreNotApplicableError`           | `LA_ACTIVIDAD_NO_PUNTUA`              | Llego un puntaje a una actividad de registro |
| `InvalidActivityConfigurationError` | `CONFIGURACION_DE_ACTIVIDAD_INVALIDA` | La actividad esta mal configurada            |

La clave de operacion es unica **por persona** desde el ADR 0010, asi que usar
la de otra ya no produce un error distinto: se registra un resultado propio,
como cualquier otra peticion. Aqui vivia `OperationBelongsToAnotherUserError`,
que se retiro por eso mismo.

## Lo que todavia no existe

No hay entidades `Categoria` ni `RecursoApoyo`. Se
incorporan cuando se necesiten, no antes. Tampoco hay persistencia real: el
unico adaptador es en memoria, y el de Prisma llega en el Ciclo 4.
