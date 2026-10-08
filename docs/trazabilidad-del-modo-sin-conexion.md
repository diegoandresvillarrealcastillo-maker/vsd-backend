# Trazabilidad del modo sin conexión

De cada requisito del entregable que toca el modo sin conexión (MR-09, MR-10,
HU_MF09_001 a HU_MF09_003 y los requisitos no funcionales de disponibilidad
offline e integridad), esta página dice **dónde se cumple, cómo se comprueba y
qué no se ha podido comprobar**.

Los requisitos funcionales (RF-031 a RF-035) y las reglas de negocio (RN-012 a
RN-015) se citan **por su código**, como hacen las historias; su texto está en el
entregable y aquí no se copia, para que no haya dos versiones.

## Cómo leer los estados

| Estado                    | Quiere decir                                                                                         |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Cumple**                | Está hecho y lo comprueban pruebas automáticas                                                       |
| **Cumple con diferencia** | Está hecho, pero se aparta de lo escrito; la diferencia tiene su divergencia y su ADR                |
| **Parcial**               | Falta una parte, dicha aquí                                                                          |
| **Sin comprobar**         | Está hecho, pero **no se ha podido probar en el entorno donde importa** (un iPhone, un Android, PRE) |

**«Pruebas automáticas» no es «probado en un teléfono».** Todo lo que dice «Cumple»
se comprueba en Vitest (jsdom, IndexedDB simulada y el motor contra un servidor
simulado idempotente) y, para las pantallas, a mano en un navegador de escritorio
con un arnés. **Ninguna fila se ha comprobado en Safari, en un iPhone ni en un
Android reales**: ver «Lo que ninguna prueba cubre».

Los archivos son de `vsd-frontend/src/` salvo que se diga otra cosa.

## Macrorrequisitos

| Código    | Pide                                                                         | Estado                | Dónde y cómo                                                                                                                                                                                                                                                                           |
| --------- | ---------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **MR-09** | Utilizar determinadas funciones previamente cargadas cuando no haya conexión | Cumple con diferencia | Actividades, diario, pendientes, panel, sendero, semáforo y VSD IA (a medias). Lo que exige conexión se ve deshabilitado y lo dice ([divergencia 6](divergencias-con-el-entregable.md), [ADR 0022](adr/0022-lo-que-exige-conexion-se-ve-deshabilitado-y-no-se-guarda-para-despues.md)) |
| **MR-10** | Enviar al servidor los datos pendientes cuando se recupere la conexión       | Cumple con diferencia | Cola y motor de envío (`sincronizacion/`). Se envía **con la aplicación abierta**, no con ella cerrada ([divergencia 8](divergencias-con-el-entregable.md), [ADR 0019](adr/0019-el-modo-sin-conexion-guarda-en-el-dispositivo-y-envia-una-cola-idempotente.md))                        |

## HU_MF09_001: Usar funciones habilitadas sin conexión

Requisitos RF-031, RF-032, RF-035. Caso de uso CU-013. Reglas RN-012, RN-015.

| #   | Criterio de aceptación                                                                           | Estado                | Dónde y cómo                                                                                                                                                                                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------ | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Perdí conexión, abro una función declarada offline: puedo usarla con la configuración disponible | Cumple                | El catálogo se lee con copia local (`sincronizacion/lecturas.ts`, `catalogoLocal.ts`); el diario (`diarioLocal.ts`), el semáforo (`semaforoLocal.ts`) y el panel (`panelLocal.ts`) también. Pruebas: los `*.spec.ts` de cada uno. Tickets SCRUM-138, 139 y 140                                                              |
| 2   | Guardo una operación: se almacena localmente con `operationId` único y estado pendiente          | Cumple                | `encolar()` de `sincronizacion/ciclo.ts` es el único camino a la cola; `cola.ts` crea la operación con un `operationId` que no cambia (es el `clientOperationId` de la API, SCRUM-133). El estado se ve en el indicador y su panel (SCRUM-137). ADR 0019, puntos 2 y 4                                                      |
| 3   | Abro una función no disponible offline: se informa la limitación **sin simular éxito**           | Cumple con diferencia | `componentes/ExigeConexion.tsx`: se ve deshabilitado con «Necesitas conexión para esto.» y lo escrito no se pierde. Perfil, acceso, descargar datos, borrar la cuenta, añadir un módulo y la bienvenida (SCRUM-142). Diferencia: la lista es más larga que la acordada ([divergencia 6](divergencias-con-el-entregable.md)) |
| 4   | Cierro sesión: las operaciones y datos privados dejan de estar disponibles en el dispositivo     | Cumple                | `olvidarLosDatosDeLaSesionActual` borra la base de la persona y la clave que la cifra; salir con cambios sin enviar pregunta primero (`componentes/ConfirmarSalida.tsx`); borrar la cuenta lo hace también. Prueba: `sesion/ProveedorDeSesion.spec.tsx`                                                                     |

**Seguridad y privacidad de la historia.**

| Pide                                | Estado           | Dónde y cómo                                                                                                                                                                                                                 |
| ----------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| «No guardar tokens en LocalStorage» | **No se cumple** | El token de la sesión de Supabase vive en `localStorage`. Divergencia deliberada: [divergencia 4](divergencias-con-el-entregable.md), [ADR 0021](adr/0021-la-sesion-de-supabase-vive-en-localstorage.md). **Hoy no hay CSP** |
| «Separar datos por usuario»         | Cumple           | Una base de IndexedDB por persona (`vsd-<id>`), cifrada con una clave no extraíble que vive en otra base (`almacenLocal.ts`, `cifrado.ts`, `llavero.ts`). ADR 0019, puntos 1 y 3                                             |
| «Limpiar al cerrar sesión»          | Cumple           | Ver el criterio 4. Si la sesión termina **sola** (caducó, se revocó) lo guardado se conserva, cerrado, a propósito: ADR 0019, punto 9                                                                                        |

## HU_MF09_002: Sincronizar operaciones pendientes

Requisitos RF-032, RF-033, RF-035. Caso de uso CU-014. Reglas RN-012, RN-013, RN-014.
Dependencia: «API idempotente».

| #   | Criterio de aceptación                                                                               | Estado                | Dónde y cómo                                                                                                                                                                                                                                               |
| --- | ---------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Vuelve la conexión y mi sesión es válida: se envían en orden compatible                              | Cumple con diferencia | `motor.ts` y `disparadores.ts` (al volver la red, al abrir, al volver a la pestaña y cada 30 s). El orden se respeta **sobre una misma cosa**. Diferencia: solo con la aplicación abierta ([divergencia 8](divergencias-con-el-entregable.md))             |
| 2   | Una respuesta se pierde, se reintenta con la misma clave: el servidor devuelve lo mismo sin duplicar | Cumple                | Backend: `clientOperationId` en resultados, diario y pendientes (`RegisterActivityResultUseCaseImpl.spec.ts`, `EscribirEnElDiarioUseCaseImpl.spec.ts`, `PendientesUseCaseImpl.spec.ts`). Frontend: `motor.spec.ts` contra un servidor simulado idempotente |
| 3   | Falla temporalmente: se programa el reintento con espera progresiva y estado visible                 | Cumple                | `cola.ts`: espera de 5 s, se duplica hasta 15 min, ±20 % de azar, respeta `Retry-After`; `clasificarFallo.ts`. El estado se ve en el panel de lo guardado. ADR 0019, punto 5                                                                               |
| 4   | Es inválida de forma permanente: queda «requiere atención» y no bloquea las demás independientes     | Cumple                | `clasificarFallo.ts` (clase «permanente») y `motor.ts`. El panel ofrece reintentar o descartar, y descartar pregunta primero (en el diario, además, ofrece copiar el texto)                                                                                |
| 5   | La sesión expiró: se detiene y solicita autenticación sin descartar la cola                          | Cumple                | `clasificarFallo.ts` (clase «sesión»): se detiene todo y la cola se conserva; el aviso lleva a entrar                                                                                                                                                      |

**Seguridad y privacidad de la historia.** «Verificar sesión, propiedad, esquema y
firma lógica del payload; no sincronizar tras cambio de usuario»: cada base es de una
persona y el motor comprueba, antes de cada envío, que la sesión sea la suya (ADR 0019,
punto 8). La API verifica sesión y propiedad como en cualquier otra ruta. Lo que no
existe es una «firma lógica» del `payload`: ver «Lo que ninguna prueba cubre».

## HU_MF09_003: Resolver conflictos de sincronización

Requisitos RF-034, RF-035. Caso de uso CU-014. Regla RN-014. Dependencia: HU_MF09_002.

| #   | Criterio de aceptación                                                                                 | Estado | Dónde y cómo                                                                                                                                                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Servidor y dispositivo modificaron lo mismo: se aplica la estrategia definida para ese tipo de entidad | Cumple | Un resultado no se edita. El diario **nunca se sobrescribe** (ADR 0009): una corrección que choca se guarda como anotación nueva marcada como copia (`ejecutores.ts`, `corregirUnaAnotacion`). Un pendiente lleva `version` y el choque se muestra (`409 VERSION_DESACTUALIZADA`)           |
| 2   | El conflicto requiere decisión: opción comprensible, sin perder ambas versiones antes de confirmar     | Cumple | Pendientes: `semaforo/choques.ts` y `resolver.ts` muestran lado a lado «En el otro dispositivo» y «Tu cambio»; **«Quedarme con lo del otro dispositivo»** o **«Aplicar mi cambio»**; primero se guarda lo nuevo y después se tira lo viejo. El diario no pide decidir: se conservan las dos |
| 3   | Registro inmutable con dos registros válidos: se conservan ambos cuando la regla de negocio lo permite | Cumple | Resultados y anotaciones tienen identificadores distintos; la copia del diario se guarda junto a la original                                                                                                                                                                                |
| 4   | Conflicto no reconocido: no sobrescribe y registra un error recuperable                                | Cumple | Un fallo que no se reconoce se trata como pasajero (`clasificarFallo.ts`), no se descarta y, tras 12 intentos, pide atención                                                                                                                                                                |

## Requisitos no funcionales

| Requisito                                                                                                                     | Estado                                       | Dónde y cómo                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Disponibilidad offline.** Las actividades previamente cargadas y los resultados pendientes deben poder guardarse localmente | Cumple                                       | Catálogo con copia local; resultados en la cola (`resultado.registrar`). **«Previamente cargadas» es literal**: la copia solo existe si se abrió la aplicación con conexión al menos una vez. Safari puede borrar lo guardado de un sitio que no se abre en una semana |
| **Integridad de datos.** La sincronización no debe crear resultados duplicados ni perder información pendiente                | Cumple, sin comprobar con dos equipos reales | Idempotencia por `clientOperationId` en la API y en el motor; nada se descarta por fallar; un almacén lleno se informa (`AlmacenLleno`) en vez de perder una operación. **No se ha probado con dos dispositivos reales a la vez**                                      |
| **Seguridad.** Los datos privados de una persona no son accesibles a otra                                                     | Cumple                                       | Una base por persona, cifrada; en la API, el aislamiento lo impone la base ([ADR 0010](adr/0010-aislamiento-en-la-base-de-datos.md)); las lecturas privadas responden `Cache-Control: no-store` y el service worker no guarda nada de la API                           |
| **Rendimiento.** Las operaciones principales responden en menos de 3 segundos, salvo la primera tras inactividad              | Sin comprobar                                | El arranque en frío de Render hace que la aplicación pueda decir «Sin conexión» hasta un minuto ([ambientes.md](ambientes.md)). **No se ha medido en PRE**                                                                                                             |

## Casos de uso

| Caso de uso                                 | Qué se comprobó                                                                                                                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CU-013** Registrar operación sin conexión | La precondición («función declarada offline, esquema cacheado») es la copia del catálogo; el flujo es `encolar()` → cola → motor. Alterno «pérdida de red» de CU-008: queda pendiente |
| **CU-014** Sincronizar y resolver           | Ver HU_MF09_002 y HU_MF09_003                                                                                                                                                         |

## Lo que ninguna prueba cubre

Dicho sin adornos, para que nadie lo dé por hecho:

- **Safari, iPhone y Android reales.** Nada se ha probado ahí. Safari no tiene
  Background Sync, borra el almacenamiento de sitios que no se usan en una semana y
  puede comportarse distinto con IndexedDB y el service worker.
- **La PWA instalada** en la pantalla de inicio, y que la petición de almacenamiento
  persistente (`storage.persist()`) se acepte: cada navegador la contesta como quiere.
- **Dos dispositivos reales con el mismo pendiente**: los choques se prueban con un
  servidor simulado, no con dos equipos.
- **PRE.** Que `sw.js` llegue sin caché larga desde Vercel, cuánto dura de verdad el
  arranque en frío visto desde la aplicación, y que el backend desplegado tenga las
  migraciones que necesita ([ambientes.md](ambientes.md)).
- **La renovación del token sin red** pasada la hora, con una sesión real de Supabase:
  se prueba con el cliente simulado.
- **La «firma lógica» del `payload`** de HU_MF09_002: no existe. La API valida esquema,
  sesión y propiedad, pero el `payload` no lleva una firma propia.
- **Un servidor de CORS real en PRE** para `ETag` e `If-None-Match`.
- **El texto del aviso de tratamiento de datos.** Debería decir que el equipo guarda una
  copia local y cifrada de actividades, diario y pendientes. Lo decide el equipo, y subir
  la versión vuelve a pedir el consentimiento a quien ya lo dio.

La [guía de prueba](guia-de-prueba-sin-conexion.md) dice cómo comprobar cada una de
estas cosas a mano, y tiene una columna para anotar el resultado.
