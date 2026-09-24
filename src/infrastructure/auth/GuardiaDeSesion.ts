import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ES_PUBLICO } from './Publico.js';
import type { PeticionConIdentidad } from './UsuarioActual.js';
import { TokenInvalidoError, VerificadorDeIdentidad } from './VerificadorDeIdentidad.js';

/**
 * Exige un token valido en cada peticion y deja dicho de quien es.
 *
 * Se registra para toda la aplicacion, asi que lo normal es estar protegido y
 * la excepcion se pide a mano con `@Publico()`. Ver el comentario de ese
 * decorador para el porque.
 *
 * Lo que hace es corto: lee la cabecera, la verifica y cuelga la identidad de
 * la peticion. Lo que **no** hace es decidir si esa persona puede hacer lo que
 * pide. Eso es autorizacion, y vive mas adentro: en las politicas de la base
 * de datos, que filtran por la identidad que este guardia establece, y en el
 * dominio, que ya sabe que el rol de administrador no da acceso a los datos
 * de nadie.
 *
 * Autenticar es saber quien eres. Autorizar es saber que puedes. Un guardia
 * que hiciera las dos cosas acabaria siendo el sitio donde vive la seguridad,
 * y la seguridad no debe vivir en un solo sitio.
 */
@Injectable()
export class GuardiaDeSesion implements CanActivate {
  private readonly registro = new Logger('Sesion');

  constructor(
    private readonly verificador: VerificadorDeIdentidad,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const esPublico = this.reflector.getAllAndOverride<boolean>(ES_PUBLICO, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);

    if (esPublico === true) {
      return true;
    }

    const peticion = contexto.switchToHttp().getRequest<
      PeticionConIdentidad & {
        headers: Record<string, string | string[] | undefined>;
      }
    >();

    const token = this.leerToken(peticion.headers['authorization']);

    if (token === null) {
      throw new UnauthorizedException({
        codigo: 'SESION_REQUERIDA',
        mensaje: 'Inicia sesion para continuar.',
      });
    }

    try {
      peticion.identidad = await this.verificador.verificar(token);
    } catch (error) {
      // El motivo se registra para poder diagnosticar, y no se responde. A
      // quien envia el token le llega siempre lo mismo: distinguir "caducado"
      // de "firma invalida" de "otro proyecto" le ahorra trabajo a quien esta
      // probando combinaciones.
      if (error instanceof TokenInvalidoError) {
        this.registro.warn(`Token rechazado: ${error.message}`);
      } else {
        // Un fallo al consultar el JWKS cae aqui. No es culpa de quien llama,
        // pero tampoco se puede dejar pasar la peticion: sin poder comprobar
        // la firma, aceptar el token equivaldria a no verificar nada.
        this.registro.error('No se pudo verificar el token.', error);
      }

      throw new UnauthorizedException({
        codigo: 'SESION_INVALIDA',
        mensaje: 'Tu sesion no es valida o ha caducado. Vuelve a iniciar sesion.',
      });
    }

    return true;
  }

  /**
   * Saca el token de la cabecera `Authorization: Bearer <token>`.
   *
   * Devuelve null ante cualquier forma que no sea exactamente esa. No se
   * aceptan alternativas —ni el token suelto, ni por parametro de la URL— y
   * lo segundo importa: un token en la URL acaba en el registro del servidor,
   * en el historial del navegador y en la cabecera `Referer` que se manda al
   * siguiente sitio que se visite.
   */
  private leerToken(cabecera: string | string[] | undefined): string | null {
    if (typeof cabecera !== 'string') {
      return null;
    }

    const [esquema, valor, ...sobra] = cabecera.trim().split(/\s+/);

    if (esquema?.toLowerCase() !== 'bearer' || valor === undefined || sobra.length > 0) {
      return null;
    }

    return valor;
  }
}
