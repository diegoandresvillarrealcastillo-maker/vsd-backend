import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AccountNotProvisionedError,
  IncompleteRegistrationError,
} from '../../domain/model/DomainError.js';
import type { RegistrarCuentaUseCase } from '../../domain/ports/in/RegistrarCuentaUseCase.js';
import type { PeticionConCuenta } from './CuentaActual.js';
import { PERMITE_REGISTRO_INCOMPLETO } from './PermiteRegistroIncompleto.js';
import { ES_PUBLICO } from './Publico.js';
import { NO_EXIGE_CUENTA } from './SinCuenta.js';

/**
 * Traduce la identidad del proveedor en la cuenta de VSD Health.
 *
 * ## Por que hace falta un segundo guardia
 *
 * `GuardiaDeSesion` deja en la peticion quien dice el token que es. Ese dato
 * viene de Supabase y **no sirve para escribir en nuestra base**: las claves
 * foraneas de `resultado` y `entrada_diario` apuntan a `usuario.id_usuario`,
 * que es un identificador nuestro y distinto.
 *
 * Son distintos a proposito. Usar el del proveedor como clave primaria ataria
 * todo el modelo de datos al proveedor de autenticacion, y sustituirlo obligaria
 * a reescribir todas las claves foraneas de la base.
 *
 * Asi que entre autenticar y operar hay una traduccion, y este guardia es esa
 * traduccion. Ponerla aqui y no en cada controlador significa que no se puede
 * olvidar en una ruta nueva.
 *
 * ## Que ocurre si el registro esta incompleto
 *
 * Se responde 403 con `REGISTRO_INCOMPLETO`, salvo en las rutas marcadas con
 * `@PermiteRegistroIncompleto()`. Ver ese decorador.
 *
 * ## Que ocurre si la cuenta no existe
 *
 * Se responde 403 con `CUENTA_NO_REGISTRADA`, no 401. La distincion importa:
 * el token es autentico y la sesion es valida, asi que decir "no estas
 * autenticado" mandaria a la persona a iniciar sesion otra vez, que es
 * exactamente lo que no arregla el problema. Lo que falta es completar el alta.
 */
@Injectable()
export class GuardiaDeCuenta implements CanActivate {
  constructor(
    private readonly cuentas: RegistrarCuentaUseCase,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const marcas = [contexto.getHandler(), contexto.getClass()];

    // Las rutas publicas no tienen identidad que traducir, y la del alta no
    // puede exigir una cuenta que todavia no existe.
    if (
      this.reflector.getAllAndOverride<boolean>(ES_PUBLICO, marcas) === true ||
      this.reflector.getAllAndOverride<boolean>(NO_EXIGE_CUENTA, marcas) === true
    ) {
      return true;
    }

    const peticion = contexto.switchToHttp().getRequest<PeticionConCuenta>();
    const identidad = peticion.identidad;

    if (identidad === undefined) {
      // No deberia ocurrir: `GuardiaDeSesion` se registra antes y habria
      // rechazado la peticion. Si pasa, es que alguien cambio el orden de los
      // guardias, y es mejor cerrar que seguir sin saber quien pregunta.
      throw new AccountNotProvisionedError();
    }

    const cuenta = await this.cuentas.buscarPorProveedor(identidad.id);

    if (cuenta === null) {
      throw new AccountNotProvisionedError();
    }

    // Una cuenta sin su registro completo —anterior a que se pidiera la fecha
    // de nacimiento y las casillas— solo entra a lo que se le marco como
    // permitido. Se comprueba aqui y no en cada caso de uso para que una ruta
    // nueva no pueda olvidarlo: lo que no se marca, lo exige.
    if (
      !cuenta.registroCompleto() &&
      this.reflector.getAllAndOverride<boolean>(PERMITE_REGISTRO_INCOMPLETO, marcas) !== true
    ) {
      throw new IncompleteRegistrationError();
    }

    peticion.cuenta = cuenta;

    return true;
  }
}
