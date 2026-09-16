import { describe, expect, it } from 'vitest';
import { FutureConsentDateError, InvalidRoleError, MissingConsentError } from './DomainError.js';
import { UserId } from './Identifier.js';
import { type DatosDeUsuario, EDAD_MINIMA, Rol, User } from './User.js';

const USUARIO_A = '11111111-1111-4111-8111-111111111111';
const USUARIO_B = '22222222-2222-4222-9222-222222222222';

const AHORA = new Date('2026-09-16T12:00:00.000Z');

function datos(sobrescribir: Partial<DatosDeUsuario> = {}): DatosDeUsuario {
  return {
    id: new UserId(USUARIO_A),
    correo: 'persona@ejemplo.test',
    idProveedorAuth: 'proveedor-abc-123',
    rol: Rol.USUARIO,
    consentimiento: {
      versionPolitica: '1.0',
      aceptadoEn: new Date('2026-09-16T10:00:00.000Z'),
    },
    registradoEn: new Date('2026-09-16T10:00:00.000Z'),
    ...sobrescribir,
  };
}

describe('User', () => {
  it('se construye con datos validos', () => {
    const usuario = User.create(datos(), AHORA);

    expect(usuario.correo).toBe('persona@ejemplo.test');
    expect(usuario.rol).toBe(Rol.USUARIO);
  });

  it('copia la fecha de registro para que no se pueda mutar desde fuera', () => {
    const fecha = new Date('2026-09-16T10:00:00.000Z');
    const usuario = User.create(datos({ registradoEn: fecha }), AHORA);

    fecha.setFullYear(1990);

    expect(usuario.registradoEn.getUTCFullYear()).toBe(2026);
  });

  it('rechaza un rol que no existe', () => {
    expect(() => User.create(datos({ rol: 'superusuario' as Rol }), AHORA)).toThrow(
      InvalidRoleError,
    );
  });

  it('la edad minima declarada es de 18 anos', () => {
    // Tratar datos sensibles de menores exige garantias adicionales que quedan
    // fuera del alcance de esta version.
    expect(EDAD_MINIMA).toBe(18);
  });
});

describe('El consentimiento de tratamiento de datos', () => {
  it('una cuenta con consentimiento puede tratar datos de salud', () => {
    const usuario = User.create(datos(), AHORA);

    expect(usuario.puedeTratarDatosDeSalud()).toBe(true);
    expect(() => usuario.exigirConsentimiento()).not.toThrow();
  });

  it('una cuenta sin consentimiento no puede', () => {
    const usuario = User.create(datos({ consentimiento: undefined }), AHORA);

    expect(usuario.puedeTratarDatosDeSalud()).toBe(false);
    expect(() => usuario.exigirConsentimiento()).toThrow(MissingConsentError);
  });

  it('rechaza una version de politica vacia', () => {
    // Guardar un consentimiento sin decir a que version corresponde no sirve
    // de prueba: las politicas cambian.
    expect(() =>
      User.create(datos({ consentimiento: { versionPolitica: '   ', aceptadoEn: AHORA } }), AHORA),
    ).toThrow(MissingConsentError);
  });

  it('rechaza una fecha de aceptacion en el futuro', () => {
    const futuro = new Date(AHORA.getTime() + 86400000);

    expect(() =>
      User.create(datos({ consentimiento: { versionPolitica: '1.0', aceptadoEn: futuro } }), AHORA),
    ).toThrow(FutureConsentDateError);
  });

  it('guarda que version acepto y cuando, no solo que acepto', () => {
    const usuario = User.create(datos(), AHORA);

    expect(usuario.consentimiento?.versionPolitica).toBe('1.0');
    expect(usuario.consentimiento?.aceptadoEn.toISOString()).toBe('2026-09-16T10:00:00.000Z');
  });
});

describe('El administrador gestiona contenidos, no personas', () => {
  it('una persona puede leer sus propios datos', () => {
    const usuario = User.create(datos(), AHORA);

    expect(usuario.puedeLeerDatosDe(new UserId(USUARIO_A))).toBe(true);
  });

  it('una persona no puede leer los datos de otra', () => {
    const usuario = User.create(datos(), AHORA);

    expect(usuario.puedeLeerDatosDe(new UserId(USUARIO_B))).toBe(false);
  });

  it('el administrador tampoco puede leer los datos de nadie', () => {
    // El entregable es explicito: el administrador no tiene acceso a los
    // resultados, al historial ni a la informacion personal de ningun usuario.
    // Que sea administrador no le da una llave maestra.
    const admin = User.create(datos({ rol: Rol.ADMINISTRADOR }), AHORA);

    expect(admin.esAdministrador()).toBe(true);
    expect(admin.puedeLeerDatosDe(new UserId(USUARIO_B))).toBe(false);
  });

  it('el administrador si puede leer sus propios datos', () => {
    const admin = User.create(datos({ rol: Rol.ADMINISTRADOR }), AHORA);

    expect(admin.puedeLeerDatosDe(new UserId(USUARIO_A))).toBe(true);
  });
});
