import { idDeMecanica } from '../ids.ts';
import type { Lote, MecanicaDeContenido, TextosDeNivel } from '../tipos.ts';
import { sesionesDeAtencion } from './atencion.ts';
import { sesionesDeCestas } from './cestas.ts';
import { sesionesDeColores } from './colores.ts';
import { sesionesDeCuentas } from './cuentas.ts';
import { sesionesDeEscenas } from './escena.ts';
import { sesionesDeIntruso } from './intruso.ts';
import { sesionesDeListas } from './lista.ts';
import { sesionesDePalabras } from './palabras.ts';
import { sesionesDePuntos } from './puntos.ts';

/**
 * El lote de Cognicion (SCRUM-222): COG-01 hasta 40 sesiones y COG-02 a COG-09 con las suyas.
 *
 * Los juegos puntuan `mayor_es_mejor`, con el maximo declarado aqui y el mismo en cada sesion
 * (`puntosMaximos`). Los cortes son los de la secuencia de numeros, que se juega igual. Los textos de apoyo
 * son los de las fichas.
 *
 * COG-01 a COG-07 y COG-09 no piden revision profesional: salen **publicados**. COG-08 pide revision ligera
 * (que no se confunda con una prueba): sale `pendiente` y sin publicar.
 */

const UMBRALES = { primero: 0.35, segundo: 0.7 } as const;

function juego(
  codigo: string,
  nombre: string,
  descripcion: string,
  motor: string,
  maximo: number,
  textos: TextosDeNivel,
  sesiones: MecanicaDeContenido['sesiones'],
  revision: MecanicaDeContenido['revision'] = 'no_requiere',
): MecanicaDeContenido {
  return {
    codigo,
    id: idDeMecanica(codigo),
    categoria: 'Cognición',
    nombre,
    tipo: 'juego',
    descripcion,
    motor,
    direccion: 'mayor_es_mejor',
    maximo,
    umbrales: UMBRALES,
    textosNivel: textos,
    revision,
    publicar: revision === 'no_requiere',
    sesiones,
  };
}

export function loteDeCognicion(): Lote {
  return {
    migracion: '20261023120000_catalogo_de_cognicion',
    titulo: 'Catalogo de Cognicion',
    categoria: 'Cognición',
    mecanicas: [
      // COG-01 ya existe (piloto): solo se agregan sus otras 36 sesiones.
      {
        codigo: 'COG-01',
        id: '0acd0000-0000-4000-8000-00000000000a',
        categoria: 'Cognición',
        nombre: 'Recuerda los colores',
        tipo: 'juego',
        descripcion: 'Mira cómo se iluminan las casillas, una a una, y tócalas en el mismo orden.',
        motor: 'secuencia',
        direccion: 'mayor_es_mejor',
        maximo: 12,
        umbrales: UMBRALES,
        textosNivel: {
          favorable: 'Seguiste la secuencia hasta el final.',
          en_seguimiento: 'Llegaste hasta donde llega la mayoría de los días.',
          requiere_atencion: 'Hoy se escapó antes. Pasa con prisa o poco descanso.',
        },
        revision: 'no_requiere',
        publicar: true,
        sesiones: sesionesDeColores(),
        yaExiste: true,
      },
      juego(
        'COG-02',
        'La palabra que sobra',
        'Cuatro palabras: tres tienen algo en común y una no. Encuentra la que sobra. Seis rondas, unos dos minutos.',
        'clasificar',
        6,
        {
          favorable: 'Encontraste los intrusos con soltura.',
          en_seguimiento: 'Algunos se te colaron, que es normal.',
          requiere_atencion: 'Hoy costó ver lo que une a las demás. Puede ser cansancio.',
        },
        sesionesDeIntruso(),
      ),
      juego(
        'COG-03',
        'Ordena por categoría',
        'Lleva cada cosa a su cesta, de una en una. Ocho cosas, unos dos minutos.',
        'clasificar',
        8,
        {
          favorable: 'Ordenaste todo sin perder el criterio.',
          en_seguimiento: 'Casi todo en su sitio.',
          requiere_atencion: 'Hoy se mezclaron varias. Un día suelto no dice nada.',
        },
        sesionesDeCestas(),
      ),
      juego(
        'COG-04',
        'Cuentas con calma',
        'Ocho cuentas cortas, sin cronómetro. Elige la respuesta con todo el tiempo que quieras.',
        'calculo',
        8,
        {
          favorable: 'Resolviste las cuentas con calma.',
          en_seguimiento: 'Algunas salieron, otras pedían más tiempo.',
          requiere_atencion: 'Hoy las cuentas costaron. Pasa con cansancio.',
        },
        sesionesDeCuentas(),
      ),
      juego(
        'COG-05',
        'Toca solo lo que cambia',
        'Unos símbolos van apareciendo. Toca solo cuando salga el que te pedimos. Un minuto y medio, más o menos.',
        'tocar_el_objetivo',
        15,
        {
          favorable: 'Mantuviste la atención todo el ejercicio.',
          en_seguimiento: 'La atención te acompañó a ratos.',
          requiere_atencion: 'Hoy costó sostener la mirada. Puede ser cansancio, sin más.',
        },
        sesionesDeAtencion(),
      ),
      juego(
        'COG-06',
        'Recuerda la lista',
        'Mira una lista unos segundos; cuando se oculte, elige lo que había. Unos dos minutos.',
        'ver_ocultar_recordar',
        8,
        {
          favorable: 'Recordaste la lista casi completa.',
          en_seguimiento: 'Recordaste buena parte.',
          requiere_atencion: 'Hoy la lista se te escapó. Pasa cuando hay prisa o poco sueño.',
        },
        sesionesDeListas(),
      ),
      juego(
        'COG-07',
        'Completa la palabra',
        'Seis palabras con letras que faltan o revueltas, y una pista. Sin tiempo.',
        'palabras',
        6,
        {
          favorable: 'Completaste las palabras con soltura.',
          en_seguimiento: 'Algunas costaron.',
          requiere_atencion: 'Hoy las palabras no salieron fácil. Puede ser cansancio.',
        },
        sesionesDePalabras(),
      ),
      juego(
        'COG-08',
        'Une los puntos en orden',
        'Toca los puntos en orden, del primero al último. Sin cronómetro: al ritmo que quieras.',
        'tocar_el_objetivo',
        10,
        {
          favorable: 'Seguiste el orden hasta el final.',
          en_seguimiento: 'Algunos saltos, nada raro.',
          requiere_atencion: 'Hoy se perdió el hilo antes. Un día suelto no dice nada.',
        },
        sesionesDePuntos(),
        'pendiente',
      ),
      juego(
        'COG-09',
        'Lo que vi',
        'Mira unas figuras unos segundos; cuando se oculten, di qué había en cada lugar. Unos dos minutos.',
        'ver_ocultar_recordar',
        5,
        {
          favorable: 'Recordaste muchos detalles de la escena.',
          en_seguimiento: 'Recordaste lo principal.',
          requiere_atencion: 'Hoy los detalles se desdibujaron. Puede ser cansancio.',
        },
        sesionesDeEscenas(),
      ),
    ],
  };
}

export const CABECERA_DE_COGNICION = `-- El catalogo de Cognicion (SCRUM-222, ADR 0030 y 0031): COG-01 hasta 40 sesiones y COG-02 a COG-09.
--
-- Solo DATOS y aditiva: no toca el esquema ni cambia ninguna actividad ni sesion ya sembradas.
--
--   1. se siembran ocho mecanicas nuevas, todas \`rotativa\` y con su \`motor\` (COG-02 a COG-09);
--   2. se siembran sus sesiones, y las 36 que faltan de «Recuerda los colores» (COG-01).
--
-- ## Que sale publicado y que no
--
--   * COG-01 a COG-07 y COG-09 NO piden revision profesional (\`no_requiere\`): salen PUBLICADAS. Si algo falla
--     en la prueba en PRE, se retira con \`UPDATE ... SET publicado = FALSE\` (retirar no borra, ADR 0025).
--   * COG-08 pide una revision ligera (que no se confunda con una prueba): \`pendiente\`, SIN PUBLICAR. La
--     base impide publicarla asi (sesion_de_actividad_publicada_revisada). Mientras no tenga una publicada, no
--     se ofrece a nadie.
--
-- ## Como se genero
--
-- Este archivo NO se escribe a mano: lo genera \`src/pruebas/catalogo/generar.ts\` desde el contenido que esta en
-- \`src/pruebas/catalogo/cognicion/\`, y una prueba comprueba que lo que esta aqui es lo que el generador
-- produce. Para cambiar un texto se cambia alli y se vuelve a generar... pero una sesion ya sembrada no se
-- edita (ADR 0030): si cambia, se retira y se agrega otra con otro identificador.
--
-- ## Las cuentas
--
--   * 8 mecanicas nuevas y 36 sesiones nuevas de COG-01 mas 8 x 40 de las demas: 356 sesiones.
--   * Un elemento de un banco (un grupo, una mesa, una palabra, una lista) esta en dos sesiones a lo sumo
--     (ADR 0031), y la prueba lo comprueba.
--
-- Es idempotente: los \`INSERT\` ignoran un identificador ya sembrado, asi que aplicarla dos veces deja lo
-- mismo. Los identificadores son fijos para que sean los mismos en los tres ambientes.
--
-- ORDEN: primero las mecanicas y despues sus sesiones (una sesion necesita su actividad). Necesita la columna
-- \`actividad.franja\` (SCRUM-221), que va antes.
--
-- Para deshacerla (si nadie las ha hecho; \`resultado.id_sesion\` es RESTRICT, y las que ya se usaron se retiran
-- con \`publicado = FALSE\` y no se borran):
--   DELETE FROM "sesion_de_actividad" WHERE "id_sesion"::text LIKE '5e5101%';
--   DELETE FROM "actividad" WHERE "id_actividad" IN (
--     '0acd0000-0000-4000-8000-000000000102', '0acd0000-0000-4000-8000-000000000103',
--     '0acd0000-0000-4000-8000-000000000104', '0acd0000-0000-4000-8000-000000000105',
--     '0acd0000-0000-4000-8000-000000000106', '0acd0000-0000-4000-8000-000000000107',
--     '0acd0000-0000-4000-8000-000000000108', '0acd0000-0000-4000-8000-000000000109');`;
