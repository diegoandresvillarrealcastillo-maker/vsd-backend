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

La cuenta de una persona. **No guarda contrasenas**, aunque el sistema si las
use: quien las almacena y las verifica es Supabase, y aqui solo queda su
identificador. Ver
[ADR 0012](adr/0012-contrasena-y-google-en-lugar-del-enlace-magico.md).

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

#### Una sola version del aviso

La version vigente vive en un unico sitio: `AvisoDePrivacidad.ts`. El frontend
y la coleccion de Postman la piden a `GET /api/aviso` en lugar de llevar su
propia copia. Antes habia tres valores para lo mismo, y segun por donde entrara
alguien quedaba registrado que habia aceptado cosas distintas (SCRUM-85).

Al darse de alta solo se acepta la version vigente: cualquier otra responde
409 `VERSION_DEL_AVISO_NO_VIGENTE` y no crea nada. Quien ya tenia cuenta
conserva la version con la que se creo, aunque hoy haya otra: es la prueba de
lo que acepto aquel dia.

#### La edad minima es de 18 anos, y la comprueba el servidor

El tratamiento de datos sensibles de menores exige garantias adicionales que
quedan fuera del alcance de esta version. Hasta la auditoria 360, `EDAD_MINIMA`
existia pero nada la usaba: el registro ni siquiera pedia una fecha. Ahora:

- **Se declara la fecha de nacimiento** (`FechaDeNacimiento`): una fecha real,
  que ya paso y de no mas de 120 anos. Se guarda el dia completo, no un "es
  mayor de edad", porque es la prueba de lo que declaro, sale en su exportacion
  y se borra con la cuenta.
- **La edad se cuenta en el servidor**, con el dia local de la persona
  (`Calendario`) y no con el de UTC: quien cumple 18 hoy en Bogota a las 8 p. m.
  ya es mayor aunque en UTC sea manana. Los nacidos un 29 de febrero cumplen el
  1 de marzo en los anos que no son bisiestos, que no adelanta la mayoria de
  edad ni un dia.
- **Un menor no queda registrado.** `POST /api/cuenta` responde 403
  `MENOR_DE_EDAD`, no crea la cuenta, y borra su identidad en Supabase Auth
  (la via que ya usa el borrado de cuenta). El rechazo se anota sin su fecha,
  su correo ni su identificador. Si el proveedor no deja borrar la identidad,
  igual se rechaza y se anota que hay que limpiarla a mano.
- **La base es la ultima defensa**: un `CHECK` impide guardar la fecha de un
  menor, con un dia de margen por la diferencia entre la fecha UTC de la base y
  la de la persona.

#### El consentimiento lo da la persona, con una casilla

Antes bastaba con enviar la version: el panel la mandaba solo, en cada carga, y
quien entraba con Google quedaba con consentimiento registrado sin haber
marcado nada. Ahora el alta exige `aceptaAviso: true` y `aceptaTerminos: true`
ademas de las versiones vigentes; sin ellas responde 400
`CONSENTIMIENTO_NO_REGISTRADO` y no crea nada.

Los **terminos** se aceptan aparte del aviso, con su propia version y su propia
fecha: son dos documentos y cada uno cambia por su lado.

#### El historial de lo aceptado

`usuario` guarda lo vigente; la tabla `consentimiento` guarda **todo** lo que se
acepto alguna vez, una fila por cada vez. Solo admite altas: la aplicacion no
tiene permiso de `UPDATE` ni de `DELETE`, porque un historial que ella misma
pudiera reescribir no probaria nada. Se borra con la cuenta, por la clave
foranea. Sale en la exportacion.

#### Las cuentas anteriores

Las creadas antes de que se pidiera la fecha y las casillas tienen
`registroCompleto: false`. `GuardiaDeCuenta` les responde 403
`REGISTRO_INCOMPLETO` en todo menos en lo que lleva `@PermiteRegistroIncompleto()`:
consultar la cuenta, **exportarla y borrarla**, que son derechos que no se
condicionan. Mandar el registro a `POST /api/cuenta` lo completa, con las mismas
comprobaciones que un alta. Lo que habian aceptado antes queda en el historial.

Ver [ADR 0021](adr/0021-la-edad-y-el-consentimiento-se-comprueban-en-el-servidor.md).

### El administrador gestiona contenidos, no personas

`puedeLeerDatosDe()` solo devuelve verdadero para el propio dueno. **El rol de
administrador no da acceso a nada ajeno**, y es deliberado: el entregable dice
que el administrador gestiona categorias, actividades y recursos, y que no
tiene acceso a los resultados, al historial ni a la informacion personal de
ningun usuario.

Ser administrador no es tener una llave maestra. Hay una prueba que lo
comprueba.

### Las preferencias: modulos activos y mascota

Cada persona empieza solo con los modulos que elige (`Preferencias.ts`):

- Los modulos se nombran con una **clave estable** —`cognicion`, `bienestar`,
  `emociones`—, no con el nombre visible ni con el identificador de la
  categoria. El nombre ya cambio una vez y el identificador puede variar entre
  bases.
- **Una lista vacia significa "todavia no eligio"**, y es lo que lleva a la
  bienvenida. Elegir cero, en cambio, se rechaza (`SIN_MODULOS_ACTIVOS`): el
  dashboard quedaria vacio. Las cuentas que ya existian tambien empiezan
  vacias, para preguntarles en lugar de suponer.
- La **mascota** es un personaje (`fungito`, `sparky`, `ori`, `gato` u
  `obsidian`, SCRUM-99) con un nombre de 1 a 30 caracteres. La forma se valida
  por formato y no contra esa lista: un personaje nuevo no deberia exigir
  desplegar el backend. Color (`#RRGGBB`) y accesorio son opcionales y vienen
  del modelo anterior; los personajes no los usan.
- **Trama se retiro** (SCRUM-121). A quien la tenia elegida la migracion
  `20261010120000_retirar_a_trama` le dejo a Fungito, y si todavia le decia
  «Trama» le cambio tambien el nombre; un nombre que la persona eligio se
  respeta. La API sigue aceptando una forma que no conozca, y el frontend la
  dibuja como Fungito conservando el nombre.

`User.conPreferencias` devuelve una cuenta nueva y solo toca esas dos cosas.
El correo y el rol no se pueden cambiar por `PATCH /api/cuenta/preferencias`:
el cuerpo no tiene donde ponerlos, y mandarlos responde 400.

### La foto de perfil

La foto (SCRUM-120, ADR 0016) es una imagen `.jpg` o `.png` de menos de 50 KB que
la persona elige en su perfil. El navegador la recorta y la comprime, y **la API
la valida otra vez** sin fiarse de eso (`FotoDePerfil`): el tipo, el peso, que el
contenido empiece como lo que dice ser y que ningun lado pase de 1024 px. Cada
motivo de rechazo tiene su codigo (`FOTO_TIPO_NO_PERMITIDO`,
`FOTO_DEMASIADO_PESADA`, `FOTO_DEMASIADO_GRANDE`, `FOTO_NO_ES_UNA_IMAGEN`) para
que la pantalla diga que esta mal.

- **El archivo vive en Storage; la cuenta guarda una marca**: `User.fotoActualizadaEl`,
  si hay foto y desde cuando. Cambia con cada foto nueva.
- Los tres casos de uso (`FotoDePerfilUseCaseImpl`: guardar, leer y quitar) reciben
  **solo la persona**, que sale del token. No hay forma de pedir, cambiar ni
  quitar la de otra.
- **`conPreferencias` y `conZonaHoraria` conservan la marca.** Reconstruyen la
  cuenta campo por campo, y si no la arrastraran, guardar el nombre borraria la
  foto sin que nadie lo pidiera.
- Marca sin archivo es lo mismo que no tener foto; archivo sin marca queda sin
  ver y se limpia con la siguiente foto o al quitarla. Si el almacenamiento no
  responde, se dice con `ALMACENAMIENTO_NO_DISPONIBLE` (503) y no se confunde con
  «no hay foto».

### La mascota propia

La persona puede subir **un SVG** como su mascota (SCRUM-122, ADR 0017). Un SVG
es un documento que puede llevar scripts y enlaces, asi que **no se guarda lo que
llega: se reconstruye** (`SvgDeMascota`). Un lector estricto lo lee, una lista
blanca de 16 elementos y de sus atributos decide que se queda, cada valor se
valida contra su tipo, y lo que se guarda es un SVG nuevo escrito por el
servidor. Lo peligroso (`peligroso`) o que no se admite (`no-admitido`: textos,
imagenes, filtros, estilos) se rechaza **entero**, con un codigo por motivo; lo
inofensivo (metadatos de editor, clases, titulos) se descarta.

- Igual que la foto: el archivo vive en Storage (su propio bucket,
  `mascotas-propias`) y la cuenta guarda una marca, `User.mascotaPropiaActualizadaEl`.
- Se **elige** como mascota con las preferencias, poniendo la forma `propia`.
  `conPreferencias` lo rechaza si no se subio (`MASCOTA_INVALIDA`).
- **Quitarla** (`sinMascotaPropia`) devuelve a quien la tenia elegida al
  personaje de siempre, `fungito`, **con el nombre que le habia puesto**.
- Una cuenta con la forma `propia` y sin marca (un estado incoherente) se puede
  leer y cambiar de nombre sin problema: lo unico que no admite es **elegirla**
  sin haberla subido.
- `User` reconstruye una cuenta a partir de otra en **un solo sitio**
  (`copiaCon`). Un campo nuevo se conserva solo; hay que decidir expresamente
  cambiarlo. Antes cada metodo copiaba campo por campo, y olvidarse de uno
  borraba datos sin avisar.

### Exportar y borrar: los derechos de acceso y de supresion

La Ley 1581 de 2012 reconoce a cada persona el derecho a conocer lo que se
guarda de ella y a pedir que se suprima (SCRUM-75).

- **Exportar** (`ExportarDatosUseCaseImpl`) reune la cuenta, los resultados, las
  entradas de diario, la foto de perfil (en base64) y la mascota propia (el SVG
  como texto), si las tiene; si Storage no responde, la exportacion falla en vez
  de salir sin ellas. Cada repositorio
  filtra por la persona y la base lo impone, asi que no puede colarse nada ajeno. Los resultados salen como en el
  resto de la API: con su nivel orientativo y sin el puntaje normalizado.
- **Borrar** (`BorrarCuentaUseCaseImpl`) es todo o nada. El repositorio borra
  las filas dentro de una transaccion, borra los archivos de la persona en
  Storage, borra la identidad en el proveedor y solo entonces confirma. Si el proveedor falla, la transaccion se deshace y la
  respuesta es `BORRADO_NO_COMPLETADO` (503): no se borro nada y se puede
  reintentar.

Queda un hueco que no se puede cerrar del todo: que la base falle al confirmar
justo despues de que el proveedor ya borro. Es mucho menos probable que un
fallo de red, que es lo que este orden cubre, y si ocurre queda en el registro
del servidor.

### Como llega el consentimiento al flujo HTTP

Desde el Ciclo 5 la regla se aplica en tres puntos, y ninguna peticion con
datos de salud puede saltarselos:

- **El alta lo exige.** `POST /api/cuenta` sin las dos casillas marcadas
  responde 400 `CONSENTIMIENTO_NO_REGISTRADO` y no crea nada
  (`RegistrarCuentaUseCaseImpl`). Y antes de pedirlas comprueba la edad.
- **Sin cuenta no se opera.** `GuardiaDeCuenta` traduce la identidad del token
  a la cuenta propia en cada ruta, y si no existe responde 403
  `CUENTA_NO_REGISTRADA`. Solo se libran las rutas publicas y la del alta. Con
  la cuenta pero sin el registro completo responde 403 `REGISTRO_INCOMPLETO`,
  salvo en consultar, exportar y borrar la cuenta.
- **La base no lo admite.** Las columnas del consentimiento son `NOT NULL`, y
  `PrismaUserRepository` se niega a guardar una cuenta sin el antes de llegar
  a PostgreSQL.

## `ActivityResult`

Es la entidad central. Hace cumplir tres reglas:

1. El identificador de operacion del cliente es obligatorio.
2. La fecha de realizacion no puede estar en el futuro. Importa en modo sin
   conexion: el reloj del dispositivo puede estar desajustado, y aceptar una
   fecha futura desordenaria el historial. **Con una tolerancia de cinco
   minutos** (`ToleranciaDelReloj`, SCRUM-133): lo que se adelante hasta ese
   margen se registra como "ahora", y lo que pase se rechaza. Ver "El reloj del
   dispositivo" mas abajo.
3. El puntaje, **si lo hay**, debe caer dentro del rango de la actividad, regla
   que delega en `OrientativeScore`.
4. `metadata` no puede traer claves que ya sean campos propios.

### El puntaje es opcional

No todas las actividades califican. Anotar que hoy te moviste, o que hubo un
momento bueno, produce **datos** y no una nota: el diccionario del entregable lo
dice desde el principio, «cuando aplique». Un resultado sin puntaje es valido y
conserva usuario, actividad, fecha e identificador de operacion.

**Que una actividad califique lo decide su escala, no su tipo.** Son dos cosas
independientes: el tipo dice como se hace la actividad y la escala dice si se
valora. En el catalogo hay dos bitacoras y no coinciden: «Movimiento del dia»
no puntua y «Como dormiste anoche» si, porque anotar cuanto dormiste es un
registro y aun asi tiene sentido decirte que descansaste bien o poco.

Conviene tenerlo presente al construir el motor de actividades: decidir si se
muestra resultado mirando el tipo dejaria sin su nivel a quien registre el
sueno, y no daria ningun error.

Un resultado sin puntaje tampoco sugiere acompanamiento por si solo. Un
registro cobra sentido en la tendencia, no en una anotacion suelta, y hacer que
un dato aislado dispare una sugerencia seria leer de mas.

Con una excepcion, desde SCRUM-94: **lo que la persona escribe pasa por la
misma deteccion de riesgo que el asistente** (`hayRiesgo`). Si algun texto de
la `metadata`, a cualquier profundidad, trae una senal, el resultado sugiere
acompanamiento esa misma vez, tenga puntaje o no. Pensado para el texto libre
de «Un momento bueno del dia», pero cubre cualquier campo de texto futuro sin
tener que acordarse de anadirlo.

Cuando un resultado sugiere acompanamiento, `POST /api/resultados` devuelve en
la misma respuesta las lineas de atencion, ordenadas por alcance. Quien recibe
la senal recibe tambien los telefonos, sin depender de una segunda peticion que
podria fallar justo entonces.

Son las del pais de la persona, sacado de su zona horaria (SCRUM-124): ver
[las lineas de ayuda segun el pais](#las-lineas-de-ayuda-segun-el-pais).

Ese texto **no aparece en ningun registro**. El registro de peticiones solo
anota metodo, ruta, estado y duracion. Y de los errores de Prisma, cuyo mensaje
repite los argumentos de la llamada que fallo, se anota el nombre, el codigo y
la traza, nunca el mensaje.

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

## El reloj del dispositivo (SCRUM-133)

Sin conexion, lo que una persona hace queda guardado en su dispositivo y viaja
despues **con la hora de ese reloj**, que puede ir unos minutos adelantado (un
celular sin sincronizar, un equipo compartido). Rechazar esa hora seria rechazar
el resultado **para siempre**: no es un fallo que se arregle reintentando, y la
persona perderia lo que hizo sin enterarse hasta mucho despues.

`domain/model/ToleranciaDelReloj` fija la politica, en un solo sitio:

- **Cinco minutos** de tolerancia (`TOLERANCIA_DEL_RELOJ_EN_MS`).
- `ajustarAlReloj(fecha, ahora)`: lo anterior a `ahora` **se respeta** (lo hecho
  sin conexion hace horas es asi de viejo); lo que se adelante hasta la
  tolerancia se registra como `ahora`; lo que pase **se rechaza**
  (`FECHA_EN_EL_FUTURO`).
- `conTolerancia(ahora)`: `ahora` mas el margen, para decidir hasta que dia se
  admite una anotacion.

Se aplica en dos sitios, y en los dos **antes de calcular el dia**:

- **Resultados:** la hora se ajusta y de ella sale el dia. Asi un resultado de las
  23:58 con el reloj adelantado pasada la medianoche no cae en el dia siguiente.
- **Diario:** el dia que manda el dispositivo se admite hasta el dia que seria
  con la tolerancia, y no uno mas (`FutureJournalDayError` para el resto).

Lo que **no** cambia: un dia de verdad en el futuro se sigue rechazando, y las
reglas de edicion del diario (plazo de una hora, versiones) no se tocan.

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

## `Calendario`

### El dia se cuenta en la zona de cada persona

Las actividades del dia, el sendero de cada modulo, el diario y el semaforo
dependen de "que dia es". Ese dia es el de la zona horaria de la persona, no el
de UTC, y lo decide siempre `Calendario`. Hasta SCRUM-123 era siempre el de
Colombia; ver el [ADR 0014](adr/0014-cada-persona-tiene-su-zona-horaria.md).

Bogota va cinco horas por detras de UTC. Con la fecha UTC, algo hecho a las
8 p. m. en Colombia contaria para el dia siguiente: la actividad sumaria en
manana, el diario la pondria en otro dia y el progreso saldria corrido.

| Metodo                | Que hace                                                                 |
| --------------------- | ------------------------------------------------------------------------ |
| `diaDe(instante)`     | El dia local, `AAAA-MM-DD`, al que pertenece un instante.                |
| `limitesDelDia(dia)`  | El rango `[desde, hasta)` de instantes de ese dia, para consultar "hoy". |
| `minutoDelDia(i)`     | Los minutos desde la medianoche local: la hora de cada aviso.            |
| `Calendario.de(zona)` | El calendario de una zona, sin construirlo otra vez en cada peticion.    |

**La regla:** ningun calculo de dia usa la fecha UTC directamente. Nada de
`toISOString().slice(0, 10)` ni de `getUTCDate()` para decidir a que dia
pertenece algo. Los instantes se siguen guardando en UTC, que es lo correcto;
lo que cambia es como se agrupan por dia.

**La zona es de la cuenta** (`User.zonaHoraria`, una zona IANA). La informa el
dispositivo en cada entrada y las cuentas anteriores quedan en `America/Bogota`:

- `POST /api/cuenta` acepta `zonaHoraria`. Si la cuenta ya existe y la zona es
  otra, la actualiza; si no viene, deja la que hay. Una zona que el servidor no
  conoce responde 400 `ZONA_HORARIA_INVALIDA`.
- Quien necesita saber que dia es recibe la zona de la cuenta en su orden: el
  diario, el registro de resultados y los avisos. El progreso la lee de la
  cuenta. No hay un calendario global ni la variable `ZONA_HORARIA`.
- Usa `Intl`, que es parte del lenguaje, asi que el dominio sigue sin
  dependencias externas.

**El dia de un resultado se guarda** (`resultado.dia`) cuando se registra, en la
zona que la persona tenia entonces. No se recalcula al leer: si viajar moviera
de dia lo que ya se hizo, se romperian rachas ya ganadas.

**Los avisos se leen en la zona de cada persona.** La tarea de cada minuto mira
las zonas en uso y, en cada una, a quien le toca en su minuto local. La zona de
`preferencia_aviso` la copia la base desde la cuenta con dos disparadores, para
que la tarea no necesite leer `usuario`.

## El sendero de cada modulo

`Sendero.ts` decide en que etapa va cada persona en cada modulo y que le toca
hoy (SCRUM-91). Se expone en `GET /api/progreso`.

- **Una sesion es un dia** en el que la persona hizo algo del modulo, contado
  con el `Calendario`. Dos actividades el mismo dia suman una sesion, y faltar
  un dia no deja hueco: el sendero no castiga.
- **Etapas** de 5, 10, 15 y 20 sesiones; despues, temporadas de 25 sin fin. Al
  completar una se pasa a la siguiente con cero hechas.
- **Lo que toca hoy** sale de cada actividad: su `frecuencia` (diaria, ciertos
  dias de la semana o unica) y su `desdeSesion`, que abre el sendero poco a
  poco. Hoy cuenta como la sesion siguiente a las anteriores, la haya empezado
  o no: hacer la primera actividad del dia no abre otras a mitad del dia.
- Una actividad **unica** hecha otro dia no vuelve; hecha hoy, se ve hecha
  hasta manana.

**No se guarda nada aparte.** Todo sale de `resultado`. Un contador propio
podria desincronizarse del historial, y entonces la pantalla diria una cosa y
los datos otra.

Cada categoria sabe a que modulo pertenece por su columna `modulo`, con la
misma clave estable que las preferencias. Un resultado de una actividad que ya
no esta en el catalogo no cuenta para ningun modulo: no hay forma de saber a
cual pertenecia.

## El diario

`EntradaDeDiario` es una anotacion del diario (SCRUM-95). El diario de un dia
es el conjunto de sus anotaciones, y cada una tiene su hora: escribir algo mas
tarde el mismo dia no reescribe lo anterior, se anade debajo. Se expone en
`GET`, `POST` y `PATCH /api/diario`.

- **El dia** es el del `Calendario`, no el de UTC. Se puede escribir en un dia
  pasado y la anotacion conserva la hora real en que se escribio; en uno futuro
  no (`DIA_EN_EL_FUTURO`).
- **Una hora para editar.** `editar()` comprueba primero la hora y despues la
  version. Fuera de plazo da `EDICION_FUERA_DE_PLAZO`. Con una version vieja,
  porque otro dispositivo la cambio, da `VERSION_DESACTUALIZADA`. En los dos
  casos no se toca nada y el cliente guarda lo suyo como una anotacion nueva
  (ADR 0009). La regla esta aqui para contestar claro, pero quien la hace
  cumplir es la base: ver `docs/modelo-de-datos.md`.
- **La hora de escribir y de editar es la del dispositivo** (SCRUM-144, ADR 0020).
  `POST` acepta `escritaEn` y `PATCH` acepta `editadaEn` (ISO 8601 con
  desplazamiento). Escrita a las 9:00 sin conexion y recibida a las 14:00, la
  anotacion muestra las 9:00; corregida a las 9:30, se aplica como correccion y
  no como una anotacion nueva. `horaDelDispositivo()` decide que hora se cree y
  **nunca lanza**: una hora que no sirve (mal formada, sin desplazamiento, un dia
  que no existe, en el futuro, de hace mas de 30 dias, anterior al comienzo del
  dia de la anotacion o a su escritura) se ignora y se usa la del servidor, sin
  error. Un reloj adelantado unos minutos (la tolerancia de `ToleranciaDelReloj`)
  queda en «ahora». La hora de la edicion nunca va hacia atras.
- **El contenido es un documento del editor**, no HTML: `DocumentoDelDiario`
  comprueba la forma del arbol (cada nodo con un `type` valido y solo las
  claves que usa el editor), su profundidad y su tamano. No cierra la lista de
  tipos: eso es del editor. Los diagramas van en `adjuntos`.
- **Senales de riesgo, solo con permiso** (SCRUM-108). Nadie se mete en el
  diario de nadie: si la persona no encendio `diarioConRecomendaciones` en su
  perfil (apagado por defecto), lo escrito no pasa por ninguna deteccion y la
  respuesta va sin sugerencia ni lineas. Con el permiso,
  `contieneSenalDeRiesgo()` pasa por `hayRiesgo` el titulo, el texto del
  documento con las frases enteras aunque el editor las parta por marcas, y el
  texto de los diagramas, y la respuesta trae `sugiereAcompanamiento` y las
  lineas de atencion, como un resultado. **No se guarda ninguna marca** en la
  anotacion.
- Escribir es idempotente por `clientOperationId`, por persona, igual que un
  resultado.

## El semaforo de pendientes

`Pendiente` es algo por hacer con su color: urgente, prioridad o aplazable
(SCRUM-97). Se expone en `GET`, `POST`, `PATCH` y `DELETE /api/pendientes`.

- **El color lo pone la persona.** El sistema puede sugerir subirlo, nunca lo
  sube solo.
- **Cada color es un plazo** (SCRUM-107): urgente, esta semana; prioridad,
  entre 7 y 21 dias; aplazable, 21 o mas.
- **Recordatorios con calma.** `recordatorio(ahora, hoy)` dice si toca
  recordarlo: sin hacer, sin posponer, y acabado el plazo de su color desde que
  se anoto (7 dias urgente, 21 prioridad, 30 aplazable). Sugiere el nivel
  siguiente; urgente no tiene siguiente. Lleva un `tono`: `plazo` para urgente
  y prioridad, `suave` para aplazable ("no es urgente, pero que no se
  acumule").
- **La fecha limite es opcional** (SCRUM-119). Un pendiente puede tener un dia
  limite, o no tenerlo: hay cosas que no vencen un dia concreto, como una tarea
  recurrente. Es un dia `AAAA-MM-DD` del calendario de la persona y no un
  instante. Sin fecha, todo funciona como arriba. **Con fecha, el recordatorio
  llega desde ese dia** en lugar de esperar los dias del color, con tono de
  `plazo` en cualquier color, y trae `fechaLimite` para que la pantalla diga que
  llego el dia. `hoy` es el de la zona de la cuenta (ADR 0014), asi que el
  mismo instante puede ser el dia limite para quien esta en Madrid y todavia no
  para quien esta en Bogota. Se pone, se cambia y se quita con `PATCH`
  (`fechaLimite: null` la quita); una que no es un dia real responde 400
  `PENDIENTE_INVALIDO`.
- **Uno por visita.** `elegirRecordatorio` devuelve uno como mucho: el de mayor
  color y, a igual color, el mas antiguo.
- **Posponer** es dar una fecha futura, como mucho a 90 dias. Hasta entonces no
  recuerda nada; `null` deja de posponer.
- La consulta trae los sin hacer y los hechos de los ultimos 7 dias.
- Crear es idempotente por `clientOperationId`, por persona.
- **Editar con version** (SCRUM-134): ver "Editar un pendiente desde dos
  dispositivos" mas abajo.
- **Borrar tambien es idempotente** (SCRUM-133): borrar uno que ya no esta
  responde 204, igual que la primera vez. Sin conexion, si se pierde la respuesta
  del primer borrado, el reintento llegaria a un error que la cola de
  sincronizacion no sabria distinguir de un fallo de verdad. No filtra nada: el
  pendiente de otra persona responde igual y no se toca (ADR 0010). Editar uno
  que no existe sigue respondiendo `PENDIENTE_NO_ENCONTRADO`.

### Editar un pendiente desde dos dispositivos (SCRUM-134)

Sin conexion, dos dispositivos pueden editar el mismo pendiente y el ultimo en
sincronizar pisaba al otro sin aviso. Cada pendiente lleva una `version` (empieza
en 1 y sube con cada edicion), y `PATCH /api/pendientes/:id` acepta la que el
dispositivo tenia. La regla, que vive en `PendientesUseCaseImpl.editar`:

| El dispositivo trae...                                  | Resultado                                         |
| ------------------------------------------------------- | ------------------------------------------------- |
| la version vigente                                      | se aplica; la version sube                        |
| una version vieja, y **el pendiente ya esta como pide** | `200` con lo vigente, sin cambiar nada            |
| una version vieja, y **solo lo marca como hecho**       | se aplica sobre lo vigente (no se pierde lo otro) |
| una version vieja, y cualquier otra edicion             | `409 VERSION_DESACTUALIZADA`, sin tocar nada      |
| ninguna version (dispositivos anteriores a este cambio) | se aplica, como siempre                           |

Por que cada fila:

- **«Ya esta como pide»** es lo que evita que un reintento choque consigo mismo.
  Sin conexion, una edicion se envia, el servidor la aplica y la respuesta se
  pierde; el dispositivo la reenvia con la version de antes, que ya no coincide.
  Como cada campo de la edicion es un valor absoluto (no un incremento), basta
  comprobar que el pendiente ya lo tiene. Tambien cubre a dos dispositivos que
  coinciden sin saberlo. No hace falta guardar identificadores de operacion de
  cada edicion.
- **Marcar como hecho gana.** Es un hecho que ocurrio, no una opinion, y se lleva
  bien con cualquier otro cambio: si un dispositivo lo marco sin conexion
  mientras otro le cambiaba el texto, no hay nada que preguntarle a la persona,
  queda hecho y con el texto nuevo. **Reabrirlo no es asi** (depende de lo que se
  vio) y se trata como cualquier otra edicion.
- **El resto es un conflicto** y no se resuelve solo. El texto, el color y las
  fechas no se mezclan: una mezcla mal hecha produce algo que nadie escribio (el
  mismo razonamiento del ADR 0009). La respuesta no trae el estado actual ni
  repite lo escrito: el cliente consulta el semaforo, que es una lectura.
- **El codigo es el mismo que el del diario** (`VERSION_DESACTUALIZADA`), a
  proposito: para quien lo recibe es el mismo hecho, "esto ya no es lo que
  viste", y se trata igual sea cual sea el dato.

**La comparacion que cuenta la hace la base**, dentro del `UPDATE`. Si la escritura
no pasa porque otro dispositivo la cambio entre leer y escribir: con version, es
un conflicto; sin version o marcando como hecho, se relee y se reaplica (hasta tres
veces) sobre lo vigente, porque esas ediciones se llevan bien con cualquier cosa.

**Una version que no es un entero positivo** (cero, negativa, con decimales, texto
o `null`) es un `400`, no un conflicto: `null` no significa «sin version».

## Los avisos por Web Push

`Aviso.ts` define los avisos que la aplicacion manda aunque no este abierta
(SCRUM-102). Se exponen en `/api/notificaciones`. La ruta no es `/api/avisos`
para no confundirla con `/api/aviso`, el aviso de privacidad.

- **Cuatro clases**, que se encienden y apagan por separado:
  - `semaforo`: los pendientes sin hacer, con su titulo, a la hora elegida;
  - `racha`: una vez al dia, solo si ese dia no se hizo ninguna actividad, a la
    hora elegida;
  - `manana` (SCRUM-126): a las **8:00** de la persona, una invitacion a empezar
    el dia. Sale siempre;
  - `noche` (SCRUM-126): a las **20:00** de la persona, solo si ese dia no se
    hizo ninguna actividad.
- **La manana y la noche tienen la hora fija.** Se encienden o se apagan
  (`PATCH /api/notificaciones/recordatorios`, con `manana` y `noche` en `true` o
  `false`); no se mueven. `MINUTO_DE_LA_MANANA` (480) y `MINUTO_DE_LA_NOCHE`
  (1200) son lo unico que se escribe en la base, o `NULL` para apagado. Todas las
  cuentas que ya existian quedan con los dos apagados: nadie recibe un aviso que
  no pidio.
- **Una sola invitacion al dia.** La racha y la noche dicen lo mismo con otras
  palabras. Con las dos encendidas, la que se revise primero cada dia es la
  unica: `aQuienLeToca` no le toca a una si la otra ya se reviso hoy, haya
  salido o no (si no salio, fue porque ya habia hecho una actividad, y entonces
  la otra tampoco saldria). La manana y el semaforo no entran en esa regla.
- **Las horas** van en la zona de la persona (SCRUM-123), en minutos desde la
  medianoche.
  `minutoDeHora("08:30")` da 510, y `Calendario.minutoDelDia(ahora)` dice que
  minuto es.
- **Nada de salud.** `mensajeDelSemaforo` cuenta y nombra hasta tres
  pendientes, y sin pendientes no hay aviso. `mensajeDeLaRacha` invita ("¿Un
  momento para ti hoy?"). Ninguno menciona un resultado, un nivel ni una
  emocion, y hay una prueba que lo comprueba.
- **Los textos de la manana y la noche** viven en `TextosDeLosRecordatorios.ts`
  (doce de cada uno) y rotan: `semillaDelAviso(persona, dia)` es el numero del
  dia mas un desfase por persona, asi que el texto cambia cada dia, no se repite
  dos dias seguidos y no hay azar ni nada que guardar. Se escriben **con juego y
  sin culpa**: misiones, pasos, el sendero; nunca "no pierdas", "todavia no" ni
  una cuenta de dias. Si se quiere cambiar o ampliar uno, hay pruebas que
  vigilan que ninguno hable de salud, ni culpe, ni se pase de largo para la
  pantalla bloqueada. Tocarlos lleva a `/panel`, donde estan las actividades.
- **La revision** (`RevisarAvisosUseCaseImpl`) corre cada minuto dentro del
  API (`RelojDeAvisos`):
  - busca a quien le toca: su hora cae en la ultima media hora y ese aviso no
    se reviso hoy;
  - lo marca revisado **antes** de mandar: si algo falla, se pierde un aviso,
    pero nunca se manda dos veces;
  - entrega a cada navegador de la persona, y suelta los que ya no existen
    (404 o 410).
- **Solo a servicios de push conocidos** (SCRUM-153). `suscripcionValida` acepta
  unicamente las direcciones de Google (`fcm.googleapis.com`), Mozilla
  (`*.push.services.mozilla.com`), Apple (`web.push.apple.com`) y Windows
  (`*.notify.windows.com`), sin usuario, sin puerto y sin que `URL` y `web-push`
  puedan leerla distinto; `WebPushEnviador` vuelve a comprobarlo antes de cada
  envio. Cualquier otra es un `400` (`AVISO_INVALIDO`). Explicado en
  [seguridad](seguridad.md).
- **Diez navegadores por cuenta como mucho.** Al pasar de diez entra el nuevo y
  sale el mas antiguo; no se rechaza (`MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA`).
- **Sin claves VAPID no hay avisos**, y lo demas funciona igual. En el plan
  gratuito de Render el servicio se duerme: dormido no revisa, y al despertar
  manda solo lo de la ultima media hora.

## Las lineas de ayuda segun el pais

Un numero equivocado en una crisis es el peor error posible, asi que las lineas
que se ensenan (en el asistente, en los resultados y en el diario) son las del
**pais de la persona**. Ver el
[ADR 0015](adr/0015-las-lineas-de-ayuda-segun-el-pais.md).

`paisDeLaZona(zona)` (`PaisDeAyuda.ts`) devuelve el codigo ISO de dos letras, o
`undefined`. Sale de una lista de zonas escrita a mano, solo para los paises
cuyas lineas verifico una persona: Colombia, Mexico, Espana y Estados Unidos. No
se pide GPS ni ubicacion, y no lanza nunca: se llama cuando alguien puede estar
mal, y una zona desconocida o mal escrita simplemente no tiene pais.

**Misma hora no es mismo pais.** Peru, Ecuador y Panama comparten la hora de
Bogota y no reciben el 192: reciben el directorio internacional.

`RecursoApoyoRepositoryPort.lineasDeAtencion(pais)` recibe el pais **como
parametro obligatorio**. Un `lineasDeAtencion()` sin pais que "devuelve todas" es
justo la llamada que hay que impedir, y con el parametro obligatorio el
compilador marca cada sitio donde alguien se olvide. Si el pais no tiene filas, o
no hay pais, devuelve las filas sin pais (el directorio internacional): **nunca
las de otro pais**.

`RecursoApoyo.create` rechaza un contacto sin `fuente` o sin `verificadoEl`
(`AAAA-MM-DD`), y la base impone lo mismo con una restriccion. Quien quiera
agregar una linea sin decir de donde sale, no puede.

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
| `InvalidJournalEntryError`          | `ANOTACION_INVALIDA`                  | La anotacion no tiene la forma del diario    |
| `FutureJournalDayError`             | `DIA_EN_EL_FUTURO`                    | Se escribe en un dia que no ha llegado       |
| `InvalidDayRangeError`              | `RANGO_DE_DIAS_INVALIDO`              | El rango pedido al diario no es valido       |
| `JournalEntryNotFoundError`         | `ANOTACION_NO_ENCONTRADA`             | No existe o es de otra persona               |
| `EditWindowClosedError`             | `EDICION_FUERA_DE_PLAZO`              | Paso la hora para editar la anotacion        |
| `StaleJournalEntryError`            | `VERSION_DESACTUALIZADA`              | Otro dispositivo la cambio entretanto        |
| `InvalidTaskError`                  | `PENDIENTE_INVALIDO`                  | Texto, nivel o fecha de posponer no validos  |
| `TaskNotFoundError`                 | `PENDIENTE_NO_ENCONTRADO`             | No existe o es de otra persona               |
| `StaleTaskError`                    | `VERSION_DESACTUALIZADA`              | Otro dispositivo cambio el pendiente         |

La clave de operacion es unica **por persona** desde el ADR 0010, asi que usar
la de otra ya no produce un error distinto: se registra un resultado propio,
como cualquier otra peticion. Aqui vivia `OperationBelongsToAnotherUserError`,
que se retiro por eso mismo.

## Lo que todavia no existe

- **La gestion de contenidos.** `Categoria`, `Activity` y `RecursoApoyo`
  existen y se leen, pero el catalogo y los recursos solo cambian con una
  migracion: todavia no hay casos de uso para que el administrador los cree o
  los edite (SCRUM-76). El limite de ese rol ya esta escrito y probado; ver
  "El administrador gestiona contenidos, no personas".
- **La sincronizacion sin conexion.** La API ya es idempotente por
  `clientOperationId`, que es lo que una cola de reintentos necesita para no
  duplicar nada, pero la cola local del frontend todavia no existe (SCRUM-18
  y SCRUM-19).
