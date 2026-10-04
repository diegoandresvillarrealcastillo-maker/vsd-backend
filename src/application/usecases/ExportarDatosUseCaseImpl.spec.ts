import { describe, expect, it } from 'vitest';
import { AccountNotProvisionedError } from '../../domain/model/DomainError.js';
import type { ActivityResult } from '../../domain/model/ActivityResult.js';
import { DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import { ClientOperationId, EntradaId, UserId } from '../../domain/model/Identifier.js';
import type { User } from '../../domain/model/User.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { ExportarDatosUseCaseImpl } from './ExportarDatosUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';
const AHORA = new Date('2026-10-02T15:00:00.000Z');
const ENTRADA = EntradaDeDiario.guardada({
  id: new EntradaId('33333333-3333-4333-a333-333333333333'),
  userId: new UserId(PERSONA),
  clientOperationId: new ClientOperationId('44444444-4444-4444-a444-444444444444'),
  dia: '2026-10-02',
  documento: DocumentoDelDiario.desdeTextoPlano('Hoy dormi mejor'),
  version: 1,
  creadaEn: AHORA,
  editadaEn: AHORA,
});

/** Arma el caso de uso con dobles que anotan por quien les preguntaron. */
function armar(cuenta: User | null) {
  const preguntas: { resultados?: string; desde?: Date; diario?: string } = {};

  const cuentas: UserRepositoryPort = {
    findById: () => Promise.resolve(cuenta),
    findByIdProveedorAuth: () => Promise.resolve(null),
    save: () => Promise.resolve(),
    borrarConTodo: () => Promise.resolve(),
  };

  const resultados = {
    ultimosDe: (id: UserId, desde: Date) => {
      preguntas.resultados = id.value;
      preguntas.desde = desde;

      return Promise.resolve([] as readonly ActivityResult[]);
    },
  } as unknown as ActivityResultRepositoryPort;

  const diario = {
    todasDe: (id: UserId) => {
      preguntas.diario = id.value;

      return Promise.resolve([ENTRADA]);
    },
  } as unknown as DiarioRepositoryPort;

  return {
    preguntas,
    casoDeUso: new ExportarDatosUseCaseImpl(cuentas, resultados, diario, () => AHORA),
  };
}

describe('ExportarDatosUseCaseImpl', () => {
  it('reune la cuenta, los resultados y el diario', async () => {
    const { casoDeUso } = armar(unaCuenta());

    const datos = await casoDeUso.execute(new UserId(PERSONA));

    expect(datos.cuenta.id.value).toBe(PERSONA);
    expect(datos.resultados).toEqual([]);
    expect(datos.entradasDeDiario).toEqual([ENTRADA]);
    expect(datos.generadoEn).toEqual(AHORA);
  });

  it('pregunta por la misma persona en cada repositorio', async () => {
    const { casoDeUso, preguntas } = armar(unaCuenta());

    await casoDeUso.execute(new UserId(PERSONA));

    expect(preguntas.resultados).toBe(PERSONA);
    expect(preguntas.diario).toBe(PERSONA);
  });

  it('exporta los resultados desde siempre, no solo los recientes', async () => {
    const { casoDeUso, preguntas } = armar(unaCuenta());

    await casoDeUso.execute(new UserId(PERSONA));

    expect(preguntas.desde?.getTime()).toBe(0);
  });

  it('sin cuenta no hay nada que exportar', async () => {
    const { casoDeUso } = armar(null);

    await expect(casoDeUso.execute(new UserId(PERSONA))).rejects.toThrow(
      AccountNotProvisionedError,
    );
  });
});
