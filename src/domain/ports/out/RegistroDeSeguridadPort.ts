import type { EventoDeSeguridad } from '../../model/EventoDeSeguridad.js';

/**
 * Donde se anotan los hechos de seguridad (SCRUM-163).
 *
 * ## Dos reglas que el contrato exige a cualquier adaptador
 *
 * 1. **Nunca lanza.** Anotar un hecho es secundario: si el servicio de registros
 *    esta caido, borrar una cuenta o rechazar un token tiene que seguir
 *    funcionando. Un adaptador que falla se traga el error y, como mucho, avisa
 *    sin incluir el evento.
 * 2. **No espera.** El metodo es sincrono y vuelve enseguida; si hay que hablar
 *    con la red, se hace despues y por separado. Una peticion no puede quedar
 *    esperando a un servicio de fuera.
 */
export interface RegistroDeSeguridadPort {
  registrar(evento: EventoDeSeguridad): void;
}
