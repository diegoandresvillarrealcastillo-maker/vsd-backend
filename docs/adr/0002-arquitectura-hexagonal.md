# ADR 0002 — Arquitectura hexagonal en tres capas

- **Estado:** Aceptada
- **Fecha:** 2026-09-14
- **Ciclo:** 0

## Contexto

VSD Health debe funcionar sin conexion, sincronizar despues, y manejar
reglas sobre datos sensibles de salud. Esa logica tiene que poder
probarse sin levantar una base de datos ni un navegador, y tiene que
sobrevivir a un cambio de proveedor de persistencia.

## Decision

Se adopta **arquitectura hexagonal** (puertos y adaptadores) con **tres
carpetas raiz**, siguiendo el modelo del proyecto de referencia de
Daniel Espanadero acordado como base para este proyecto:

```
domain/          model, ports/in, ports/out
application/     usecases, services
infrastructure/  controllers, entities, repositories, adapters, config
```

Las dependencias apuntan siempre hacia el dominio, nunca al reves.

**Los puertos viven dentro de `domain/`**, no en una carpeta hermana. Un
puerto es parte del contrato del dominio.

## Alternativas consideradas

### Seis carpetas raiz, con `ports/` y `adapters/` al mismo nivel

Fue la propuesta inicial de este proyecto. Se descarto al revisar el
codigo del proyecto de referencia: al sacar los puertos fuera de
`domain/`, el dominio deja de declarar su propio contrato y aparece una
capa extra que no corresponde a ninguna frontera real.

### Arquitectura en capas clasica (controlador, servicio, repositorio)

Mas simple y mas conocida, pero el servicio termina dependiendo del ORM,
y con ello la logica de negocio queda atada a la base de datos. Para un
sistema con sincronizacion sin conexion eso es un problema serio: la
misma regla tiene que ejecutarse contra IndexedDB y contra PostgreSQL.

## Consecuencias

### A favor

- El dominio se prueba sin base de datos, sin red y sin framework.
- La misma logica de dominio se expresa igual en el frontend y en el
  backend, aunque los adaptadores sean distintos.
- Cambiar de proveedor de persistencia afecta a un adaptador.

### En contra

- Mas archivos y mas indireccion que una arquitectura en capas: para un
  caso de uso trivial hay que escribir un puerto y un adaptador.
- Exige disciplina. Un `import` de Prisma dentro de `domain/` rompe la
  arquitectura en silencio.

### Como se sostiene

La regla de dependencia se documenta en `docs/arquitectura.md` y se
verifica en la revision de cada Pull Request. Si la disciplina no basta,
se anadira una regla de ESLint que prohiba esos imports.

## Referencias

- Cockburn, A. (2005). _Hexagonal Architecture_.
- Espanadero, D. _arquitectura-hexagonal-java_.
