import type { DatosExportados } from '../../../domain/ports/in/ExportarDatosUseCase.js';
import { convertirEnFlujo, ListaEnFlujo, objetoJsonEnFlujo } from '../jsonEnFlujo.js';
import { EntradaDelDiarioDto } from './EntradaDelDiarioDto.js';
import { ExportacionDto } from './ExportacionDto.js';
import { PendienteDto } from './PendienteDto.js';

/**
 * La exportacion de los datos propios como JSON, escrita por piezas (SCRUM-262).
 *
 * Es el mismo JSON de `ExportacionDto`, con las mismas claves y en el mismo orden; lo unico que
 * cambia es que los resultados, el diario y los pendientes no se arman en una lista: cada uno se
 * convierte y se escribe cuando llega, y se suelta.
 *
 * El tipo de `piezas` obliga a que esten **todas** las claves de `ExportacionDto`: si alguien anade
 * un campo a la clase y no aqui, no compila. El orden de las claves es el del objeto.
 */
export function exportacionEnFlujo(
  datos: DatosExportados,
): AsyncGenerator<string, void, undefined> {
  const resto = ExportacionDto.sinListas(datos);

  const piezas: { [K in keyof ExportacionDto]: ExportacionDto[K] | ListaEnFlujo } = {
    generadoEn: resto.generadoEn,
    cuenta: resto.cuenta,
    fechaNacimiento: resto.fechaNacimiento,
    consentimientos: resto.consentimientos,
    resultados: new ListaEnFlujo(
      convertirEnFlujo(datos.resultados, (exportado) => ExportacionDto.resultado(exportado)),
    ),
    entradasDeDiario: new ListaEnFlujo(
      convertirEnFlujo(datos.entradasDeDiario, (entrada) => EntradaDelDiarioDto.desde(entrada)),
    ),
    pendientes: new ListaEnFlujo(
      convertirEnFlujo(datos.pendientes, (pendiente) => PendienteDto.desde(pendiente)),
    ),
    avisos: resto.avisos,
    foto: resto.foto,
    mascotaPropia: resto.mascotaPropia,
    datoCurioso: resto.datoCurioso,
  };

  return objetoJsonEnFlujo(Object.entries(piezas));
}
