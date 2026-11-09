import { idDeMecanica } from '../ids.ts';
import type { Lote, MecanicaDeContenido } from '../tipos.ts';
import { sesionesDeDeduccionEspacial } from './deduccionEspacial.ts';

const UMBRALES = { primero: 0.35, segundo: 0.7 } as const;

const MECANICA: MecanicaDeContenido = {
  codigo: 'COG-10',
  id: idDeMecanica('COG-10'),
  categoria: 'Cognición',
  nombre: 'El lugar de la figura',
  tipo: 'juego',
  descripcion: 'Cruza pistas de forma y posición para encontrar una casilla en la cuadrícula.',
  motor: 'deduccion_espacial',
  direccion: 'mayor_es_mejor',
  maximo: 1,
  umbrales: UMBRALES,
  textosNivel: {
    favorable: 'Encontraste la casilla que cumplía las pistas.',
    en_seguimiento: 'Revisaste las pistas y elegiste una casilla.',
    requiere_atencion: 'Hoy costó cruzar las pistas. Puedes volver a intentarlo otro día.',
  },
  revision: 'pendiente',
  publicar: false,
  sesiones: sesionesDeDeduccionEspacial(),
};

export function loteDeCognicion365(): Lote {
  return {
    migracion: '20261105120000_cognicion365_deduccion_espacial',
    titulo: 'Deduccion espacial de Cognicion 365',
    categoria: 'Cognición',
    mecanicas: [MECANICA],
  };
}

export const CABECERA_DE_COGNICION_365 = `-- Cognición 365 · COG-10: cuarenta cuadrículas espaciales distintas.
--
-- La mecánica y sus sesiones quedan PENDIENTES de revisión y no se publican.
-- Requiere aplicar antes 20261105110000_motor_deduccion_espacial.
--
-- Se conserva la migracion del catalogo anterior sin reescribirla. Esta siembra es nueva, aditiva e idempotente.`;
