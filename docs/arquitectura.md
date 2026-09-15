# Arquitectura

## Por que arquitectura hexagonal

VSD Health maneja informacion sobre el estado emocional y cognitivo de
personas. Esa logica —cuando un resultado es valido, que se puede
mostrar y a quien, cuando hay que remitir a ayuda profesional— es la
parte del sistema que mas importa y la que menos deberia cambiar porque
cambie la base de datos o el framework.

La arquitectura hexagonal, tambien llamada _puertos y adaptadores_
(Cockburn, 2005), separa esa logica de la tecnologia que la rodea. El
dominio no sabe que existe PostgreSQL, ni NestJS, ni IndexedDB.

Consecuencia practica: la logica de negocio se puede probar sin levantar
una base de datos, y cambiar de proveedor de persistencia afecta a un
adaptador, no al dominio.

## Referencia

La organizacion de carpetas sigue el modelo del proyecto de referencia
de Daniel Espanadero
(<https://github.com/DanielEspanadero/arquitectura-hexagonal-java>),
que es la base acordada para este proyecto.

Un detalle de ese modelo que conviene subrayar: **los puertos viven
dentro de `domain/`**, no en una carpeta hermana. Un puerto es parte del
contrato del dominio, no una capa aparte.

## Las tres capas

Esta es la estructura real de `vsd-backend`, no un ejemplo. El primer recorrido
vertical construido es el registro del resultado de una actividad.

```
src/
├── domain/                     <- el nucleo. No importa nada, ni de Node.
│   ├── model/
│   │   ├── ActivityResult.ts           entidad central
│   │   ├── Identifier.ts               UserId, ActivityId, ClientOperationId…
│   │   ├── OrientativeScore.ts         puntaje y su nivel orientativo
│   │   └── DomainError.ts              errores propios, sin codigos HTTP
│   └── ports/
│       ├── in/                 <- lo que el dominio ofrece
│       │   └── RegisterActivityResultUseCase.ts
│       └── out/                <- lo que el dominio necesita
│           └── ActivityResultRepositoryPort.ts
│
├── application/                <- orquesta el dominio
│   ├── usecases/
│   │   └── RegisterActivityResultUseCaseImpl.ts
│   └── services/
│       └── ActivityResultService.ts    fachada hacia la infraestructura
│
└── infrastructure/             <- lo unico que toca el mundo exterior
    ├── main.ts                         arranque del servidor
    ├── controllers/
    │   ├── ActivityResultController.ts adaptador de entrada HTTP
    │   ├── HealthController.ts
    │   └── dto/                        forma de lo que entra y sale por HTTP
    ├── filters/
    │   └── DomainExceptionFilter.ts    errores de dominio -> codigos HTTP
    ├── logging/
    │   └── RequestLoggingInterceptor.ts
    ├── repositories/
    │   └── InMemoryActivityResultRepository.ts
    └── config/
        ├── AppModule.ts                modulo raiz
        ├── ActivityResultModule.ts     cableado de dependencias
        ├── aplicacion.ts               protecciones y validacion
        ├── environment.ts              configuracion validada al arrancar
        └── openapi.ts                  contrato de la API
```

Todavia no hay `entities/`: entran en el Ciclo 4 con Prisma.

**Lo que demuestra este arbol:** NestJS aparece unicamente dentro de
`infrastructure/`. Al integrarlo en el Ciclo 3 no hubo que tocar una sola
linea de `domain/` ni de `application/`, que era la prueba real de que el
diseno del Ciclo 2 estaba bien. Ni el caso de uso ni el servicio llevan un
decorador del framework: se construyen con fabricas en
`ActivityResultModule`, y por eso siguen siendo ejecutables y probables sin
levantar nada. Ver [dominio.md](dominio.md) y
[ADR 0006](adr/0006-el-dominio-se-escribe-sin-framework.md).

## La regla de dependencia

Las dependencias apuntan **siempre hacia adentro**:

```
infrastructure  ──▶  application  ──▶  domain
```

Nunca al reves. En concreto:

- `domain/` no importa nada de `application/` ni de `infrastructure/`.
- `domain/` no importa nada de NestJS, Prisma, Express ni React.
- `application/` puede importar de `domain/`, nunca de `infrastructure/`.
- `infrastructure/` puede importar de las dos, y es la unica capa que
  conoce frameworks y bibliotecas externas.

Si un archivo de `domain/` necesita importar Prisma, el diseno esta mal:
lo que hace falta es un puerto de salida.

### La regla la impone una herramienta, no la disciplina

Esto no es un acuerdo escrito que haya que recordar: `eslint.config.mjs`
contiene una regla que hace **fallar la construccion** si alguien cruza una
frontera. El mensaje de error no se limita a prohibir, explica que hacer en su
lugar.

La comprobacion corre tambien en el CI, asi que no se puede saltar. Sin ella,
la arquitectura se erosiona sin que nadie lo note: alguien importa Prisma en el
dominio "solo esta vez" y meses despues el nucleo ya no se puede probar sin
base de datos.

Las pruebas del dominio son la excepcion en un solo punto: pueden importar el
ejecutor de pruebas, porque no forman parte de lo que se despliega. Las
fronteras entre capas si les aplican igual.

## Como se aplica al frontend

`vsd-frontend` usa la misma division. Cambia lo que hay en
`infrastructure/`:

- `controllers/` pasa a ser la capa de presentacion (componentes React);
- los adaptadores de persistencia hablan con IndexedDB a traves de Dexie
  en lugar de con PostgreSQL a traves de Prisma;
- se anade un adaptador de API que consume `vsd-backend`.

El dominio compartido —que es un resultado valido, que significa cada
estado— se expresa igual en los dos lados.

## Donde vive la autorizacion

La autorizacion es una regla de negocio, no un detalle de transporte.
Vive en la capa de `application/`, no en el controlador y no en el
frontend. Ver [seguridad.md](seguridad.md).

## Contrato entre los dos repositorios

Al estar el frontend y el backend en repositorios separados, el riesgo
principal es que sus tipos se desincronicen sin que nadie lo note.

Mitigacion acordada: NestJS genera el contrato OpenAPI, y el frontend
deriva sus tipos de TypeScript a partir de ese contrato. Una
comprobacion del CI detecta la divergencia. Se implementa en el Ciclo 4.
Ver [ADR 0001](adr/0001-dos-repositorios-separados.md).

## Configuracion y ambientes

La arquitectura resuelve donde vive cada responsabilidad. Falta decir de
donde salen los valores que cambian entre un entorno y otro.

VSD Health no escribe en el codigo ninguna URL, credencial ni puerto.
Todo eso entra como variable de entorno, de modo que el mismo codigo
corre en los tres ambientes cambiando solo la configuracion. Ese
principio, junto con la paridad entre entornos, viene de los _doce
factores_, y es lo que sostiene la separacion DEV, PRE y PROD.

Encaja de forma natural con la regla de dependencia: la configuracion es
un detalle de infraestructura, asi que se lee en `infrastructure/config/`
y se entrega hacia adentro. El dominio nunca consulta una variable de
entorno.

Ver [ambientes.md](ambientes.md).

## Referencias

- Cockburn, A. (2005). _Hexagonal Architecture_.
  <https://alistair.cockburn.us/hexagonal-architecture/>
- Espanadero, D. _arquitectura-hexagonal-java_.
  <https://github.com/DanielEspanadero/arquitectura-hexagonal-java>
- Wiggins, A. (2017). _The Twelve-Factor App_.
  <https://12factor.net/es/>
