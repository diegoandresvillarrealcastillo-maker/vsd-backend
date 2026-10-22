import { beforeEach, describe, expect, it } from 'vitest';
import {
  VERSION_VIGENTE_DE_LOS_TERMINOS,
  VERSION_VIGENTE_DEL_AVISO,
} from '../../domain/model/AvisoDePrivacidad.js';
import {
  AccountNotProvisionedError,
  MissingConsentError,
  OutdatedPrivacyNoticeError,
  OutdatedTermsError,
} from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import {
  type ConsentimientoAceptado,
  TipoDeConsentimiento,
  type User,
} from '../../domain/model/User.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { AceptarTextosVigentesUseCaseImpl } from './AceptarTextosVigentesUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';

const ANTES = new Date('2026-09-16T10:00:00.000Z');
const AHORA = new Date('2026-11-02T15:30:00.000Z');

const ACEPTA_TODO = {
  aceptaAviso: true,
  versionPolitica: VERSION_VIGENTE_DEL_AVISO,
  aceptaTerminos: true,
  versionTerminos: VERSION_VIGENTE_DE_LOS_TERMINOS,
} as const;

/**
 * Doble del repositorio que, como la base, lleva el historial de lo aceptado: solo se anade, y lo
 * que ya estaba no se repite. Hace falta aqui porque lo que se comprueba es justo eso: que volver a
 * aceptar suma y no reemplaza.
 */
class RepositorioConHistorial implements UserRepositoryPort {
  private readonly porId = new Map<string, User>();
  private readonly historial = new Map<string, ConsentimientoAceptado[]>();

  findById(id: UserId): Promise<User | null> {
    return Promise.resolve(this.porId.get(id.value) ?? null);
  }

  findByIdProveedorAuth(idProveedorAuth: string): Promise<User | null> {
    const encontrada = [...this.porId.values()].find(
      (cuenta) => cuenta.idProveedorAuth === idProveedorAuth,
    );

    return Promise.resolve(encontrada ?? null);
  }

  save(user: User): Promise<void> {
    this.porId.set(user.id.value, user);

    const anotadas = this.historial.get(user.id.value) ?? [];
    const aceptados: ConsentimientoAceptado[] = [
      ...(user.consentimiento === undefined
        ? []
        : [
            {
              tipo: TipoDeConsentimiento.AVISO_DE_PRIVACIDAD,
              version: user.consentimiento.versionPolitica,
              aceptadoEn: user.consentimiento.aceptadoEn,
            },
          ]),
      ...(user.terminos === undefined
        ? []
        : [
            {
              tipo: TipoDeConsentimiento.TERMINOS,
              version: user.terminos.versionPolitica,
              aceptadoEn: user.terminos.aceptadoEn,
            },
          ]),
    ];

    for (const nuevo of aceptados) {
      const repetido = anotadas.some(
        (fila) =>
          fila.tipo === nuevo.tipo &&
          fila.version === nuevo.version &&
          fila.aceptadoEn.getTime() === nuevo.aceptadoEn.getTime(),
      );

      if (!repetido) {
        anotadas.push(nuevo);
      }
    }

    this.historial.set(user.id.value, anotadas);

    return Promise.resolve();
  }

  consentimientosDe(id: UserId): Promise<readonly ConsentimientoAceptado[]> {
    return Promise.resolve([...(this.historial.get(id.value) ?? [])]);
  }

  borrarConTodo(): Promise<void> {
    return Promise.reject(new Error('no se usa en esta prueba'));
  }

  inactivarConTodo(): Promise<void> {
    return Promise.reject(new Error('no se usa en esta prueba'));
  }

  estaInactivadaPorProveedor(): Promise<boolean> {
    return Promise.resolve(false);
  }
}

describe('AceptarTextosVigentesUseCaseImpl (SCRUM-237)', () => {
  let cuentas: RepositorioConHistorial;
  let caso: AceptarTextosVigentesUseCaseImpl;

  beforeEach(() => {
    cuentas = new RepositorioConHistorial();
    caso = new AceptarTextosVigentesUseCaseImpl(cuentas, () => AHORA);
  });

  /** Una cuenta que acepto textos de antes: los dos viejos, salvo lo que se indique. */
  async function conLosTextosDeAntes(
    cambios: { versionPolitica?: string; versionTerminos?: string } = {},
  ): Promise<void> {
    await cuentas.save(
      unaCuenta({
        id: PERSONA,
        aceptadoEn: ANTES,
        versionPolitica: cambios.versionPolitica ?? '2026-09-1',
        versionTerminos: cambios.versionTerminos ?? '2026-10-1',
      }),
    );
  }

  async function laCuenta() {
    const cuenta = await cuentas.findById(new UserId(PERSONA));

    if (cuenta === null) {
      throw new Error('la cuenta deberia existir');
    }

    return cuenta;
  }

  it('al aceptar los dos textos vigentes los guarda con su version y la fecha de hoy', async () => {
    await conLosTextosDeAntes();

    const cuenta = await caso.execute(new UserId(PERSONA), ACEPTA_TODO);

    expect(cuenta.consentimiento).toEqual({
      versionPolitica: VERSION_VIGENTE_DEL_AVISO,
      aceptadoEn: AHORA,
    });
    expect(cuenta.terminos).toEqual({
      versionPolitica: VERSION_VIGENTE_DE_LOS_TERMINOS,
      aceptadoEn: AHORA,
    });
    expect(await laCuenta()).toEqual(cuenta);
  });

  it('lo anterior no se pierde: el historial conserva lo que acepto antes y suma lo de ahora', async () => {
    await conLosTextosDeAntes();

    await caso.execute(new UserId(PERSONA), ACEPTA_TODO);

    const historial = await cuentas.consentimientosDe(new UserId(PERSONA));

    expect(historial.map((h) => `${h.tipo} ${h.version}`).sort()).toEqual(
      [
        'aviso_de_privacidad 2026-09-1',
        'terminos 2026-10-1',
        `aviso_de_privacidad ${VERSION_VIGENTE_DEL_AVISO}`,
        `terminos ${VERSION_VIGENTE_DE_LOS_TERMINOS}`,
      ].sort(),
    );
  });

  it('si solo cambiaron los terminos, solo hay que aceptar los terminos', async () => {
    await conLosTextosDeAntes({ versionPolitica: VERSION_VIGENTE_DEL_AVISO });

    const cuenta = await caso.execute(new UserId(PERSONA), {
      aceptaTerminos: true,
      versionTerminos: VERSION_VIGENTE_DE_LOS_TERMINOS,
    });

    expect(cuenta.terminos?.aceptadoEn).toEqual(AHORA);
    expect(cuenta.consentimiento?.aceptadoEn).toEqual(ANTES);
  });

  it('lo que ya estaba al dia no se vuelve a fechar aunque la orden lo traiga', async () => {
    // La fecha es la prueba de cuando acepto. Aceptar de nuevo lo que ya aceptaba la reescribiria.
    await conLosTextosDeAntes({ versionPolitica: VERSION_VIGENTE_DEL_AVISO });

    const cuenta = await caso.execute(new UserId(PERSONA), ACEPTA_TODO);

    expect(cuenta.consentimiento?.aceptadoEn).toEqual(ANTES);
    expect(cuenta.terminos?.aceptadoEn).toEqual(AHORA);
  });

  it('sin nada pendiente no hace nada: ni guarda ni anade al historial', async () => {
    await conLosTextosDeAntes({
      versionPolitica: VERSION_VIGENTE_DEL_AVISO,
      versionTerminos: VERSION_VIGENTE_DE_LOS_TERMINOS,
    });
    const antes = await cuentas.consentimientosDe(new UserId(PERSONA));

    const cuenta = await caso.execute(new UserId(PERSONA), ACEPTA_TODO);

    expect(cuenta.consentimiento?.aceptadoEn).toEqual(ANTES);
    expect(await cuentas.consentimientosDe(new UserId(PERSONA))).toEqual(antes);
  });

  it('repetirlo no duplica nada', async () => {
    await conLosTextosDeAntes();

    await caso.execute(new UserId(PERSONA), ACEPTA_TODO);
    const despuesDeUna = await cuentas.consentimientosDe(new UserId(PERSONA));
    await caso.execute(new UserId(PERSONA), ACEPTA_TODO);

    expect(await cuentas.consentimientosDe(new UserId(PERSONA))).toEqual(despuesDeUna);
  });

  describe('lo que se rechaza, sin guardar nada', () => {
    async function nadaCambio(): Promise<void> {
      const cuenta = await laCuenta();

      expect(cuenta.consentimiento).toEqual({ versionPolitica: '2026-09-1', aceptadoEn: ANTES });
      expect(cuenta.terminos).toEqual({ versionPolitica: '2026-10-1', aceptadoEn: ANTES });
    }

    it.each([
      ['no marca el aviso', { ...ACEPTA_TODO, aceptaAviso: false }],
      ['no manda la casilla del aviso', { ...ACEPTA_TODO, aceptaAviso: undefined }],
      ['no marca los terminos', { ...ACEPTA_TODO, aceptaTerminos: false }],
      ['no manda la version del aviso', { ...ACEPTA_TODO, versionPolitica: undefined }],
      ['manda la version de los terminos en blanco', { ...ACEPTA_TODO, versionTerminos: '  ' }],
    ])('si %s: falta el consentimiento', async (_caso, orden) => {
      await conLosTextosDeAntes();

      await expect(caso.execute(new UserId(PERSONA), orden)).rejects.toBeInstanceOf(
        MissingConsentError,
      );
      await nadaCambio();
    });

    it('un aviso que ya no es el vigente', async () => {
      await conLosTextosDeAntes();

      await expect(
        caso.execute(new UserId(PERSONA), { ...ACEPTA_TODO, versionPolitica: '2026-09-1' }),
      ).rejects.toBeInstanceOf(OutdatedPrivacyNoticeError);
      await nadaCambio();
    });

    it('unos terminos que ya no son los vigentes', async () => {
      await conLosTextosDeAntes();

      await expect(
        caso.execute(new UserId(PERSONA), { ...ACEPTA_TODO, versionTerminos: '2026-10-1' }),
      ).rejects.toBeInstanceOf(OutdatedTermsError);
      await nadaCambio();
    });

    it('si falta uno de los dos pendientes, no se acepta ni el otro', async () => {
      await conLosTextosDeAntes();

      await expect(
        caso.execute(new UserId(PERSONA), { ...ACEPTA_TODO, aceptaTerminos: false }),
      ).rejects.toBeInstanceOf(MissingConsentError);
      await nadaCambio();
    });

    it('una cuenta que no existe', async () => {
      await expect(caso.execute(new UserId(PERSONA), ACEPTA_TODO)).rejects.toBeInstanceOf(
        AccountNotProvisionedError,
      );
    });
  });
});
