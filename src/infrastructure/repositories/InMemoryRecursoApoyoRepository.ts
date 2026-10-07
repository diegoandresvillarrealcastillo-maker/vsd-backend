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
    pais: 'CO',
    fuente: 'https://www.minsalud.gov.co',
    verificadoEl: '2026-09-16',
  }),
  RecursoApoyo.create({
    id: '0123c0de-0000-4000-8000-000000000123',
    titulo: 'Línea 123',
    descripcion:
      'Línea única de emergencias, en todo el país. Es la que hay que marcar si hay riesgo inmediato para la vida de alguien.',
    tipo: 'contacto',
    cobertura: 'nacional',
    pais: 'CO',
    fuente:
      'https://www1.funcionpublica.gov.co/preguntas-frecuentes/-/asset_publisher/sqxafjubsrEu/content/linea-unica-de-emergencias-nacional-123/28585938',
    verificadoEl: '2026-10-06',
  }),
  RecursoApoyo.create({
    id: '0106c0de-0000-4000-8000-000000000106',
    titulo: 'Línea 106, el poder de ser escuchado',
    descripcion:
      'Apoyo psicológico gratuito de la Secretaría Distrital de Salud, las 24 horas, todos los días del año. Se marca 106 desde Bogotá; también responde por WhatsApp al 300 754 8933 y en linea106@saludcapital.gov.co.',
    tipo: 'contacto',
    cobertura: 'bogota',
    enlace: 'https://www.saludcapital.gov.co',
    pais: 'CO',
    fuente:
      'https://literalmente.saludcapital.gov.co/salud-mental/que-tipo-de-ayuda-necesitas/lineas-de-atencion/',
    verificadoEl: '2026-10-06',
  }),
  // Mexico, Espana, Estados Unidos y el directorio internacional (SCRUM-124).
  // Los mismos datos que `20261009120000_lineas_de_ayuda_por_pais`.
  RecursoApoyo.create({
    id: '8009c0de-0000-4000-8000-000000911200',
    titulo: 'Línea de la Vida, 800 911 2000',
    descripcion:
      'Orientación gratuita en salud mental de la Secretaría de Salud, las 24 horas, todos los días del año. Se marca 800 911 2000.',
    tipo: 'contacto',
    cobertura: 'nacional',
    enlace: 'https://www.gob.mx/lineadelavida',
    pais: 'MX',
    fuente:
      'https://www.gob.mx/salud/prensa/239-linea-de-la-vida-celebra-25-anos-de-servicio-humano-para-poblacion-con-problemas-de-salud-mental',
    verificadoEl: '2026-10-06',
  }),
  RecursoApoyo.create({
    id: '0911c0de-0000-4000-8000-000000000911',
    titulo: 'Línea 911',
    descripcion:
      'Línea única de emergencias, en todo el país, las 24 horas, todos los días del año. Es la que hay que marcar si hay riesgo inmediato para la vida de alguien.',
    tipo: 'contacto',
    cobertura: 'nacional',
    pais: 'MX',
    fuente: 'https://www.gob.mx/911/articulos/que-es-9-1-1-conoce-mas-de-911emergencias',
    verificadoEl: '2026-10-06',
  }),
  RecursoApoyo.create({
    id: '0024c0de-0000-4000-8000-000000000024',
    titulo: 'Línea 024, llama a la vida',
    descripcion:
      'Línea del Ministerio de Sanidad: gratuita, confidencial y las 24 horas, todos los días del año. Escucha a quien lo está pasando mal y también a su familia y sus allegados. Se marca 024.',
    tipo: 'contacto',
    cobertura: 'nacional',
    enlace: 'https://www.sanidad.gob.es/linea024/home.htm',
    pais: 'ES',
    fuente: 'https://www.sanidad.gob.es/linea024/home.htm',
    verificadoEl: '2026-10-06',
  }),
  RecursoApoyo.create({
    id: '0112c0de-0000-4000-8000-000000000112',
    titulo: 'Línea 112',
    descripcion:
      'Teléfono de emergencias. Es el que hay que marcar si hay riesgo inmediato para la vida de alguien.',
    tipo: 'contacto',
    cobertura: 'nacional',
    pais: 'ES',
    fuente: 'https://www.sanidad.gob.es/linea024/home.htm',
    verificadoEl: '2026-10-06',
  }),
  RecursoApoyo.create({
    id: '0988c0de-0000-4000-8000-000000000988',
    titulo: 'Línea 988',
    descripcion:
      'Apoyo gratuito y confidencial por llamada, mensaje de texto o chat, las 24 horas, todos los días del año. Para hablar en español, marca 988 y presiona 2, o envía AYUDA por mensaje de texto al 988.',
    tipo: 'contacto',
    cobertura: 'nacional',
    enlace: 'https://988lifeline.org/get-help/',
    pais: 'US',
    fuente: 'https://988lifeline.org/get-help/',
    verificadoEl: '2026-10-06',
  }),
  RecursoApoyo.create({
    id: '1911c0de-0000-4000-8000-000000000911',
    titulo: 'Línea 911',
    descripcion:
      'Número de emergencias, las 24 horas. Es el que hay que marcar si hay riesgo inmediato para la vida de alguien.',
    tipo: 'contacto',
    cobertura: 'nacional',
    pais: 'US',
    fuente: 'https://www.usa.gov/features/the-988-lifeline-and-other-mental-health-services',
    verificadoEl: '2026-10-06',
  }),
  RecursoApoyo.create({
    id: '0ffec0de-0000-4000-8000-00000000f1de',
    titulo: 'Directorio internacional de líneas de ayuda',
    descripcion:
      'Todavía no tenemos verificadas las líneas del lugar donde estás, y preferimos no darte un número que podría no ser el tuyo. Este directorio, que recomienda la Asociación Internacional para la Prevención del Suicidio, reúne líneas gratuitas de muchos países, por teléfono, chat o mensaje. Si hay riesgo inmediato para la vida de alguien, llama al número de emergencias del lugar donde estás.',
    tipo: 'contacto',
    cobertura: 'internacional',
    enlace: 'https://findahelpline.com/',
    fuente: 'https://www.iasp.info/crisis-centres-helplines/',
    verificadoEl: '2026-10-06',
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

/** Las lineas del catalogo, tal cual: lo que comparan las pruebas con la base. */
export function catalogoDeLineas(): readonly RecursoApoyo[] {
  return RECURSOS.filter((recurso) => recurso.esLineaDeAtencion());
}

export class InMemoryRecursoApoyoRepository implements RecursoApoyoRepositoryPort {
  lineasDeAtencion(pais: string | undefined): Promise<readonly RecursoApoyo[]> {
    const lineas = catalogoDeLineas();
    const delPais = pais === undefined ? [] : lineas.filter((linea) => linea.pais === pais);

    // Un pais sin lineas, o sin pais, recibe lo que sirve en cualquier parte:
    // nunca las de otro pais.
    return Promise.resolve(
      RecursoApoyo.ordenarPorAlcance(
        delPais.length > 0 ? delPais : lineas.filter((linea) => linea.pais === undefined),
      ),
    );
  }

  porTema(tema: string): Promise<readonly RecursoApoyo[]> {
    return Promise.resolve(
      RecursoApoyo.ordenarPorAlcance(RECURSOS.filter((recurso) => recurso.tema === tema)),
    );
  }
}
