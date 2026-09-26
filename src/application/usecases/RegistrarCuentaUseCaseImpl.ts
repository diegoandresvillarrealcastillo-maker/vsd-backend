import { MissingConsentError } from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import { Rol, User } from '../../domain/model/User.js';
import type {
  RegistrarCuentaCommand,
  RegistrarCuentaUseCase,
} from '../../domain/ports/in/RegistrarCuentaUseCase.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/**
 * Da de alta una cuenta de VSD Health a partir de una identidad ya verificada.
 *
 * El generador de identificadores y el reloj se reciben por constructor con un
 * valor por defecto, igual que en el registro de resultados: asi las pruebas
 * pueden fijarlos y comprobar reglas que dependen del tiempo sin que el
 * resultado cambie segun la hora a la que se ejecuten.
 */
export class RegistrarCuentaUseCaseImpl implements RegistrarCuentaUseCase {
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly generarId: () => UserId = () => new UserId(globalThis.crypto.randomUUID()),
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async buscarPorProveedor(idProveedorAuth: string): Promise<User | null> {
    return this.cuentas.findByIdProveedorAuth(idProveedorAuth);
  }

  async execute(command: RegistrarCuentaCommand): Promise<User> {
    const existente = await this.cuentas.findByIdProveedorAuth(command.idProveedorAuth);

    if (existente !== null) {
      // Ya tiene cuenta. Se devuelve la que hay en lugar de fallar, de modo
      // que el frontend pueda llamar a esto en cada inicio de sesion sin
      // averiguar antes si es la primera vez.
      //
      // Tampoco se vuelve a pedir el consentimiento ni se actualiza el que
      // hay: la fecha y la version guardadas son la prueba de lo que acepto
      // esa persona ese dia, y sobrescribirlas borraria esa prueba.
      return existente;
    }

    if (command.versionPolitica.trim() === '') {
      // Sin consentimiento no se crea nada. No es un formalismo: la Ley 1581
      // de 2012 exige autorizacion previa, expresa e informada para datos
      // sensibles, y la informacion relacionada con salud lo es. Sin ella no
      // hay base legal para guardar un solo resultado.
      throw new MissingConsentError();
    }

    const ahora = this.reloj();

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
        consentimiento: {
          versionPolitica: command.versionPolitica.trim(),
          aceptadoEn: ahora,
        },
        registradoEn: ahora,
        // Se omite en lugar de mandar undefined: el modo estricto del proyecto
        // no acepta lo segundo.
        ...(command.nombre === undefined || command.nombre.trim() === ''
          ? {}
          : { nombre: command.nombre.trim() }),
      },
      ahora,
    );

    await this.cuentas.save(cuenta);

    return cuenta;
  }
}
