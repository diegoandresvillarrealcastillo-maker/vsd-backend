import {
  AccountNotProvisionedError,
  FileStorageUnavailableError,
} from '../../domain/model/DomainError.js';
import { SesionId, type UserId } from '../../domain/model/Identifier.js';
import type { User } from '../../domain/model/User.js';
import type {
  DatosExportados,
  ExportarDatosUseCase,
  ResultadoExportado,
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
import { aplanar } from '../aplanar.js';

/** Desde cuando se exporta: desde siempre. */
const DESDE_EL_PRINCIPIO = new Date(0);

/**
 * Reune todo lo que VSD Health guarda de una persona.
 *
 * Cada repositorio filtra por la persona en su propia consulta y la base lo
 * impone con sus politicas, asi que aqui no puede colarse nada ajeno aunque un
 * adaptador se olvidara de filtrar.
 *
 * Los resultados, el diario y los pendientes no se leen aqui: se entregan como flujos perezosos
 * que leen de a `FILAS_POR_PAGINA` cuando alguien los recorre (SCRUM-262). Lo que se lee en este
 * metodo, y puede fallar antes de que empiece la respuesta, es lo acotado: la cuenta, las
 * aceptaciones, los avisos, los dos archivos y el dato curioso.
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

    const [consentimientos, preferencias, navegadores, foto, mascotaPropia, datoCurioso] =
      await Promise.all([
        this.cuentas.consentimientosDe(id),
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
      resultados: this.resultadosConTitulo(id),
      entradasDeDiario: aplanar(() => this.diario.paginasDeEntradas(id)),
      pendientes: aplanar(() => this.pendientes.paginasDePendientes(id)),
      avisos: { preferencias, navegadores: navegadores.length },
      foto,
      mascotaPropia,
      datoCurioso,
    };
  }

  /**
   * Los resultados, de a pagina, cada uno con el titulo de la sesion que hizo (ADR 0030).
   *
   * Los titulos se preguntan por pagina y solo los de las sesiones que todavia no se conocen: una
   * sesion se pregunta una sola vez en todo el recorrido, y si ninguna pagina trae sesiones no se
   * pregunta nunca. Lo que se recuerda entre paginas son los titulos, que son tantos como sesiones
   * distintas hizo la persona, acotado por el catalogo y no por lo que lleva de uso.
   */
  private async *resultadosConTitulo(
    id: UserId,
  ): AsyncGenerator<ResultadoExportado, void, undefined> {
    const titulos = new Map<string, string>();
    const preguntadas = new Set<string>();

    for await (const pagina of this.resultados.paginasDeResultados(id, DESDE_EL_PRINCIPIO)) {
      const nuevas = [
        ...new Set(
          pagina.flatMap((resultado) =>
            resultado.sessionId === undefined || preguntadas.has(resultado.sessionId.value)
              ? []
              : [resultado.sessionId.value],
          ),
        ),
      ];

      if (nuevas.length > 0) {
        const encontrados = await this.sesiones.titulosDe(
          nuevas.map((sesion) => new SesionId(sesion)),
        );

        for (const [sesion, titulo] of encontrados) {
          titulos.set(sesion, titulo);
        }

        for (const sesion of nuevas) {
          preguntadas.add(sesion);
        }
      }

      for (const resultado of pagina) {
        yield {
          resultado,
          titulo:
            resultado.sessionId === undefined ? undefined : titulos.get(resultado.sessionId.value),
        };
      }
    }
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
