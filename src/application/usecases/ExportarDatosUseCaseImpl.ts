import {
  AccountNotProvisionedError,
  FileStorageUnavailableError,
} from '../../domain/model/DomainError.js';
import { SesionId, type UserId } from '../../domain/model/Identifier.js';
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
import type { DatoCuriosoRepositoryPort } from '../../domain/ports/out/DatoCuriosoRepositoryPort.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';
import type { SesionesRepositoryPort } from '../../domain/ports/out/SesionesRepositoryPort.js';
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
    private readonly datosCuriosos: DatoCuriosoRepositoryPort,
    private readonly sesiones: SesionesRepositoryPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async execute(id: UserId): Promise<DatosExportados> {
    const cuenta = await this.cuentas.findById(id);

    if (cuenta === null) {
      throw new AccountNotProvisionedError();
    }

    const [
      consentimientos,
      resultados,
      entradasDeDiario,
      pendientes,
      preferencias,
      navegadores,
      foto,
      mascotaPropia,
      datoCurioso,
    ] = await Promise.all([
      this.cuentas.consentimientosDe(id),
      this.resultados.ultimosDe(id, DESDE_EL_PRINCIPIO),
      this.diario.todasDe(id),
      this.pendientes.todosDe(id),
      this.avisos.preferenciasDe(id),
      this.avisos.suscripcionesDe(id),
      this.archivoDe(this.fotos, cuenta, cuenta.fotoActualizadaEl),
      this.archivoDe(this.mascotas, cuenta, cuenta.mascotaPropiaActualizadaEl),
      this.datoCuriosoDe(id),
    ]);

    return {
      generadoEn: this.reloj(),
      cuenta,
      consentimientos,
      resultados,
      titulosDeSesiones: await this.titulosDeLasSesiones(resultados),
      entradasDeDiario,
      pendientes,
      avisos: { preferencias, navegadores: navegadores.length },
      foto,
      mascotaPropia,
      datoCurioso,
    };
  }

  /**
   * El titulo de cada sesion distinta que la persona hizo (ADR 0030). Si no hizo ninguna, ni se pregunta.
   */
  private async titulosDeLasSesiones(
    resultados: readonly { readonly sessionId?: SesionId | undefined }[],
  ): Promise<ReadonlyMap<string, string>> {
    const distintas = new Set(
      resultados.flatMap((resultado) =>
        resultado.sessionId === undefined ? [] : [resultado.sessionId.value],
      ),
    );

    return distintas.size === 0
      ? new Map()
      : this.sesiones.titulosDe([...distintas].map((id) => new SesionId(id)));
  }

  /** Lo ultimo que se le dio, con su texto: el identificador no le dice nada a la persona. */
  private async datoCuriosoDe(id: UserId): Promise<DatosExportados['datoCurioso']> {
    const cursor = await this.datosCuriosos.cursorDe(id);

    if (cursor === null || cursor.idDato === null) {
      return null;
    }

    const dato = await this.datosCuriosos.porId(cursor.idDato);

    return dato === null ? null : { dia: cursor.dia, texto: dato.texto };
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
