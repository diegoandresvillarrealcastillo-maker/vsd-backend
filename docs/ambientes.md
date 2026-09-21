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

## La base de datos de cada ambiente

| Ambiente | Donde vive                                | Estado            |
| -------- | ----------------------------------------- | ----------------- |
| DEV      | PostgreSQL local, Docker o `db:local`     | En funcionamiento |
| CI       | Contenedor del trabajo, se crea y se tira | En funcionamiento |
| PRE      | Supabase, proyecto `vsd-health-pre`       | **Preparado**     |
| PROD     | Supabase, proyecto `vsd-health-prod`      | **Preparado**     |

Preparado quiere decir las cinco migraciones aplicadas, el catalogo sembrado y
el rol `vsd_app` con contrasena y sujeto a las politicas de aislamiento. Los
dos quedaron asi el **21/09/2026**, comprobados con `npm run db:revisar`.

Lo que todavia no existe es un despliegue que se conecte a ellas.

Las migraciones llevan consigo todo lo que tiene que ser igual en los tres
ambientes: las seis tablas, el aislamiento por Row Level Security, las tres
lineas de atencion y **el catalogo de tres categorias y nueve actividades**.

El catalogo se siembra con una migracion y no desde el panel justamente por
eso. Si PRE y PROD tuvieran actividades distintas, probar en PRE dejaria de
significar algo, y el fallo no daria ningun error: la aplicacion se veria bien
y mostraria cosas distintas en cada sitio.

Ninguno de los dos contiene datos de ninguna persona.

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

Las bases de PRE y PROD estan preparadas y listas para recibir conexiones,
pero **todavia no hay ningun despliegue** que las use: la API solo corre en
local y en el contenedor del CI. Los despliegues se configuran en el ciclo correspondiente, y esta
seccion se actualiza cuando eso cambie.

Los dos pasos manuales de cada ambiente —aplicar las migraciones y darle
contrasena a `vsd_app`— ya estan hechos. Se hicieron con `npm run db:preparar`,
que los encadena en el orden correcto: el rol lo crea una migracion, asi que
darle contrasena antes no funciona.

Las contrasenas viven en el gestor del equipo y **son distintas por ambiente**.
Si una se compromete, la otra no se va con ella. No pasan por Git ni por
ningun chat.

Queda anotar las dos URL en el gestor de secretos del proveedor de despliegue,
cuando ese despliegue exista.
