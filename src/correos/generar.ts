import { mkdirSync, writeFileSync } from 'node:fs';
import { CARPETA_DE_GENERADOS, construirCorreos } from './construirCorreos.js';

/**
 * Escribe los correos de Supabase Auth en `correos/generados/` (SCRUM-125).
 *
 * Lo usa `npm run correos`. Despues de tocar la plantilla, la paleta o un
 * texto, se corre esto y se sube el resultado junto con el cambio: una prueba
 * falla si lo generado no coincide con lo que hay en el repositorio.
 */
mkdirSync(CARPETA_DE_GENERADOS, { recursive: true });

for (const correo of construirCorreos()) {
  writeFileSync(new URL(`${correo.archivo}.html`, CARPETA_DE_GENERADOS), correo.html, 'utf8');
  console.log(`correos/generados/${correo.archivo}.html  (${correo.plantillaEnSupabase})`);
}
