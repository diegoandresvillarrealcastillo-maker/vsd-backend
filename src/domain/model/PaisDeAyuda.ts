import { Calendario } from './Calendario.js';

/**
 * En que pais esta una persona, sacado de su zona horaria (SCRUM-124).
 *
 * ## Por que la zona y no la ubicacion
 *
 * Nunca se pide GPS ni permiso de ubicacion. La zona horaria ya la guarda cada
 * cuenta (SCRUM-123, ADR 0014) y alcanza para lo unico que hace falta: decidir
 * que telefonos de ayuda ensenar.
 *
 * ## Por que una lista escrita a mano
 *
 * Un numero equivocado en una crisis es el peor error posible. Por eso solo hay
 * pais para los paises **cuyas lineas verifico una persona** contra la fuente
 * oficial (ver `docs/textos-del-asistente.md`, seccion de lineas de atencion).
 * Cualquier otra zona no tiene pais, y quien la tiene recibe el directorio
 * internacional y no el telefono de otro pais como si fuera suyo.
 *
 * Agregar un pais son tres cosas, juntas: sus zonas aqui, sus lineas en una
 * migracion (con fuente y fecha de verificacion) y su copia en
 * `InMemoryRecursoApoyoRepository`. Hay pruebas que fallan si una de las tres
 * se queda atras.
 *
 * Las zonas son las que `Intl` conoce para cada pais, y una prueba lo comprueba:
 * si una version nueva de Node trae una zona nueva de uno de estos paises, la
 * prueba avisa en lugar de dejar a alguien sin sus lineas.
 *
 * Los codigos son ISO 3166-1 de dos letras.
 */
export const ZONAS_POR_PAIS = {
  CO: ['America/Bogota'],
  MX: [
    'America/Bahia_Banderas',
    'America/Cancun',
    'America/Chihuahua',
    'America/Ciudad_Juarez',
    'America/Hermosillo',
    'America/Matamoros',
    'America/Mazatlan',
    'America/Merida',
    'America/Mexico_City',
    'America/Monterrey',
    'America/Ojinaga',
    'America/Tijuana',
  ],
  ES: ['Africa/Ceuta', 'Atlantic/Canary', 'Europe/Madrid'],
  US: [
    'America/Adak',
    'America/Anchorage',
    'America/Boise',
    'America/Chicago',
    'America/Denver',
    'America/Detroit',
    'America/Indiana/Knox',
    'America/Indiana/Marengo',
    'America/Indiana/Petersburg',
    'America/Indiana/Tell_City',
    'America/Indiana/Vevay',
    'America/Indiana/Vincennes',
    'America/Indiana/Winamac',
    'America/Indianapolis',
    'America/Juneau',
    'America/Kentucky/Monticello',
    'America/Los_Angeles',
    'America/Louisville',
    'America/Menominee',
    'America/Metlakatla',
    'America/New_York',
    'America/Nome',
    'America/North_Dakota/Beulah',
    'America/North_Dakota/Center',
    'America/North_Dakota/New_Salem',
    'America/Phoenix',
    'America/Sitka',
    'America/Yakutat',
    'Pacific/Honolulu',
    // Los nombres con los que otras versiones de Node escriben dos zonas de
    // Indiana y Kentucky. Una cuenta guardada con ellos sigue siendo de aqui.
    'America/Indiana/Indianapolis',
    'America/Kentucky/Louisville',
  ],
} as const satisfies Readonly<Record<string, readonly string[]>>;

/** Un pais con lineas de ayuda verificadas. */
export type CodigoDePais = keyof typeof ZONAS_POR_PAIS;

export const PAISES_CON_LINEAS = Object.keys(ZONAS_POR_PAIS) as readonly CodigoDePais[];

const PAIS_POR_ZONA: ReadonlyMap<string, CodigoDePais> = new Map(
  PAISES_CON_LINEAS.flatMap((pais) =>
    ZONAS_POR_PAIS[pais].map((zona): [string, CodigoDePais] => [zona, pais]),
  ),
);

/**
 * El pais de una zona horaria, o `undefined` si no esta entre los que tienen
 * lineas verificadas.
 *
 * Una zona desconocida o mal escrita tampoco tiene pais: aqui no se lanza un
 * error, porque esto se llama cuando alguien puede estar mal y lo ultimo que
 * debe pasar es que falle.
 */
export function paisDeLaZona(zona: string): CodigoDePais | undefined {
  if (!Calendario.esZonaValida(zona)) {
    return undefined;
  }

  return PAIS_POR_ZONA.get(Calendario.canonica(zona));
}
