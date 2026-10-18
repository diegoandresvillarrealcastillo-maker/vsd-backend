import { mecanicaSinPuntaje } from '../comun.ts';
import type { Lote } from '../tipos.ts';
import { sesionesDeEstiramiento } from './estiramiento.ts';
import { sesionesDeCaminatas, sesionesDeCuidados, sesionesDeSueno } from './habitos.ts';
import { sesionesDeAntesDeDormir, sesionesDeDescanso } from './noche.ts';
import { sesionesDeRespiracion } from './respiracion.ts';
import { sesionesDeRespiro } from './respiro.ts';
import { sesionesDeEscaneo } from './escaneo.ts';

/**
 * El lote de Bienestar (SCRUM-223): BIE-01 hasta 40 sesiones y BIE-02 a BIE-09 con las suyas.
 *
 * Ninguna puntua, y **todas piden revision** (profesional, o ligera en BIE-05, 08 y 09): entran `pendiente`
 * y sin publicar. La base impide publicarlas asi. Los textos son borradores para quien revise.
 *
 * BIE-04 es «Un cuidado pequeno de hoy», que reemplaza a «Agua y comida» (D-C3).
 */
export function loteDeBienestar(): Lote {
  return {
    migracion: '20261023130000_catalogo_de_bienestar',
    titulo: 'Catalogo de Bienestar',
    categoria: 'Bienestar',
    mecanicas: [
      // BIE-01 ya existe (piloto): solo se agregan sus otras 37 sesiones.
      mecanicaSinPuntaje({
        codigo: 'BIE-01',
        id: '0acd0000-0000-4000-8000-00000000000b',
        categoria: 'Bienestar',
        nombre: 'Respiración guiada',
        descripcion:
          'Un círculo que se abre y se cierra para acompañar tu respiración, a tu ritmo. Dos minutos, y puedes parar cuando quieras.',
        motor: 'guia_paso_a_paso',
        sesiones: sesionesDeRespiracion(),
        yaExiste: true,
      }),
      mecanicaSinPuntaje({
        codigo: 'BIE-02',
        categoria: 'Bienestar',
        nombre: 'Pausa de estiramiento',
        descripcion:
          'Cuatro movimientos suaves para soltar el cuerpo, uno tras otro, desde una silla. Unos dos minutos.',
        motor: 'guia_paso_a_paso',
        sesiones: sesionesDeEstiramiento(),
      }),
      mecanicaSinPuntaje({
        codigo: 'BIE-03',
        categoria: 'Bienestar',
        nombre: 'El hábito de sueño de hoy',
        descripcion:
          'Una práctica pequeña para cuidar tu descanso, una por día. Tú decides si la pruebas. Un minuto.',
        motor: 'cuestionario_corto',
        sesiones: sesionesDeSueno(),
      }),
      mecanicaSinPuntaje({
        codigo: 'BIE-04',
        categoria: 'Bienestar',
        nombre: 'Un cuidado pequeño de hoy',
        descripcion: 'Un gesto de uno a cinco minutos para cuidarte hoy. Sin metas ni cuentas.',
        motor: 'cuestionario_corto',
        sesiones: sesionesDeCuidados(),
      }),
      mecanicaSinPuntaje({
        codigo: 'BIE-05',
        categoria: 'Bienestar',
        nombre: 'La caminata del día',
        descripcion:
          'Una invitación para salir a caminar, grande o pequeña, y contarla. Sin metas ni pasos contados.',
        motor: 'cuestionario_corto',
        sesiones: sesionesDeCaminatas(),
      }),
      mecanicaSinPuntaje({
        codigo: 'BIE-06',
        categoria: 'Bienestar',
        nombre: 'Escaneo corporal',
        descripcion:
          'Llevar la atención al cuerpo, zona por zona, sin cambiar nada. De uno a tres minutos, y puedes parar cuando quieras.',
        motor: 'guia_paso_a_paso',
        sesiones: sesionesDeEscaneo(),
      }),
      mecanicaSinPuntaje({
        codigo: 'BIE-07',
        categoria: 'Bienestar',
        nombre: 'Antes de dormir',
        descripcion: 'Cuatro gestos suaves para preparar la noche. Solo se ofrece por la noche.',
        motor: 'cuestionario_corto',
        franja: 'noche',
        sesiones: sesionesDeAntesDeDormir(),
      }),
      mecanicaSinPuntaje({
        codigo: 'BIE-08',
        categoria: 'Bienestar',
        nombre: 'El descanso de mañana',
        descripcion: 'Planear con calma cómo bajar el ritmo esta noche. Un minuto.',
        motor: 'cuestionario_corto',
        sesiones: sesionesDeDescanso(),
      }),
      mecanicaSinPuntaje({
        codigo: 'BIE-09',
        categoria: 'Bienestar',
        nombre: 'Un respiro en medio del día',
        descripcion:
          'Una pausa de uno o dos minutos para el trabajo o el estudio. Tú eliges entre tres.',
        motor: 'guia_paso_a_paso',
        sesiones: sesionesDeRespiro(),
      }),
    ],
  };
}

export const CABECERA_DE_BIENESTAR = `-- El catalogo de Bienestar (SCRUM-223, ADR 0030 y 0031): BIE-01 hasta 40 sesiones y BIE-02 a BIE-09.
--
-- Solo DATOS y aditiva: no toca el esquema ni cambia ninguna actividad ni sesion ya sembradas.
--
--   1. se siembran ocho mecanicas nuevas, todas \`rotativa\` y con su \`motor\` (BIE-02 a BIE-09). BIE-07
--      («Antes de dormir») trae su franja: \`noche\`, de 19:00 a 4:59 en la hora de la persona;
--   2. se siembran sus sesiones, y las 37 que faltan de «Respiracion guiada» (BIE-01).
--
-- ## NADA SE PUBLICA
--
-- Ninguna mecanica de Bienestar puntua, y todas piden revision (profesional, o ligera en BIE-05, 08 y 09): las
-- sesiones entran \`pendiente\` y SIN PUBLICAR. La base impide publicarlas asi
-- (sesion_de_actividad_publicada_revisada). Mientras una mecanica no tenga una sesion publicada, no se ofrece a
-- nadie: el sendero de todas las personas queda como esta. Publicar es una migracion aparte, que se genera de la
-- hoja de aprobacion cuando una persona con formacion revisa, y queda dicho quien y cuando.
--
-- Los textos son BORRADORES para quien revise (practicas de sueno, estiramientos, guiones de atencion al cuerpo).
-- Que esten en la base no los aprueba. Una sesion \`revisada\` no se edita: si la revision cambia un texto, se
-- retira y se agrega otra con otro identificador.
--
-- ## Como se genero
--
-- NO se escribe a mano: lo genera \`src/pruebas/catalogo/generar.ts\` desde \`src/pruebas/catalogo/bienestar/\`, y
-- una prueba comprueba que lo que esta aqui es lo que el generador produce. Cada sesion pasa antes por el contrato
-- de su motor, el lenguaje clinico (R6) y la lista de exclusion (R14).
--
-- Es idempotente: los \`INSERT\` ignoran un identificador ya sembrado.
--
-- ORDEN: primero las mecanicas y despues sus sesiones. Necesita \`actividad.franja\` (SCRUM-221).
--
-- Para deshacerla (nadie puede haber hecho estas sesiones mientras no se publiquen):
--   DELETE FROM "sesion_de_actividad" WHERE "id_sesion"::text LIKE '5e5102%';
--   DELETE FROM "actividad" WHERE "id_actividad"::text LIKE '0acd0000-0000-4000-8000-0000000002%';`;
