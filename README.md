# VSD Health — Backend

API y persistencia de **VSD Health**, una herramienta de acompanamiento
del bienestar emocional y cognitivo.

> ### Aviso importante
>
> **VSD Health no diagnostica, no formula medicamentos y no reemplaza la
> atencion de psicologos, medicos ni psiquiatras.**
>
> La informacion que ofrece es orientativa y de apoyo. Ante cualquier
> senal de alerta, la aplicacion remite a recursos de ayuda profesional.

---

## Contexto academico

|                 |                                                       |
| --------------- | ----------------------------------------------------- |
| **Institucion** | Universidad de Cundinamarca                           |
| **Programa**    | Ingenieria de Software                                |
| **Grupo**       | 501M                                                  |
| **Docente**     | Luiferney Ortiz Parra                                 |
| **Equipo**      | Diego Andres Villarreal Castillo · Samuel Villa Perez |

---

## Los dos repositorios

| Repositorio                                                                         | Contenido                                                          |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **vsd-backend** (este)                                                              | API en NestJS, base de datos y documentacion tecnica del proyecto. |
| [vsd-frontend](https://github.com/diegoandresvillarrealcastillo-maker/vsd-frontend) | PWA en React + TypeScript.                                         |

---

## Documentacion

Toda la documentacion tecnica del proyecto vive en [docs/](docs/):

| Documento                                              | Contenido                                                         |
| ------------------------------------------------------ | ----------------------------------------------------------------- |
| [Arquitectura](docs/arquitectura.md)                   | Arquitectura hexagonal en tres capas y como se organiza el codigo |
| [Ambientes](docs/ambientes.md)                         | Los tres ambientes DEV, PRE y PROD y su configuracion             |
| [Dominio](docs/dominio.md)                             | Las reglas de negocio que ya estan construidas                    |
| [Convenciones](docs/convenciones.md)                   | Nombres, estructura de carpetas y estilo                          |
| [Seguridad](docs/seguridad.md)                         | Secretos, aislamiento entre usuarios y datos sensibles            |
| [Divergencias](docs/divergencias-con-el-entregable.md) | Donde el sistema se aparta del entregable academico, y por que    |
| [Textos del asistente](docs/textos-del-asistente.md)   | Todo lo que VSD IA le puede decir a una persona, para revisarlo   |
| [Decisiones de arquitectura](docs/adr/)                | Por que el proyecto es como es                                    |

---

## Estado actual

La API ya funciona y **guarda en PostgreSQL**. Si no hay `DATABASE_URL` cae al
adaptador en memoria, que sigue existiendo para desarrollo y pruebas; en
preproduccion y produccion la base de datos es obligatoria y sin ella el
servicio no arranca.

La API ya sabe **quien llama**. Cada peticion trae el token que Supabase
entrega al iniciar sesion, y la API lo verifica contra las claves publicas del
proyecto antes de atender nada. De ahi sale la identidad que reciben tanto el
caso de uso como las politicas de la base; el cuerpo de la peticion ya no puede
decir de quien es un dato.
Ver [ADR 0013](docs/adr/0013-la-api-verifica-el-token-contra-el-jwks.md).

| Ciclo | Que se incorporo                                      | Estado    |
| ----- | ----------------------------------------------------- | --------- |
| 1     | Repositorio, ramas, CI, documentacion                 | Terminado |
| 2     | Dominio y aplicacion en TypeScript, sin framework     | Terminado |
| 3     | API NestJS: endpoints, validacion, seguridad, OpenAPI | Terminado |
| 4     | Prisma + PostgreSQL + Supabase, aislamiento por RLS   | Terminado |
| 5     | Usuarios y autenticacion                              | En curso  |

## Como ejecutarlo en local

Necesitas Node 24 y Git. Cuatro pasos:

```bash
git clone https://github.com/diegoandresvillarrealcastillo-maker/vsd-backend.git
cd vsd-backend
npm install
```

Crea tu archivo de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

Para desarrollo local los valores por defecto sirven tal cual. Si dejas
`DATABASE_URL` vacia, la API arranca guardando en memoria; para usar PostgreSQL,
levanta la base con uno de los comandos de mas abajo y apunta ahi las dos URL.

Arranca la API:

```bash
npm run start:dev
```

Ya puedes abrir:

- **http://localhost:3000/health** — comprueba que responde
- **http://localhost:3000/api/docs** — documentacion navegable de la API

### VSD IA

El asistente responde en `POST /api/asistente`. Es la primera version: **reglas,
sin modelo de lenguaje**, sin costo y sin llamadas a ninguna API.

Si el texto trae una expresion de riesgo, la respuesta incluye siempre las
lineas de atencion, y esa decision se toma antes de mirar nada mas. No se delega
a un modelo, ni ahora ni cuando exista el adaptador de Fase 2: ver
[ADR 0011](docs/adr/0011-la-deteccion-de-riesgo-es-por-reglas.md).

### Probar la API sin salir del editor

El archivo [`peticiones.http`](peticiones.http) trae ocho ejemplos listos:
registrar un resultado, ver la idempotencia en accion, y los casos que deben
fallar. Instala la extension **REST Client** y aparecera un boton _Send
Request_ encima de cada bloque.

### Depurar

Pulsa **F5** y elige _Depurar la API_. Compila, arranca y los puntos de
interrupcion funcionan sobre los archivos `.ts`.

### Comandos disponibles

| Comando                    | Que hace                                       |
| -------------------------- | ---------------------------------------------- |
| `npm run start:dev`        | Arranca la API y recarga al guardar            |
| `npm test`                 | Ejecuta las pruebas                            |
| `npm run test:watch`       | Pruebas en modo continuo                       |
| `npm run test:coverage`    | Pruebas con informe de cobertura               |
| `npm run test:integracion` | Solo las pruebas contra PostgreSQL real        |
| `npm run lint`             | Estilo y fronteras de la arquitectura          |
| `npm run typecheck`        | Revisa los tipos sin compilar                  |
| `npm run build`            | Compila a `dist/`                              |
| `npm run openapi`          | Genera `openapi.json` sin levantar el servidor |

### Base de datos en local

Hay dos formas de levantarla. Las dos dan el mismo PostgreSQL 17 en el mismo
puerto; usa la que te funcione.

| Comando                | Que hace                                       |
| ---------------------- | ---------------------------------------------- |
| `npm run db:arriba`    | Levanta las bases con Docker                   |
| `npm run db:local`     | Levanta PostgreSQL **sin Docker ni admin**     |
| `npm run db:aplicar`   | Aplica las migraciones                         |
| `npm run db:estado`    | Dice si falta alguna migracion                 |
| `npm run db:ver`       | Abre Prisma Studio para mirar los datos        |
| `npm run db:revisar`   | Dice que hay **de verdad** en una base         |
| `npm run db:rol`       | Le da contrasena a `vsd_app` en un ambiente    |
| `npm run db:preparar`  | Deja un ambiente listo: migra, rol y comprueba |
| `npm run db:abajo`     | Para los contenedores                          |
| `npm run db:reiniciar` | Los para y **borra los datos**                 |

Con Docker se levantan dos bases: la de desarrollo en el **5432** y otra para
pruebas en el **5433**, esta sin volumen para que cada ejecucion parta de cero.

`npm run db:local` es la alternativa para maquinas sin permisos de
administrador: descarga los binarios oficiales de PostgreSQL y los ejecuta como
un proceso normal. Es PostgreSQL de verdad, no una simulacion.

### Las pruebas que necesitan la base

Los archivos `*.integracion.spec.ts` hablan con PostgreSQL de verdad. **Si no
hay `DATABASE_URL`, se saltan** y el resto de la suite corre igual: obligar a
levantar una base para cambiar una linea de dominio termina con alguien
comentando las pruebas.

Con la base levantada corren solas, y el CI las ejecuta siempre contra un
contenedor propio. Ahi no pueden saltarse: si faltara la base, fallan diciendolo
en vez de pasar sin comprobar nada.

Estas pruebas se conectan con el rol `vsd_app`, no con el dueno de las tablas,
porque el dueno esta exento de las politicas de aislamiento. La primera vez le
dan una contrasena local por su cuenta; no hay nada que preparar a mano.

### Si algo no arranca

El servicio **no arranca** si falta una variable de entorno o tiene un valor
invalido. Es a proposito: el mensaje te dice cual es y que se esperaba. Es
preferible eso a arrancar a medias y fallar mas tarde con un error confuso.

**`docker` no se reconoce como comando.** Si instalaste Docker Desktop sin
permisos de administrador queda en tu perfil y no en el PATH. Para dejarlo
disponible de forma permanente, en PowerShell:

```powershell
[Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path','User') + ";$env:LOCALAPPDATA\Programs\DockerDesktop
esourcesin", 'User')
```

Hay que cerrar y abrir la terminal despues. Los comandos `npm run db:*` no lo
necesitan: npm resuelve la ruta por su cuenta.

**Docker Desktop se queda en "starting".** Pasa en la primera ejecucion. Se
comprueba con `docker desktop status` y se resuelve cerrando sus procesos y
volviendo a abrirlo:

```powershell
Get-CimInstance Win32_Process | Where-Object { $_.ExecutablePath -like "$env:LOCALAPPDATA\Programs\DockerDesktop*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
Start-Process "$env:LOCALAPPDATA\Programs\DockerDesktop\Docker Desktop.exe"
```

No se pierde nada: los contenedores y sus datos viven en volumenes aparte.

## Stack previsto

- **NestJS** + **TypeScript**
- **Prisma** como ORM
- **PostgreSQL** alojado en **Supabase**
- **Supabase Auth** para la identidad: correo y contrasena, y Google como
  opcion. VSD Health **no almacena contrasenas**; las guarda Supabase
- Contrato de API publicado como OpenAPI y consumido por el frontend
- Despliegue en **Render**

---

## Requisitos previos

- **Node.js 24** (la version exacta esta fijada en [.nvmrc](.nvmrc))
- **Git**
- Acceso al proyecto de Supabase del equipo
- Una cuenta con acceso al proyecto en Jira

---

## Variables de entorno

Copiar [.env.example](.env.example) como `.env` y completar los valores.

Ninguno de esos valores puede pasar al frontend. En particular,
`SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_JWT_SECRET` viven unicamente
aqui. Ver [docs/seguridad.md](docs/seguridad.md).

Hay dos cadenas de conexion distintas y no son intercambiables:
`DATABASE_URL` la usa la aplicacion; `DIRECT_URL` solo la usan las
migraciones de Prisma. Contra Supabase, ademas, ninguna de las dos apunta a
la direccion directa del proyecto, que solo resuelve por IPv6:
[docs/ambientes.md](docs/ambientes.md) explica cual va a cada puerto y por que.

---

## Como se trabaja

El flujo de ramas, la convencion de commits y las reglas de seguridad
estan en [CONTRIBUTING.md](CONTRIBUTING.md). Resumen:

```
feature/SCRUM-42-...  ->  desarrollo  ->  preproduccion  ->  produccion
```

- Nunca se trabaja directamente sobre `produccion`.
- Todo commit sigue Conventional Commits y cita su ticket `SCRUM-N`.
- Todo cambio entra por Pull Request con al menos una aprobacion.

---

## Licencia

Proyecto academico. Uso restringido al ambito del curso.
