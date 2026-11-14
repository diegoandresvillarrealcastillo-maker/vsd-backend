# ADR 0015: Las lineas de ayuda se eligen por el pais de la zona horaria

- **Estado:** aceptado
- **Fecha:** 2026-10-06
- **Tarea:** SCRUM-124
- **Depende de:** [ADR 0014](0014-cada-persona-tiene-su-zona-horaria.md)

## Contexto

Desde SCRUM-60 el asistente ensena las lineas de atencion ante una senal de
riesgo, y desde SCRUM-94 y SCRUM-108 tambien las ensenan los resultados y el
diario. Eran tres y las tres de Colombia: el 192, el 123 y el 106.

Eso estaba bien mientras todas las personas estuvieran en Colombia. Con la zona
horaria por persona (ADR 0014) deja de estarlo: alguien en Madrid o en Ciudad de
Mexico recibiria el 192 como si fuera suyo, y el 192 no contesta alli. Un numero
equivocado en una crisis es el peor error posible: la persona pidio ayuda y la
aplicacion le dio una puerta que no existe.

## Decision

**El pais se deduce de la zona horaria de la cuenta, y cada pais tiene su
catalogo de lineas, escrito a mano y con la fuente de cada numero.**

- **Sin ubicacion.** No se pide GPS ni permiso de ubicacion. La zona ya la
  guarda la cuenta (ADR 0014) y alcanza para esto.
- **Una lista escrita a mano** de zonas por pais (`PaisDeAyuda.ts`), y solo para
  los paises cuyas lineas verifico una persona. Cualquier otra zona no tiene
  pais.
- **Quien no tiene pais recibe el directorio internacional**, y ningun telefono:
  el directorio recomendado por la Asociacion Internacional para la Prevencion
  del Suicidio (IASP), que reune lineas gratuitas por pais, y una frase que dice
  que se llame al numero de emergencias del lugar donde esta. No se le da un
  numero porque no se sabe cual seria el suyo.
- **Cada linea tiene fuente y fecha de verificacion**, y la base no deja entrar
  un contacto sin ellas (una restriccion `CHECK`, y la misma regla en el
  dominio). Que "cada linea tiene fuente" no dependa de acordarse.
- **Colombia no cambia:** sus tres lineas y su cobertura (`nacional`, `bogota`,
  `universidad`) siguen igual.

Agregar un pais son tres cosas, juntas: sus zonas en `PaisDeAyuda.ts`, sus
lineas en una migracion nueva y su copia en `InMemoryRecursoApoyoRepository`.
Hay pruebas que fallan si una de las tres se queda atras, y otra que compara las
zonas con las que `Intl` conoce de ese pais.

## Alternativas descartadas

**Pedir la ubicacion (GPS).** Es un permiso mas, y de los que mas cuesta
conceder: a quien esta mal le aparece una ventana que no entiende. Ademas
guardaria o procesaria un dato de ubicacion, que la Ley 1581 trata con mas
cuidado que una zona horaria, para decidir algo que la zona ya decide.

**Geolocalizar por la direccion IP.** Falla justo cuando importa: con una VPN, en
la red de una universidad o con datos moviles, la IP dice otro lugar. Y exige
mandar la IP a un servicio de fuera o cargar una base de datos de IP.

**Preguntar el pais en el perfil.** Es un dato mas para llenar, y lo que no se
llena queda vacio. La zona ya viene sola, la informa el dispositivo.

**Ensenar las lineas de todos los paises.** Es lo contrario de lo que se busca:
una lista larga en el peor momento, y el telefono de otro pais mezclado con el
del propio.

**Un catalogo de todos los paises.** No se puede verificar. Una lista de
doscientos paises con numeros que nadie leyo en su fuente es peor que una corta
con cada numero comprobado, porque parece mas completa y no lo es.

## Como se verifica una linea

Una persona abre la pagina **oficial** del servicio (el ministerio, el gobierno,
el propio servicio) y comprueba el numero, el horario y que sea gratuita. La
fuente y la fecha quedan en la fila. La lista de que se leyo, y de donde, esta
en `docs/textos-del-asistente.md`.

No sirve un blog, una nota de prensa sin enlace a la fuente ni lo que "todo el
mundo sabe". Y lo que no se pudo abrir **no se anade**: es mejor un pais menos
que un numero sin comprobar.

## Consecuencias

**A favor**

- Nadie recibe el telefono de otro pais como si fuera suyo. Hay una prueba que
  lo comprueba con cada una de las 23 frases de riesgo, desde cada zona.
- Es explicable: ante cualquier respuesta se senala la zona, el pais, la fila y
  la pagina donde se confirmo.
- Funciona sin conexion: el catalogo cabe en el dispositivo, igual que las
  reglas (RF9).
- No hay un permiso nuevo ni un dato nuevo: sale de lo que la cuenta ya guarda.

**En contra, y hay que decirlo**

- **La zona no es el pais.** Alguien de Colombia que viaja recibe las lineas de
  donde esta, que es lo que hace falta; pero alguien en un pais con zona
  compartida sin lista (por ejemplo Peru y Ecuador, que tienen la hora de
  Bogota) recibe el directorio, no un telefono. Por eso la lista es de zonas
  `IANA` y no de horas.
- **Quien no tiene pais con lineas recibe menos**: un directorio que hay que
  abrir y no un numero que marcar. Es el precio de no dar uno equivocado.
- **La cobertura es chica**: hoy Colombia, Mexico, Espana y Estados Unidos.
  Crece de a un pais, con su verificacion.
- **Los datos caducan.** Las lineas cambian de numero, de horario o desaparecen.
  La fecha de verificacion existe para que se vea cuanto hace de cada una, pero
  nada la hace envejecer sola: alguien tiene que volver a mirar.
- **La zona por defecto es `America/Bogota`.** Quien nunca informo otra recibe
  las lineas de Colombia, que es lo correcto para la inmensa mayoria de las
  cuentas actuales y puede no serlo para una cuenta nueva sin zona informada.
- **Aplicar la migracion antes de desplegar este codigo.** El codigo pide una
  columna que la migracion crea; sin ella, las lineas fallan justo en la ruta del
  riesgo. Es el orden de siempre (`docs/ambientes.md`), y aqui pesa mas.
