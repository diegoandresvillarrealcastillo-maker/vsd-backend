# Ambientes de ejecucion

## El problema que resuelve

Una aplicacion suele funcionar bien en el computador de quien la
escribio. Los problemas aparecen cuando pasa a otro entorno: cambia la
direccion de la API, la base de datos, el puerto o las credenciales.

Si esos valores estan escritos dentro del codigo, cada cambio de entorno
obliga a modificar el codigo. Y modificar el codigo para desplegar es
justo lo que produce errores en produccion.

La regla que sigue VSD Health es una sola:

> **El mismo codigo en los tres ambientes. Lo unico que cambia es la
> configuracion.**

## Los tres ambientes

| Ambiente | Proposito                    | Donde se ejecuta                  | Rama            |
| -------- | ---------------------------- | --------------------------------- | --------------- |
| **DEV**  | Desarrollo diario            | El computador de cada integrante  | `desarrollo`    |
| **PRE**  | Validacion antes de publicar | Servicio de despliegue de pruebas | `preproduccion` |
| **PROD** | Uso por personas reales      | Servicio de despliegue productivo | `produccion`    |

Un cambio recorre siempre el mismo camino y en el mismo orden:

```
feature/SCRUM-N-...  ->  desarrollo  ->  preproduccion  ->  produccion
                            DEV            PRE               PROD
```

Nada llega a PROD sin haber pasado por PRE. Ver `CONTRIBUTING.md`.

## Que cambia entre un ambiente y otro

Solo la configuracion. Ninguna de estas diferencias vive en el codigo:

| Variable                    | DEV                         | PRE                          | PROD                     |
| --------------------------- | --------------------------- | ---------------------------- | ------------------------ |
| `VITE_API_BASE_URL`         | `http://localhost:3000`     | URL de la API de pruebas     | URL de la API productiva |
| `DATABASE_URL`              | Base de datos de desarrollo | Base de datos de pruebas     | Base de datos productiva |
| `CORS_ORIGIN`               | `http://localhost:5173`     | Dominio de la PWA en pruebas | Dominio exacto de la PWA |
| `NODE_ENV` / `VITE_APP_ENV` | `development`               | `preproduction`              | `production`             |

`CORS_ORIGIN` nunca puede ser `*` en PRE ni en PROD: debe nombrar el
dominio exacto.

`SUPABASE_SERVICE_ROLE_KEY` es **obligatoria en PRE y PROD**: sin ella el
servicio no arranca. Es la clave `service_role` de cada proyecto de Supabase,
se pone a mano en Render y nunca pasa por Git. El backend la usa para **dos**
cosas: borrar la identidad de quien borra su cuenta y guardar, leer y borrar los
archivos de las personas en Supabase Storage (la foto de perfil, SCRUM-120; ver
el [ADR 0016](adr/0016-los-archivos-de-cada-persona-viven-en-storage-y-solo-los-toca-la-api.md)).
Nunca para leer ni escribir datos de la base. En DEV es opcional: sin ella la
identidad no se borra en Supabase y las fotos se guardan en memoria.

**El bucket de las fotos no se crea a mano.** La API crea `fotos-de-perfil` la
primera vez que se guarda una foto: privado, sin politicas, con un limite de
51 200 bytes y solo `image/jpeg` e `image/png`. Si ya existe, lo deja como esta.
La primera vez en PRE hay que comprobarlo a ojo, porque en CI y en local no hay
Storage: subir una foto desde el perfil, mirar en Supabase (Storage) que el
bucket existe, es privado y tiene un objeto con el identificador de la cuenta
como nombre, y quitar la foto desde el perfil y ver que el objeto desaparece.

La mascota propia (SCRUM-122, ADR 0017) usa **otro bucket**, `mascotas-propias`,
creado de la misma forma: privado, sin politicas, con un limite de 102 400 bytes
y solo `image/svg+xml`. Se comprueba igual, subiendo un `.svg` desde el perfil.

**No hay variable de zona horaria.** `ZONA_HORARIA` existio hasta SCRUM-123,
cuando el servicio contaba el dia en una sola zona. Ahora cada cuenta guarda la
suya y la informa el dispositivo; ver "El dia se cuenta en la zona de cada
persona" en `dominio.md` y el ADR 0014. Si todavia esta declarada en Render, se
puede quitar: ya no se lee.

`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` y `VAPID_SUBJECT` son las claves de los
avisos por Web Push (SCRUM-102).

- **Opcionales en los tres ambientes:** sin ellas no se mandan avisos y todo lo
  demas funciona igual. Van las tres juntas o ninguna, y una suelta impide
  arrancar.
- **Un par por ambiente**, generado con `npm run vapid:generar`. Lo generan
  Diego o Samuel.
- **La privada es un secreto:** se pone a mano en Render y nunca pasa por Git.
  La publica viaja al navegador.
- **Cambiarlas obliga a reactivar los avisos:** las suscripciones quedan atadas
  a la clave publica con la que se hicieron, asi que cada persona tendria que
  activarlos de nuevo.

## Donde vive cada valor

- **En el repositorio** solo esta `.env.example`, con los nombres de las
  variables y valores de ejemplo. Nunca valores reales.
- **En el computador de cada integrante** esta su `.env` local, que Git
  ignora.
- **En PRE y en PROD** los valores se cargan como variables de entorno
  del servicio de despliegue. No existe ningun archivo `.env` subido.

Cada ambiente tiene su propia base de datos. Los datos de prueba nunca
se mezclan con los de personas reales.

## Los principios que aplicamos

Esta forma de trabajar viene de los _doce factores_, un conjunto de
practicas para aplicaciones que deben desplegarse y operarse, no solo
ejecutarse. De los doce, estos cuatro son los que condicionan
directamente el diseno de VSD Health:

**Configuracion separada del codigo.** Todo lo que cambia segun el
entorno sale de variables de entorno. El codigo no sabe en que ambiente
se esta ejecutando.

**Paridad entre entornos.** Los tres ambientes deben parecerse lo mas
posible. Si en DEV usamos PostgreSQL, en PRE y en PROD tambien: una base
de datos distinta en desarrollo esconde errores hasta que ya es tarde.

**Servicios desacoplados.** La base de datos y el proveedor de
autenticacion son recursos externos conectados por configuracion. Cambiar
de proveedor debe significar cambiar una variable y un adaptador, nunca
tocar el dominio. Ver [arquitectura.md](arquitectura.md).

**Registros como flujo de eventos.** La aplicacion no administra archivos
de registro: escribe los eventos a la salida estandar y es el entorno de
despliegue quien los recoge. Los registros nunca incluyen datos
personales ni informacion de salud de ningun usuario.

El formato cambia con el ambiente, que es otra vez el mismo codigo con
distinta configuracion. En DESARROLLO se escribe el formato legible de
NestJS, con colores, porque lo lee una persona en su terminal. En PRE y
PROD se escribe JSON de una linea por evento, sin colores, porque lo lee
un indexador: con texto suelto y codigos de color no hay manera de
filtrar por estado o por ruta cuando toca buscar algo.

Cada peticion deja una sola linea con metodo, ruta, estado y duracion, y
nada mas. La forma es cerrada y hay una prueba que la exige, de modo que
si alguien anade un campo mas adelante la suite falla antes de que ese
campo llegue a produccion. Se anota la plantilla de la ruta
—`/api/resultados/:id`— y no la URL concreta, para que los
identificadores no acaben en el registro solo por viajar en la direccion.

## La imagen de Docker (SCRUM-131)

El backend se empaqueta en una imagen (`Dockerfile`) y esa misma imagen corre en
el CI, en el entorno completo (SCRUM-132) y en Render. La decision y lo que se
descarto estan en el [ADR 0018](adr/0018-el-backend-se-despliega-como-una-imagen-de-docker.md).
El frontend sigue en Vercel: no usa contenedor.

```bash
docker build -t vsd-api .
docker run --rm -p 3000:3000 --env-file .env vsd-api
```

Lo que conviene saber:

- **No lleva configuracion.** Ni `.env` ni ningun valor: todo entra como variable
  de entorno al ejecutar, con los mismos nombres de esta pagina. `.dockerignore`
  funciona por lista blanca para que un archivo con secretos no entre por
  descuido.
- **`NODE_ENV` vale `production` por omision.** Sin configurar nada, el servicio
  se niega a arrancar y dice que falta. Para probarla en local con la base en
  memoria hay que pedir `NODE_ENV=development` y dar `CORS_ORIGIN` y
  `SUPABASE_URL`.
- **No aplica migraciones.** Las aplica una persona, como siempre.
- **Corre sin privilegios** (usuario `node`) y con el codigo de solo lectura.
- **`PORT`** lo pone Render; si no llega, 3000.
- **El `HEALTHCHECK`** consulta `/health` con el `fetch` de Node. Lo lee Docker
  Compose; Render usa su propia comprobacion.
- **El CI** (trabajo "Imagen de Docker") la construye, la arranca y comprueba lo
  anterior. Imprime el peso en cada ejecucion.

### El entorno completo (SCRUM-132)

`docker compose --profile completo up --build` levanta cuatro piezas en orden,
cada una esperando a la anterior por una **condicion** y no por una pausa:

| Pieza         | Que hace                                                 | Espera a              |
| ------------- | -------------------------------------------------------- | --------------------- |
| `postgres`    | La base de desarrollo (PostgreSQL 17.6)                  | —                     |
| `migraciones` | `prisma migrate deploy` y termina                        | `postgres` sana       |
| `api`         | La imagen de arriba, en `development`, en el puerto 3000 | migraciones sin error |
| `web`         | La imagen del frontend (nginx), en el puerto 8080        | `api` sana            |

- `migraciones` usa la etapa `compilacion` del `Dockerfile` y no la imagen final,
  porque la CLI de Prisma no viaja en la que se despliega.
- Las piezas nuevas estan en el perfil `completo`: `docker compose up -d` y
  `npm run db:arriba` siguen levantando solo las dos bases, como siempre.
- El CI (trabajo «Entorno completo con Docker Compose») levanta la base, las
  migraciones y la API, comprueba que el catalogo responde con su esquema y datos
  y que la API acepta el origen de la web y no otro; y, si `vsd-frontend` ya
  tiene su `Dockerfile` en `desarrollo`, levanta tambien la web.
- Lo que **no** incluye: Supabase. El inicio de sesion usa el proyecto que se
  indique en `SUPABASE_URL`. Y es el ambiente de desarrollo: la API conecta como
  el dueno de las tablas, como `start:dev`.

El paso a paso para quien lo use esta en el [README](../README.md).

### Pasar el servicio de Render a Docker

Lo hace **una persona en el panel de Render**; no se automatiza porque se toca un
servicio vivo con sus variables. Los nombres de los campos salen de lo que se de
Render, no de haberlos abierto: si algo no coincide, manda el panel.

1. Crear un servicio web **nuevo** con el mismo repositorio y la misma rama, con
   el lenguaje en **Docker** y el `Dockerfile` de la raiz. Dejar vacio el comando
   de inicio: la imagen ya trae el suyo.
2. Copiar las variables de entorno del servicio actual (incluida
   `SUPABASE_SERVICE_ROLE_KEY`) y poner la ruta de comprobacion en `/health`.
3. Esperar a que despliegue y comprobar `/health` y, con una sesion de PRE, el
   perfil y el catalogo.
4. Cambiar `VITE_API_BASE_URL` de la web de PRE (Vercel) a la direccion nueva y
   volver a desplegarla, y **apagar el servicio viejo** solo cuando todo
   funcione.
5. Anotar aqui la fecha del cambio.

Mientras tanto el servicio de Node actual sigue funcionando: el `Dockerfile` en el
repositorio no cambia nada de lo desplegado hasta que alguien haga estos pasos.

**Fecha del cambio: pendiente.** Al 08/10/2026 nadie ha hecho este cambio ni lo ha
anotado aqui; el servicio de PRE sigue siendo el de Node.

## El modo sin conexion en cada ambiente (SCRUM-143)

El modo sin conexion (ADR 0019) **no se configura**: no agrega ninguna variable de
entorno, ni al backend ni al frontend. Es el mismo codigo en los tres ambientes,
como todo lo demas. Lo que si cambia con el ambiente es lo que se guarda y donde.

| Que                                         | Como se comporta                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **La aplicacion guardada** (service worker) | Cada ambiente tiene su propio dominio, asi que su propio service worker y su propia copia. Precarga unos 204 archivos, unos **9,4 MiB** (`npm run build` lo imprime). No guarda nada de la API                                                                                                                                              |
| **Lo de cada persona** (IndexedDB)          | Una base por persona **y por dominio** (`vsd-<id>`): lo hecho en PRE no se mezcla con lo de PROD, aunque sea el mismo navegador                                                                                                                                                                                                             |
| **`index.html` y `sw.js`**                  | En la imagen de nginx van con `no-cache` (`nginx/default.conf` del frontend): se revalidan en cada visita, y por eso una version nueva se ve. En Vercel **no hay cabeceras propias** (`vercel.json` solo reescribe rutas): se confia en lo que Vercel hace por omision, y **no se ha comprobado en PRE** que `sw.js` llegue sin cache larga |
| **`GET /health`**                           | Es lo que dice si hay conexion con la API (ADR 0019): responde sin tocar la base. Debe seguir existiendo y sin sesion                                                                                                                                                                                                                       |
| **`GET /api/asistente/reglas-locales`**     | Publica, con `ETag`, para que VSD IA responda sin red (SCRUM-141). Se despliega **antes** que el frontend: si el frontend llega primero, lo unico que pasa es que no hay reglas guardadas y el asistente se comporta como antes                                                                                                             |
| **CORS**                                    | La API **expone `ETag`** (SCRUM-133) para que la PWA pueda leerlo y preguntar «¿cambio?» con `If-None-Match`. Sin eso, cada lectura con copia bajaria todo de nuevo. `CORS_ORIGIN` sigue siendo el dominio exacto de la PWA de cada ambiente                                                                                                |

### El arranque en frio y el modo sin conexion

En el plan gratuito, Render apaga el servicio tras 15 minutos sin peticiones y
despertarlo tarda cerca de un minuto. Para quien usa la aplicacion eso se parece
mucho a no tener conexion, y la aplicacion lo trata asi a proposito:

- La comprobacion de conexion (`GET /health`) espera **15 segundos**. Un servidor
  dormido no contesta a tiempo, y **no cuenta como conexion**: la aplicacion puede
  decir «Sin conexion» hasta que el servicio despierte, **aunque haya internet**. La
  misma peticion ya lo esta despertando, y en cuanto responde vuelve a «con conexion» y
  se envia lo guardado.
- Un `503` o un tiempo agotado se tratan como un fallo **pasajero**: espera creciente
  (5 s, 10 s... hasta 15 min) y no se descarta nada.
- Las lecturas con copia (catalogo, diario, panel, perfil) usan la copia si la API
  tarda mas de 2,5 s o no responde, y dicen de cuando es.
- La PWA llama a `/health` en cuanto se abre (SCRUM-111), y el workflow
  `mantener-el-api-despierto.yml` lo hace cada 10 minutos.

**No se ha medido en PRE** cuanto dura exactamente ese minuto visto desde la
aplicacion, ni se ha comprobado a mano que el indicador diga lo que debe mientras el
servicio despierta: ver la [guia de prueba](guia-de-prueba-sin-conexion.md), caso 9.

### Los limites del plan gratuito que importan aqui

- **Render:** 750 horas al mes y se duerme a los 15 minutos. Con un solo servicio
  despierto todo el mes, se usan unas 744; **no caben PRE y PROD despiertos a la vez**
  (ver «Lo que falta para PROD»).
- **Supabase:** dos proyectos activos por cuenta, y un proyecto sin actividad durante
  siete dias queda en pausa.
- **Lo que no tiene limite propio:** lo guardado en el navegador de cada persona. Su
  cuota la decide el navegador y es finita: un almacen lleno se informa
  (`AlmacenLleno`) y no se pierde nada en silencio. **Safari puede borrar** lo guardado
  de un sitio que no se abre en una semana, salvo que este instalado en la pantalla de
  inicio.

## La base de datos de cada ambiente

| Ambiente | Donde vive                                | Estado                                 |
| -------- | ----------------------------------------- | -------------------------------------- |
| DEV      | PostgreSQL local, Docker o `db:local`     | En funcionamiento                      |
| CI       | Contenedor del trabajo, se crea y se tira | En funcionamiento                      |
| PRE      | Supabase, proyecto `vsd-health-pre`       | **En uso**, con las 13 migraciones     |
| PROD     | Supabase, proyecto `vsd-health-prod`      | **Preparado**, con 5 de 13 migraciones |

Preparado quiere decir las migraciones de ese momento aplicadas, el catalogo
sembrado y el rol `vsd_app` con contrasena y sujeto a las politicas de
aislamiento. Los dos quedaron asi el **21/09/2026**, con cinco migraciones,
comprobados con `npm run db:revisar`. Desde entonces cada uno siguio un camino
distinto (comprobado el 06/10/2026 en la tabla `_prisma_migrations`):

- **PRE** recibio las migraciones a medida que llegaban a `preproduccion`.
  Tiene las 13, hasta `20261005120000_avisos_push`, y es la base que usa el API
  desplegado.
- **PROD** sigue como quedo el 21/09: 5 de 13, hasta
  `20260921120000_catalogo_inicial`. Le faltan las ocho siguientes, que tienen
  que estar aplicadas antes del primer despliegue de PROD. Ver "Estado actual".

> **Despues del 06/10/2026 llegaron nueve migraciones mas** (`20261007120000_zona_horaria_por_persona`
> hasta `20261014120000_hora_del_dispositivo_en_el_diario`): ya son **22** en el
> repositorio. Cuales estan aplicadas en cada base lo dice `npm run db:revisar`, y **las
> aplica una persona**, en orden, antes de desplegar el backend. Dos importan para el
> modo sin conexion: `20261013120000_version_del_pendiente` (SCRUM-134: el codigo nuevo
> necesita esa columna) y `20261014120000_hora_del_dispositivo_en_el_diario`
> (SCRUM-144: cambia el disparador y la politica del diario). **Sin ellas, desplegar el
> backend rompe los pendientes y el diario.** Esta tabla refleja lo comprobado el
> 06/10; no se ha vuelto a comprobar.

Las migraciones llevan consigo todo lo que tiene que ser igual en los tres
ambientes: las tablas, el aislamiento por Row Level Security, las tres lineas
de atencion y **el catalogo de tres categorias y nueve actividades**.

El catalogo se siembra con una migracion y no desde el panel justamente por
eso. Si PRE y PROD tuvieran actividades distintas, probar en PRE dejaria de
significar algo, y el fallo no daria ningun error: la aplicacion se veria bien
y mostraria cosas distintas en cada sitio.

PROD no contiene datos de ninguna persona. PRE si tiene cuentas, creadas desde
la PWA desplegada.

Los dos proyectos viven en la organizacion de Samuel, no en `VSD-COMPANY`. El
plan gratuito de Supabase permite **dos proyectos activos por cuenta**, y los
miembros con rol Owner o Admin cuentan para ese limite. Por eso Diego entra
como **Developer**: con cualquier rol superior, sus propios proyectos contarian
alli y la organizacion se quedaria sin cupo.

> **Se pausan solos.** Un proyecto gratuito que pasa siete dias sin actividad
> queda en pausa y hay que reactivarlo a mano desde el panel. No se pierde
> nada, pero el primer intento de conexion falla y el error no lo dice.

### Como se llega a esas bases

La direccion directa —`db.<ref>.supabase.co`— **solo resuelve por IPv6**. En
una maquina sin IPv6 no hay manera de alcanzarla, y el sintoma es un `P1001`
que parece un problema de credenciales sin serlo. Para eso estan los pooler:

| Via                                      | Puerto | Para que sirve                            |
| ---------------------------------------- | ------ | ----------------------------------------- |
| Conexion directa                         | 5432   | Solo IPv6.                                |
| Session pooler, usuario `postgres.<ref>` | 5432   | IPv4. **Es la que usan las migraciones.** |
| Transaction pooler                       | 6543   | IPv4. La usa la aplicacion.               |

El transaction pooler no sirve para migrar: no conserva la sesion entre
sentencias. Por eso, contra Supabase, `DIRECT_URL` apunta al session pooler y
no a la direccion directa.

### El rol con el que se conecta la aplicacion

En cada ambiente con base de datos hay **dos** credenciales distintas, y no es
burocracia:

- `DIRECT_URL` usa el dueno de las tablas. Solo la usan las migraciones.
- `DATABASE_URL` usa el rol `vsd_app`, que no es dueno de nada. Es la que usa
  el servicio.

El dueno de una tabla esta exento de sus propias politicas de aislamiento. Si
la aplicacion se conectara con el, el Row Level Security dejaria de aplicarse
**sin dar ningun error**. Por eso el servicio comprueba al arrancar con que rol
se conecto y, fuera de desarrollo, se niega a arrancar si no esta sujeto a las
politicas.

La migracion crea `vsd_app` sin contrasena a proposito. Si se la pusiera, esa
contrasena estaria en Git, en el historial y en la copia que tiene cada persona
del repositorio. Darsela es por eso un paso manual por ambiente:

```bash
VSD_APP_PASSWORD='la-que-genere-el-gestor' npm run db:rol -- "cadena-del-dueno"
```

La contrasena entra por variable de entorno y no como argumento, porque los
argumentos quedan en el historial de la terminal y se ven en la lista de
procesos. El script no la imprime ni la guarda en ningun sitio: anotala en el
gestor de contrasenas **antes** de ejecutarlo, porque despues no hay forma de
recuperarla.

Ademas de ponerla, comprueba tres cosas y falla si alguna no se cumple: que
`vsd_app` no sea superusuario ni salte RLS, que conectandose con el no se vea
ninguna fila ajena, y que si se pueda leer el catalogo. Cuando la base esta
vacia lo advierte, porque entonces "no ve nada" tambien seria cierto con las
politicas apagadas.

## Estado actual

Las variables de los tres ambientes estan documentadas en
`.env.example`, en este repositorio y en `vsd-frontend`.

| Ambiente | API                                                        | PWA                                 | Base                                       |
| -------- | ---------------------------------------------------------- | ----------------------------------- | ------------------------------------------ |
| DEV      | `http://localhost:3000`                                    | `http://localhost:5173`             | Local                                      |
| PRE      | Render, servicio `vsd-api-pre`: `vsd-api-pre.onrender.com` | Vercel: `vsd-health-pre.vercel.app` | `vsd-health-pre`                           |
| PROD     | Sin desplegar                                              | Sin desplegar                       | `vsd-health-prod`, preparada pero atrasada |

**PRE esta desplegado y en uso.** Las variables de cada servicio se cargaron a
mano en Render y en Vercel; ninguna paso por Git. Dos cosas propias de este
despliegue:

- **Vercel sirve la PWA en cualquier ruta.** `vercel.json` reescribe toda ruta
  a `index.html`, porque las rutas las resuelve React en el navegador. Sin eso,
  entrar directo a `/panel` o recargar respondia 404 (SCRUM-104).
- **Render se duerme.** En el plan gratuito apaga el servicio tras 15 minutos
  sin peticiones, y despertarlo tarda cerca de un minuto. Lo cubren dos cosas
  (SCRUM-111): la PWA llama a `/health` en cuanto se abre, y el workflow
  `mantener-el-api-despierto.yml` lo llama cada 10 minutos. GitHub ejecuta los
  workflows programados desde la rama por defecto, `produccion`, asi que ese
  ultimo empieza a correr cuando SCRUM-111 llegue alli; mientras tanto se lanza
  a mano desde Actions.

Los dos pasos manuales de cada base —aplicar las migraciones y darle
contrasena a `vsd_app`— se hicieron en PRE y en PROD con `npm run db:preparar`,
que los encadena en el orden correcto: el rol lo crea una migracion, asi que
darle contrasena antes no funciona.

Las contrasenas viven en el gestor del equipo y **son distintas por ambiente**.
Si una se compromete, la otra no se va con ella. No pasan por Git ni por
ningun chat.

### Los correos de Supabase Auth

Confirmar la cuenta, recuperar la contrasena y cambiar el correo los manda
Supabase, y cada proyecto guarda **sus propias plantillas**: no viajan con las
migraciones. Las del equipo estan en [`correos/`](../correos/README.md) (SCRUM-125)
y las **pega una persona** en cada ambiente, en _Authentication → Emails →
Templates_. Salen de una sola plantilla y usan `{{ .SiteURL }}` para el logo, asi
que la **Site URL** de cada proyecto tiene que ser la de su PWA (PRE:
`https://vsd-health-pre.vercel.app`).

### Lo que falta para PROD

1. **Ponerle al dia la base.** Aplicar a `vsd-health-prod` las ocho
   migraciones que le faltan con `npm run db:aplicar`, con `DIRECT_URL`
   apuntando al session pooler de PROD en la misma orden. Lo hace una persona
   del equipo, y antes de ejecutarlo se comprueba a que host apunta.
2. **Crear el servicio del API y el proyecto de la PWA**, con sus propias
   variables: `CORS_ORIGIN` con el dominio exacto de PROD, su propio par de
   claves VAPID y la `DATABASE_URL` de `vsd_app` en PROD.
3. **Pegar las plantillas de correo** de [`correos/generados/`](../correos/README.md)
   en `vsd-health-prod`, con la Site URL de la PWA de PROD.
4. **Elegir el plan de Render.** En el gratuito no caben PRE y PROD despiertos
   en el mismo espacio de trabajo: uno solo usa unas 744 de las 750 horas del
   mes. Ver el encabezado de `mantener-el-api-despierto.yml`.
