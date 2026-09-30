import { Activity, DireccionEscala } from '../../domain/model/Activity.js';
import { Categoria } from '../../domain/model/Categoria.js';
import { ActivityId, CategoryId } from '../../domain/model/Identifier.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';

/**
 * Catalogo de actividades en memoria.
 *
 * Sustituye al adaptador de Prisma hasta que exista la base de datos. Las
 * actividades que trae son las tres que sirven de referencia en la
 * documentacion, una por cada direccion de escala, de modo que las pruebas
 * puedan ejercitar los tres comportamientos.
 *
 * Los textos de nivel estan en el lenguaje de cada actividad. A nadie se le
 * dice que su memoria "requiere atencion", que suena a dictamen.
 */
const CATALOGO: readonly Activity[] = [
  Activity.create({
    id: new ActivityId('33333333-3333-4333-a333-333333333333'),
    nombre: 'Secuencias',
    direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
    puntajeMaximo: 10,
    textosNivel: {
      favorable: 'Muy afinado',
      en_seguimiento: 'Con altibajos',
      requiere_atencion: 'Cuesta sostenerlo',
    },
  }),

  Activity.create({
    id: new ActivityId('77777777-7777-4777-a777-777777777777'),
    nombre: 'Tu semana en una hoja',
    // Aqui un puntaje alto significa mas carga, no que le fue mejor.
    direccionEscala: DireccionEscala.MAYOR_REQUIERE_ATENCION,
    puntajeMaximo: 20,
    // Esta actividad quiebra antes que las demas: una semana no tiene por que
    // ponerse pesada en el mismo punto en que falla un juego de memoria.
    umbrales: { primero: 0.25, segundo: 0.5 },
    textosNivel: {
      favorable: 'Semana tranquila',
      en_seguimiento: 'Semana con tensión',
      requiere_atencion: 'Semana pesada',
    },
  }),

  Activity.create({
    id: new ActivityId('88888888-8888-4888-a888-888888888888'),
    nombre: 'Bitácora de sueño',
    // Un registro produce datos, no una calificacion.
    direccionEscala: DireccionEscala.SIN_PUNTAJE,
  }),
];

export class InMemoryActivityRepository implements ActivityRepositoryPort {
  private readonly porId: ReadonlyMap<string, Activity>;
  private readonly actividades: readonly Activity[];

  constructor(actividades: readonly Activity[] = CATALOGO) {
    this.actividades = actividades;
    this.porId = new Map(actividades.map((actividad) => [actividad.id.value, actividad]));
  }

  findById(id: ActivityId): Promise<Activity | null> {
    return Promise.resolve(this.porId.get(id.value) ?? null);
  }

  /**
   * Todas las actividades bajo una sola categoria de ejemplo.
   *
   * En memoria no hay categorias de verdad. Este adaptador existe para poder
   * trabajar sin base de datos, y repartir estas tres actividades en tres
   * grupos inventados no haria mas cierta ninguna prueba: lo que se ejercita
   * aqui es la forma de la respuesta, no el contenido del catalogo.
   */
  listarCatalogo(): Promise<readonly Categoria[]> {
    return Promise.resolve([
      Categoria.create({
        id: new CategoryId('99999999-9999-4999-a999-999999999999'),
        nombre: 'Actividades',
        descripcion: 'Catálogo de ejemplo para trabajar sin base de datos.',
        actividades: this.actividades,
      }),
    ]);
  }
}
