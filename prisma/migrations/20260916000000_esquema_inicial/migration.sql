-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "rol" AS ENUM ('usuario', 'administrador');

-- CreateEnum
CREATE TYPE "direccion_escala" AS ENUM ('mayor_es_mejor', 'mayor_requiere_atencion', 'sin_puntaje');

-- CreateEnum
CREATE TYPE "nivel_orientativo" AS ENUM ('favorable', 'en_seguimiento', 'requiere_atencion');

-- CreateEnum
CREATE TYPE "formato_entrada" AS ENUM ('texto_plano', 'enriquecido');

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" UUID NOT NULL,
    "nombre" VARCHAR(100),
    "correo" VARCHAR(120) NOT NULL,
    "id_proveedor_auth" VARCHAR(255) NOT NULL,
    "rol" "rol" NOT NULL DEFAULT 'usuario',
    "version_politica_aceptada" VARCHAR(20) NOT NULL,
    "fecha_aceptacion_politica" TIMESTAMPTZ(3) NOT NULL,
    "fecha_registro" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id_categoria" UUID NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "actividad" (
    "id_actividad" UUID NOT NULL,
    "id_categoria" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "descripcion" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "direccion_escala" "direccion_escala" NOT NULL,
    "puntaje_maximo" DECIMAL(5,2),
    "umbrales" JSONB,
    "textos_nivel" JSONB,

    CONSTRAINT "actividad_pkey" PRIMARY KEY ("id_actividad")
);

-- CreateTable
CREATE TABLE "resultado" (
    "id_resultado" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_actividad" UUID NOT NULL,
    "puntaje" DECIMAL(5,2),
    "nivel_orientativo" "nivel_orientativo",
    "metadata" JSONB,
    "id_operacion_cliente" UUID NOT NULL,
    "fecha" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resultado_pkey" PRIMARY KEY ("id_resultado")
);

-- CreateTable
CREATE TABLE "recurso_apoyo" (
    "id_recurso" UUID NOT NULL,
    "id_categoria" UUID,
    "titulo" VARCHAR(120) NOT NULL,
    "descripcion" TEXT,
    "tipo" VARCHAR(30) NOT NULL,
    "enlace" VARCHAR(255),

    CONSTRAINT "recurso_apoyo_pkey" PRIMARY KEY ("id_recurso")
);

-- CreateTable
CREATE TABLE "entrada_diario" (
    "id_entrada" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "titulo" VARCHAR(120),
    "contenido" TEXT NOT NULL,
    "formato" "formato_entrada" NOT NULL DEFAULT 'texto_plano',
    "etiquetas" JSONB,
    "adjuntos" JSONB,
    "id_operacion_cliente" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "fecha_creacion" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_edicion" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "entrada_diario_pkey" PRIMARY KEY ("id_entrada")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_id_proveedor_auth_key" ON "usuario"("id_proveedor_auth");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_nombre_key" ON "categoria"("nombre");

-- CreateIndex
CREATE INDEX "actividad_id_categoria_idx" ON "actividad"("id_categoria");

-- CreateIndex
CREATE UNIQUE INDEX "resultado_id_operacion_cliente_key" ON "resultado"("id_operacion_cliente");

-- CreateIndex
CREATE INDEX "resultado_id_usuario_fecha_idx" ON "resultado"("id_usuario", "fecha");

-- CreateIndex
CREATE INDEX "resultado_id_actividad_idx" ON "resultado"("id_actividad");

-- CreateIndex
CREATE INDEX "recurso_apoyo_id_categoria_idx" ON "recurso_apoyo"("id_categoria");

-- CreateIndex
CREATE UNIQUE INDEX "entrada_diario_id_operacion_cliente_key" ON "entrada_diario"("id_operacion_cliente");

-- CreateIndex
CREATE INDEX "entrada_diario_id_usuario_fecha_creacion_idx" ON "entrada_diario"("id_usuario", "fecha_creacion");

-- AddForeignKey
ALTER TABLE "actividad" ADD CONSTRAINT "actividad_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado" ADD CONSTRAINT "resultado_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado" ADD CONSTRAINT "resultado_id_actividad_fkey" FOREIGN KEY ("id_actividad") REFERENCES "actividad"("id_actividad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurso_apoyo" ADD CONSTRAINT "recurso_apoyo_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id_categoria") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrada_diario" ADD CONSTRAINT "entrada_diario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
