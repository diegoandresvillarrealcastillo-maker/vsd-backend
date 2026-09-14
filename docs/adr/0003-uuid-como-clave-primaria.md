# ADR 0003 — UUID como clave primaria en lugar de entero autoincremental

- **Estado:** Aceptada
- **Fecha:** 2026-09-14
- **Ciclo:** 0

## Contexto

El modelo entidad-relacion inicial del entregable academico usaba
enteros autoincrementales como clave primaria. Al revisarlo contra dos
requisitos del propio documento aparecieron dos problemas.

**Primero: el funcionamiento sin conexion.** La aplicacion debe permitir
completar actividades sin red y sincronizar despues. Si el
identificador lo asigna la base de datos, el dispositivo no puede
crear un registro mientras esta desconectado: no sabe que numero le
corresponde. Y no puede inventarlo, porque otro dispositivo estaria
inventando el mismo.

**Segundo: la enumeracion.** Con identificadores consecutivos, quien ve
`/resultados/41` puede probar con `/resultados/42`. La barrera contra
eso debe ser la autorizacion, pero un identificador consecutivo convierte
cualquier fallo de autorizacion en una fuga masiva en lugar de una fuga
puntual, porque permite recorrer toda la tabla.

## Decision

Todas las claves primarias son **UUID versión 4**, generadas por quien
crea el registro, sea el servidor o el dispositivo.

Ademas, la tabla `resultado` lleva un campo `id_operacion_cliente`, un
UUID con restriccion `UNIQUE`, generado por el dispositivo.

## Alternativas consideradas

### Entero autoincremental con un campo UUID adicional para sincronizar

Mantiene la clave primaria corta y anade el UUID solo para la
sincronizacion. Se descarto porque obliga a mantener dos
identificadores para la misma fila y a traducir entre ellos en cada
frontera del sistema.

### Identificadores ordenables tipo ULID

Resuelven lo mismo y ademas conservan el orden temporal, lo que mejora
el comportamiento de los indices. Se descarto porque PostgreSQL trae
UUID de forma nativa, Supabase Auth ya identifica a los usuarios con
UUID, y anadir un formato no estandar no se justifica en un proyecto de
este tamano.

## Consecuencias

### A favor

- El dispositivo crea registros sin conexion y sin coordinarse con nadie.
- Los identificadores no se pueden enumerar.
- Coinciden con el identificador que Supabase Auth asigna al usuario.
- `id_operacion_cliente` con `UNIQUE` hace la sincronizacion idempotente:
  si el dispositivo reintenta tras una caida de red, el segundo intento
  choca contra la restriccion y se descarta, en lugar de crear un
  resultado duplicado. Esto era un requisito del documento que el modelo
  original no podia cumplir.

### En contra

- Ocupan 16 bytes frente a 4, y los indices son mayores.
- Un UUID v4 es aleatorio, asi que las inserciones no van al final del
  indice y lo fragmentan mas. Al volumen esperado de este proyecto no es
  un problema medible.
- Son incomodos de leer y de citar en una conversacion.
