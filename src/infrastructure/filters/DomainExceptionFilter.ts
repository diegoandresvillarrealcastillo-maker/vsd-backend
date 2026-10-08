import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Optional,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { DomainError } from '../../domain/model/DomainError.js';
import { esArchivoPeligroso } from '../../domain/model/EventoDeSeguridad.js';
import type { RegistroDeSeguridadPort } from '../../domain/ports/out/RegistroDeSeguridadPort.js';
import type { PeticionConCuenta } from '../auth/CuentaActual.js';
import { REGISTRO_DE_SEGURIDAD } from '../config/tokens.js';
import { identificadorDeLaRespuesta } from '../logging/identificadorDePeticion.js';
import { contextoDeLaPeticion } from '../seguridad/contextoDeLaPeticion.js';
import { RegistroDeSeguridadNulo } from '../seguridad/RegistroDeSeguridadEnSalida.js';

/**
 * Traduce los errores a respuestas HTTP.
 *
 * El dominio no conoce codigos de estado: lanza errores propios con un codigo
 * estable. Es aqui, en la infraestructura, donde se decide como se ven desde
 * fuera. Asi el dominio sigue sirviendo igual si manana se invoca desde una
 * cola de sincronizacion en lugar de por HTTP.
 */
const ESTADO_POR_CODIGO: Record<string, HttpStatus> = {
  IDENTIFICADOR_INVALIDO: HttpStatus.BAD_REQUEST,
  PUNTAJE_FUERA_DE_RANGO: HttpStatus.BAD_REQUEST,
  RANGO_DE_PUNTAJE_INVALIDO: HttpStatus.BAD_REQUEST,
  FECHA_EN_EL_FUTURO: HttpStatus.BAD_REQUEST,

  // Aqui vivia OPERACION_DE_OTRO_USUARIO. Se quito con el ADR 0010: la clave
  // de operacion es unica por persona, asi que usar una ajena ya no produce
  // una respuesta distinta a usar una inexistente. No hacia falta un estado
  // que no delatara nada porque dejo de haber algo que delatar.

  // La actividad no esta en el catalogo. 404 porque el recurso que se nombra
  // no existe, y quien llama no puede hacer nada distinto con su peticion.
  ACTIVIDAD_NO_ENCONTRADA: HttpStatus.NOT_FOUND,

  CLAVE_DE_METADATA_RESERVADA: HttpStatus.BAD_REQUEST,
  LA_ACTIVIDAD_NO_PUNTUA: HttpStatus.BAD_REQUEST,

  // 403 y no 401: el token es autentico y la sesion vale. Lo que falta es la
  // cuenta. Decir "no estas autenticado" mandaria a la persona a iniciar
  // sesion otra vez, que es justo lo que no arregla el problema.
  CUENTA_NO_REGISTRADA: HttpStatus.FORBIDDEN,

  // 409 porque es un conflicto con un recurso que ya existe, no un error de
  // formato. La peticion esta bien escrita; lo que pasa es que ese correo ya
  // esta tomado por una cuenta creada con otro metodo de acceso.
  CORREO_YA_REGISTRADO: HttpStatus.CONFLICT,

  // Sin consentimiento no hay base legal para tratar informacion de salud.
  // Ley 1581 de 2012.
  CONSENTIMIENTO_NO_REGISTRADO: HttpStatus.BAD_REQUEST,

  // La edad (auditoria 360, S-01). La fecha que no sirve es un error de quien
  // llama: 400. Ser menor es otra cosa: la peticion esta bien hecha y la
  // identidad es autentica, pero la regla de negocio no admite a esa persona.
  // 403 y no 400, porque no se arregla corrigiendo el formato.
  FECHA_DE_NACIMIENTO_INVALIDA: HttpStatus.BAD_REQUEST,
  MENOR_DE_EDAD: HttpStatus.FORBIDDEN,

  // La cuenta existe y el token vale, pero le falta aceptar y declarar su edad.
  // 403 como CUENTA_NO_REGISTRADA: repetir el inicio de sesion no lo arregla,
  // completar el registro si.
  REGISTRO_INCOMPLETO: HttpStatus.FORBIDDEN,

  // Igual que el aviso, 409: se arregla pidiendo la version vigente y repitiendo.
  VERSION_DE_LOS_TERMINOS_NO_VIGENTE: HttpStatus.CONFLICT,

  // 409 y no 400: la peticion esta bien formada. Lo que pasa es que choca con
  // el estado del servidor, que tiene otra version vigente. Se arregla pidiendo
  // la vigente y repitiendo, no corrigiendo el formato.
  VERSION_DEL_AVISO_NO_VIGENTE: HttpStatus.CONFLICT,

  // Preferencias de la cuenta. Las tres son errores de quien llama: pidio algo
  // que no existe o que dejaria la cuenta sin nada que hacer.
  MODULO_DESCONOCIDO: HttpStatus.BAD_REQUEST,
  SIN_MODULOS_ACTIVOS: HttpStatus.BAD_REQUEST,
  MASCOTA_INVALIDA: HttpStatus.BAD_REQUEST,
  NOMBRE_INVALIDO: HttpStatus.BAD_REQUEST,
  ZONA_HORARIA_INVALIDA: HttpStatus.BAD_REQUEST,

  // Diario (SCRUM-95).
  ANOTACION_INVALIDA: HttpStatus.BAD_REQUEST,
  DIA_EN_EL_FUTURO: HttpStatus.BAD_REQUEST,
  RANGO_DE_DIAS_INVALIDO: HttpStatus.BAD_REQUEST,
  // Inexistente o de otra persona: las dos se responden igual.
  ANOTACION_NO_ENCONTRADA: HttpStatus.NOT_FOUND,
  // 409 y no 403: la peticion esta bien y la anotacion es suya. Lo que choca
  // es el estado: paso su hora, o la cambio otro dispositivo. Las dos se
  // resuelven igual, guardando lo que se traia como una anotacion nueva.
  EDICION_FUERA_DE_PLAZO: HttpStatus.CONFLICT,
  VERSION_DESACTUALIZADA: HttpStatus.CONFLICT,

  // Semaforo de pendientes (SCRUM-97).
  PENDIENTE_INVALIDO: HttpStatus.BAD_REQUEST,
  PENDIENTE_NO_ENCONTRADO: HttpStatus.NOT_FOUND,

  // Los avisos por Web Push (SCRUM-102): una hora o una suscripcion mal
  // formada.
  AVISO_INVALIDO: HttpStatus.BAD_REQUEST,

  // La foto de perfil (SCRUM-120). Cada motivo con el estado que le toca: el
  // tipo (415), el peso (413) y lo demas, que es un archivo que no vale (400).
  FOTO_TIPO_NO_PERMITIDO: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
  FOTO_DEMASIADO_PESADA: HttpStatus.PAYLOAD_TOO_LARGE,
  FOTO_DEMASIADO_GRANDE: HttpStatus.BAD_REQUEST,
  FOTO_NO_ES_UNA_IMAGEN: HttpStatus.BAD_REQUEST,
  FOTO_NO_ENCONTRADA: HttpStatus.NOT_FOUND,

  // La mascota propia, un SVG (SCRUM-122). El tipo es 415 y el peso 413, como
  // en la foto; todo lo demas es un archivo que no vale (400): no es un SVG,
  // trae algo peligroso, usa algo que no se admite o es demasiado complejo.
  MASCOTA_SVG_TIPO_NO_PERMITIDO: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
  MASCOTA_SVG_DEMASIADO_PESADO: HttpStatus.PAYLOAD_TOO_LARGE,
  MASCOTA_SVG_NO_ES_UN_SVG: HttpStatus.BAD_REQUEST,
  MASCOTA_SVG_PELIGROSO: HttpStatus.BAD_REQUEST,
  MASCOTA_SVG_NO_ADMITIDO: HttpStatus.BAD_REQUEST,
  MASCOTA_SVG_DEMASIADO_COMPLEJO: HttpStatus.BAD_REQUEST,
  MASCOTA_PROPIA_NO_ENCONTRADA: HttpStatus.NOT_FOUND,
  // 503 como el borrado: el almacenamiento es de fuera, y reintentar en un
  // momento es lo que tiene que hacer quien llama.
  ALMACENAMIENTO_NO_DISPONIBLE: HttpStatus.SERVICE_UNAVAILABLE,

  // 503: el borrado depende del proveedor de autenticacion, y si este no
  // responde no se borra nada. No es culpa de quien llama, y reintentar en un
  // momento es exactamente lo que tiene que hacer.
  BORRADO_NO_COMPLETADO: HttpStatus.SERVICE_UNAVAILABLE,

  // Esto no es culpa de quien llama: significa que el catalogo del servidor
  // esta mal configurado. Devolver 400 le diria que corrija algo que no esta
  // en su mano.
  CONFIGURACION_DE_ACTIVIDAD_INVALIDA: HttpStatus.INTERNAL_SERVER_ERROR,
};

/**
 * Lo que se anota de un error interno sin arriesgar datos de nadie.
 *
 * Los errores de Prisma repiten en su mensaje los argumentos de la llamada que
 * fallo, y ahi pueden ir la metadata de un resultado o el texto libre de "Un
 * momento bueno del dia" (SCRUM-94). De esos se anota el nombre, el codigo y
 * los marcos de la traza, que es lo que sirve para encontrar el fallo, y nunca
 * el mensaje. Los demas errores se anotan enteros, como siempre.
 */
export function trazaSegura(error: unknown): string | undefined {
  if (!(error instanceof Error)) {
    // Un valor que no es un Error puede ser cualquier cosa, incluido un objeto
    // con datos de la peticion. Basta con saber que clase de cosa era.
    return `Se lanzo un valor que no es un Error (${typeof error}).`;
  }

  if (!error.name.startsWith('PrismaClient')) {
    return error.stack;
  }

  const codigo = 'code' in error && typeof error.code === 'string' ? ` ${error.code}` : '';
  const marcos = (error.stack ?? '')
    .split('\n')
    .filter((linea) => linea.trimStart().startsWith('at '));

  return [
    `${error.name}${codigo} (mensaje omitido: puede traer datos de la peticion)`,
    ...marcos,
  ].join('\n');
}

interface CuerpoDeError {
  readonly codigo: string;
  readonly mensaje: string;
}

/**
 * El estado de un error al leer el cuerpo de la peticion, si lo es.
 *
 * Los lanza el lector de JSON de Express antes de llegar a ninguna ruta: un
 * cuerpo demasiado grande (413) o que no es JSON (400). Traen su estado y la
 * marca `expose`, que dice que es un error de quien llama y se puede contar.
 *
 * Sin esto caian en el error interno: respondian 500 por algo que no es culpa
 * del servidor y se anotaban enteros. Y el mensaje de un JSON mal formado cita
 * un trozo del cuerpo, que en el diario es lo que alguien escribio.
 */
function estadoAlLeerElCuerpo(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }

  const { status, expose } = error as { status?: unknown; expose?: unknown };

  return typeof status === 'number' && status >= 400 && status < 500 && expose === true
    ? status
    : undefined;
}

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly registro = new Logger('Errores');

  constructor(
    @Optional()
    @Inject(REGISTRO_DE_SEGURIDAD)
    private readonly seguridad: RegistroDeSeguridadPort = new RegistroDeSeguridadNulo(),
  ) {}

  catch(excepcion: unknown, host: ArgumentsHost): void {
    const respuesta = host.switchToHttp().getResponse<Response>();

    if (excepcion instanceof DomainError) {
      const estado = ESTADO_POR_CODIGO[excepcion.code] ?? HttpStatus.BAD_REQUEST;
      const cuerpo: CuerpoDeError = { codigo: excepcion.code, mensaje: excepcion.message };

      this.registrarSiEsDeSeguridad(excepcion.code, host);

      // Un error del dominio con estado 5xx significa que algo nuestro fallo.
      // La persona recibe el mensaje claro; la causa tecnica va al registro,
      // que es donde sirve para encontrarla.
      if (estado >= HttpStatus.INTERNAL_SERVER_ERROR) {
        const identificador = identificadorDeLaRespuesta(respuesta) ?? 'sin identificador';
        const causa: unknown = excepcion.cause;

        this.registro.error(
          `${excepcion.code} [${identificador}]`,
          trazaSegura(causa instanceof Error ? causa : excepcion),
        );
      }

      respuesta.status(estado).json(cuerpo);

      return;
    }

    // Errores que ya vienen con su estado: validacion del DTO, ruta no
    // encontrada, limite de peticiones superado.
    if (excepcion instanceof HttpException) {
      respuesta.status(excepcion.getStatus()).json(excepcion.getResponse());

      return;
    }

    // El cuerpo no se pudo leer. Es de quien llama, asi que no se anota: el
    // registro de peticiones ya deja la linea con su estado.
    const estadoDelCuerpo = estadoAlLeerElCuerpo(excepcion);

    if (estadoDelCuerpo !== undefined) {
      const cuerpo: CuerpoDeError =
        estadoDelCuerpo === Number(HttpStatus.PAYLOAD_TOO_LARGE)
          ? {
              codigo: 'CUERPO_DEMASIADO_GRANDE',
              mensaje: 'Lo que enviaste supera el tamaño máximo que admite esta ruta.',
            }
          : {
              codigo: 'CUERPO_ILEGIBLE',
              mensaje: 'No se pudo leer el cuerpo de la petición. Comprueba que sea JSON válido.',
            };

      respuesta.status(estadoDelCuerpo).json(cuerpo);

      return;
    }

    // Cualquier otra cosa es un fallo nuestro. El detalle va al registro del
    // servidor, donde sirve para diagnosticar; al cliente solo le llega un
    // mensaje generico. Devolver la traza seria entregar un mapa del interior
    // del sistema a quien lo esta probando.
    // El identificador va en el mensaje, no solo en la traza. Es el puente
    // entre lo que la persona ve en pantalla y esta entrada del registro: sin
    // el, saber que hubo un error interno no ayuda a encontrar cual.
    const identificador = identificadorDeLaRespuesta(respuesta) ?? 'sin identificador';

    this.registro.error(`Error no controlado [${identificador}]`, trazaSegura(excepcion));

    const cuerpo: CuerpoDeError = {
      codigo: 'ERROR_INTERNO',
      mensaje: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    };

    respuesta.status(HttpStatus.INTERNAL_SERVER_ERROR).json(cuerpo);
  }

  /**
   * Un archivo que no es lo que dice ser, o que trae algo que no debe, se anota
   * como hecho de seguridad (SCRUM-163). La respuesta no cambia en nada.
   */
  private registrarSiEsDeSeguridad(codigo: string, host: ArgumentsHost): void {
    if (!esArchivoPeligroso(codigo)) {
      return;
    }

    try {
      const http = host.switchToHttp();
      const peticion = http.getRequest<PeticionConCuenta & Request>();

      // Sin cuenta no hay a quien atribuirlo; la ruta lo exige, asi que no deberia pasar.
      if (peticion.cuenta === undefined) {
        return;
      }

      this.seguridad.registrar({
        tipo: 'ARCHIVO_PELIGROSO_RECHAZADO',
        idUsuario: peticion.cuenta.id.value,
        motivo: codigo,
        ...contextoDeLaPeticion(peticion, http.getResponse<Response>()),
      });
    } catch {
      // Anotar el hecho nunca puede impedir que la persona reciba su respuesta.
    }
  }
}
