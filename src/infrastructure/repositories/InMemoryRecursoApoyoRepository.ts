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
 * `20260916130000_recursos_de_apoyo`. Si cambian ahi, cambian aqui: hay una
 * prueba que compara las dos fuentes.
 */
const RECURSOS: readonly RecursoApoyo[] = [
  RecursoApoyo.create({
    id: '0192c0de-0000-4000-8000-000000000192',
    titulo: 'Linea 192, opcion 4',
    descripcion:
      'Orientacion en salud mental del Ministerio de Salud. Funciona en todo el pais: se marca 192 y se elige la opcion 4. Atiende un equipo de profesionales.',
    tipo: 'contacto',
    cobertura: 'nacional',
    enlace: 'https://www.minsalud.gov.co',
  }),
  RecursoApoyo.create({
    id: '0123c0de-0000-4000-8000-000000000123',
    titulo: 'Linea 123',
    descripcion:
      'Linea unica de emergencias, en todo el pais. Es la que hay que marcar si hay riesgo inmediato para la vida de alguien.',
    tipo: 'contacto',
    cobertura: 'nacional',
  }),
  RecursoApoyo.create({
    id: '0106c0de-0000-4000-8000-000000000106',
    titulo: 'Linea 106, el poder de ser escuchado',
    descripcion:
      'Apoyo psicologico gratuito de la Secretaria Distrital de Salud, las 24 horas, todos los dias del ano. Se marca 106 desde Bogota; tambien responde por WhatsApp al 300 754 8933 y en linea106@saludcapital.gov.co.',
    tipo: 'contacto',
    cobertura: 'bogota',
    enlace: 'https://www.saludcapital.gov.co',
  }),
  RecursoApoyo.create({
    id: '0a000000-0000-4000-8000-000000000001',
    titulo: 'Que significa tu nivel',
    descripcion:
      'El nivel resume como te fue en esa actividad concreta, ese dia. No dice nada sobre ti como persona, y un mismo nivel puede significar cosas distintas segun la actividad.',
    tipo: 'lectura',
    tema: 'resultado',
    cobertura: 'nacional',
  }),
  RecursoApoyo.create({
    id: '0a000000-0000-4000-8000-000000000002',
    titulo: 'Rutina para descansar mejor',
    descripcion:
      'Acostarte y levantarte a la misma hora, dejar las pantallas media hora antes y bajar la luz de la habitacion son los tres cambios con mas efecto y los mas faciles de sostener.',
    tipo: 'lectura',
    tema: 'sueno',
    cobertura: 'nacional',
  }),
  RecursoApoyo.create({
    id: '0a000000-0000-4000-8000-000000000003',
    titulo: 'Cuando el dia viene pesado',
    descripcion:
      'Sentirte mal un dia no requiere explicacion ni solucion inmediata. Ayuda moverte un rato, tomar agua, y contarselo a alguien de confianza antes de que se acumule.',
    tipo: 'lectura',
    tema: 'animo',
    cobertura: 'nacional',
  }),
  RecursoApoyo.create({
    id: '0a000000-0000-4000-8000-000000000004',
    titulo: 'Bienestar universitario',
    descripcion:
      'La Universidad de Cundinamarca tiene acompanamiento psicologico gratuito para estudiantes. Se pide por Bienestar Universitario en tu sede.',
    tipo: 'contacto',
    tema: 'ayuda',
    cobertura: 'universidad',
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
