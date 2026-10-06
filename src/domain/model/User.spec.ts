import { describe, expect, it } from 'vitest';
import {
  FutureConsentDateError,
  InvalidNameError,
  InvalidPetError,
  InvalidRoleError,
  InvalidTimeZoneError,
  MissingConsentError,
  NoActiveModulesError,
  UnknownModuleError,
} from './DomainError.js';
import { UserId } from './Identifier.js';
import { type DatosDeUsuario, EDAD_MINIMA, Rol, User } from './User.js';

const USUARIO_A = '11111111-1111-4111-8111-111111111111';
const USUARIO_B = '22222222-2222-4222-9222-222222222222';

const AHORA = new Date('2026-09-16T12:00:00.000Z');

function datos(sobrescribir: Partial<DatosDeUsuario> = {}): DatosDeUsuario {
  return {
    id: new UserId(USUARIO_A),
    correo: 'persona@ejemplo.test',
    // Deliberadamente sin pinta de credencial: el escaneo de secretos
    // marca cualquier cadena con entropia en un campo que se llame Auth.
    idProveedorAuth: 'proveedor-de-prueba',
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

describe('Las preferencias de la cuenta', () => {
  const LUMA = { forma: 'brote', color: '#a2d9b6', accesorio: 'ninguno', nombre: 'Luma' };

  it('una cuenta nueva no ha elegido modulos ni mascota', () => {
    const usuario = User.create(datos(), AHORA);

    expect(usuario.modulosActivos).toEqual([]);
    expect(usuario.haElegidoModulos()).toBe(false);
    expect(usuario.mascota).toBeUndefined();
  });

  it('cambiar los modulos devuelve otra cuenta y no toca la original', () => {
    const original = User.create(datos(), AHORA);
    const cambiada = original.conPreferencias({ modulosActivos: ['emociones'] });

    expect(cambiada.modulosActivos).toEqual(['emociones']);
    expect(cambiada.haElegidoModulos()).toBe(true);
    expect(original.modulosActivos).toEqual([]);
  });

  it('lo que no se manda se queda como estaba', () => {
    const conModulos = User.create(datos({ modulosActivos: ['cognicion'] }), AHORA);
    const conMascota = conModulos.conPreferencias({ mascota: LUMA });

    expect(conMascota.modulosActivos).toEqual(['cognicion']);
    expect(conMascota.mascota).toEqual(LUMA);
  });

  it('no deja desactivar el ultimo modulo', () => {
    const usuario = User.create(datos({ modulosActivos: ['bienestar'] }), AHORA);

    expect(() => usuario.conPreferencias({ modulosActivos: [] })).toThrow(NoActiveModulesError);
  });

  it('no deja activar un modulo que no existe', () => {
    const usuario = User.create(datos(), AHORA);

    expect(() => usuario.conPreferencias({ modulosActivos: ['finanzas'] })).toThrow(
      UnknownModuleError,
    );
  });

  it('rechaza una mascota mal formada', () => {
    const usuario = User.create(datos(), AHORA);

    expect(() => usuario.conPreferencias({ mascota: { ...LUMA, color: 'verde' } })).toThrow(
      InvalidPetError,
    );
  });

  it('cambiar preferencias no toca el correo, el rol ni el consentimiento', () => {
    const original = User.create(datos({ nombre: 'Diego' }), AHORA);
    const cambiada = original.conPreferencias({ modulosActivos: ['cognicion'], mascota: LUMA });

    expect(cambiada.id.equals(original.id)).toBe(true);
    expect(cambiada.correo).toBe(original.correo);
    expect(cambiada.rol).toBe(original.rol);
    expect(cambiada.nombre).toBe('Diego');
    expect(cambiada.consentimiento).toEqual(original.consentimiento);
  });

  it('cambia el nombre sin espacios sobrantes', () => {
    const usuario = User.create(datos(), AHORA).conPreferencias({ nombre: '  Diego  ' });

    expect(usuario.nombre).toBe('Diego');
  });

  it.each([
    ['vacio', '   '],
    ['demasiado largo', 'x'.repeat(101)],
    ['con salto de linea', 'Die\ngo'],
  ])('rechaza un nombre %s', (_caso, nombre) => {
    expect(() => User.create(datos(), AHORA).conPreferencias({ nombre })).toThrow(InvalidNameError);
  });

  it('lo que llega de la base pasa por la misma regla', () => {
    expect(() => User.create(datos({ modulosActivos: ['finanzas'] }), AHORA)).toThrow(
      UnknownModuleError,
    );
  });
});

describe('La zona horaria de la cuenta (SCRUM-123)', () => {
  it('sin zona, es la de Colombia: es la de todas las cuentas anteriores', () => {
    expect(User.create(datos(), AHORA).zonaHoraria).toBe('America/Bogota');
  });

  it('guarda la zona que informa el dispositivo', () => {
    expect(User.create(datos({ zonaHoraria: 'Europe/Madrid' }), AHORA).zonaHoraria).toBe(
      'Europe/Madrid',
    );
  });

  it('la guarda con la forma de IANA, aunque llegue en otras mayusculas', () => {
    expect(User.create(datos({ zonaHoraria: 'europe/madrid' }), AHORA).zonaHoraria).toBe(
      'Europe/Madrid',
    );
  });

  it.each(['Marte/Olympus', '', '   ', 'Bogota'])('rechaza la zona "%s"', (zona) => {
    expect(() => User.create(datos({ zonaHoraria: zona }), AHORA)).toThrow(InvalidTimeZoneError);
  });

  it('conZonaHoraria devuelve otra cuenta con la zona nueva y todo lo demas igual', () => {
    const antes = User.create(
      datos({ nombre: 'Ana', modulosActivos: ['cognicion'], diarioConRecomendaciones: true }),
      AHORA,
    );

    const despues = antes.conZonaHoraria('Asia/Tokyo');

    expect(despues).not.toBe(antes);
    expect(despues.zonaHoraria).toBe('Asia/Tokyo');
    expect(despues.id.value).toBe(antes.id.value);
    expect(despues.nombre).toBe('Ana');
    expect(despues.modulosActivos).toEqual(['cognicion']);
    expect(despues.diarioConRecomendaciones).toBe(true);
    // La cuenta original no cambia.
    expect(antes.zonaHoraria).toBe('America/Bogota');
  });

  it('conZonaHoraria devuelve esta misma cuenta si la zona ya es esa', () => {
    const cuenta = User.create(datos({ zonaHoraria: 'Europe/Madrid' }), AHORA);

    expect(cuenta.conZonaHoraria('europe/madrid')).toBe(cuenta);
  });

  it('conZonaHoraria rechaza una zona que no existe', () => {
    expect(() => User.create(datos(), AHORA).conZonaHoraria('Marte/Olympus')).toThrow(
      InvalidTimeZoneError,
    );
  });

  it('cambiar las preferencias no cambia la zona', () => {
    const cuenta = User.create(datos({ zonaHoraria: 'Europe/Madrid' }), AHORA);

    expect(cuenta.conPreferencias({ nombre: 'Ana' }).zonaHoraria).toBe('Europe/Madrid');
  });
});
