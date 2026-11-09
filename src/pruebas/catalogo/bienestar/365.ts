import { mecanicaSinPuntaje, opcionesDeTarjeta, sesion, tarjeta } from '../comun.ts';
import { idDeMecanica } from '../ids.ts';
import type { Lote, MecanicaDeContenido } from '../tipos.ts';
import { FAMILIAS_DIVERSAS, type FormatoDeBienestar } from './actividades.ts';

/**
 * Bienestar 365: 356 actividades nuevas que completan las nueve fichas existentes.
 *
 * Son actividades concretas, cotidianas y sin puntaje. Cada familia se asigna a la interacción VSD que mejor le
 * corresponde (tarjeta, preguntas, lista, escritura o guía animada por pasos); no se añaden dependencias ni
 * estilos de otro módulo. Todo queda pendiente de revisión profesional y sin publicar, igual que el catálogo
 * actual de Bienestar.
 */

const OPCIONES = opcionesDeTarjeta(
  ['ahora', 'Lo intentaré ahora'],
  ['despues', 'Quizá en otro momento'],
  ['hoy-no', 'Hoy no'],
);

const FINALES_INCOMPLETOS = new Set(
  'a al ante bajo con contra de desde durante en entre hacia hasta para por según sin sobre tras y o que un una unos unas'.split(
    ' ',
  ),
);

function descripcionDe(idea: string): string {
  const palabras = idea.match(/[\p{L}\p{N}]+/gu) ?? [];

  if (palabras.length < 2) {
    throw new Error(`La actividad «${idea}» no permite crear una descripción de 2–3 palabras.`);
  }

  const candidatos = [
    palabras.slice(0, 3),
    [palabras[0], palabras.at(-2), palabras.at(-1)],
    [palabras[0], palabras[1], palabras.at(-1)],
    palabras.slice(-3),
    [palabras[0], palabras[2], palabras.at(-1)],
  ];

  for (const candidato of candidatos) {
    const descripcion = candidato
      .filter((palabra): palabra is string => palabra !== undefined)
      .map((palabra, indice) =>
        indice === 0
          ? `${palabra[0]?.toLocaleUpperCase('es-CO')}${palabra.slice(1)}`
          : palabra.toLocaleLowerCase('es-CO'),
      )
      .join(' ');
    const clave = descripcion.toLocaleLowerCase('es-CO');
    const ultimaPalabra = candidato.at(-1)?.toLocaleLowerCase('es-CO');

    if (
      descripcion.split(/\s+/u).length >= 2 &&
      ultimaPalabra !== undefined &&
      !FINALES_INCOMPLETOS.has(ultimaPalabra) &&
      !DESCRIPCIONES_USADAS.has(clave)
    ) {
      DESCRIPCIONES_USADAS.add(clave);
      return descripcion;
    }
  }

  throw new Error(`No se encontró un resumen único de 2–3 palabras para «${idea}».`);
}

const DESCRIPCIONES_USADAS = new Set<string>();

const IDEAS = FAMILIAS_DIVERSAS.flatMap((familia, familiaIndice) =>
  familia.actividades.map((actividad, actividadIndice) => ({
    familiaIndice,
    actividadIndice,
    familia,
    actividad,
  })),
)
  .sort((a, b) => a.actividadIndice - b.actividadIndice || a.familiaIndice - b.familiaIndice)
  .slice(0, 356)
  .map(({ familia, actividad }) => {
    const descripcionCorta = descripcionDe(actividad);

    return {
      tema: familia.etiqueta,
      descripcionCorta,
      formato: familia.formato,
      nombre: `${familia.etiqueta}: ${descripcionCorta}`,
      texto: actividad,
    };
  });

const TOTAL_NUEVAS = 356;

if (IDEAS.length < TOTAL_NUEVAS) {
  throw new Error(
    `Bienestar 365 necesita ${TOTAL_NUEVAS} invitaciones nuevas; hay ${IDEAS.length}.`,
  );
}

function crearParametros(
  idea: (typeof IDEAS)[number],
  formato: FormatoDeBienestar,
): { readonly motor: string; readonly parametros: Readonly<Record<string, unknown>> } {
  switch (formato) {
    case 'tarjeta':
      return {
        motor: 'cuestionario_corto',
        parametros: tarjeta({
          titulo: idea.nombre,
          texto: idea.texto,
          opciones: OPCIONES,
          indicacion: 'Sin respuestas buenas o malas. Tú eliges si probarlo.',
          cierre: 'Gracias por hacer una pausa a tu manera.',
        }),
      };
    case 'preguntas':
      return {
        motor: 'cuestionario_corto',
        parametros: {
          modo: 'preguntas',
          indicacion: 'Elige lo que te sirva; puedes cambiarlo o dejarlo para otro momento.',
          preguntas: [
            {
              clave: 'momento',
              texto: `¿Cuándo te gustaría probarlo? ${idea.texto}`,
              tipo: 'opcion',
              opciones: [
                { clave: 'inicio', texto: 'Al empezar el día' },
                { clave: 'entre', texto: 'Entre dos actividades' },
                { clave: 'cuando-pueda', texto: 'Cuando me venga bien' },
              ],
            },
            {
              clave: 'ajuste',
              texto: `¿Qué versión de «${idea.nombre}» te resulta posible hoy?`,
              tipo: 'opcion',
              opciones: [
                { clave: 'igual', texto: 'Tal como está' },
                { clave: 'pequeno', texto: 'En una versión pequeña' },
                { clave: 'despues', texto: 'Quizá otro día' },
              ],
            },
          ],
          enlaceAlAviso: false,
          conLineasDeAyuda: false,
          cierre: 'Tu plan puede cambiar cuando quieras.',
        },
      };
    case 'lista':
      return {
        motor: 'cuestionario_corto',
        parametros: {
          modo: 'lista',
          indicacion: `Para «${idea.nombre}», marca lo que te gustaría probar. También puedes no marcar nada.`,
          items: [
            { clave: 'probar', texto: `Probar: ${idea.nombre}` },
            { clave: 'adaptar', texto: `Adaptar: ${idea.nombre}` },
            { clave: 'despues', texto: 'Dejarlo para otro momento' },
          ],
          cierre: 'La lista queda a tu manera, sin puntaje.',
        },
      };
    case 'pasos':
      return {
        motor: 'guia_paso_a_paso',
        parametros: {
          modo: 'pasos',
          intro: idea.texto,
          avance: 'manual',
          pasos: [
            { titulo: 'Empieza', texto: idea.texto },
            {
              titulo: 'Hazlo a tu manera',
              texto: `Elige un detalle de «${idea.nombre}» y pruébalo solo si te resulta cómodo.`,
            },
            {
              titulo: 'Cierra',
              texto: 'Decide si quieres repetirlo, ajustarlo o dejarlo por hoy.',
            },
          ],
          cierre: 'Gracias por darte este momento.',
          avisoSiempre: 'Puedes pasar un paso o parar cuando quieras.',
        },
      };
    case 'escritura':
      return {
        motor: 'escritura_breve',
        parametros: {
          invitacion: idea.texto,
          campos: 1,
          minimo: 1,
          largoMaximo: 240,
          permiteNingunaHoy: true,
          cierre: 'Gracias por dejar esta idea en tus palabras.',
        },
      };
  }
}

function crearMecanica(indice: number): MecanicaDeContenido {
  const idea = IDEAS[indice];

  if (idea === undefined) {
    throw new Error(`No se encontró la invitación ${indice + 1} de Bienestar 365.`);
  }

  const codigo = `BIE-${String(indice + 10).padStart(2, '0')}`;
  const { motor, parametros } = crearParametros(idea, idea.formato);

  return mecanicaSinPuntaje({
    codigo,
    id: idDeMecanica(codigo),
    categoria: 'Bienestar',
    nombre: idea.nombre,
    descripcion: idea.descripcionCorta,
    motor,
    sesiones: [sesion(codigo, 1, idea.nombre, parametros)],
  });
}

const MECANICAS = Array.from({ length: TOTAL_NUEVAS }, (_, indice) => crearMecanica(indice));

export function loteDeBienestar365(): Lote {
  return {
    migracion: '20261106120000_bienestar365',
    titulo: 'Plan anual de Bienestar',
    categoria: 'Bienestar',
    mecanicas: MECANICAS,
  };
}

export const CABECERA_DE_BIENESTAR_365 = `-- Bienestar 365 · 356 actividades concretas para completar las 365 fichas.
--
-- Solo datos, aditiva e idempotente. Usa el motor cuestionario_corto y la pantalla VSD existente.
-- Todas quedan pendientes de revisión profesional y sin publicar. La migración no aprueba ni habilita contenido.
-- La publicación requiere una revisión registrada en la hoja oficial de SCRUM-228.
--`;
