import { AccountNotProvisionedError } from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type {
  DatosExportados,
  ExportarDatosUseCase,
} from '../../domain/ports/in/ExportarDatosUseCase.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/** Desde cuando se exporta: desde siempre. */
const DESDE_EL_PRINCIPIO = new Date(0);

/**
 * Reune todo lo que VSD Health guarda de una persona.
 *
 * Cada repositorio filtra por la persona en su propia consulta y la base lo
 * impone con sus politicas, asi que aqui no puede colarse nada ajeno aunque un
 * adaptador se olvidara de filtrar.
 */
export class ExportarDatosUseCaseImpl implements ExportarDatosUseCase {
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly resultados: ActivityResultRepositoryPort,
    private readonly diario: DiarioRepositoryPort,
    private readonly pendientes: PendientesRepositoryPort,
    private readonly avisos: AvisosRepositoryPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async execute(id: UserId): Promise<DatosExportados> {
    const cuenta = await this.cuentas.findById(id);

    if (cuenta === null) {
      throw new AccountNotProvisionedError();
    }

    const [resultados, entradasDeDiario, pendientes, preferencias, navegadores] = await Promise.all(
      [
        this.resultados.ultimosDe(id, DESDE_EL_PRINCIPIO),
        this.diario.todasDe(id),
        this.pendientes.todosDe(id),
        this.avisos.preferenciasDe(id),
        this.avisos.suscripcionesDe(id),
      ],
    );

    return {
      generadoEn: this.reloj(),
      cuenta,
      resultados,
      entradasDeDiario,
      pendientes,
      avisos: { preferencias, navegadores: navegadores.length },
    };
  }
}
