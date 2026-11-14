import { type Azar, entre, generadorDe, revolver, uno } from '../azar.ts';
import { idDeSesion } from '../ids.ts';
import type { SesionDeContenido } from '../tipos.ts';

/**
 * COG-04 · «Cuentas con calma» (motor `calculo`): 40 sesiones de 8 cuentas, **sin cronometro** (R4).
 *
 * Diez tipos de cuenta en tres niveles de rango (30), mas diez «cuentas del dia a dia» con pesos
 * colombianos (cambio, totales, repartos) (10). Todo se genera con una semilla al sembrar: la migracion que
 * se aplica es la que se reviso, y una prueba la recalcula.
 *
 * - Cada cuenta trae **tres opciones distintas y una sola correcta**. Las otras dos son errores comunes
 *   (uno de mas o de menos, o una decena de diferencia), nunca absurdas.
 * - **Sin numeros negativos en el nivel 1** (ninguna opcion ni respuesta).
 * - Nunca «te equivocaste»: eso es de la pantalla.
 */

const RONDAS = 8;

export interface Cuenta {
  readonly enunciado: string;
  /** El valor correcto. */
  readonly respuesta: number;
  /** Como se muestra cada valor: un numero, o pesos. */
  readonly formato: (valor: number) => string;
  /** Errores comunes de esta cuenta, si los hay; si no, uno de mas o de menos, o una decena de diferencia. */
  readonly distractores?: readonly number[];
}

const numero = (valor: number): string => String(valor);

/** Pesos colombianos: `$13.500`. */
export function pesos(valor: number): string {
  return `$${valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

const cuenta = (
  enunciado: string,
  respuesta: number,
  formato: (valor: number) => string = numero,
  distractores?: readonly number[],
): Cuenta => ({
  enunciado,
  respuesta,
  formato,
  ...(distractores === undefined ? {} : { distractores }),
});

type Generador = (azar: Azar, nivel: 1 | 2 | 3) => Cuenta;

const dosDigitos = (azar: Azar, nivel: 1 | 2 | 3) =>
  [entre(azar, 11, 40), entre(azar, 21, 99), entre(azar, 101, 499)][nivel - 1] as number;

// ---------------------------------------------------------------------------
// Los diez tipos
// ---------------------------------------------------------------------------

const TIPOS: readonly { readonly nombre: string; readonly genera: Generador }[] = [
  {
    nombre: 'Sumas sin llevada',
    genera: (azar, nivel) => {
      // Cada cifra de la suma da menos de 10: no se lleva nada.
      const cifras = nivel + 1;
      let a = 0;
      let b = 0;

      for (let i = 0; i < cifras; i++) {
        // Ningun numero empieza en cero ni termina en cero: «67 + 0» no es una cuenta.
        const x = entre(azar, i === 0 || i === cifras - 1 ? 1 : 0, 8);
        const y = entre(azar, i === cifras - 1 ? 1 : 0, 9 - x);

        a = a * 10 + x;
        b = b * 10 + y;
      }

      return cuenta(`¿Cuánto es ${a} + ${b}?`, a + b);
    },
  },
  {
    nombre: 'Sumas con llevada',
    genera: (azar, nivel) => {
      const baja = [10, 30, 100][nivel - 1] as number;
      const alta = [39, 99, 499][nivel - 1] as number;
      let a = entre(azar, baja, alta);
      let b = entre(azar, baja, alta);

      // Se pide una llevada de verdad en las unidades.
      while ((a % 10) + (b % 10) < 10) {
        a = entre(azar, baja, alta);
        b = entre(azar, baja, alta);
      }

      return cuenta(`¿Cuánto es ${a} + ${b}?`, a + b);
    },
  },
  {
    nombre: 'Restas',
    genera: (azar, nivel) => {
      const b = dosDigitos(azar, nivel);
      const a = b + entre(azar, 5, [30, 80, 300][nivel - 1] as number);

      return cuenta(`¿Cuánto es ${a} - ${b}?`, a - b);
    },
  },
  {
    nombre: 'Dobles',
    genera: (azar, nivel) => {
      const n = [entre(azar, 6, 24), entre(azar, 25, 75), entre(azar, 76, 450)][
        nivel - 1
      ] as number;

      return cuenta(`¿Cuál es el doble de ${n}?`, n * 2);
    },
  },
  {
    nombre: 'Mitades',
    genera: (azar, nivel) => {
      const n = [entre(azar, 3, 12), entre(azar, 13, 45), entre(azar, 46, 225)][
        nivel - 1
      ] as number;

      return cuenta(`¿Cuál es la mitad de ${n * 2}?`, n);
    },
  },
  {
    nombre: 'Tablas',
    genera: (azar, nivel) => {
      const a = [entre(azar, 2, 5), entre(azar, 3, 9), entre(azar, 6, 12)][nivel - 1] as number;
      const b = [entre(azar, 2, 5), entre(azar, 3, 9), entre(azar, 6, 12)][nivel - 1] as number;

      return cuenta(`¿Cuánto es ${a} × ${b}?`, a * b);
    },
  },
  {
    nombre: 'Completar la decena',
    genera: (azar, nivel) => {
      const decena = [entre(azar, 2, 6), entre(azar, 7, 19), entre(azar, 20, 90)][
        nivel - 1
      ] as number;
      const resto = entre(azar, 1, 9);
      const desde = decena * 10 - resto;

      return cuenta(`¿Cuánto falta para llegar a ${decena * 10} desde ${desde}?`, resto);
    },
  },
  {
    nombre: 'Redondear',
    genera: (azar, nivel) => {
      const base = [entre(azar, 1, 9), entre(azar, 10, 49), entre(azar, 50, 90)][
        nivel - 1
      ] as number;
      // Una cifra que no sea 5, para que haya una sola decena mas cercana.
      const unidad = uno(azar, [1, 2, 3, 4, 6, 7, 8, 9]);
      const n = base * 10 + unidad;

      const redondeado = unidad < 5 ? base * 10 : (base + 1) * 10;
      const otraDecena = unidad < 5 ? (base + 1) * 10 : base * 10;

      // Los errores comunes son la otra decena vecina y la de mas alla.
      return cuenta(`Redondea ${n} a la decena más cercana.`, redondeado, numero, [
        otraDecena,
        unidad < 5 && base > 1 ? (base - 1) * 10 : (base + 2) * 10,
      ]);
    },
  },
  {
    nombre: 'Tres números',
    genera: (azar, nivel) => {
      const tope = [9, 25, 60][nivel - 1] as number;
      const a = entre(azar, 2, tope);
      const b = entre(azar, 2, tope);
      const c = entre(azar, 2, tope);

      return cuenta(`¿Cuánto es ${a} + ${b} + ${c}?`, a + b + c);
    },
  },
  {
    nombre: 'Cuánto falta',
    genera: (azar, nivel) => {
      const total = [entre(azar, 12, 30), entre(azar, 40, 150), entre(azar, 200, 900)][
        nivel - 1
      ] as number;
      const falta = entre(azar, 3, Math.max(5, Math.floor(total / 2)));

      return cuenta(`${total - falta} + ? = ${total}. ¿Qué número falta?`, falta);
    },
  },
];

// ---------------------------------------------------------------------------
// Las diez «cuentas del dia a dia»
// ---------------------------------------------------------------------------

const mil = (azar: Azar, minimo: number, maximo: number, paso = 500) =>
  entre(azar, minimo / paso, maximo / paso) * paso;

const DIA_A_DIA: readonly {
  readonly nombre: string;
  readonly nivel: 1 | 2 | 3;
  readonly genera: Generador;
}[] = [
  {
    nombre: 'El cambio de una compra',
    nivel: 2,
    genera: (azar) => {
      const compra = mil(azar, 2500, 17500);
      const billete = compra > 10000 ? 20000 : 10000;

      return cuenta(
        `Pagas con ${pesos(billete)} una compra de ${pesos(compra)}. ¿Cuánto te devuelven?`,
        billete - compra,
        pesos,
      );
    },
  },
  {
    nombre: 'Dos cosas, un total',
    nivel: 1,
    genera: (azar) => {
      const a = mil(azar, 1000, 4500);
      const b = mil(azar, 1000, 6000);

      return cuenta(
        `Un pan cuesta ${pesos(a)} y un jugo ${pesos(b)}. ¿Cuánto pagas por los dos?`,
        a + b,
        pesos,
      );
    },
  },
  {
    nombre: 'Varias iguales',
    nivel: 1,
    genera: (azar) => {
      const precio = mil(azar, 1000, 3500);
      const cuantas = entre(azar, 2, 5);

      return cuenta(
        `${cuantas} empanadas de ${pesos(precio)} cada una. ¿Cuánto cuestan en total?`,
        precio * cuantas,
        pesos,
      );
    },
  },
  {
    nombre: 'La cuenta entre dos',
    nivel: 2,
    genera: (azar) => {
      const mitad = mil(azar, 3000, 20000, 500);

      return cuenta(
        `La cuenta es de ${pesos(mitad * 2)} y se divide entre dos. ¿Cuánto pone cada quien?`,
        mitad,
        pesos,
      );
    },
  },
  {
    nombre: 'El trayecto de ida y vuelta',
    nivel: 1,
    genera: (azar) => {
      const minutos = entre(azar, 8, 45);

      return cuenta(
        `Un trayecto dura ${minutos} minutos de ida y otros ${minutos} de vuelta. ¿Cuántos minutos son en total?`,
        minutos * 2,
      );
    },
  },
  {
    nombre: 'Con descuento',
    nivel: 2,
    genera: (azar) => {
      const precio = mil(azar, 15000, 60000, 1000);
      const descuento = mil(azar, 2000, 8000, 1000);

      return cuenta(
        `Una camiseta de ${pesos(precio)} tiene ${pesos(descuento)} de descuento. ¿Cuánto pagas?`,
        precio - descuento,
        pesos,
      );
    },
  },
  {
    nombre: 'Lo que se ahorra',
    nivel: 2,
    genera: (azar) => {
      const semanal = mil(azar, 2000, 8000, 1000);
      const semanas = entre(azar, 3, 6);

      return cuenta(
        `Ahorras ${pesos(semanal)} cada semana. ¿Cuánto tienes después de ${semanas} semanas?`,
        semanal * semanas,
        pesos,
      );
    },
  },
  {
    nombre: 'Las páginas que faltan',
    nivel: 3,
    genera: (azar) => {
      const total = entre(azar, 80, 250);
      const leidas = entre(azar, 20, total - 15);

      return cuenta(
        `Un libro tiene ${total} páginas y llevas ${leidas}. ¿Cuántas te faltan?`,
        total - leidas,
      );
    },
  },
  {
    nombre: 'El reparto parejo',
    nivel: 3,
    genera: (azar) => {
      const grupos = entre(azar, 3, 6);
      const cada = entre(azar, 2, 8);

      return cuenta(
        `Tienes ${grupos * cada} galletas para repartir entre ${grupos} personas. ¿Cuántas le tocan a cada una?`,
        cada,
      );
    },
  },
  {
    nombre: 'Las monedas',
    nivel: 3,
    genera: (azar) => {
      const de500 = entre(azar, 2, 5);
      const de200 = entre(azar, 2, 6);

      return cuenta(
        `Tienes ${de500} monedas de $500 y ${de200} de $200. ¿Cuánto dinero tienes?`,
        de500 * 500 + de200 * 200,
        pesos,
      );
    },
  },
];

// ---------------------------------------------------------------------------
// Armar la ronda: tres opciones distintas, una correcta
// ---------------------------------------------------------------------------

function opcionesDe(azar: Azar, hecha: Cuenta): { opciones: string[]; correcta: number } {
  const esPesos = hecha.formato === pesos;
  const salto = esPesos ? 500 : 1;
  const candidatos = new Set<number>();
  const propios = (hecha.distractores ?? []).map((valor) => valor - hecha.respuesta);
  const posibles =
    propios.length > 0
      ? propios
      : revolver(
          azar,
          esPesos
            ? [-salto, salto, -2 * salto, 2 * salto, -1000, 1000, -2000, 2000]
            : [-1, 1, -2, 2, -10, 10, 9, -9, 11, -11],
        );

  for (const diferencia of posibles) {
    const valor = hecha.respuesta + diferencia;

    // Ni cero ni negativos (en ningun nivel: sin negativos desde el 1), ni lo mismo que la respuesta.
    if (valor > 0 && valor !== hecha.respuesta) {
      candidatos.add(valor);
    }

    if (candidatos.size === 2) {
      break;
    }
  }

  const valores = revolver(azar, [hecha.respuesta, ...candidatos]);

  return {
    opciones: valores.map(hecha.formato),
    correcta: valores.indexOf(hecha.respuesta),
  };
}

function sesion(
  numero: number,
  titulo: string,
  nivel: 1 | 2 | 3,
  genera: Generador,
): SesionDeContenido {
  const azar = generadorDe(0x4d4d0000 + numero * 7919);
  const vistas = new Set<string>();
  const rondas: { enunciado: string; opciones: string[]; correcta: number }[] = [];

  while (rondas.length < RONDAS) {
    const hecha = genera(azar, nivel);

    // Ninguna cuenta se repite dentro de la sesion.
    if (vistas.has(hecha.enunciado)) {
      continue;
    }

    vistas.add(hecha.enunciado);
    rondas.push({ enunciado: hecha.enunciado, ...opcionesDe(azar, hecha) });
  }

  return {
    id: idDeSesion('COG-04', numero),
    titulo: titulo.slice(0, 100),
    nivel,
    parametros: { rondas, puntosMaximos: RONDAS },
  };
}

export function sesionesDeCuentas(): SesionDeContenido[] {
  const sesiones: SesionDeContenido[] = [];
  let numero = 0;

  for (const nivel of [1, 2, 3] as const) {
    for (const tipo of TIPOS) {
      numero += 1;
      sesiones.push(sesion(numero, `${tipo.nombre}, nivel ${nivel}`, nivel, tipo.genera));
    }
  }

  for (const tipo of DIA_A_DIA) {
    numero += 1;
    sesiones.push(sesion(numero, `Día a día: ${tipo.nombre}`, tipo.nivel, tipo.genera));
  }

  return sesiones;
}
