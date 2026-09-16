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

/** Base de conocimiento del asistente: la tabla RECURSO_APOYO. */
export const RECURSO_APOYO_REPOSITORY = Symbol('RecursoApoyoRepositoryPort');

/**
 * El asistente. Hoy siempre es el de reglas; en la Fase 2 este token es el
 * unico sitio donde se elige entre ese y el que use un modelo de lenguaje.
 */
export const ASISTENTE = Symbol('AsistentePort');
