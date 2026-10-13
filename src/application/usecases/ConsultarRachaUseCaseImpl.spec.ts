import { describe, expect, it } from 'vitest';
import { AccountNotProvisionedError } from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import type { User } from '../../domain/model/User.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { ConsultarRachaUseCaseImpl } from './ConsultarRachaUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';

// Viernes 2 de octubre de 2026, a las 9 p. m. en Bogota: ya es sabado 3 en UTC.
const NOCHE_DEL_VIERNES = new Date('2026-10-03T02:00:00.000Z');

function armar(cuenta: User | null, dias: readonly string[], ahora: Date = NOCHE_DEL_VIERNES) {
  const cuentas: UserRepositoryPort = {
    findById: () => Promise.resolve(cuenta),
    findByIdProveedorAuth: () => Promise.resolve(null),
    save: () => Promise.resolve(),
    consentimientosDe: () => Promise.resolve([]),
    borrarConTodo: () => Promise.resolve(),
  };
  const resultados = {
    diasConActividad: () => Promise.resolve(dias),
  } as unknown as ActivityResultRepositoryPort;

  return new ConsultarRachaUseCaseImpl(cuentas, resultados, () => ahora);
}

describe('ConsultarRachaUseCaseImpl', () => {
  it('sin cuenta falla como el resto de lo que pide una cuenta', async () => {
    await expect(armar(null, []).execute(new UserId(PERSONA))).rejects.toBeInstanceOf(
      AccountNotProvisionedError,
    );
  });

  it('sin actividad la llama descansa', async () => {
    const racha = await armar(unaCuenta(), []).execute(new UserId(PERSONA));

    expect(racha).toMatchObject({ dias: 0, enDescanso: true, hechoHoy: false });
  });

  it('cuenta los dias seguidos que terminan hoy', async () => {
    const racha = await armar(unaCuenta(), ['2026-09-30', '2026-10-01', '2026-10-02']).execute(
      new UserId(PERSONA),
    );

    expect(racha).toMatchObject({ dias: 3, hechoHoy: true, enDescanso: false });
  });

  it('«hoy» es el dia de Colombia: a las 9 p. m. del viernes todavia es viernes', async () => {
    // En UTC ya es sabado 3. Si «hoy» saliera del reloj UTC, el viernes quedaria como
    // «ayer» y la cadena no tendria hecho hoy.
    const racha = await armar(unaCuenta(), ['2026-10-02']).execute(new UserId(PERSONA));

    expect(racha.hechoHoy).toBe(true);
  });

  it('al dia siguiente, sin haber hecho nada aun, la cadena sigue en pie', async () => {
    const sabadoPorLaManana = new Date('2026-10-03T14:00:00.000Z');
    const racha = await armar(unaCuenta(), ['2026-10-01', '2026-10-02'], sabadoPorLaManana).execute(
      new UserId(PERSONA),
    );

    expect(racha).toMatchObject({ dias: 2, hechoHoy: false, enDescanso: false });
  });
});
