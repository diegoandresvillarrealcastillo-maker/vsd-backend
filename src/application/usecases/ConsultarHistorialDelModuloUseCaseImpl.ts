import {
  AccountNotProvisionedError,
  InvalidHistoryPageError,
} from '../../domain/model/DomainError.js';
import {
  type HechoDelHistorial,
  type PaginaDelHistorial,
  codificarLaPagina,
  decodificarLaPagina,
  limiteDelHistorial,
} from '../../domain/model/HistorialDelModulo.js';
import type {
  ConsultarHistorialDelModuloCommand,
  ConsultarHistorialDelModuloUseCase,
} from '../../domain/ports/in/ConsultarHistorialDelModuloUseCase.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/**
 * El historial de un modulo: lo que la persona hizo, del mas reciente al mas antiguo, por
 * paginas (SCRUM-184).
 *
 * - **Sale de los resultados**, igual que el sendero: no hay una tabla de historial aparte
 *   que pueda diverger. Por lo mismo, entra en la exportacion y se borra con la cuenta sin
 *   hacer nada mas.
 * - **De cualquier modulo conocido**, este activo o no: es lo que la persona hizo, y
 *   desactivar un modulo no lo borra.
 * - **Solo que hizo y cuando.** Ni puntaje, ni nivel, ni lo escrito: un historial es una lista
 *   y no una lectura de como le fue.
 * - Una actividad que ya no esta en el catalogo no se ensena: no hay forma de saber a que
 *   modulo pertenecia (igual que en el progreso).
 */
export class ConsultarHistorialDelModuloUseCaseImpl implements ConsultarHistorialDelModuloUseCase {
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly catalogo: ActivityRepositoryPort,
    private readonly resultados: ActivityResultRepositoryPort,
  ) {}

  async execute(command: ConsultarHistorialDelModuloCommand): Promise<PaginaDelHistorial> {
    const cuenta = await this.cuentas.findById(command.userId);

    if (cuenta === null) {
      throw new AccountNotProvisionedError();
    }

    // Antes de preguntar nada: una pagina que no es nuestra no llega a la base.
    const despuesDe =
      command.pagina === undefined ? undefined : decodificarLaPagina(command.pagina);

    if (despuesDe === null) {
      throw new InvalidHistoryPageError();
    }

    const categorias = await this.catalogo.listarCatalogo();
    const actividades = categorias
      .filter((categoria) => categoria.modulo === command.modulo)
      .flatMap((categoria) => categoria.actividades);

    if (actividades.length === 0) {
      return { hechos: [], siguiente: null };
    }

    const nombres = new Map(
      actividades.map((actividad) => [actividad.id.value, actividad.nombre] as const),
    );
    const limite = limiteDelHistorial(command.limite);

    // Una fila de mas, solo para saber si hay otra pagina.
    const filas = await this.resultados.historialDe(
      command.userId,
      actividades.map((actividad) => actividad.id),
      { limite: limite + 1, ...(despuesDe === undefined ? {} : { despuesDe }) },
    );

    const hayMas = filas.length > limite;
    const deEstaPagina = filas.slice(0, limite);
    const ultima = deEstaPagina.at(-1);

    const hechos = deEstaPagina.flatMap((fila): HechoDelHistorial[] => {
      const nombre = nombres.get(fila.idActividad);

      return nombre === undefined
        ? []
        : [
            {
              id: fila.id,
              actividad: { id: fila.idActividad, nombre },
              dia: fila.dia,
              hechaEn: fila.hechaEn,
            },
          ];
    });

    return {
      hechos,
      siguiente:
        hayMas && ultima !== undefined
          ? codificarLaPagina({ hechaEn: ultima.hechaEn, id: ultima.id })
          : null,
    };
  }
}
