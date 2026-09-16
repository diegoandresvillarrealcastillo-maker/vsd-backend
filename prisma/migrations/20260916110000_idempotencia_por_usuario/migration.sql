-- La clave de idempotencia pasa a ser unica por persona, no en toda la tabla.
--
-- Con un unico global, enviar el identificador de operacion de otra persona
-- daba una respuesta distinta a enviar uno inexistente: el primero se
-- rechazaba y el segundo creaba el resultado. Esa diferencia, por si sola,
-- permite averiguar que operaciones ajenas existen sin ver ni un dato.
--
-- Siendo unico por persona, la peticion de un tercero simplemente crea un
-- resultado suyo y no hay dos respuestas que comparar. La idempotencia se
-- conserva entera: lo que protege es que el mismo dispositivo no duplique su
-- propia operacion, y eso siempre ocurre dentro de una misma cuenta.
--
-- Ver ADR 0010.

-- DropIndex
DROP INDEX "entrada_diario_id_operacion_cliente_key";

-- DropIndex
DROP INDEX "resultado_id_operacion_cliente_key";

-- CreateIndex
CREATE UNIQUE INDEX "entrada_diario_id_usuario_id_operacion_cliente_key" ON "entrada_diario"("id_usuario", "id_operacion_cliente");

-- CreateIndex
CREATE UNIQUE INDEX "resultado_id_usuario_id_operacion_cliente_key" ON "resultado"("id_usuario", "id_operacion_cliente");
