import { Calendario } from '../../domain/model/Calendario.js';
import { AccountNotProvisionedError } from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { Modulo } from '../../domain/model/Preferencias.js';
import type { Activity } from '../../domain/model/Activity.js';
import {
  type ActividadDeHoy,
  type Hecho,
  type ProgresoDelModulo,
  progresoDelModulo,
} from '../../domain/model/Sendero.js';
import type { SesionDeActividad } from '../../domain/model/SesionDeActividad.js';
import type { ConsultarProgresoUseCase } from '../../domain/ports/in/ConsultarProgresoUseCase.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { SesionesRepositoryPort } from '../../domain/ports/out/SesionesRepositoryPort.js';
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
 *
 * ## Las sesiones (SCRUM-205, ADR 0030)
 *
 * Una mecanica con motor solo se puede hacer si tiene una sesion que dar. Por eso, en dos pasos y solo
 * si el catalogo tiene mecanicas con motor en los modulos activos (hoy no tiene ninguna, y entonces no
 * se consulta nada):
 *
 * 1. se pregunta **cuales tienen sesion** y el sendero deja fuera las que no;
 * 2. con lo que el sendero ofrece (lo de hoy y lo sugerido), se pide **la sesion de cada una**. Se
 *    piden solo esas y no las de todo el catalogo: el contenido pesa entre 1 y 3 KB por sesion.
 */
export class ConsultarProgresoUseCaseImpl implements ConsultarProgresoUseCase {
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly catalogo: ActivityRepositoryPort,
    private readonly resultados: ActivityResultRepositoryPort,
    private readonly sesiones: SesionesRepositoryPort,
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
    const actividadesDe = (modulo: Modulo): readonly Activity[] =>
      categorias
        .filter((categoria) => categoria.modulo === modulo)
        .flatMap((categoria) => categoria.actividades);

    // Paso 1: de las mecanicas con motor de los modulos activos, cuales tienen sesion.
    const conMotor = cuenta.modulosActivos
      .flatMap(actividadesDe)
      .filter((actividad) => actividad.motor !== undefined);
    const conSesion =
      conMotor.length === 0
        ? new Set<string>()
        : await this.sesiones.mecanicasConSesion(
            id,
            conMotor.map((actividad) => actividad.id),
            hoy,
          );

    const progresos = cuenta.modulosActivos.map((modulo) =>
      progresoDelModulo({
        modulo,
        actividades: actividadesDe(modulo),
        hechos: hechosPorModulo.get(modulo) ?? [],
        hoy,
        diaDeLaSemana,
        persona: id.value,
        conSesion,
      }),
    );

    // Paso 2: la sesion de cada mecanica con motor que el sendero ofrece.
    const ofrecidas = new Map<string, Activity>();

    for (const progreso of progresos) {
      for (const { actividad } of [...progreso.hoy, ...progreso.sugeridas]) {
        if (actividad.motor !== undefined) {
          ofrecidas.set(actividad.id.value, actividad);
        }
      }
    }

    if (ofrecidas.size === 0) {
      return progresos;
    }

    const sesionesDeHoy = await this.sesiones.sesionesDeHoy(
      id,
      [...ofrecidas.values()].map((actividad) => actividad.id),
      hoy,
    );

    return progresos.map((progreso) => ({
      ...progreso,
      hoy: conSesiones(progreso.hoy, sesionesDeHoy),
      sugeridas: conSesiones(progreso.sugeridas, sesionesDeHoy),
    }));
  }
}

/**
 * Les pone su sesion a las actividades con motor. Una que, entre las dos preguntas, se quedo sin sesion
 * (se retiro en ese instante) no se ofrece: es mejor una tarjeta menos que una que no se puede abrir.
 */
function conSesiones(
  actividades: readonly ActividadDeHoy[],
  sesiones: ReadonlyMap<string, SesionDeActividad>,
): readonly ActividadDeHoy[] {
  return actividades.flatMap((una) => {
    if (una.actividad.motor === undefined) {
      return [una];
    }

    const sesion = sesiones.get(una.actividad.id.value);

    return sesion === undefined ? [] : [{ ...una, sesion }];
  });
}
