import { PAISES_CON_LINEAS, ZONAS_POR_PAIS } from '../../domain/model/PaisDeAyuda.js';
import {
  MENSAJES,
  MENSAJE_DE_RIESGO,
  REGLAS_DE_CHARLA,
  REGLAS_DE_INTENCION,
  RELLENO_DE_LA_CHARLA,
} from '../../domain/model/ReglasDelAsistente.js';
import { EXPRESIONES_DE_RIESGO } from '../../domain/model/SenalesDeRiesgo.js';
import {
  ESQUEMA_DE_LAS_REGLAS_LOCALES,
  type ConsultarLasReglasLocalesUseCase,
  type PaisConLineas,
  type ReglasLocalesDelAsistente,
} from '../../domain/ports/in/ConsultarLasReglasLocalesUseCase.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';

/**
 * Arma lo que el dispositivo necesita para responder lo basico sin conexion
 * (SCRUM-141).
 *
 * No decide nada: junta lo que el servidor ya usa. Las reglas y los textos
 * salen de `ReglasDelAsistente.ts`, la lista de riesgo de `SenalesDeRiesgo.ts`,
 * los paises de `PaisDeAyuda.ts` y las lineas de la misma tabla que lee el
 * asistente (`lineasDeAtencion`, que ya sabe que un pais sin lineas recibe el
 * directorio internacional y nunca las de otro pais). Si cualquiera de las
 * cuatro cambia, cambia lo que se publica, y hay pruebas que lo comprueban
 * contra el asistente de verdad.
 *
 * ## El orden es el del servidor
 *
 * Las lineas salen en el orden en que las devuelve `lineasDeAtencion`: lo que
 * sirve en todo el pais primero. Aqui no se reordena nada, ni siquiera para que el
 * `ETag` sea mas estable: quien esta en una crisis ve las lineas con el orden que
 * tiene la aplicacion en linea, y ese orden es una decision editorial (la 192
 * antes que la 123), no un detalle de la base. Cambiarlo es cambiar una fila, y
 * entonces cambia el paquete.
 */
export class ConsultarLasReglasLocalesUseCaseImpl implements ConsultarLasReglasLocalesUseCase {
  constructor(private readonly recursos: RecursoApoyoRepositoryPort) {}

  async ejecutar(): Promise<ReglasLocalesDelAsistente> {
    const paises = await Promise.all(
      PAISES_CON_LINEAS.map(async (pais): Promise<[string, PaisConLineas]> => [
        pais,
        {
          zonas: [...ZONAS_POR_PAIS[pais]],
          lineas: await this.recursos.lineasDeAtencion(pais),
        },
      ]),
    );

    return {
      esquema: ESQUEMA_DE_LAS_REGLAS_LOCALES,
      riesgo: {
        expresiones: [...EXPRESIONES_DE_RIESGO],
        mensaje: MENSAJE_DE_RIESGO,
      },
      charla: {
        reglas: REGLAS_DE_CHARLA.map((regla) => ({
          intencion: regla.intencion,
          patrones: [...regla.patrones],
          mensaje: regla.sinConexion
            ? (regla.mensajeSinConexion ?? MENSAJES[regla.intencion])
            : null,
          variantes: [...(regla.variantes ?? [])],
        })),
        relleno: [...RELLENO_DE_LA_CHARLA],
      },
      intenciones: REGLAS_DE_INTENCION.map((regla) => ({
        intencion: regla.intencion,
        patrones: [...regla.patrones],
        mensaje: regla.sinConexion ? MENSAJES[regla.intencion] : null,
        // Lo unico que se responde sin conexion de esta lista es donde buscar
        // ayuda, y se responde con telefonos.
        conLineas: regla.sinConexion,
      })),
      paises: Object.fromEntries(paises),
      internacional: await this.recursos.lineasDeAtencion(undefined),
    };
  }
}
