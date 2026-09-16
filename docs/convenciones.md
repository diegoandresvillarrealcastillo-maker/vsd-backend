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

| Tipo               | Convencion                               | Ejemplo                              |
| ------------------ | ---------------------------------------- | ------------------------------------ |
| Carpetas           | kebab-case                               | `support-resources/`                 |
| Modelos de dominio | PascalCase                               | `ActivityResult.ts`                  |
| Puertos            | PascalCase con sufijo                    | `ActivityRepositoryPort.ts`          |
| Casos de uso       | PascalCase con sufijo                    | `CreateActivityResultUseCase.ts`     |
| Adaptadores        | PascalCase con sufijo                    | `PrismaActivityRepositoryAdapter.ts` |
| Componentes React  | PascalCase                               | `ActivityCard.tsx`                   |
| Pruebas            | igual que el archivo, con sufijo `.spec` | `ActivityResult.spec.ts`             |

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

### Proteccion de ramas

Desde el 16/09/2026 las tres ramas de ambiente estan protegidas en GitHub, en
los dos repositorios. La prohibicion de tocar produccion dejo de depender de la
disciplina del equipo y la impone el servidor.

| Regla                         | `produccion` y `preproduccion` | `desarrollo`       |
| ----------------------------- | ------------------------------ | ------------------ |
| Push directo                  | prohibido                      | permitido          |
| Pull Request obligatorio      | si                             | no                 |
| Aprobaciones minimas          | 1                              | ninguna            |
| Checks de CI en verde         | los 3                          | calidad y secretos |
| Force push                    | prohibido                      | prohibido          |
| Borrar la rama                | prohibido                      | prohibido          |
| Alcanza a los administradores | si                             | no                 |

**Las reglas alcanzan tambien al dueno del repositorio.** Sin eso, la
proteccion seria una sugerencia: quien tiene permisos de administracion podria
saltarsela y la garantia dejaria de existir justo para quien mas facil lo tiene.

Como consecuencia, **Diego no puede fusionar sus propios Pull Requests**:
GitHub no admite que el autor apruebe su propia propuesta. La aprobacion la da
Samuel, que es lo que el equipo venia haciendo y ahora es obligatorio.

`desarrollo` no exige Pull Request a proposito. Es la rama de integracion y la
friccion ahi cuesta mas de lo que aporta; lo que si impide es reescribir el
historial. El flujo de trabajo sigue siendo por Pull Request, pero como
convencion y no como candado.

Los checks requeridos no exigen que la rama este al dia antes de fusionar. Con
tres ramas de ambiente y promociones en cadena, esa opcion obliga a
sincronizaciones constantes entre ramas que por diseno van desfasadas.

Verificado el 16/09/2026 con un intento deliberado de push directo a
`produccion`, que el servidor rechazo:

```
remote: error: GH006: Protected branch update failed for refs/heads/produccion.
remote: - Changes must be made through a pull request.
remote: - 3 of 3 required status checks are expected.
```

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
