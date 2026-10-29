import { AccountNotProvisionedError, OwnPetNotFoundError } from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import { SvgDeMascota } from '../../domain/model/svg/SvgDeMascota.js';
import type { User } from '../../domain/model/User.js';
import type {
  MascotaPropiaLeida,
  MascotaPropiaUseCase,
} from '../../domain/ports/in/MascotaPropiaUseCase.js';
import type { AlmacenPersonalPort } from '../../domain/ports/out/AlmacenPersonalPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { conAlmacen, cuentaDe, guardarLaMarca } from './ArchivoPersonalDeLaCuenta.js';

/**
 * La mascota propia de la cuenta propia (SCRUM-122).
 *
 * Es la hermana de `FotoDePerfilUseCaseImpl` y se parece a proposito: un
 * archivo en el almacenamiento y una marca en la cuenta, con el archivo primero
 * y la marca despues. Lo que cambia es lo que se hace con el archivo: aqui **no
 * se guarda lo que llego, se guarda lo que sale de sanearlo** (`SvgDeMascota`).
 * Lo que subio la persona no se conserva en ninguna parte.
 */
export class MascotaPropiaUseCaseImpl implements MascotaPropiaUseCase {
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly almacen: AlmacenPersonalPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async guardar(persona: UserId, contenido: Uint8Array, tipoDeclarado: string): Promise<User> {
    // Primero lo que no depende de nadie: si el archivo no vale, no se toca nada.
    const svg = SvgDeMascota.crear(contenido, tipoDeclarado);
    const cuenta = await cuentaDe(this.cuentas, persona);

    await conAlmacen(() =>
      this.almacen.guardar(persona, { contenido: svg.contenido, tipo: svg.tipo }),
    );

    const quedo = await this.cuentas.guardarCambios(cuenta, cuenta.conMascotaPropia(this.reloj()));

    if (quedo === null) {
      // La cuenta se borro mientras se subia el archivo: no queda el dibujo de quien ya no existe.
      await conAlmacen(() => this.almacen.borrar(persona));

      throw new AccountNotProvisionedError();
    }

    return quedo;
  }

  async leer(persona: UserId): Promise<MascotaPropiaLeida> {
    const cuenta = await cuentaDe(this.cuentas, persona);

    // Sin marca no se pregunta al almacenamiento: no hay nada que buscar.
    if (cuenta.mascotaPropiaActualizadaEl === undefined) {
      throw new OwnPetNotFoundError();
    }

    const archivo = await conAlmacen(() => this.almacen.leer(persona));

    // Marca sin archivo: se perdio por el camino. Para quien la pide es lo
    // mismo que no tener.
    if (archivo === undefined) {
      throw new OwnPetNotFoundError();
    }

    return {
      contenido: archivo.contenido,
      tipo: archivo.tipo,
      actualizadaEl: cuenta.mascotaPropiaActualizadaEl,
    };
  }

  async quitar(persona: UserId): Promise<User> {
    const cuenta = await cuentaDe(this.cuentas, persona);

    // Se borra siempre, haya marca o no: si quedo un archivo suelto de un
    // intento a medias, esto es lo que lo limpia.
    await conAlmacen(() => this.almacen.borrar(persona));

    const sin = cuenta.sinMascotaPropia();

    if (sin === cuenta) {
      return cuenta;
    }

    return guardarLaMarca(this.cuentas, cuenta, sin);
  }
}
