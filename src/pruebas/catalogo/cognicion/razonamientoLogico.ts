import { idDeMecanica, idDeSesion } from '../ids.ts';
import type { Lote, MecanicaDeContenido, SesionDeContenido } from '../tipos.ts';
import { GRUPOS_DE_NIVEL_1, GRUPOS_DE_NIVEL_2, GRUPOS_DE_NIVEL_3 } from './intruso.ts';

const GRUPOS = [
  ...GRUPOS_DE_NIVEL_1.slice(0, 14).map((grupo) => ({ grupo, nivel: 1 as const })),
  ...GRUPOS_DE_NIVEL_2.slice(0, 13).map((grupo) => ({ grupo, nivel: 2 as const })),
  ...GRUPOS_DE_NIVEL_3.slice(0, 13).map((grupo) => ({ grupo, nivel: 3 as const })),
];

function sesionDeGrupo(numero: number): SesionDeContenido {
  const seleccionado = GRUPOS[numero - 1];

  if (seleccionado === undefined) {
    throw new Error(`Falta el grupo lógico ${numero}`);
  }

  const { grupo, nivel } = seleccionado;
  const miembro = grupo.juntas[0];

  return {
    id: idDeSesion('COG-11', numero),
    titulo: `Conclusión ${String(numero).padStart(2, '0')} · ${grupo.categoria}`,
    nivel,
    parametros: {
      modo: 'deduccion_logica',
      premisas: [
        `Los ejemplos «${grupo.juntas.join('», «')}» pertenecen a la categoría «${grupo.categoria}».`,
        `«${miembro}» es uno de esos ejemplos.`,
      ],
      opciones: [
        {
          clave: 'categoria',
          texto: `«${miembro}» pertenece a «${grupo.categoria}».`,
          correcta: true,
        },
        {
          clave: 'intruso',
          texto: `«${grupo.intruso}» pertenece a «${grupo.categoria}».`,
          correcta: false,
        },
        {
          clave: 'generalizar',
          texto: `Todo lo que pertenece a «${grupo.categoria}» es «${miembro}».`,
          correcta: false,
        },
      ],
      explicacion: `El primer enunciado ubica los ejemplos en «${grupo.categoria}» y el segundo incluye allí a «${miembro}».`,
      puntosMaximos: 1,
    },
  };
}

const UMBRALES = { primero: 0.35, segundo: 0.7 } as const;
const MECANICA: MecanicaDeContenido = {
  codigo: 'COG-11',
  id: idDeMecanica('COG-11'),
  categoria: 'Cognición',
  nombre: 'La conclusión que se sostiene',
  tipo: 'juego',
  descripcion: 'Relaciona premisas y selecciona una conclusión válida.',
  motor: 'deduccion_logica',
  direccion: 'mayor_es_mejor',
  maximo: 1,
  umbrales: UMBRALES,
  textosNivel: {
    favorable: 'Conectaste las premisas con cuidado.',
    en_seguimiento: 'Leíste las premisas y elegiste una conclusión.',
    requiere_atencion: 'Hoy costó conectar las ideas. Puedes volver a probar otro día.',
  },
  revision: 'pendiente',
  publicar: false,
  sesiones: GRUPOS.map((_, indice) => sesionDeGrupo(indice + 1)),
};

export function loteDeRazonamientoLogico(): Lote {
  return {
    migracion: '20261105140000_cognicion365_razonamiento_logico',
    titulo: 'Deducción lógica con distintos grupos y relaciones',
    categoria: 'Cognición',
    mecanicas: [MECANICA],
  };
}

export const CABECERA_DE_RAZONAMIENTO_LOGICO = `-- Cognición 365 · COG-11: cuarenta silogismos con grupos y relaciones distintos.
-- La nueva mecanica y sus sesiones quedan pendientes de revision y no se publican.`;
