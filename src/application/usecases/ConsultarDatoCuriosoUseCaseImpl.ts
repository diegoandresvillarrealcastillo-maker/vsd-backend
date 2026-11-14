import { Calendario } from '../../domain/model/Calendario.js';
import type { DatoCuriosoDelDia } from '../../domain/model/DatoCurioso.js';
import type { User } from '../../domain/model/User.js';
import type { ConsultarDatoCuriosoUseCase } from '../../domain/ports/in/ConsultarDatoCuriosoUseCase.js';
import type { DatoCuriosoRepositoryPort } from '../../domain/ports/out/DatoCuriosoRepositoryPort.js';

/**
 * El dato curioso del dia (SCRUM-185, ADR 0025).
 *
 * ## Que garantiza
 *
 * - **El mismo dato todo el dia.** Una vez elegido, queda en el cursor con el dia: pedirlo
 *   otra vez, desde otro dispositivo o sin conexion despues de haberlo guardado, da el mismo.
 * - **Uno distinto cada dia**, en el orden propio de la persona, hasta recorrer todo el
 *   catalogo una vez. Despues empieza un ciclo nuevo, en el mismo orden.
 * - **El catalogo puede cambiar con el ciclo en curso.** No se cuenta «el dia numero N»: se
 *   pasa «al siguiente despues del ultimo». Un dato nuevo entra donde le toca, uno retirado
 *   se salta, y ninguno ya visto vuelve antes de terminar el ciclo.
 *
 * ## El dia
 *
 * Sale del `Calendario` de la zona de la persona, nunca del reloj UTC ni del del dispositivo:
 * a las 9 p. m. en Bogota ya es el dia siguiente en UTC. Si el cursor es de un dia **posterior**
 * al de hoy (la persona viajo al oeste y el reloj «retrocedio»), se sigue con el mismo dato:
 * avanzar o volver atras daria un dato repetido o uno saltado.
 *
 * ## Concurrencia
 *
 * No hay bloqueo. El siguiente se calcula de forma determinista desde el cursor, asi que dos
 * peticiones a la vez eligen el mismo dato y escriben el mismo cursor.
 */
export class ConsultarDatoCuriosoUseCaseImpl implements ConsultarDatoCuriosoUseCase {
  constructor(
    private readonly datos: DatoCuriosoRepositoryPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async execute(cuenta: User): Promise<DatoCuriosoDelDia> {
    const id = cuenta.id;
    const hoy = Calendario.de(cuenta.zonaHoraria).diaDe(this.reloj());
    const cursor = await this.datos.cursorDe(id);

    // Ya se le dio uno hoy (o en un dia que para el reloj todavia no llego): ese mismo.
    if (cursor !== null && cursor.dia >= hoy && cursor.idDato !== null) {
      const dato = await this.datos.porId(cursor.idDato);

      if (dato !== null) {
        return { dia: cursor.dia, dato };
      }
    }

    const siguiente = await this.datos.siguienteDespuesDe(
      id,
      cursor === null ? null : { clave: cursor.clave, idDato: cursor.idDato },
    );

    if (siguiente === null) {
      return { dia: hoy, dato: null };
    }

    await this.datos.guardarCursor(id, {
      idDato: siguiente.dato.id,
      clave: siguiente.clave,
      dia: hoy,
    });

    return { dia: hoy, dato: siguiente.dato };
  }
}
