/**
 * Tokens de inyeccion de dependencias.
 *
 * Una interfaz de TypeScript no existe en tiempo de ejecucion, asi que no se
 * puede usar como identificador para inyectar. Estos simbolos hacen ese papel:
 * son el nombre por el que NestJS conoce a cada puerto.
 *
 * Gracias a ellos la capa de aplicacion sigue dependiendo solo de la interfaz,
 * y es este modulo el que decide que implementacion concreta se entrega.
 */
export const ACTIVITY_RESULT_REPOSITORY = Symbol('ActivityResultRepositoryPort');
export const ACTIVITY_REPOSITORY = Symbol('ActivityRepositoryPort');

/** Cliente de Prisma, o null cuando el servicio corre sin base de datos. */
export const PRISMA = Symbol('PrismaService');
export const CONFIGURACION = Symbol('Configuracion');

/** Las cuentas de VSD Health. */
export const USER_REPOSITORY = Symbol('UserRepositoryPort');

/** Alta de cuenta: el puente entre la identidad del proveedor y la nuestra. */
export const REGISTRAR_CUENTA = Symbol('RegistrarCuentaUseCase');

/** Modulos activos y mascota de la cuenta propia. */
export const ACTUALIZAR_PREFERENCIAS = Symbol('ActualizarPreferenciasUseCase');

/** Derechos de supresion y de acceso: borrar la cuenta y exportar los datos. */
export const BORRAR_CUENTA = Symbol('BorrarCuentaUseCase');
/**
 * Borrar una cuenta sin dejar constancia (SCRUM-190). Es para rechazar a un menor que ya tenia
 * datos: no hay autorizacion que demostrar, asi que no se conserva nada, ni la constancia.
 */
export const BORRAR_SIN_CONSTANCIA = Symbol('BorrarCuentaSinConstanciaUseCase');
export const EXPORTAR_DATOS = Symbol('ExportarDatosUseCase');

/** El diario: sus anotaciones y los tres casos de uso (SCRUM-95). */
export const DIARIO_REPOSITORY = Symbol('DiarioRepositoryPort');
export const CONSULTAR_DIARIO = Symbol('ConsultarDiarioUseCase');
export const ESCRIBIR_EN_EL_DIARIO = Symbol('EscribirEnElDiarioUseCase');
export const EDITAR_ANOTACION = Symbol('EditarAnotacionUseCase');

/** El semaforo de pendientes (SCRUM-97). */
export const PENDIENTES_REPOSITORY = Symbol('PendientesRepositoryPort');
export const PENDIENTES = Symbol('PendientesUseCase');
export const AVISOS_REPOSITORY = Symbol('AvisosRepositoryPort');

/** El catalogo de datos curiosos y el cursor de cada persona (SCRUM-185). */
export const DATO_CURIOSO_REPOSITORY = Symbol('DatoCuriosoRepositoryPort');

/** El dato curioso del dia (SCRUM-185). */
export const CONSULTAR_DATO_CURIOSO = Symbol('ConsultarDatoCuriosoUseCase');
export const ENVIADOR_PUSH = Symbol('EnviadorDePushPort');
export const AVISOS = Symbol('AvisosUseCase');
export const REVISAR_AVISOS = Symbol('RevisarAvisosUseCase');

/** La foto de perfil (SCRUM-120): su caso de uso y el almacen donde viven los archivos. */
export const FOTO_DE_PERFIL = Symbol('FotoDePerfilUseCase');
export const ALMACEN_DE_FOTOS = Symbol('AlmacenDeFotos');

/** La mascota propia, un SVG (SCRUM-122): su caso de uso y su almacen. */
export const MASCOTA_PROPIA = Symbol('MascotaPropiaUseCase');
export const ALMACEN_DE_MASCOTAS = Symbol('AlmacenDeMascotas');

/** Donde se anotan los hechos de seguridad (SCRUM-163). */
export const REGISTRO_DE_SEGURIDAD = Symbol('RegistroDeSeguridadPort');

/** La identidad en el proveedor de autenticacion. */
export const PROVEEDOR_DE_IDENTIDAD = Symbol('ProveedorDeIdentidadPort');

/** Base de conocimiento del asistente: la tabla RECURSO_APOYO. */
export const RECURSO_APOYO_REPOSITORY = Symbol('RecursoApoyoRepositoryPort');

/**
 * El asistente. Hoy siempre es el de reglas; en la Fase 2 este token es el
 * unico sitio donde se elige entre ese y el que use un modelo de lenguaje.
 */
export const ASISTENTE = Symbol('AsistentePort');

/** Las reglas de VSD IA que se aplican en el dispositivo, sin conexion (SCRUM-141). */
export const CONSULTAR_REGLAS_LOCALES = Symbol('ConsultarLasReglasLocalesUseCase');

/** El sendero de cada modulo activo. */
export const CONSULTAR_PROGRESO = Symbol('ConsultarProgresoUseCase');

/** La racha: dias seguidos con al menos una actividad (SCRUM-186). */
export const CONSULTAR_RACHA = Symbol('ConsultarRachaUseCase');

/** Lectura del catalogo: categorias con sus actividades. */
export const CONSULTAR_CATALOGO = Symbol('ConsultarCatalogoUseCase');
