import { describe, expect, it, vi } from 'vitest';
import { AccountNotProvisionedError } from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import { RecursoApoyo } from '../../domain/model/RecursoApoyo.js';
import type { User } from '../../domain/model/User.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { RecursoApoyoRepositoryPort } from '../../domain/ports/out/RecursoApoyoRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { ConsultarAcompanamientoUseCaseImpl } from './ConsultarAcompanamientoUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';

// Viernes 2 de octubre de 2026, a las 9 p. m. en Bogota: ya es sabado 3 en UTC.
const NOCHE_DEL_VIERNES = new Date('2026-10-03T02:00:00.000Z');

const LINEA_NACIONAL = RecursoApoyo.create({
  id: '0192c0de-0000-4000-8000-000000000192',
  titulo: 'Línea 192, opción 4',
  tipo: 'contacto',
  cobertura: 'nacional',
  pais: 'CO',
  fuente: 'https://www.minsalud.gov.co',
  verificadoEl: '2026-10-01',
});
const LINEA_DE_BOGOTA = RecursoApoyo.create({
  id: '0106c0de-0000-4000-8000-000000000106',
  titulo: 'Línea 106',
  tipo: 'contacto',
  cobertura: 'bogota',
  pais: 'CO',
  fuente: 'https://www.minsalud.gov.co',
  verificadoEl: '2026-10-01',
});

function armar(cuenta: User | null, dias: readonly string[], ahora: Date = NOCHE_DEL_VIERNES) {
  const cuentas: UserRepositoryPort = {
    findById: () => Promise.resolve(cuenta),
    findByIdProveedorAuth: () => Promise.resolve(null),
    save: () => Promise.resolve(),
    consentimientosDe: () => Promise.resolve([]),
    borrarConTodo: () => Promise.resolve(),
    inactivarConTodo: () => Promise.resolve(),
    estaInactivadaPorProveedor: () => Promise.resolve(false),
  };
  const resultados = {
    diasConAtencion: () => Promise.resolve(dias),
  } as unknown as ActivityResultRepositoryPort;
  const lineasDeAtencion = vi.fn(() => Promise.resolve([LINEA_DE_BOGOTA, LINEA_NACIONAL]));
  const recursos = { lineasDeAtencion } as unknown as RecursoApoyoRepositoryPort;

  return {
    caso: new ConsultarAcompanamientoUseCaseImpl(cuentas, resultados, recursos, () => ahora),
    lineasDeAtencion,
  };
}

describe('ConsultarAcompanamientoUseCaseImpl (SCRUM-177)', () => {
  it('sin cuenta falla como el resto de lo que pide una cuenta', async () => {
    await expect(armar(null, []).caso.execute(new UserId(PERSONA))).rejects.toBeInstanceOf(
      AccountNotProvisionedError,
    );
  });

  it('sin dias con atencion, ninguno y ninguna linea', async () => {
    const { caso, lineasDeAtencion } = armar(unaCuenta(), []);

    expect(await caso.execute(new UserId(PERSONA))).toEqual({
      nivel: 'ninguno',
      lineasDeAtencion: [],
    });
    expect(lineasDeAtencion).not.toHaveBeenCalled();
  });

  it('a los 3 dias seguidos, moderado, sin lineas: se ofrece hablarlo, no se llena de numeros', async () => {
    const { caso, lineasDeAtencion } = armar(unaCuenta(), [
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
    ]);

    expect(await caso.execute(new UserId(PERSONA))).toEqual({
      nivel: 'moderado',
      lineasDeAtencion: [],
    });
    expect(lineasDeAtencion).not.toHaveBeenCalled();
  });

  it('a los 7 dias seguidos, critico, con las lineas de su pais ordenadas por alcance', async () => {
    const { caso, lineasDeAtencion } = armar(unaCuenta(), [
      '2026-09-26',
      '2026-09-27',
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
    ]);

    const acompanamiento = await caso.execute(new UserId(PERSONA));

    expect(acompanamiento.nivel).toBe('critico');
    // Lo nacional primero: la 106 solo contesta desde Bogota.
    expect(acompanamiento.lineasDeAtencion.map((linea) => linea.id)).toEqual([
      LINEA_NACIONAL.id,
      LINEA_DE_BOGOTA.id,
    ]);
    expect(lineasDeAtencion).toHaveBeenCalledWith('CO');
  });

  it('en una zona sin pais con lineas verificadas pide el directorio, nunca el numero de otro pais', async () => {
    const { caso, lineasDeAtencion } = armar(unaCuenta().conZonaHoraria('Pacific/Auckland'), [
      '2026-09-26',
      '2026-09-27',
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
    ]);

    await caso.execute(new UserId(PERSONA));

    expect(lineasDeAtencion).toHaveBeenCalledWith(undefined);
  });

  it('«hoy» es el dia de la persona: a las 9 p. m. del viernes todavia es viernes', async () => {
    // En UTC ya es sabado 3. Con ese «hoy», la cadena de 3 dias que termina el viernes seria
    // «de antes de ayer» y no contaria.
    const { caso } = armar(unaCuenta(), ['2026-09-30', '2026-10-01', '2026-10-02']);

    expect((await caso.execute(new UserId(PERSONA))).nivel).toBe('moderado');
  });

  it('sin atencion hoy, la cadena de ayer sigue en pie', async () => {
    const sabadoPorLaManana = new Date('2026-10-03T14:00:00.000Z');
    const { caso } = armar(
      unaCuenta(),
      ['2026-09-30', '2026-10-01', '2026-10-02'],
      sabadoPorLaManana,
    );

    expect((await caso.execute(new UserId(PERSONA))).nivel).toBe('moderado');
  });

  it('una cadena rota hace dias ya no ofrece nada', async () => {
    const { caso } = armar(
      unaCuenta(),
      ['2026-09-30', '2026-10-01', '2026-10-02'],
      new Date('2026-10-08T15:00:00.000Z'),
    );

    expect((await caso.execute(new UserId(PERSONA))).nivel).toBe('ninguno');
  });
});
