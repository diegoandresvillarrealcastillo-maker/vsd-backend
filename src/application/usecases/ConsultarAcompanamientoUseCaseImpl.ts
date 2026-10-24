import {
  actividadesQueCuentanParaAcompanar,
  NivelDeAcompanamiento,
  nivelDeAcompanamiento,
} from '../../domain/model/AcompanamientoPorRiesgo.js';
import { Calendario } from '../../domain/model/Calendario.js';
import { AccountNotProvisionedError } from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import { paisDeLaZona } from '../../domain/model/PaisDeAyuda.js';
import { RecursoApoyo } from '../../domain/model/RecursoApoyo.js';
import type {
  Acompanamiento,
  ConsultarAcompanamientoUseCase,
} from '../../domain/ports/in/ConsultarAcompanamientoUseCase.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/**
 * Decide si la aplicacion le ofrece acompanamiento a una persona por los dias seguidos en que
 * sus resultados requirieron atencion (SCRUM-177, ADR 0034).
 *
 * «Hoy» sale del `Calendario` de la zona de la persona, nunca del reloj UTC ni del del
 * dispositivo, y los dias salen de `resultado.dia` (SCRUM-123): viajar no mueve los de antes. Las
 * lineas son las del **pais de la persona** (SCRUM-124) y solo salen con el nivel critico.
 *
 * Solo se mira lo de quien **dio su permiso** (`acompanamientoPorDias`, apagado por defecto): es una
 * inferencia sobre su estado, y sin el permiso no se lee ni un resultado. Solo cuentan las
 * actividades de «mayor requiere atencion» (carga y emociones): un puntaje bajo en un juego de
 * cognicion no es una senal emocional (ADR 0034, preguntas 1 y 3).
 *
 * El reloj se recibe por constructor, como en la racha, para fijarlo en las pruebas.
 */
export class ConsultarAcompanamientoUseCaseImpl implements ConsultarAcompanamientoUseCase {
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly resultados: ActivityResultRepositoryPort,
    private readonly recursos: RecursoApoyoRepositoryPort,
    private readonly actividades: ActivityRepositoryPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async execute(id: UserId): Promise<Acompanamiento> {
    const cuenta = await this.cuentas.findById(id);

    if (cuenta === null) {
      throw new AccountNotProvisionedError();
    }

    if (!cuenta.acompanamientoPorDias) {
      return { nivel: NivelDeAcompanamiento.NINGUNO, lineasDeAtencion: [] };
    }

    const hoy = Calendario.de(cuenta.zonaHoraria).diaDe(this.reloj());
    const cuentan = actividadesQueCuentanParaAcompanar(await this.actividades.listarCatalogo());
    const nivel = nivelDeAcompanamiento(await this.resultados.diasConAtencion(id, cuentan), hoy);

    if (nivel !== NivelDeAcompanamiento.CRITICO) {
      return { nivel, lineasDeAtencion: [] };
    }

    return {
      nivel,
      lineasDeAtencion: RecursoApoyo.ordenarPorAlcance(
        await this.recursos.lineasDeAtencion(paisDeLaZona(cuenta.zonaHoraria)),
      ),
    };
  }
}
