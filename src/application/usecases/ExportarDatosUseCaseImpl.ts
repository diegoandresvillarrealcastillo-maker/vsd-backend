import {
  AccountNotProvisionedError,
  FileStorageUnavailableError,
} from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { User } from '../../domain/model/User.js';
import type {
  DatosExportados,
  ExportarDatosUseCase,
} from '../../domain/ports/in/ExportarDatosUseCase.js';
import type { FotoLeida } from '../../domain/ports/in/FotoDePerfilUseCase.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type {
  AlmacenPersonalPort,
  ArchivoPersonal,
} from '../../domain/ports/out/AlmacenPersonalPort.js';
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
    private readonly fotos: AlmacenPersonalPort,
    private readonly mascotas: AlmacenPersonalPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async execute(id: UserId): Promise<DatosExportados> {
    const cuenta = await this.cuentas.findById(id);

    if (cuenta === null) {
      throw new AccountNotProvisionedError();
    }

    const [
      resultados,
      entradasDeDiario,
      pendientes,
      preferencias,
      navegadores,
      foto,
      mascotaPropia,
    ] = await Promise.all([
      this.resultados.ultimosDe(id, DESDE_EL_PRINCIPIO),
      this.diario.todasDe(id),
      this.pendientes.todosDe(id),
      this.avisos.preferenciasDe(id),
      this.avisos.suscripcionesDe(id),
      this.archivoDe(this.fotos, cuenta, cuenta.fotoActualizadaEl),
      this.archivoDe(this.mascotas, cuenta, cuenta.mascotaPropiaActualizadaEl),
    ]);

    return {
      generadoEn: this.reloj(),
      cuenta,
      resultados,
      entradasDeDiario,
      pendientes,
      avisos: { preferencias, navegadores: navegadores.length },
      foto,
      mascotaPropia,
    };
  }

  /**
   * Un archivo de la persona, si tiene: su foto de perfil (SCRUM-120) o su
   * mascota propia (SCRUM-122).
   *
   * Si el almacenamiento no responde, **la exportacion falla** en lugar de
   * salir sin el archivo: entregar «todo lo tuyo» con una parte callada seria
   * dar por cumplido el derecho de acceso sin haberlo cumplido.
   */
  private async archivoDe(
    almacen: AlmacenPersonalPort,
    cuenta: User,
    actualizadaEl: Date | undefined,
  ): Promise<FotoLeida | null> {
    if (actualizadaEl === undefined) {
      return null;
    }

    let archivo: ArchivoPersonal | undefined;

    try {
      archivo = await almacen.leer(cuenta.id);
    } catch (error) {
      throw new FileStorageUnavailableError(error);
    }

    return archivo === undefined
      ? null
      : { contenido: archivo.contenido, tipo: archivo.tipo, actualizadaEl };
  }
}
