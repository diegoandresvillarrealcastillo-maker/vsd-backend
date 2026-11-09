import { generadorDe, revolver } from '../azar.ts';
import { idDeMecanica, idDeSesion } from '../ids.ts';
import type { Lote, MecanicaDeContenido, SesionDeContenido } from '../tipos.ts';
import { variarSesionDeAtencion } from './atencion.ts';
import { loteDeCognicion } from './index.ts';
import { loteDeCognicion365 } from './365.ts';
import { loteDeRazonamientoLogico } from './razonamientoLogico.ts';

const CODIGOS_BASE = Array.from(
  { length: 11 },
  (_, indice) => `COG-${String(indice + 1).padStart(2, '0')}`,
);

const ETIQUETAS: Readonly<Record<string, string>> = {
  'COG-01': 'Memoria',
  'COG-02': 'Intruso',
  'COG-03': 'Categorías',
  'COG-04': 'Cálculo',
  'COG-05': 'Atención',
  'COG-06': 'Recuerdo',
  'COG-07': 'Palabras',
  'COG-08': 'Secuencia',
  'COG-09': 'Escena',
  'COG-10': 'Espacio',
  'COG-11': 'Inferencia',
};

const UMBRALES = { primero: 0.35, segundo: 0.7 } as const;
const MAXIMO_DE_RONDAS = 7;
const TEXTOS = {
  favorable: 'Completaste el recorrido de retos con soltura.',
  en_seguimiento: 'Avanzaste por el recorrido a tu ritmo.',
  requiere_atencion: 'Hoy algunas partes costaron. Puedes volver otro día.',
} as const;

interface FaseBase {
  readonly codigo: string;
  readonly mecanica: MecanicaDeContenido;
  readonly sesion: SesionDeContenido;
  readonly idSesion: string;
  readonly maximo: number;
}

function rotar<T>(elementos: readonly T[], desplazamiento: number): T[] {
  if (elementos.length < 2) return [...elementos];
  const salto = desplazamiento % elementos.length;
  return [...elementos.slice(salto), ...elementos.slice(0, salto)];
}

function moverOpciones(rondas: unknown, salto: number, claveOpciones: string): void {
  if (!Array.isArray(rondas)) return;
  for (const valor of rondas) {
    if (typeof valor !== 'object' || valor === null) continue;
    const ronda = valor as Record<string, unknown>;
    const opciones = ronda[claveOpciones];
    const correcta = ronda.correcta ?? ronda.intruso;
    if (!Array.isArray(opciones) || typeof correcta !== 'number') continue;
    const respuesta = opciones[correcta];
    const nuevas = rotar(opciones, salto);
    const indice = nuevas.indexOf(respuesta);
    ronda[claveOpciones] = nuevas;
    if ('correcta' in ronda) ronda.correcta = indice;
    if ('intruso' in ronda) ronda.intruso = indice;
  }
}

/** Crea una sesión de juego nueva cuando un banco base aporta otra fase del mismo motor. */
function variarSesion(
  codigo: string,
  sesion: SesionDeContenido,
  variante: number,
): SesionDeContenido {
  const parametros = structuredClone(sesion.parametros) as Record<string, unknown>;
  const rotarCampo = (campo: string, salto = variante) => {
    const valor = parametros[campo];
    if (Array.isArray(valor)) parametros[campo] = rotar(valor, salto);
  };

  {
    switch (codigo) {
      case 'COG-01':
        if (variante === 3 && Array.isArray(parametros.casillas)) {
          parametros.casillas = [...parametros.casillas].reverse();
        } else {
          rotarCampo('casillas', variante + 1);
        }
        break;
      case 'COG-02':
        rotarCampo('rondas', variante + 1);
        moverOpciones(parametros.rondas, variante + 1, 'palabras');
        break;
      case 'COG-04':
        rotarCampo('rondas', variante + 1);
        moverOpciones(parametros.rondas, variante + 1, 'opciones');
        break;
      case 'COG-07':
        rotarCampo('palabras', variante + 1);
        break;
      case 'COG-03':
        rotarCampo('elementos', variante + 1);
        break;
      case 'COG-06':
        rotarCampo('elementos', variante + 1);
        rotarCampo('distractores', variante + 2);
        break;
      case 'COG-08':
        rotarCampo('puntos', variante + 1);
        break;
      case 'COG-09':
        rotarCampo('preguntas', variante + 1);
        break;
      case 'COG-10': {
        const celdas = parametros.celdas;
        const solucion = parametros.solucion;
        if (Array.isArray(celdas) && typeof solucion === 'string') {
          const transformar = (fila: number, columna: number) => {
            if (variante === 0) return { fila: columna, columna: fila };
            if (variante === 1) return { fila: 4 - fila, columna: 4 - columna };
            if (variante === 2) return { fila: 4 - columna, columna: fila };
            return { fila, columna: 4 - columna };
          };
          parametros.celdas = celdas.map((valor) => {
            if (typeof valor !== 'object' || valor === null) return valor;
            const celda = valor as Record<string, unknown>;
            if (typeof celda.fila !== 'number' || typeof celda.columna !== 'number') return celda;
            return { ...celda, ...transformar(celda.fila, celda.columna) };
          });
          const objetivo = (parametros.celdas as Record<string, unknown>[]).find(
            (celda) => celda.clave === solucion,
          );
          if (objetivo !== undefined && Array.isArray(parametros.pistas)) {
            parametros.pistas = (parametros.pistas as string[]).map((pista) =>
              /^Está en la fila \d+\.$/u.test(pista)
                ? `Está en la fila ${String(objetivo.fila)}.`
                : pista,
            );
          }
        }
        break;
      }
      case 'COG-11': {
        const opciones = parametros.opciones;
        if (Array.isArray(opciones)) {
          if (variante === 0) parametros.opciones = rotar(opciones, 1);
          else if (variante === 1) parametros.opciones = rotar(opciones, 2);
          else if (variante === 2) parametros.opciones = [...opciones].reverse();
          else parametros.opciones = [opciones[1], opciones[0], ...opciones.slice(2)];
        }
        break;
      }
    }
  }

  return {
    ...sesion,
    titulo: `${sesion.titulo} · recorrido ${String(variante + 1)}`,
    parametros,
  };
}

/** Las fases compuestas conservan su juego, pero cada una presenta como máximo siete respuestas. */
function limitarRondas(codigo: string, sesion: SesionDeContenido): SesionDeContenido {
  const parametros = structuredClone(sesion.parametros) as Record<string, unknown>;
  const limitarLista = (clave: string) => {
    const lista = parametros[clave];
    if (Array.isArray(lista)) parametros[clave] = lista.slice(0, MAXIMO_DE_RONDAS);
  };

  switch (codigo) {
    case 'COG-01':
      if (typeof parametros.rondas === 'number') {
        parametros.rondas = Math.min(parametros.rondas, MAXIMO_DE_RONDAS);
      }
      break;
    case 'COG-02':
    case 'COG-04':
      limitarLista('rondas');
      if (Array.isArray(parametros.rondas)) {
        parametros.puntosMaximos = parametros.rondas.length;
      }
      break;
    case 'COG-03':
      limitarLista('elementos');
      if (Array.isArray(parametros.elementos)) {
        parametros.puntosMaximos = parametros.elementos.length;
      }
      break;
    case 'COG-05':
      // variarSesionDeAtencion genera siete objetivos repartidos entre 21 estímulos.
      break;
    case 'COG-06':
      limitarLista('elementos');
      if (Array.isArray(parametros.elementos)) {
        parametros.puntosMaximos = parametros.elementos.length;
      }
      break;
    case 'COG-07':
      limitarLista('palabras');
      if (Array.isArray(parametros.palabras)) {
        parametros.puntosMaximos = parametros.palabras.length;
      }
      break;
    case 'COG-08':
      limitarLista('puntos');
      if (Array.isArray(parametros.puntos)) {
        parametros.puntosMaximos = parametros.puntos.length;
      }
      break;
    case 'COG-09':
      limitarLista('preguntas');
      if (Array.isArray(parametros.preguntas)) {
        parametros.puntosMaximos = parametros.preguntas.length;
      }
      break;
    case 'COG-10':
    case 'COG-11':
      break;
  }

  return { ...sesion, parametros };
}

function maximoDeFase(
  codigo: string,
  sesion: SesionDeContenido,
  maximoOriginal: number | null,
): number {
  const maximo = sesion.parametros.puntosMaximos;

  return codigo !== 'COG-01' && typeof maximo === 'number' ? maximo : (maximoOriginal ?? 0);
}

function idDeSesionDeFase(numero: number): string {
  return `5e5fff00-0000-4000-8000-${String(numero).padStart(12, '0')}`;
}

function combinacionesDe(tamano: 3 | 4): string[][] {
  const resultado: string[][] = [];
  const recorrer = (siguiente: number, actual: string[]) => {
    if (actual.length === tamano) {
      resultado.push(actual);
      return;
    }

    for (let indice = siguiente; indice < CODIGOS_BASE.length; indice++) {
      recorrer(indice + 1, [...actual, CODIGOS_BASE[indice] as string]);
    }
  };

  recorrer(0, []);
  return resultado;
}

function combinacionesUnicas(): string[][] {
  const trios = revolver(generadorDe(0x365c0), combinacionesDe(3));
  const cuartetos = revolver(generadorDe(0x365c1), combinacionesDe(4)).slice(0, 189);
  const seleccionadas = [...trios, ...cuartetos];

  return seleccionadas.map((grupo, indice) => revolver(generadorDe(0x365c2 + indice), grupo));
}

function permutaciones(codigos: readonly string[]): string[][] {
  if (codigos.length < 2) {
    return [[...codigos]];
  }

  return codigos.flatMap((codigo, indice) =>
    permutaciones([...codigos.slice(0, indice), ...codigos.slice(indice + 1)]).map((resto) => [
      codigo,
      ...resto,
    ]),
  );
}

function descripcionCortaDe(codigos: readonly string[], usadas: ReadonlySet<string>): string {
  const trios =
    codigos.length === 3
      ? [codigos]
      : permutaciones(codigos).map((permutacion) => permutacion.slice(0, 3));

  for (const trio of trios) {
    const descripcion = trio.map((codigo) => ETIQUETAS[codigo]).join(' ');

    if (!usadas.has(descripcion)) {
      return descripcion;
    }
  }

  throw new Error(`No se pudo crear una descripción única para ${codigos.join(', ')}`);
}

/**
 * 354 actividades compuestas: cada una reúne un conjunto de tres o cuatro mecanicas base que no se
 * repite. Cada fase conserva su propio juego, instrucciones, contenido y resultado.
 */
export function loteDeRetosCompuestos365(): Lote {
  const base = [
    ...loteDeCognicion().mecanicas,
    ...loteDeCognicion365().mecanicas,
    ...loteDeRazonamientoLogico().mecanicas,
  ];
  const porCodigo = new Map(base.map((mecanica) => [mecanica.codigo, mecanica]));
  const siguienteSesion = new Map(CODIGOS_BASE.map((codigo) => [codigo, 0]));
  const variantesPorSesion = new Map<string, number>();
  let siguienteIdDeFase = 0;
  const combinaciones = combinacionesUnicas();
  const descripciones = new Set<string>();

  const fasesDe = (codigos: readonly string[]): FaseBase[] =>
    codigos.map((codigo) => {
      const mecanica = porCodigo.get(codigo);

      if (mecanica === undefined || mecanica.sesiones.length === 0) {
        throw new Error(`Falta contenido base para ${codigo}`);
      }

      const numero = siguienteSesion.get(codigo) ?? 0;
      siguienteSesion.set(codigo, numero + 1);
      const original = mecanica.sesiones[numero % mecanica.sesiones.length] as SesionDeContenido;
      const variante = variantesPorSesion.get(original.id) ?? 0;
      variantesPorSesion.set(original.id, variante + 1);
      siguienteIdDeFase += 1;

      const sesionVariada =
        codigo === 'COG-05'
          ? variarSesionDeAtencion(original, variante + 1)
          : variarSesion(codigo, original, variante);
      const sesionLimitada = limitarRondas(codigo, sesionVariada);

      return {
        codigo,
        mecanica,
        sesion: sesionLimitada,
        idSesion: idDeSesionDeFase(siguienteIdDeFase),
        maximo: maximoDeFase(codigo, sesionLimitada, mecanica.maximo),
      };
    });

  const borradores = combinaciones.map((codigos) => {
    const fases = fasesDe(codigos);
    const etiquetas = fases.map((fase) => ETIQUETAS[fase.codigo] as string);
    const nombre = etiquetas.join(' · ');
    const descripcion = descripcionCortaDe(codigos, descripciones);
    descripciones.add(descripcion);
    const maximo = fases.reduce((suma, fase) => suma + fase.maximo, 0);
    return {
      fases,
      nombre,
      descripcion,
      maximo,
    };
  });

  const mecanicas: MecanicaDeContenido[] = revolver(generadorDe(0x365c4), borradores).map(
    (borrador, indice) => {
      const numero = indice + 12;
      const codigo = `COG-${String(numero).padStart(2, '0')}`;
      const sesion: SesionDeContenido = {
        id: idDeSesion(codigo, 1),
        titulo: borrador.nombre,
        nivel: Math.min(...borrador.fases.map((fase) => fase.sesion.nivel)) as 1 | 2 | 3,
        parametros: {
          modo: 'reto_compuesto_cognitivo',
          fases: borrador.fases.map((fase) => ({
            codigo: fase.codigo,
            idSesion: fase.idSesion,
            titulo: fase.sesion.titulo,
            nivel: fase.sesion.nivel,
            maximo: fase.maximo,
            parametros: fase.sesion.parametros,
          })),
          puntosMaximos: borrador.maximo,
        },
      };

      return {
        codigo,
        id: idDeMecanica(codigo),
        categoria: 'Cognición',
        nombre: `Reto ${String(numero).padStart(3, '0')} · ${borrador.nombre}`,
        tipo: 'juego',
        descripcion: borrador.descripcion,
        motor: 'reto_compuesto_cognitivo',
        direccion: 'mayor_es_mejor',
        maximo: borrador.maximo,
        umbrales: UMBRALES,
        textosNivel: TEXTOS,
        revision: 'pendiente',
        publicar: false,
        sesiones: [sesion],
      };
    },
  );

  return {
    migracion: '20261105160000_cognicion365_retos_compuestos',
    titulo: '354 actividades compuestas de Cognición 365',
    categoria: 'Cognición',
    mecanicas,
  };
}

export const CABECERA_DE_RETOS_COMPUESTOS_365 = `-- Cognición 365 · COG-12 a COG-365: 354 recorridos compuestos, cada uno con un conjunto unico de tres o cuatro juegos cognitivos.
-- Todos quedan pendientes de revision profesional y sin publicar.`;
