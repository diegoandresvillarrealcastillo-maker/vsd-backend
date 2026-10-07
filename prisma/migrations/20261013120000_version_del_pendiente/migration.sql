-- ---------------------------------------------------------------------------
-- La version de cada pendiente (SCRUM-134)
--
-- Sin conexion, dos dispositivos pueden editar el mismo pendiente y el ultimo en
-- sincronizar pisaba al otro sin aviso. El diario ya lo evita con una version
-- (ADR 0009); aqui se hace lo mismo con los pendientes.
--
-- La version arranca en 1 y sube en uno con cada edicion. La API compara la que
-- trae el dispositivo con la de la fila **dentro del propio UPDATE**
-- (`WHERE version = <la que leyo>`), de modo que dos ediciones que lleguen a la
-- vez no se pisan: una gana y la otra recibe un conflicto.
--
-- Es aditiva y no bloquea nada: una columna con valor por defecto constante. Los
-- pendientes que ya existen quedan en 1, que es lo cierto (todavia nadie los ha
-- editado desde que existe el contador). No cambia ninguna politica de seguridad:
-- la fila sigue siendo de su dueno y de nadie mas.
--
-- Durante el despliegue, un dispositivo que todavia no manda la version sigue
-- funcionando como antes: sin version, la API no comprueba conflictos.
-- ---------------------------------------------------------------------------

ALTER TABLE "pendiente" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

COMMENT ON COLUMN "pendiente"."version" IS
  'Empieza en 1 y sube con cada edicion. Sirve para detectar que otro dispositivo cambio el pendiente entretanto (SCRUM-134).';
