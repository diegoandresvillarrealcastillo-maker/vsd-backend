import { AccountNotProvisionedError, PhotoNotFoundError } from '../../domain/model/DomainError.js';
import { FotoDePerfil } from '../../domain/model/FotoDePerfil.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { User } from '../../domain/model/User.js';
import type { FotoDePerfilUseCase, FotoLeida } from '../../domain/ports/in/FotoDePerfilUseCase.js';
import type { AlmacenPersonalPort } from '../../domain/ports/out/AlmacenPersonalPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { conAlmacen, cuentaDe, guardarLaMarca } from './ArchivoPersonalDeLaCuenta.js';

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
    const cuenta = await cuentaDe(this.cuentas, persona);

    await conAlmacen(() =>
      this.almacen.guardar(persona, { contenido: foto.contenido, tipo: foto.tipo }),
    );

    const quedo = await this.cuentas.guardarCambios(cuenta, cuenta.conFoto(this.reloj()));

    if (quedo === null) {
      // La cuenta se borro mientras se subia el archivo: no queda la foto de quien ya no existe.
      await conAlmacen(() => this.almacen.borrar(persona));

      throw new AccountNotProvisionedError();
    }

    return quedo;
  }

  async leer(persona: UserId): Promise<FotoLeida> {
    const cuenta = await cuentaDe(this.cuentas, persona);

    // Sin marca no se pregunta al almacenamiento: no hay nada que buscar.
    if (cuenta.fotoActualizadaEl === undefined) {
      throw new PhotoNotFoundError();
    }

    const archivo = await conAlmacen(() => this.almacen.leer(persona));

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
    const cuenta = await cuentaDe(this.cuentas, persona);

    // Se borra siempre, haya marca o no: si quedo un archivo suelto de un
    // intento a medias, esto es lo que lo limpia.
    await conAlmacen(() => this.almacen.borrar(persona));

    const sinFoto = cuenta.sinFoto();

    if (sinFoto === cuenta) {
      return cuenta;
    }

    return guardarLaMarca(this.cuentas, cuenta, sinFoto);
  }
}
