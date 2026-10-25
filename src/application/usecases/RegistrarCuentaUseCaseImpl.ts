import {
  esLaVersionVigente,
  esLaVersionVigenteDeLosTerminos,
} from '../../domain/model/AvisoDePrivacidad.js';
import { Calendario, ZONA_HORARIA_POR_DEFECTO } from '../../domain/model/Calendario.js';
import {
  AccountInactiveError,
  InvalidBirthDateError,
  InvalidTimeZoneError,
  MissingConsentError,
  OutdatedPrivacyNoticeError,
  OutdatedTermsError,
  UnderageError,
} from '../../domain/model/DomainError.js';
import type { ContextoDeLaPeticion } from '../../domain/model/EventoDeSeguridad.js';
import { FechaDeNacimiento } from '../../domain/model/FechaDeNacimiento.js';
import { UserId } from '../../domain/model/Identifier.js';
import { EDAD_MINIMA, Rol, User, type RegistroDeLaPersona } from '../../domain/model/User.js';
import type { BorrarCuentaUseCase } from '../../domain/ports/in/BorrarCuentaUseCase.js';
import type {
  RegistrarCuentaCommand,
  RegistrarCuentaUseCase,
} from '../../domain/ports/in/RegistrarCuentaUseCase.js';
import type { ProveedorDeIdentidadPort } from '../../domain/ports/out/ProveedorDeIdentidadPort.js';
import type { RegistroDeSeguridadPort } from '../../domain/ports/out/RegistroDeSeguridadPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/**
 * Para el registro del servidor: que se rechazo a alguien por su edad, y nada
 * de quien. Ni la fecha de nacimiento ni el correo ni el identificador llegan
 * aqui; lo unico que importa saber es si la identidad se pudo borrar.
 */
export interface RegistroDeRechazos {
  menorDeEdad(identidadBorrada: boolean): void;
}

/** Sin registro de seguridad: lo que usan las pruebas que no lo miran. */
const SIN_REGISTRO_DE_SEGURIDAD: RegistroDeSeguridadPort = { registrar: () => undefined };

/**
 * Da de alta una cuenta de VSD Health a partir de una identidad ya verificada.
 *
 * El generador de identificadores y el reloj se reciben por constructor con un
 * valor por defecto, igual que en el registro de resultados: asi las pruebas
 * pueden fijarlos y comprobar reglas que dependen del tiempo sin que el
 * resultado cambie segun la hora a la que se ejecuten.
 *
 * ## Quien puede registrarse
 *
 * Solo quien declara ser mayor de 18 anos y marca, con casillas, el aviso de
 * privacidad y los terminos (S-01 y S-02 de la auditoria 360). Se comprueba
 * aqui, en el servidor: que el formulario tambien lo pida es una cortesia, no
 * una barrera.
 */
export class RegistrarCuentaUseCaseImpl implements RegistrarCuentaUseCase {
  /**
   * @param identidades Para borrar la identidad de quien resulta menor: se
   *   registro en el proveedor antes de llegar aqui, y no debe quedarle nada
   *   suyo, ni siquiera el correo.
   * @param borrado Para las cuentas anteriores que, al completar su registro,
   *   declaran ser menores: ya tienen datos, y se borra todo lo suyo.
   * @param seguridad Donde se anota que se creo una cuenta y que se registro un
   *   consentimiento (SCRUM-167). El rechazo de un menor no se anota aqui sino en
   *   el filtro de errores, que es quien conoce la IP de la peticion.
   */
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly identidades: ProveedorDeIdentidadPort,
    private readonly borrado: BorrarCuentaUseCase,
    private readonly registro: RegistroDeRechazos,
    private readonly generarId: () => UserId = () => new UserId(globalThis.crypto.randomUUID()),
    private readonly reloj: () => Date = () => new Date(),
    private readonly seguridad: RegistroDeSeguridadPort = SIN_REGISTRO_DE_SEGURIDAD,
  ) {}

  async buscarPorProveedor(idProveedorAuth: string): Promise<User | null> {
    const cuenta = await this.cuentas.findByIdProveedorAuth(idProveedorAuth);

    if (cuenta === null) {
      await this.rechazarSiSeDioDeBaja(idProveedorAuth);
    }

    return cuenta;
  }

  async execute(command: RegistrarCuentaCommand): Promise<User> {
    const existente = await this.cuentas.findByIdProveedorAuth(command.idProveedorAuth);

    if (existente === null) {
      // Un token que todavia no caduco no puede dar de alta una cuenta nueva para una identidad
      // que ya no existe (SCRUM-190). Quien quiera volver a usar VSD Health se registra de nuevo y
      // recibe una identidad nueva.
      await this.rechazarSiSeDioDeBaja(command.idProveedorAuth);

      return this.crear(command);
    }

    if (!existente.registroCompleto() && traeElRegistro(command)) {
      return this.completar(existente, command);
    }

    // Ya tiene cuenta. Se devuelve la que hay en lugar de fallar, de modo que
    // el frontend pueda llamar a esto en cada inicio de sesion sin averiguar
    // antes si es la primera vez.
    //
    // Tampoco se vuelve a pedir el consentimiento ni se actualiza el que hay:
    // la fecha y la version guardadas son la prueba de lo que acepto esa
    // persona ese dia, y sobrescribirlas borraria esa prueba. Por lo mismo se
    // ignora la fecha de nacimiento que traiga la orden: la declarada una vez
    // no se cambia por aqui.
    //
    // Lo unico que se actualiza es la zona horaria, y solo si es otra: es lo
    // que el dispositivo informa en cada entrada, y lo que permite que viajar
    // no obligue a configurar nada (SCRUM-123).
    return this.conLaZona(existente, command.zonaHoraria);
  }

  /**
   * Lanza `CUENTA_INACTIVA` si ese identificador es de una cuenta que se dio de baja.
   *
   * Solo se pregunta cuando no hay cuenta: es lo que separa «todavia no tiene» de «tenia una y ya
   * no». La respuesta es 401 y no 403, para que el cliente cierre la sesion en lugar de mandar a la
   * persona a completar un registro.
   */
  private async rechazarSiSeDioDeBaja(idProveedorAuth: string): Promise<void> {
    if (await this.cuentas.estaInactivadaPorProveedor(idProveedorAuth)) {
      throw new AccountInactiveError();
    }
  }

  private async crear(command: RegistrarCuentaCommand): Promise<User> {
    const ahora = this.reloj();
    const zona = zonaDe(command.zonaHoraria);
    const registro = await this.verificar(command, ahora, zona, null);

    const cuenta = User.create(
      {
        id: this.generarId(),
        correo: command.correo.trim().toLowerCase(),
        idProveedorAuth: command.idProveedorAuth,
        // El rol se fija aqui y no se recibe. Que pudiera llegar en la orden
        // convertiria el alta en una via de escalada de privilegios, y es el
        // error clasico: basta con que alguien anada el campo al cuerpo de la
        // peticion. Por construccion, esta via no concede administrador jamas.
        rol: Rol.USUARIO,
        consentimiento: registro.consentimiento,
        terminos: registro.terminos,
        fechaDeNacimiento: registro.fechaDeNacimiento,
        registradoEn: ahora,
        // Se omite en lugar de mandar undefined: el modo estricto del proyecto
        // no acepta lo segundo.
        ...(command.nombre === undefined || command.nombre.trim() === ''
          ? {}
          : { nombre: command.nombre.trim() }),
        ...(command.zonaHoraria === undefined ? {} : { zonaHoraria: command.zonaHoraria }),
      },
      ahora,
    );

    await this.cuentas.save(cuenta);

    this.seguridad.registrar({
      tipo: 'CUENTA_CREADA',
      idUsuario: cuenta.id.value,
      ...command.origen,
    });
    this.anotarElConsentimiento(cuenta, registro, command.origen);

    return cuenta;
  }

  /**
   * Completa el registro de una cuenta anterior a que se pidiera. Pasa por las
   * mismas comprobaciones que un alta: ser mayor y marcar las dos casillas.
   */
  private async completar(existente: User, command: RegistrarCuentaCommand): Promise<User> {
    const ahora = this.reloj();
    const zona = zonaDe(command.zonaHoraria ?? existente.zonaHoraria);
    const registro = await this.verificar(command, ahora, zona, existente);

    const completa = existente.conRegistroCompleto(registro, ahora);
    const enSuZona =
      command.zonaHoraria === undefined ? completa : completa.conZonaHoraria(command.zonaHoraria);

    await this.cuentas.save(enSuZona);

    this.anotarElConsentimiento(enSuZona, registro, command.origen);

    return enSuZona;
  }

  /** Solo las versiones que se aceptaron: ni la fecha de nacimiento ni nada de la persona. */
  private anotarElConsentimiento(
    cuenta: User,
    registro: RegistroDeLaPersona,
    origen: ContextoDeLaPeticion | undefined,
  ): void {
    this.seguridad.registrar({
      tipo: 'CONSENTIMIENTO_REGISTRADO',
      idUsuario: cuenta.id.value,
      versionAviso: registro.consentimiento.versionPolitica,
      versionTerminos: registro.terminos.versionPolitica,
      ...origen,
    });
  }

  /**
   * Lo que tiene que cumplirse para quedar registrado, en este orden: una fecha
   * de nacimiento real, ser mayor de edad, marcar las dos casillas y aceptar las
   * versiones vigentes.
   *
   * La edad va antes que el consentimiento a proposito: a un menor no se le
   * pide aceptar nada, se le rechaza.
   *
   * @param existente La cuenta que ya tiene datos, si la hay. Cambia lo que se
   *   borra cuando resulta menor.
   */
  private async verificar(
    command: RegistrarCuentaCommand,
    ahora: Date,
    zona: string,
    existente: User | null,
  ): Promise<RegistroDeLaPersona> {
    const hoy = Calendario.de(zona).diaDe(ahora);

    if (command.fechaNacimiento === undefined) {
      throw new InvalidBirthDateError();
    }

    const fechaDeNacimiento = FechaDeNacimiento.crear(command.fechaNacimiento, hoy);

    if (fechaDeNacimiento.edadEn(hoy) < EDAD_MINIMA) {
      await this.rechazarAlMenor(command.idProveedorAuth, existente);
    }

    // Sin consentimiento no se crea nada. No es un formalismo: la Ley 1581 de
    // 2012 exige autorizacion previa, expresa e informada para datos sensibles,
    // y la informacion relacionada con salud lo es. "Expresa" quiere decir que
    // la persona la dio: marcar la casilla, no que la version llegara en el
    // cuerpo.
    if (command.aceptaAviso !== true || command.aceptaTerminos !== true) {
      throw new MissingConsentError();
    }

    const versionDelAviso = command.versionPolitica?.trim() ?? '';
    const versionDeLosTerminos = command.versionTerminos?.trim() ?? '';

    if (versionDelAviso === '' || versionDeLosTerminos === '') {
      throw new MissingConsentError();
    }

    // Solo se exigen las vigentes a quien se da de alta ahora: quien ya tiene
    // cuenta conserva la version que acepto en su dia, aunque hoy haya otra.
    if (!esLaVersionVigente(versionDelAviso)) {
      throw new OutdatedPrivacyNoticeError();
    }

    if (!esLaVersionVigenteDeLosTerminos(versionDeLosTerminos)) {
      throw new OutdatedTermsError();
    }

    return {
      fechaDeNacimiento,
      consentimiento: { versionPolitica: versionDelAviso, aceptadoEn: ahora },
      terminos: { versionPolitica: versionDeLosTerminos, aceptadoEn: ahora },
    };
  }

  /**
   * Rechaza a un menor sin dejar nada suyo: ni cuenta ni identidad.
   *
   * Si borrar falla (el proveedor no responde) igual se rechaza: la peticion
   * no puede salir como aceptada. Pero se anota, porque queda una identidad que
   * hay que limpiar a mano, y quien lee el registro tiene que enterarse.
   */
  private async rechazarAlMenor(idProveedorAuth: string, existente: User | null): Promise<never> {
    let identidadBorrada = true;

    try {
      if (existente === null) {
        await this.identidades.borrarIdentidad(idProveedorAuth);
      } else {
        await this.borrado.execute(existente.id);
      }
    } catch {
      identidadBorrada = false;
    }

    this.registro.menorDeEdad(identidadBorrada);

    throw new UnderageError();
  }

  private async conLaZona(cuenta: User, zona: string | undefined): Promise<User> {
    if (zona === undefined) {
      return cuenta;
    }

    const enSuZona = cuenta.conZonaHoraria(zona);

    if (enSuZona !== cuenta) {
      await this.cuentas.save(enSuZona);
    }

    return enSuZona;
  }
}

/** Si la orden trae algo del registro: la fecha o alguna de las dos casillas. */
function traeElRegistro(command: RegistrarCuentaCommand): boolean {
  return (
    command.fechaNacimiento !== undefined ||
    command.aceptaAviso !== undefined ||
    command.aceptaTerminos !== undefined
  );
}

/**
 * La zona con la que se cuenta la edad. Una que el servidor no conoce se
 * rechaza igual que en el resto de la cuenta, antes de calcular nada con ella.
 */
function zonaDe(zona: string | undefined): string {
  const pedida = zona ?? ZONA_HORARIA_POR_DEFECTO;

  if (!Calendario.esZonaValida(pedida)) {
    throw new InvalidTimeZoneError();
  }

  return pedida;
}
