import { describe, expect, it } from 'vitest';
import { ConsultarLasReglasLocalesUseCaseImpl } from '../../application/usecases/ConsultarLasReglasLocalesUseCaseImpl.js';
import { CASOS_DE_LAS_REGLAS_LOCALES } from '../../pruebas/casosDeLasReglasLocales.js';
import { responderSinConexion } from '../../pruebas/motorLocalDeReferencia.js';
import { ReglasLocalesDelAsistenteDto } from '../controllers/dto/ReglasLocalesDelAsistenteDto.js';
import { InMemoryRecursoApoyoRepository } from '../repositories/InMemoryRecursoApoyoRepository.js';

/**
 * El contrato de las reglas locales (SCRUM-141), como archivo.
 *
 * `docs/contratos/reglas-locales.json` es **lo que publica el servidor** (el cuerpo
 * de `GET /api/asistente/reglas-locales`) junto con **lo que tiene que responder el
 * dispositivo** a cada frase del conjunto de casos. El frontend guarda una copia
 * de ese archivo y prueba su motor contra ella: asi las dos aplicaciones se
 * comprueban contra el mismo texto, aunque vivan en repositorios distintos.
 *
 * Esta prueba falla cuando algo que se publica cambia (una regla, un texto, una
 * linea, una zona, una frase del conjunto) sin que se regenere el archivo. Eso es lo
 * que se busca: **un cambio en lo que el dispositivo responde sin conexion no puede
 * pasar sin que se vea en la revision**, y sin que alguien se acuerde de copiarlo
 * al frontend.
 *
 * Para regenerarlo, a proposito y despues de leer la diferencia:
 *
 *     npx vitest run ContratoDeLasReglasLocales -u
 *
 * y copiar el archivo a `src/asistente/contrato/reglas-locales.json` del frontend.
 */
describe('el contrato de las reglas locales', () => {
  it('esta al dia: lo publicado y lo que debe responder el dispositivo', async () => {
    const reglas = await new ConsultarLasReglasLocalesUseCaseImpl(
      new InMemoryRecursoApoyoRepository(),
    ).ejecutar();

    const contrato = {
      // Tal como sale por HTTP: la forma del DTO, no la del dominio.
      paquete: JSON.parse(JSON.stringify(ReglasLocalesDelAsistenteDto.desde(reglas))) as unknown,
      casos: CASOS_DE_LAS_REGLAS_LOCALES.map((caso) => ({
        ...caso,
        esperado: responderSinConexion(reglas, caso),
      })),
    };

    await expect(`${JSON.stringify(contrato, null, 2)}\n`).toMatchFileSnapshot(
      '../../../docs/contratos/reglas-locales.json',
    );
  });
});
