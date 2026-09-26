import { RecursoApoyo } from '../../domain/model/RecursoApoyo.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';

/**
 * Base de conocimiento minima, en memoria.
 *
 * No es un doble de pruebas: es lo que responde el asistente cuando la
 * aplicacion corre sin base de datos, que es el caso de desarrollo y el que
 * habra en el dispositivo cuando el asistente viva tambien en la PWA (RF9).
 *
 * Por eso trae las lineas de atencion de verdad y no datos de ejemplo. Un
 * asistente que en local responde con telefonos inventados es un asistente
 * que nadie puede revisar antes de publicarlo.
 *
 * Los mismos datos estan sembrados en la migracion
 * `20260916130000_recursos_de_apoyo`, corregidos despues en
 * `20260926120000_tildes_en_los_textos_visibles`. Si cambian ahi, cambian aqui:
 * hay una prueba que compara las dos fuentes.
 *
 * Estos textos llevan tildes y enes, al contrario que el resto del codigo. No
 * son codigo: son lo que alguien lee en pantalla, y en el caso de las lineas de
 * atencion, lo que lee en el peor momento.
 */
const RECURSOS: readonly RecursoApoyo[] = [
  RecursoApoyo.create({
    id: '0192c0de-0000-4000-8000-000000000192',
    titulo: 'Línea 192, opción 4',
    descripcion:
      'Orientación en salud mental del Ministerio de Salud. Funciona en todo el país: se marca 192 y se elige la opción 4. Atiende un equipo de profesionales.',
    tipo: 'contacto',
    cobertura: 'nacional',
    enlace: 'https://www.minsalud.gov.co',
  }),
  RecursoApoyo.create({
    id: '0123c0de-0000-4000-8000-000000000123',
    titulo: 'Línea 123',
    descripcion:
      'Línea única de emergencias, en todo el país. Es la que hay que marcar si hay riesgo inmediato para la vida de alguien.',
    tipo: 'contacto',
    cobertura: 'nacional',
  }),
  RecursoApoyo.create({
    id: '0106c0de-0000-4000-8000-000000000106',
    titulo: 'Línea 106, el poder de ser escuchado',
    descripcion:
      'Apoyo psicológico gratuito de la Secretaría Distrital de Salud, las 24 horas, todos los días del año. Se marca 106 desde Bogotá; también responde por WhatsApp al 300 754 8933 y en linea106@saludcapital.gov.co.',
    tipo: 'contacto',
    cobertura: 'bogota',
    enlace: 'https://www.saludcapital.gov.co',
  }),
  RecursoApoyo.create({
    id: '0a000000-0000-4000-8000-000000000001',
    titulo: 'Qué significa tu nivel',
    descripcion:
      'El nivel resume cómo te fue en esa actividad concreta, ese día. No dice nada sobre ti como persona, y un mismo nivel puede significar cosas distintas según la actividad.',
    tipo: 'lectura',
    tema: 'resultado',
    cobertura: 'nacional',
  }),
  RecursoApoyo.create({
    id: '0a000000-0000-4000-8000-000000000002',
    titulo: 'Rutina para descansar mejor',
    descripcion:
      'Acostarte y levantarte a la misma hora, dejar las pantallas media hora antes y bajar la luz de la habitación son los tres cambios con más efecto y los más fáciles de sostener.',
    tipo: 'lectura',
    tema: 'sueno',
    cobertura: 'nacional',
  }),
  RecursoApoyo.create({
    id: '0a000000-0000-4000-8000-000000000003',
    titulo: 'Cuando el día viene pesado',
    descripcion:
      'Sentirte mal un día no requiere explicación ni solución inmediata. Ayuda moverte un rato, tomar agua, y contárselo a alguien de confianza antes de que se acumule.',
    tipo: 'lectura',
    tema: 'animo',
    cobertura: 'nacional',
  }),
];

export class InMemoryRecursoApoyoRepository implements RecursoApoyoRepositoryPort {
  lineasDeAtencion(): Promise<readonly RecursoApoyo[]> {
    return Promise.resolve(
      RecursoApoyo.ordenarPorAlcance(RECURSOS.filter((recurso) => recurso.esLineaDeAtencion())),
    );
  }

  porTema(tema: string): Promise<readonly RecursoApoyo[]> {
    return Promise.resolve(
      RecursoApoyo.ordenarPorAlcance(RECURSOS.filter((recurso) => recurso.tema === tema)),
    );
  }
}
