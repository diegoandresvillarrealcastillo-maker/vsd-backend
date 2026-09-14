# Convenciones

## Idioma

- **Codigo** (variables, funciones, clases, carpetas): ingles.
- **Comentarios y documentacion**: espanol.
- **Textos visibles al usuario**: espanol.
- **Mensajes de commit**: espanol.

El codigo va en ingles porque el vocabulario de los frameworks lo esta,
y mezclar los dos idiomas en la misma linea produce nombres como
`getUsuarioById`. La documentacion va en espanol porque su publico es el
equipo y el docente.

## Nombres de archivos

| Tipo | Convencion | Ejemplo |
|---|---|---|
| Carpetas | kebab-case | `support-resources/` |
| Modelos de dominio | PascalCase | `ActivityResult.ts` |
| Puertos | PascalCase con sufijo | `ActivityRepositoryPort.ts` |
| Casos de uso | PascalCase con sufijo | `CreateActivityResultUseCase.ts` |
| Adaptadores | PascalCase con sufijo | `PrismaActivityRepositoryAdapter.ts` |
| Componentes React | PascalCase | `ActivityCard.tsx` |
| Pruebas | igual que el archivo, con sufijo `.spec` | `ActivityResult.spec.ts` |

## Nombres en base de datos

- Tablas y columnas en `snake_case`, en espanol, siguiendo el modelo
  entidad-relacion del entregable academico: `usuario`, `actividad`,
  `resultado`, `categoria`, `recurso_apoyo`.
- Claves primarias: `id`, de tipo UUID.
  Ver [ADR 0003](adr/0003-uuid-como-clave-primaria.md).
- Claves foraneas: `id_<tabla>`. Ejemplo: `id_usuario`.
- Marcas de tiempo: `creado_en`, `actualizado_en`.

El codigo mantiene los nombres en ingles y Prisma hace la
correspondencia con `@map` y `@@map`. Asi la base de datos sigue
coincidiendo con el modelo del documento academico sin arrastrar el
espanol al codigo.

## Estructura de carpetas

Se organiza **por capa y luego por concepto**, siguiendo el proyecto de
referencia. Ver [arquitectura.md](arquitectura.md).

## Git

Ramas, commits y Pull Requests: ver `CONTRIBUTING.md` en la raiz del
repositorio.

## Pruebas

- Las pruebas viven junto al archivo que prueban.
- `domain/` y `application/` deben alcanzar al menos **80 %** de
  cobertura. Son las capas donde vive la logica; el resto es cableado.
- Toda regla de autorizacion necesita una prueba **en negativo**: no
  basta comprobar que el dueno accede a su dato, hay que comprobar que
  otro usuario recibe un rechazo.

## Comentarios

Se comenta **el porque**, no el que. El codigo ya dice lo que hace.

```ts
// Mal: incrementa el contador en uno
contador += 1;

// Bien: el pooler de Supabase cierra las conexiones inactivas al minuto,
// asi que se reintenta una vez antes de propagar el error.
```
