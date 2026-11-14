import { mecanicaSinPuntaje } from '../comun.ts';
import type { Lote } from '../tipos.ts';
import { sesionesDeAcompanamiento } from './acompanan.ts';
import { sesionesDeAncla } from './ancla.ts';
import { sesionesDeControlo } from './controlo.ts';
import { sesionesDeCarta, sesionesDeCierre, sesionesDeTresCosas } from './escritura.ts';
import { sesionesDeLugar } from './lugar.ts';
import { sesionesDeRueda } from './rueda.ts';

/**
 * El lote de Emociones (SCRUM-224): EMO-02 hasta 40 sesiones y EMO-01, 03, 04, 05, 07, 08 y 09 con las suyas.
 * EMO-06, "Otra manera de verlo", **se difiere** (D-C4): es la de mas riesgo del catalogo y pide revision
 * profesional previa a cualquier codigo. Emociones queda en 8 x 40 = 320.
 *
 * Es el modulo mas delicado y el que menos afirma. Ninguna puntua, todas **acompanan** (R3), el texto libre
 * pasa por la deteccion de riesgo (R8) y ninguna da una lectura de lo que la persona siente (R13). Todas piden
 * revision (psicologia, o ligera en EMO-05 y 09): entran `pendiente` y sin publicar.
 */
export function loteDeEmociones(): Lote {
  return {
    migracion: '20261023140000_catalogo_de_emociones',
    titulo: 'Catalogo de Emociones',
    categoria: 'Emociones',
    mecanicas: [
      mecanicaSinPuntaje({
        codigo: 'EMO-01',
        categoria: 'Emociones',
        nombre: 'Rueda de emociones',
        descripcion:
          'Ponle nombre, con matiz, a lo que sientes: de un círculo grande a uno más fino. Un minuto.',
        motor: 'cuestionario_corto',
        sesiones: sesionesDeRueda(),
      }),
      // EMO-02 ya existe (piloto): solo se agregan sus otras 37 sesiones.
      mecanicaSinPuntaje({
        codigo: 'EMO-02',
        id: '0acd0000-0000-4000-8000-00000000000c',
        categoria: 'Emociones',
        nombre: 'Tres cosas buenas',
        descripcion:
          'Hasta tres cosas del día que estuvieron bien, por pequeñas que sean. Con una basta, y hay días en que no sale ninguna.',
        motor: 'escritura_breve',
        sesiones: sesionesDeTresCosas(),
        yaExiste: true,
      }),
      mecanicaSinPuntaje({
        codigo: 'EMO-03',
        categoria: 'Emociones',
        nombre: 'Ancla 5-4-3-2-1',
        descripcion: 'Volver al presente con los sentidos, a tu ritmo y sin tiempo. Dos minutos.',
        motor: 'guia_paso_a_paso',
        sesiones: sesionesDeAncla(),
      }),
      mecanicaSinPuntaje({
        codigo: 'EMO-04',
        categoria: 'Emociones',
        nombre: 'Lo que sí controlo',
        descripcion:
          'Separa lo que depende de ti de lo que no, con una situación en tarjetas. Dos minutos.',
        motor: 'clasificar',
        sesiones: sesionesDeControlo(),
      }),
      mecanicaSinPuntaje({
        codigo: 'EMO-05',
        categoria: 'Emociones',
        nombre: 'Carta a mí de mañana',
        descripcion:
          'Déjate una nota breve para mañana. Tú decides si la lees o si la borras sin leerla.',
        motor: 'escritura_breve',
        sesiones: sesionesDeCarta(),
      }),
      mecanicaSinPuntaje({
        codigo: 'EMO-07',
        categoria: 'Emociones',
        nombre: 'Mi lugar tranquilo',
        descripcion:
          'Imagina un lugar que te guste con los cinco sentidos. Tú eliges cuál. Dos o tres minutos.',
        motor: 'guia_paso_a_paso',
        sesiones: sesionesDeLugar(),
      }),
      mecanicaSinPuntaje({
        codigo: 'EMO-08',
        categoria: 'Emociones',
        nombre: 'Quién me acompaña',
        descripcion: 'Recuerda con quién puedes contar, sin guardar nombres. Un minuto.',
        motor: 'cuestionario_corto',
        sesiones: sesionesDeAcompanamiento(),
      }),
      mecanicaSinPuntaje({
        codigo: 'EMO-09',
        categoria: 'Emociones',
        nombre: 'El cierre del día',
        descripcion:
          'Cierra la jornada con lo que dejas y lo que te llevas. Solo se ofrece por la noche.',
        motor: 'escritura_breve',
        franja: 'noche',
        sesiones: sesionesDeCierre(),
      }),
    ],
  };
}

export const CABECERA_DE_EMOCIONES = `-- El catalogo de Emociones (SCRUM-224, ADR 0030 y 0031): EMO-02 hasta 40 sesiones y EMO-01, 03, 04, 05, 07, 08 y 09.
--
-- Solo DATOS y aditiva: no toca el esquema ni cambia ninguna actividad ni sesion ya sembradas.
--
--   1. se siembran siete mecanicas nuevas, todas \`rotativa\` y con su \`motor\` (EMO-01, 03, 04, 05, 07, 08 y 09).
--      EMO-09 («El cierre del dia») trae su franja: \`noche\`, de 19:00 a 4:59 en la hora de la persona;
--   2. se siembran sus sesiones, y las 37 que faltan de «Tres cosas buenas» (EMO-02).
--
-- EMO-06 («Otra manera de verlo») NO esta: se difiere hasta tener revision profesional (D-C4). Emociones queda en
-- 8 x 40 = 320.
--
-- ## NADA SE PUBLICA
--
-- Ninguna mecanica de Emociones puntua, y todas piden revision (psicologia, o ligera en EMO-05 y EMO-09): las
-- sesiones entran \`pendiente\` y SIN PUBLICAR. La base impide publicarlas asi (sesion_de_actividad_publicada_revisada).
-- Mientras una mecanica no tenga una sesion publicada, no se ofrece a nadie. Publicar es una migracion aparte,
-- que se genera de la hoja de aprobacion cuando una persona con formacion revisa, y queda dicho quien y cuando.
--
-- Los textos son BORRADORES para quien revise: la taxonomia de 90 emociones y sus definiciones, los guiones de
-- atencion y de lugar tranquilo, las 240 tarjetas de «Lo que si controlo». Que esten en la base no los aprueba.
-- Una sesion \`revisada\` no se edita: si la revision cambia un texto, se retira y se agrega otra.
--
-- ## Como se genero
--
-- NO se escribe a mano: lo genera \`src/pruebas/catalogo/generar.ts\` desde \`src/pruebas/catalogo/emociones/\`, y una
-- prueba comprueba que lo que esta aqui es lo que el generador produce. Cada sesion pasa antes por el contrato de
-- su motor, el lenguaje clinico (R6) y la lista de exclusion (R14).
--
-- Es idempotente: los \`INSERT\` ignoran un identificador ya sembrado.
--
-- ORDEN: primero las mecanicas y despues sus sesiones. Necesita \`actividad.franja\` (SCRUM-221).
--
-- Para deshacerla (nadie puede haber hecho estas sesiones mientras no se publiquen):
--   DELETE FROM "sesion_de_actividad" WHERE "id_sesion"::text LIKE '5e5103%';
--   DELETE FROM "actividad" WHERE "id_actividad"::text LIKE '0acd0000-0000-4000-8000-0000000003%';`;
