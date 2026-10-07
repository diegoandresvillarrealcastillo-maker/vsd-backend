import {
  AccountNotProvisionedError,
  FileStorageUnavailableError,
  PhotoNotFoundError,
} from '../../domain/model/DomainError.js';
import { FotoDePerfil } from '../../domain/model/FotoDePerfil.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { User } from '../../domain/model/User.js';
import type { FotoDePerfilUseCase, FotoLeida } from '../../domain/ports/in/FotoDePerfilUseCase.js';
import type { AlmacenPersonalPort } from '../../domain/ports/out/AlmacenPersonalPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';

/**
 * La foto de perfil de la cuenta propia (SCRUM-120).
 *
 * Son dos cosas que viven en sitios distintos: **el archivo**, en el
 * almacenamiento de archivos, y **la marca** de que existe y desde cuando, en
 * la cuenta. Mantenerlas de acuerdo es lo unico que hace esta clase.
 *
 * El orden al guardar es el archivo primero y la marca despues. Si algo falla
 * entre una cosa y otra, queda un archivo sin marca, que nadie ve y que la
 * siguiente foto reemplaza; lo contrario seria una marca que promete una foto
 * que no esta.
 */
export class FotoDePerfilUseCaseImpl implements FotoDePerfilUseCase {
  constructor(
    private readonly cuentas: UserRepositoryPort,
    private readonly almacen: AlmacenPersonalPort,
    private readonly reloj: () => Date = () => new Date(),
  ) {}

  async guardar(persona: UserId, contenido: Uint8Array, tipoDeclarado: string): Promise<User> {
    // Primero lo que no depende de nadie: si el archivo no vale, no se toca nada.
    const foto = FotoDePerfil.crear(contenido, tipoDeclarado);
    const cuenta = await this.cuentaDe(persona);

    await this.conAlmacen(() =>
      this.almacen.guardar(persona, { contenido: foto.contenido, tipo: foto.tipo }),
    );

    const actualizada = cuenta.conFoto(this.reloj());

    await this.cuentas.save(actualizada);

    return actualizada;
  }

  async leer(persona: UserId): Promise<FotoLeida> {
    const cuenta = await this.cuentaDe(persona);

    // Sin marca no se pregunta al almacenamiento: no hay nada que buscar.
    if (cuenta.fotoActualizadaEl === undefined) {
      throw new PhotoNotFoundError();
    }

    const archivo = await this.conAlmacen(() => this.almacen.leer(persona));

    // Marca sin archivo: la foto se perdio por el camino. Para quien la pide
    // es lo mismo que no tener.
    if (archivo === undefined) {
      throw new PhotoNotFoundError();
    }

    return {
      contenido: archivo.contenido,
      tipo: archivo.tipo,
      actualizadaEl: cuenta.fotoActualizadaEl,
    };
  }

  async quitar(persona: UserId): Promise<User> {
    const cuenta = await this.cuentaDe(persona);

    // Se borra siempre, haya marca o no: si quedo un archivo suelto de un
    // intento a medias, esto es lo que lo limpia.
    await this.conAlmacen(() => this.almacen.borrar(persona));

    const sinFoto = cuenta.sinFoto();

    if (sinFoto !== cuenta) {
      await this.cuentas.save(sinFoto);
    }

    return sinFoto;
  }

  private async cuentaDe(persona: UserId): Promise<User> {
    const cuenta = await this.cuentas.findById(persona);

    if (cuenta === null) {
      throw new AccountNotProvisionedError();
    }

    return cuenta;
  }

  /** El almacenamiento es de fuera: si falla, se cuenta como lo que es y sin su detalle. */
  private async conAlmacen<T>(accion: () => Promise<T>): Promise<T> {
    try {
      return await accion();
    } catch (error) {
      throw new FileStorageUnavailableError(error);
    }
  }
}
