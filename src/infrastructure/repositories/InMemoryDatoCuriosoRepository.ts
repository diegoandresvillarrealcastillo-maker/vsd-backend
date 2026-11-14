import { createHash } from 'node:crypto';
import type { CursorDelCiclo, DatoCurioso } from '../../domain/model/DatoCurioso.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { DatoCuriosoRepositoryPort } from '../../domain/ports/out/DatoCuriosoRepositoryPort.js';

/**
 * Donde cae un dato en el orden de una persona: un hash de los dos identificadores, como
 * entero con signo de 64 bits.
 *
 * Es el equivalente de `hashtextextended(id_dato || ':' || id_usuario, 0)` que usa el
 * adaptador de PostgreSQL. No dan los mismos numeros —son otra funcion— y no tienen por que:
 * lo que importa es la propiedad, no el valor. Cada persona tiene su orden, estable mientras
 * no cambie el catalogo, y no depende de nada que se guarde.
 */
export function claveEnElOrdenDe(userId: string, datoId: string): bigint {
  const resumen = createHash('sha256').update(`${datoId}:${userId}`).digest('hex');

  return BigInt.asIntN(64, BigInt(`0x${resumen.slice(0, 16)}`));
}

/** Los datos con los que arranca la API cuando no hay base de datos: solo para desarrollo. */
const DATOS_DE_EJEMPLO: readonly DatoCurioso[] = [
  {
    id: 'a0000000-0000-4000-8000-000000000001',
    tema: 'hongos',
    texto: 'Los hongos están más emparentados con los animales que con las plantas.',
  },
  {
    id: 'a0000000-0000-4000-8000-000000000002',
    tema: 'animales',
    texto: 'Los pulpos tienen tres corazones.',
  },
  {
    id: 'a0000000-0000-4000-8000-000000000003',
    tema: 'espacio',
    texto: 'La luz del Sol tarda unos 8 minutos en llegar a la Tierra.',
  },
  {
    id: 'a0000000-0000-4000-8000-000000000004',
    tema: 'colombia',
    texto: 'Colombia es uno de los países megadiversos del planeta.',
  },
  {
    id: 'a0000000-0000-4000-8000-000000000005',
    tema: 'naturaleza',
    texto: 'Un arcoíris es en realidad un círculo completo; desde el suelo solo vemos la mitad.',
  },
];

/**
 * Adaptador en memoria del catalogo de datos curiosos y de los cursores.
 *
 * Sirve para probar el caso de uso sin base de datos y para que la API arranque en desarrollo
 * sin `DATABASE_URL`. No sustituye a las pruebas de integracion: aqui el orden se calcula con
 * otro hash y el «siguiente» es una busqueda en una lista, no una consulta con indice.
 */
export class InMemoryDatoCuriosoRepository implements DatoCuriosoRepositoryPort {
  private readonly datos = new Map<string, { dato: DatoCurioso; publicado: boolean }>();
  private readonly cursores = new Map<string, CursorDelCiclo>();

  constructor(iniciales: readonly DatoCurioso[] = DATOS_DE_EJEMPLO) {
    for (const dato of iniciales) {
      this.agregar(dato);
    }
  }

  /** Suma un dato al catalogo. Solo para pruebas y para el arranque. */
  agregar(dato: DatoCurioso, publicado = true): void {
    this.datos.set(dato.id, { dato, publicado });
  }

  /** Deja de servirse, pero la fila sigue: quien ya lo tiene lo conserva el resto del dia. */
  retirar(id: string): void {
    const actual = this.datos.get(id);

    if (actual !== undefined) {
      this.datos.set(id, { ...actual, publicado: false });
    }
  }

  /** Lo borra del catalogo. */
  borrar(id: string): void {
    this.datos.delete(id);
  }

  cursorDe(userId: UserId): Promise<CursorDelCiclo | null> {
    return Promise.resolve(this.cursores.get(userId.value) ?? null);
  }

  porId(id: string): Promise<DatoCurioso | null> {
    return Promise.resolve(this.datos.get(id)?.dato ?? null);
  }

  siguienteDespuesDe(
    userId: UserId,
    despuesDe: { readonly clave: bigint; readonly idDato: string | null } | null,
  ): Promise<{ readonly dato: DatoCurioso; readonly clave: bigint } | null> {
    const enSuOrden = [...this.datos.values()]
      .filter((registro) => registro.publicado)
      .map((registro) => ({
        dato: registro.dato,
        clave: claveEnElOrdenDe(userId.value, registro.dato.id),
      }))
      // Por clave y, si dos coinciden, por identificador: el mismo desempate que la base.
      .sort((a, b) =>
        a.clave === b.clave ? a.dato.id.localeCompare(b.dato.id) : a.clave < b.clave ? -1 : 1,
      );

    if (enSuOrden.length === 0) {
      return Promise.resolve(null);
    }

    const siguiente =
      despuesDe === null
        ? undefined
        : enSuOrden.find(
            (candidato) =>
              candidato.clave > despuesDe.clave ||
              (candidato.clave === despuesDe.clave && candidato.dato.id > (despuesDe.idDato ?? '')),
          );

    // Al llegar al final se vuelve al principio: empieza un ciclo nuevo.
    return Promise.resolve(siguiente ?? enSuOrden[0] ?? null);
  }

  guardarCursor(userId: UserId, cursor: CursorDelCiclo): Promise<void> {
    this.cursores.set(userId.value, cursor);

    return Promise.resolve();
  }
}
