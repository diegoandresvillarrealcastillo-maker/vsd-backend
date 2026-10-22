import { VERSIONES_VIGENTES } from '../../domain/model/AvisoDePrivacidad.js';
import {
  AccountNotProvisionedError,
  MissingConsentError,
  OutdatedPrivacyNoticeError,
  OutdatedTermsError,
} from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import { TipoDeConsentimiento, type TextosAceptados, type User } from '../../domain/model/User.js';
import type {
  AceptarTextosCommand,
  AceptarTextosVigentesUseCase,
} from '../../domain/ports/in/AceptarTextosVigentesUseCase.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/**
 * Vuelve a registrar la aceptacion del aviso y de los terminos cuando cambiaron (SCRUM-237).
 *
 * Es lo que cumple la promesa de los dos textos: «si cambian, te pediremos que la aceptes de
 * nuevo». Hasta que se hace, la guardia de la cuenta no deja usar nada mas.
 *
 * - **Solo se acepta lo pendiente, y todo junto.** Si cambiaron los dos, hay que marcar los dos:
 *   aceptar uno y dejar el otro no deja a la persona al dia, y es mejor que falle entero a que
 *   quede a medias. Lo que ya estaba al dia no se vuelve a fechar: la fecha es la prueba de cuando
 *   acepto, y volver a aceptar lo mismo la reescribiria.
 * - **Se exigen las casillas y las versiones vigentes**, en el mismo orden y con los mismos errores
 *   que el registro: sin casilla no hay autorizacion expresa (Ley 1581 de 2012), y una version vieja
 *   quiere decir que la persona leyo otro texto.
 * - **No hay nada que hacer si no hay nada pendiente.** Es idempotente: el cliente puede reintentar
 *   (la red falla) sin que se llene el historial.
 * - **No se pierde lo anterior.** `save` anade la aceptacion nueva al historial y deja la vieja, que
 *   es lo que la persona acepto en su dia.
 */
export class AceptarTextosVigentesUseCaseImpl implements AceptarTextosVigentesUseCase {
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async execute(id: UserId, aceptacion: AceptarTextosCommand): Promise<User> {
    const cuenta = await this.cuentas.findById(id);

    if (cuenta === null) {
      // La guardia ya exige cuenta para llegar aqui, asi que esto solo pasa si se borro entre una
      // cosa y otra.
      throw new AccountNotProvisionedError();
    }

    const pendientes = cuenta.textosPendientes(VERSIONES_VIGENTES);

    if (pendientes.length === 0) {
      return cuenta;
    }

    const ahora = this.reloj();
    const pideElAviso = pendientes.includes(TipoDeConsentimiento.AVISO_DE_PRIVACIDAD);
    const pideLosTerminos = pendientes.includes(TipoDeConsentimiento.TERMINOS);

    // Primero todo lo que falta, y despues las versiones: una persona que no marco la casilla
    // recibe «falta el consentimiento» aunque ademas mande una version vieja.
    if (
      (pideElAviso && (aceptacion.aceptaAviso !== true || sinTexto(aceptacion.versionPolitica))) ||
      (pideLosTerminos &&
        (aceptacion.aceptaTerminos !== true || sinTexto(aceptacion.versionTerminos)))
    ) {
      throw new MissingConsentError();
    }

    const aceptados: TextosAceptados = {
      ...(pideElAviso
        ? {
            aviso: {
              versionPolitica: this.vigente(aceptacion.versionPolitica, 'aviso'),
              aceptadoEn: ahora,
            },
          }
        : {}),
      ...(pideLosTerminos
        ? {
            terminos: {
              versionPolitica: this.vigente(aceptacion.versionTerminos, 'terminos'),
              aceptadoEn: ahora,
            },
          }
        : {}),
    };

    const alDia = cuenta.conTextosAceptados(aceptados, ahora);

    await this.cuentas.save(alDia);

    return alDia;
  }

  /** La version que se mando, si es la vigente de ese texto; si no, el error de ese texto. */
  private vigente(version: string | undefined, texto: 'aviso' | 'terminos'): string {
    const limpia = version?.trim() ?? '';

    if (limpia === VERSIONES_VIGENTES[texto]) {
      return limpia;
    }

    throw texto === 'aviso' ? new OutdatedPrivacyNoticeError() : new OutdatedTermsError();
  }
}

function sinTexto(valor: string | undefined): boolean {
  return (valor?.trim() ?? '') === '';
}
