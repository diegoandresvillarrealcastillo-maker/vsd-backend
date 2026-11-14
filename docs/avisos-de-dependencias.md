# Avisos de dependencias

Registro de los avisos de seguridad que SonarQube muestra sobre las dependencias del backend (SCRUM-298 y SCRUM-299). Aqui queda por escrito que se hizo, que sigue abierto, por que, y que se vigila. Ultima revision: 28/10/2026. El frontend lleva el suyo (`vsd-frontend/docs/avisos-de-dependencias.md`).

## Como leerlo

- **Ningun aviso se oculta ni se rebaja.** Lo que no tiene version corregida se documenta aqui; no se marca como resuelto ni como seguro.
- **SonarQube y `npm audit` no dicen lo mismo, y ninguno reemplaza al otro.** `npm audit` solo ve los avisos que GitHub ya reviso y que traen un rango de versiones. Los de `picomatch` y `uri-js` estan publicados sin revisar y sin rango, asi que `npm audit` da 0 avisos y `scripts/revisar-dependencias.mjs` (que se apoya en `npm audit --omit=dev`) tampoco los vigila. Por eso se llevan a mano en este archivo.
- Un aviso solo se da por resuelto despues de un nuevo analisis de SonarQube sobre `desarrollo` que ya no lo muestre.
- **Las gravedades se muestran de las dos fuentes**, la de GitHub y el CVSS que muestra SonarQube, porque pueden diferir (SonarQube puntua mas alto en algunos avisos). Ninguna es una gravedad nuestra y no se rebaja ninguna: la referencia es la mas alta.

## Los cinco avisos de SonarQube

| Paquete     | Version | Aviso                                                                                                             | Estado                                                                                 |
| ----------- | ------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `picomatch` | 4.0.7   | GHSA-fc5q-39xc-vjpf (CVE-2026-112366)                                                                             | **Abierto**: sin version corregida                                                     |
| `picomatch` | 4.0.5   | El mismo aviso, en otra copia instalada                                                                           | La copia ya no existe: se unifico con la 4.0.7. **El aviso sigue abierto en la 4.0.7** |
| `uri-js`    | 4.4.1   | GHSA-ffpj-9hx9-929p (CVE-2026-93690), GHSA-7g43-p94j-qr58 (CVE-2026-93751), GHSA-cw9r-3wqp-32hm (CVE-2026-103387) | **Abierto**: sin version corregida                                                     |

Son tres avisos distintos en `uri-js` y uno solo en `picomatch`, repetido por tener dos copias instaladas: de ahi los cinco de SonarQube.

## Lo que se cambio: una sola copia de picomatch

Antes habia **tres copias** de `picomatch`: la 4.0.7 en la raiz y dos copias de la 4.0.5, una dentro de cada `@angular-devkit/core` (el que trae `@nestjs/cli` y el que trae `@nestjs/schematics`). Las versiones 22.1.x de `@angular-devkit/core` fijaban `picomatch` en `4.0.5` exacta; desde la 22.2.3 fijan `4.0.7`.

Se actualizaron, dentro de sus rangos (`package.json` no cambia, solo el lockfile):

- `@nestjs/cli` 12.0.1 → 12.0.11 (con `@angular-devkit/*` 22.1.8 → 22.2.3, y sus dependencias de consola `@inquirer/*`).
- `@nestjs/schematics` 12.0.0 → 12.0.12 (con `@angular-devkit/*` 22.1.5 → 22.2.4).

Resultado: **una sola copia** (4.0.7), compartida por todas las herramientas. **Esto no corrige el aviso**: la 4.0.7 tambien esta afectada. Lo que cambia es que desaparece el aviso de la copia 4.0.5 porque esa copia ya no existe, y que cuando salga la correccion bastara un `npm update picomatch` para cubrir todas las cadenas.

`@nestjs/schematics` no es dependencia directa nuestra, y con Node 24.14 npm no lo sube por si solo: las versiones nuevas piden Node `^24.15` y npm descarta las que no cuadran con el Node de quien instala (lo mismo que ya pedia `@angular-devkit/core` 22.1.8). Si en un equipo con Node mas viejo `npm install` lo baja, se vuelve a ver la copia 4.0.5.

## Corregido en el repositorio: qs (SCRUM-299)

Despues del analisis de SonarQube sobre los cambios de SCRUM-298 aparecio un aviso nuevo, este **de ejecucion**: `qs` 6.16.1, CVE-2026-110910 (CWE-116, codificacion de salida), CVSS 6.3 (media) en SonarQube. Entra por `express` y `body-parser` (y por `superagent`, de pruebas).

- **Cambio:** `qs` 6.16.1 → 6.17.1, dentro de los rangos de sus padres (`express ^6.14.0`, `body-parser ^6.16.1`, `superagent ^6.14.1`); solo cambia el lockfile y `npm ls qs` muestra una sola copia.
- **Lo que no se sabe:** el aviso aparecio pocos minutos antes de revisarlo y GitHub, OSV y NVD todavia no traian su detalle, asi que **no esta confirmado cual version lo corrige**. Se subio a la ultima (6.17.1), que incluye todo lo de la 6.16.2 y la 6.17.0, y OSV no reporta avisos para ella. Solo el siguiente analisis de SonarQube lo confirma.
- **Exposicion:** por el tipo de debilidad (codificacion de salida) el aviso apunta a `qs.stringify`; Express y body-parser usan `qs` solo para leer (`parse`), y nada de `src/` lo importa. Es una deduccion, no un dato del aviso.
- **Compatibilidad:** de la 6.16.1 a la 6.17.1 los cambios de `parse` son de borde (una clave `__proto__` propia se copia como dato, los puntos codificados en porcentaje se leen sin distinguir mayusculas, el limite de arreglos con comas, claves de prototipo entre corchetes). La API recibe JSON y su suite, con las pruebas de integracion contra una base local, pasa completa.

## Alcance real: que llega a la imagen y que no

- **La imagen que se despliega no instala `picomatch` ni `uri-js`** (`qs`, en cambio, si es de produccion). El `Dockerfile` hace `npm ci --omit=dev --omit=optional` en la etapa de dependencias y es lo que se copia a la imagen final; ahi `npm ls --omit=dev --omit=optional picomatch uri-js` da vacio. La etapa de compilacion los tiene, pero se descarta. El codigo compilado (`dist/`) no los contiene ni los importa (ningun archivo de `src/` ni `scripts/` los usa directamente).
- **Donde si corren:** en el equipo de quien desarrolla y en el CI. `eslint` (`uri-js`, por `ajv@6`), `vitest`, `vite` y `tinyglobby` (`picomatch`, para encontrar los archivos de prueba y de cobertura), `lint-staged` (`picomatch`, para elegir los archivos del commit) y `@nestjs/cli` (solo `nest start --watch`; `npm run build` usa `tsc`).
- **Dato aparte:** `ajv@8` (el de `@prisma/streams-local`, que si es de produccion, y el de `@angular-devkit`) no usa `uri-js`.

## Siguen abiertos: sin version corregida

### picomatch 4.0.7 — GHSA-fc5q-39xc-vjpf (CVE-2026-112366)

- **Que es.** Denegacion de servicio por expresion regular (ReDoS): patrones con un extglob repetido de una sola rama, como `+(*)` o `+(*a)`, producen un retroceso exponencial sobre cadenas cortas y bloquean el ciclo de eventos de Node.js. Gravedad: **alta** en GitHub (CVSS 3.1: 7.5; 4.0: 8.7) y CVSS 8.7 (alta) en SonarQube. Esta sin revisar en GitHub y sin rango de versiones. Afecta hasta la 4.0.7, la ultima publicada; la correccion propuesta (`micromatch/picomatch#194`) sigue abierta y no hay version nueva.
- **Por que no se corrige.** No hay version corregida en ninguna linea (el propio reporte menciona tambien la 2.3.1 como afectada), asi que forzar otra version no ayuda. No se puede quitar: es la base de la busqueda de archivos de Vitest, Vite y `lint-staged`.
- **Condicion de explotacion.** Que alguien le entregue a picomatch un patron con esa forma. Los patrones que usamos son literales de nuestra configuracion (`src/**/*.spec.ts`, `scripts/**/*.spec.mjs`, `src/**/*.ts`, `src/infrastructure/config/**`, los de `lint-staged` y los de ESLint) y ninguno usa extglob; buscamos `+(`, `*(`, `@(`, `!(` y `?(` en los archivos de configuracion y no hay. La API no recibe patrones de nadie: no importa `picomatch` y no esta en la imagen.
- **Mitigacion.** Revisar en cada Pull Request que ningun patron nuevo de configuracion (Vitest, ESLint, `lint-staged`, GitHub Actions) use extglob repetido.
- **Riesgo pendiente.** Sigue abierto; la gravedad publicada es alta, aunque aqui no hay camino por el que llegue un patron externo ni nada de esto corre en produccion.

### uri-js 4.4.1 — tres avisos

| Aviso                                 | Que es                                                                                                                                          | GitHub          | SonarQube (CVSS) |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------- |
| GHSA-ffpj-9hx9-929p (CVE-2026-93690)  | `removeDotSegments` entra en un bucle infinito si un segmento de la ruta empieza con separadores Unicode de linea o parrafo (con IRI activado). | Alta (CVSS 7.5) | 7.5 (alta)       |
| GHSA-7g43-p94j-qr58 (CVE-2026-93751)  | `pctDecChars` decodifica secuencias UTF-8 invalidas o demasiado largas como caracteres ASCII de control: puede colar `../` o saltos de linea.   | Media           | 6.5 (media)      |
| GHSA-cw9r-3wqp-32hm (CVE-2026-103387) | `URI.parse` del manejador `mailto` lanza una excepcion que nadie captura.                                                                       | Baja            | 4.3 (media)      |

- **Estado.** Los tres estan sin revisar en GitHub y afectan hasta la 4.4.1, la ultima (de junio de 2023); el proyecto no ha respondido a los reportes (`garycourt/uri-js#103`, `#105`, `#106`).
- **Quien lo trae.** `eslint` → `ajv@6` → `uri-js`. Solo desarrollo: el lint.
- **Por que no se corrige.** ESLint `10.13.0` (la ultima) sigue pidiendo `ajv ^6.14.0`, asi que subirlo no cambia nada. Forzar `ajv@8` no funciona: ESLint carga `ajv/lib/refs/json-schema-draft-04.json` y usa la opcion `schemaId: 'auto'`, que solo existen en `ajv@6`. Reemplazar `uri-js` con un override pondria una combinacion que ni `ajv@6` ni ESLint soportan bajo el control de calidad del repositorio. No se hace.
- **Condicion de explotacion.** Que `ajv` procese una direccion controlada por un atacante. Aqui solo resuelve los `$id` y `$ref` de los esquemas JSON de ESLint, de sus reglas y de nuestra configuracion; ninguno viene de usuarios ni de la red. La API no usa `uri-js` y la imagen no lo instala.
- **Riesgo pendiente.** Sigue abierto; el paquete esta sin mantenimiento, asi que lo mas probable es que se resuelva cuando ESLint deje `ajv@6`.

## Como seguirlos

Revisar este archivo cada mes y cuando Dependabot proponga subir `eslint`, `@nestjs/cli`, `vitest`, `lint-staged` o `picomatch`. Cuando salga una version corregida: `npm update <paquete>`, mover la fila a corregida y esperar al analisis de SonarQube para darla por resuelta.

```bash
npm ls picomatch uri-js                                      # quien trae cada uno y en que version
npm ls --omit=dev --omit=optional picomatch uri-js           # lo que instala la imagen: debe dar vacio
npm audit --omit=dev                                         # lo que ve npm; debe dar 0
npm view picomatch dist-tags.latest                          # si ya hay version nueva
```
