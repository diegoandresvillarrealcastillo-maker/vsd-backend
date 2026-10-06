import { Calendario } from '../../domain/model/Calendario.js';
import { AccountNotProvisionedError } from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { Modulo } from '../../domain/model/Preferencias.js';
import {
  type Hecho,
  type ProgresoDelModulo,
  progresoDelModulo,
} from '../../domain/model/Sendero.js';
import type { ConsultarProgresoUseCase } from '../../domain/ports/in/ConsultarProgresoUseCase.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/** Desde cuando cuentan las sesiones: desde siempre. */
const DESDE_EL_PRINCIPIO = new Date(0);

/**
 * Calcula el sendero de cada modulo activo a partir de los resultados.
 *
 * Los dias se cuentan con el `Calendario` de la zona de la persona: un
 * resultado de las 8 p. m. es de hoy, no de manana (SCRUM-87). Cada resultado
 * trae su dia ya guardado, el de cuando se registro, de modo que viajar no
 * mueve los de otras epocas ni rompe una racha (SCRUM-123).
 *
 * Un resultado de una actividad que ya no esta en el catalogo no cuenta para
 * ningun modulo: no hay forma de saber a cual pertenecia. Es un caso raro —el
 * administrador tendria que retirar una actividad que alguien ya hizo— y
 * contarlo en el modulo equivocado seria peor que no contarlo.
 */
export class ConsultarProgresoUseCaseImpl implements ConsultarProgresoUseCase {
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly catalogo: ActivityRepositoryPort,
    private readonly resultados: ActivityResultRepositoryPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async execute(id: UserId): Promise<readonly ProgresoDelModulo[]> {
    const cuenta = await this.cuentas.findById(id);

    if (cuenta === null) {
      throw new AccountNotProvisionedError();
    }

    if (!cuenta.haElegidoModulos()) {
      return [];
    }

    const calendario = Calendario.de(cuenta.zonaHoraria);

    const [categorias, resultados] = await Promise.all([
      this.catalogo.listarCatalogo(),
      this.resultados.ultimosDe(id, DESDE_EL_PRINCIPIO),
    ]);

    const moduloDeActividad = new Map<string, Modulo>();

    for (const categoria of categorias) {
      if (categoria.modulo === undefined) {
        continue;
      }

      for (const actividad of categoria.actividades) {
        moduloDeActividad.set(actividad.id.value, categoria.modulo);
      }
    }

    const hechosPorModulo = new Map<Modulo, Hecho[]>();

    for (const resultado of resultados) {
      const modulo = moduloDeActividad.get(resultado.activityId.value);

      if (modulo === undefined) {
        continue;
      }

      const hechos = hechosPorModulo.get(modulo) ?? [];

      hechos.push({
        actividad: resultado.activityId.value,
        dia: resultado.dia,
      });
      hechosPorModulo.set(modulo, hechos);
    }

    const hoy = calendario.diaDe(this.reloj());
    const diaDeLaSemana = calendario.diaDeLaSemana(hoy);

    return cuenta.modulosActivos.map((modulo) =>
      progresoDelModulo({
        modulo,
        actividades: categorias
          .filter((categoria) => categoria.modulo === modulo)
          .flatMap((categoria) => categoria.actividades),
        hechos: hechosPorModulo.get(modulo) ?? [],
        hoy,
        diaDeLaSemana,
      }),
    );
  }
}
