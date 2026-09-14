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

| | |
|---|---|
| **Institucion** | Universidad de Cundinamarca |
| **Programa** | Ingenieria de Software |
| **Grupo** | 501M |
| **Docente** | Luiferney Ortiz Parra |
| **Equipo** | Diego Andres Villarreal Castillo · Samuel Villa Perez |

---

## Los dos repositorios

| Repositorio | Contenido |
|---|---|
| **vsd-backend** (este) | API en NestJS, base de datos y documentacion tecnica del proyecto. |
| [vsd-frontend](https://github.com/diegoandresvillarrealcastillo-maker/vsd-frontend) | PWA en React + TypeScript. |

---

## Documentacion

Toda la documentacion tecnica del proyecto vive en [docs/](docs/):

| Documento | Contenido |
|---|---|
| [Arquitectura](docs/arquitectura.md) | Arquitectura hexagonal en tres capas y como se organiza el codigo |
| [Convenciones](docs/convenciones.md) | Nombres, estructura de carpetas y estilo |
| [Seguridad](docs/seguridad.md) | Secretos, aislamiento entre usuarios y datos sensibles |
| [Decisiones de arquitectura](docs/adr/) | Por que el proyecto es como es |

---

## Estado actual

Este repositorio contiene, por ahora, **solo la base de gestion del
proyecto**: estructura de ramas, configuracion, integracion continua y
documentacion.

La API todavia no existe. Se incorpora por ciclos:

| Ciclo | Que se incorpora | Estado |
|---|---|---|
| 1 | Repositorio, ramas, CI inicial, documentacion | En curso |
| 4 | Arquitectura hexagonal y contratos de API | Pendiente |
| 5 | Prisma + PostgreSQL + Supabase | Pendiente |
| 6 | API NestJS funcional | Pendiente |

No se documentan aqui comandos de instalacion o ejecucion porque
todavia no hay nada que instalar ni ejecutar. Esta seccion se completa
en el Ciclo 6.

---

## Stack previsto

- **NestJS** + **TypeScript**
- **Prisma** como ORM
- **PostgreSQL** alojado en **Supabase**
- **Supabase Auth** para la identidad, sin contrasenas
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
`DATABASE_URL` pasa por el pooler (puerto 6543) y la usa la aplicacion;
`DIRECT_URL` es la conexion directa (puerto 5432) y solo la usan las
migraciones de Prisma.

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
