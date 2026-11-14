import {
  type Validador,
  booleano,
  entero,
  lista,
  objeto,
  opcional,
  repetido,
  requerido,
  texto,
} from './piezas.js';

/**
 * M9, `escritura_breve`: texto libre corto, uno o varios campos, con una idea de arranque opcional.
 * `minimo` es cuantos campos hay que llenar (con «una basta», 1) y `permiteNingunaHoy` el boton «hoy no me
 * sale ninguno».
 *
 * `minimo` es de **1 en adelante**: la pantalla pide al menos una respuesta, y un dia sin nada es
 * justamente lo que registra el boton de `permiteNingunaHoy`. Un `minimo` de 0 haria que el boton
 * de terminar sirviera para no escribir nada, que es otra cosa.
 *
 * SCRUM-220 suma tres cosas, todas opcionales para que las sesiones ya sembradas sigan valiendo:
 *
 * - `etiquetas`: lo que pide cada campo («Lo que dejo», «Lo que me llevo»). Una por campo.
 * - `textoNinguna`: lo que dice el boton de «hoy no» cuando no es «Hoy no me sale ninguna» («Hoy lo dejo
 *   todo para manana», EMO-09).
 * - `guardarParaManana`: «Carta a mi de manana» (EMO-05). Lo escrito se guarda en el diario con su etiqueta
 *   y aparece manana, con la opcion de borrarlo sin leerlo. Solo con un campo.
 */
export const ESCRITURA_BREVE: Validador = objeto(
  {
    invitacion: requerido(texto(200)),
    campos: requerido(entero(1, 5)),
    largoMaximo: requerido(entero(50, 1000)),
    ideas: opcional(lista(0, 10, texto(80))),
    minimo: opcional(entero(1, 5)),
    permiteNingunaHoy: opcional(booleano),
    etiquetas: opcional(lista(1, 5, texto(80))),
    textoNinguna: opcional(texto(60)),
    guardarParaManana: opcional(booleano),
    /** Lo que dice al terminar: es parte del contenido que se revisa, como la invitacion. */
    cierre: opcional(texto(160)),
  },
  (valor) => {
    const campos = valor['campos'] as number;

    if (typeof valor['minimo'] === 'number' && valor['minimo'] > campos) {
      return `minimo (${valor['minimo']}) no puede ser mayor que los campos (${campos})`;
    }

    if (Object.hasOwn(valor, 'etiquetas')) {
      const etiquetas = valor['etiquetas'] as unknown[];

      if (etiquetas.length !== campos) {
        return `etiquetas (${etiquetas.length}) tiene que ser una por campo (${campos})`;
      }

      const repetida = repetido(etiquetas, 'etiquetas', null);

      if (repetida !== undefined) {
        return repetida;
      }
    }

    if (Object.hasOwn(valor, 'textoNinguna') && valor['permiteNingunaHoy'] !== true) {
      return 'textoNinguna solo tiene sentido si permiteNingunaHoy es verdadero';
    }

    if (valor['guardarParaManana'] === true && campos !== 1) {
      return `guardarParaManana pide un solo campo, y hay ${campos}`;
    }

    return Object.hasOwn(valor, 'ideas') ? repetido(valor['ideas'], 'ideas', null) : undefined;
  },
);
