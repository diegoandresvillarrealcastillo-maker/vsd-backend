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
import { FechaDeNacimiento } from './FechaDeNacimiento.js';
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

describe('El registro completo: la edad y los terminos (auditoria 360)', () => {
  const registro = {
    fechaDeNacimiento: FechaDeNacimiento.restaurar('1998-03-14'),
    consentimiento: {
      versionPolitica: '2026-09-1',
      aceptadoEn: new Date('2026-09-16T11:00:00.000Z'),
    },
    terminos: { versionPolitica: '2026-10-1', aceptadoEn: new Date('2026-09-16T11:00:00.000Z') },
  };

  it('una cuenta sin fecha ni terminos tiene el registro incompleto', () => {
    expect(User.create(datos(), AHORA).registroCompleto()).toBe(false);
  });

  it('con la fecha y los terminos esta completo', () => {
    const usuario = User.create(
      datos({ fechaDeNacimiento: registro.fechaDeNacimiento, terminos: registro.terminos }),
      AHORA,
    );

    expect(usuario.registroCompleto()).toBe(true);
  });

  it.each([
    ['solo con la fecha', { fechaDeNacimiento: registro.fechaDeNacimiento }],
    ['solo con los terminos', { terminos: registro.terminos }],
  ])('%s sigue incompleto', (_caso, parcial) => {
    expect(User.create(datos(parcial), AHORA).registroCompleto()).toBe(false);
  });

  it('completar el registro devuelve otra cuenta con todo lo demas igual', () => {
    const antes = User.create(datos({ nombre: 'Ana', zonaHoraria: 'Europe/Madrid' }), AHORA);

    const despues = antes.conRegistroCompleto(registro, AHORA);

    expect(despues.registroCompleto()).toBe(true);
    expect(despues.fechaDeNacimiento?.valor).toBe('1998-03-14');
    expect(despues.terminos?.versionPolitica).toBe('2026-10-1');
    expect(despues.consentimiento?.versionPolitica).toBe('2026-09-1');
    expect(despues.nombre).toBe('Ana');
    expect(despues.zonaHoraria).toBe('Europe/Madrid');
    expect(despues.id.value).toBe(USUARIO_A);
    // La anterior no cambio.
    expect(antes.registroCompleto()).toBe(false);
    expect(antes.consentimiento?.versionPolitica).toBe('1.0');
  });

  it('el resto de los cambios no pierde el registro', () => {
    const completa = User.create(datos(), AHORA).conRegistroCompleto(registro, AHORA);

    expect(completa.conPreferencias({ nombre: 'Ana' }).registroCompleto()).toBe(true);
    expect(completa.conZonaHoraria('Asia/Tokyo').registroCompleto()).toBe(true);
    expect(completa.conFoto(AHORA).registroCompleto()).toBe(true);
  });

  it('completar con una version vacia o una fecha del futuro se rechaza', () => {
    const cuenta = User.create(datos(), AHORA);
    const futuro = new Date(AHORA.getTime() + 86400000);

    expect(() =>
      cuenta.conRegistroCompleto(
        { ...registro, terminos: { versionPolitica: '  ', aceptadoEn: AHORA } },
        AHORA,
      ),
    ).toThrow(MissingConsentError);
    expect(() =>
      cuenta.conRegistroCompleto(
        { ...registro, consentimiento: { versionPolitica: '2026-09-1', aceptadoEn: futuro } },
        AHORA,
      ),
    ).toThrow(FutureConsentDateError);
  });

  it('los terminos se validan como el aviso al construir la cuenta', () => {
    expect(() =>
      User.create(datos({ terminos: { versionPolitica: '', aceptadoEn: AHORA } }), AHORA),
    ).toThrow(MissingConsentError);
    expect(() =>
      User.create(
        datos({
          terminos: { versionPolitica: '2026-10-1', aceptadoEn: new Date(AHORA.getTime() + 1000) },
        }),
        AHORA,
      ),
    ).toThrow(FutureConsentDateError);
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

describe('User: la foto de perfil (SCRUM-120)', () => {
  const GUARDADA_EL = new Date('2026-10-09T15:30:00.123Z');

  it('una cuenta nueva no tiene foto', () => {
    expect(User.create(datos(), AHORA).fotoActualizadaEl).toBeUndefined();
  });

  it('conFoto devuelve otra cuenta con la fecha, y la original no cambia', () => {
    const antes = User.create(datos(), AHORA);
    const despues = antes.conFoto(GUARDADA_EL);

    expect(despues).not.toBe(antes);
    expect(despues.fotoActualizadaEl).toEqual(GUARDADA_EL);
    expect(antes.fotoActualizadaEl).toBeUndefined();
  });

  it('conFoto no toca nada mas de la cuenta', () => {
    const antes = User.create(
      datos({
        nombre: 'Ana',
        modulosActivos: ['cognicion'],
        mascota: { forma: 'sparky', nombre: 'Chispa' },
        diarioConRecomendaciones: true,
        zonaHoraria: 'Europe/Madrid',
      }),
      AHORA,
    );
    const despues = antes.conFoto(GUARDADA_EL);

    expect(despues.id.value).toBe(antes.id.value);
    expect(despues.correo).toBe(antes.correo);
    expect(despues.idProveedorAuth).toBe(antes.idProveedorAuth);
    expect(despues.rol).toBe(antes.rol);
    expect(despues.consentimiento).toEqual(antes.consentimiento);
    expect(despues.registradoEn).toEqual(antes.registradoEn);
    expect(despues.nombre).toBe('Ana');
    expect(despues.modulosActivos).toEqual(['cognicion']);
    expect(despues.mascota).toEqual({ forma: 'sparky', nombre: 'Chispa' });
    expect(despues.diarioConRecomendaciones).toBe(true);
    expect(despues.zonaHoraria).toBe('Europe/Madrid');
  });

  it('copia la fecha, para que no se pueda mutar desde fuera', () => {
    const fecha = new Date(GUARDADA_EL.getTime());
    const cuenta = User.create(datos(), AHORA).conFoto(fecha);

    fecha.setFullYear(1990);

    expect(cuenta.fotoActualizadaEl?.getUTCFullYear()).toBe(2026);
  });

  it('sinFoto la quita', () => {
    const cuenta = User.create(datos({ fotoActualizadaEl: GUARDADA_EL }), AHORA);

    expect(cuenta.sinFoto().fotoActualizadaEl).toBeUndefined();
    expect(cuenta.fotoActualizadaEl).toEqual(GUARDADA_EL);
  });

  it('sinFoto en una cuenta sin foto devuelve esta misma cuenta', () => {
    const cuenta = User.create(datos(), AHORA);

    expect(cuenta.sinFoto()).toBe(cuenta);
  });

  // Estas dos son las que importan: `conPreferencias` y `conZonaHoraria`
  // reconstruyen la cuenta campo por campo, y si no arrastraran la foto,
  // guardar el nombre o la zona borraria la foto sin que nadie lo pidiera.
  it('cambiar las preferencias no quita la foto', () => {
    const cuenta = User.create(datos({ fotoActualizadaEl: GUARDADA_EL }), AHORA);

    expect(cuenta.conPreferencias({ nombre: 'Ana' }).fotoActualizadaEl).toEqual(GUARDADA_EL);
  });

  it('cambiar la zona horaria no quita la foto', () => {
    const cuenta = User.create(datos({ fotoActualizadaEl: GUARDADA_EL }), AHORA);

    expect(cuenta.conZonaHoraria('Asia/Tokyo').fotoActualizadaEl).toEqual(GUARDADA_EL);
  });

  it('la foto no se puede poner por conPreferencias', () => {
    // El cuerpo de PATCH /api/cuenta/preferencias no tiene donde ponerla; aqui se
    // comprueba que el tipo tampoco: la foto solo entra por su propia ruta.
    // @ts-expect-error `fotoActualizadaEl` no es una preferencia.
    const cuenta = User.create(datos(), AHORA).conPreferencias({ fotoActualizadaEl: GUARDADA_EL });

    expect(cuenta.fotoActualizadaEl).toBeUndefined();
  });
});

describe('User: la mascota propia (SCRUM-122)', () => {
  const GUARDADA_EL = new Date('2026-10-12T09:00:00.000Z');
  const CON_FOTO = new Date('2026-10-09T15:30:00.123Z');

  it('una cuenta nueva no tiene mascota propia', () => {
    expect(User.create(datos(), AHORA).mascotaPropiaActualizadaEl).toBeUndefined();
  });

  it('conMascotaPropia devuelve otra cuenta con la fecha, y la original no cambia', () => {
    const antes = User.create(datos(), AHORA);
    const despues = antes.conMascotaPropia(GUARDADA_EL);

    expect(despues).not.toBe(antes);
    expect(despues.mascotaPropiaActualizadaEl).toEqual(GUARDADA_EL);
    expect(antes.mascotaPropiaActualizadaEl).toBeUndefined();
  });

  it('conMascotaPropia copia la fecha, para que no se pueda mutar desde fuera', () => {
    const fecha = new Date(GUARDADA_EL.getTime());
    const cuenta = User.create(datos(), AHORA).conMascotaPropia(fecha);

    fecha.setFullYear(1990);

    expect(cuenta.mascotaPropiaActualizadaEl?.getUTCFullYear()).toBe(2026);
  });

  it('no elige la mascota propia: solo anota que existe', () => {
    const cuenta = User.create(datos({ mascota: { forma: 'sparky', nombre: 'Chispa' } }), AHORA);

    expect(cuenta.conMascotaPropia(GUARDADA_EL).mascota).toEqual({
      forma: 'sparky',
      nombre: 'Chispa',
    });
  });

  it('la foto y la mascota propia son independientes: una no toca a la otra', () => {
    const conAmbas = User.create(datos({ fotoActualizadaEl: CON_FOTO }), AHORA).conMascotaPropia(
      GUARDADA_EL,
    );

    expect(conAmbas.fotoActualizadaEl).toEqual(CON_FOTO);
    expect(conAmbas.sinFoto().mascotaPropiaActualizadaEl).toEqual(GUARDADA_EL);
    expect(conAmbas.sinMascotaPropia().fotoActualizadaEl).toEqual(CON_FOTO);
  });

  describe('lo que se conserva al cambiar otra cosa', () => {
    const cuenta = User.create(datos({ mascotaPropiaActualizadaEl: GUARDADA_EL }), AHORA);

    it('las preferencias', () => {
      expect(cuenta.conPreferencias({ nombre: 'Ana' }).mascotaPropiaActualizadaEl).toEqual(
        GUARDADA_EL,
      );
    });

    it('la zona horaria', () => {
      expect(cuenta.conZonaHoraria('Asia/Tokyo').mascotaPropiaActualizadaEl).toEqual(GUARDADA_EL);
    });

    it('la foto', () => {
      expect(cuenta.conFoto(CON_FOTO).mascotaPropiaActualizadaEl).toEqual(GUARDADA_EL);
      expect(cuenta.conFoto(CON_FOTO).sinFoto().mascotaPropiaActualizadaEl).toEqual(GUARDADA_EL);
    });

    it('conMascotaPropia no toca nada mas de la cuenta', () => {
      const antes = User.create(
        datos({
          nombre: 'Ana',
          modulosActivos: ['cognicion'],
          mascota: { forma: 'ori', nombre: 'Papel' },
          diarioConRecomendaciones: true,
          zonaHoraria: 'Europe/Madrid',
          fotoActualizadaEl: CON_FOTO,
        }),
        AHORA,
      );
      const despues = antes.conMascotaPropia(GUARDADA_EL);

      expect(despues.id.value).toBe(antes.id.value);
      expect(despues.correo).toBe(antes.correo);
      expect(despues.nombre).toBe('Ana');
      expect(despues.modulosActivos).toEqual(['cognicion']);
      expect(despues.mascota).toEqual({ forma: 'ori', nombre: 'Papel' });
      expect(despues.diarioConRecomendaciones).toBe(true);
      expect(despues.zonaHoraria).toBe('Europe/Madrid');
      expect(despues.fotoActualizadaEl).toEqual(CON_FOTO);
    });
  });

  describe('elegirla como mascota', () => {
    it('sin haberla subido, no se puede: no hay dibujo', () => {
      const cuenta = User.create(datos(), AHORA);

      expect(() => cuenta.conPreferencias({ mascota: { forma: 'propia', nombre: 'Mia' } })).toThrow(
        InvalidPetError,
      );
    });

    it('subida, si se puede, con el nombre que se le ponga', () => {
      const cuenta = User.create(datos({ mascotaPropiaActualizadaEl: GUARDADA_EL }), AHORA);

      expect(
        cuenta.conPreferencias({ mascota: { forma: 'propia', nombre: 'Mia' } }).mascota,
      ).toEqual({ forma: 'propia', nombre: 'Mia' });
    });

    it('cambiar otra cosa de una cuenta cuya mascota es la propia no se bloquea, aunque falte el archivo', () => {
      // Un estado incoherente (forma propia sin marca) no puede dejar a la
      // persona sin poder cambiar su nombre.
      const cuenta = User.create(datos({ mascota: { forma: 'propia', nombre: 'Mia' } }), AHORA);

      expect(cuenta.conPreferencias({ nombre: 'Ana' }).nombre).toBe('Ana');
    });

    it('una cuenta con forma propia y sin marca se puede leer de la base', () => {
      expect(() =>
        User.create(datos({ mascota: { forma: 'propia', nombre: 'Mia' } }), AHORA),
      ).not.toThrow();
    });
  });

  describe('sinMascotaPropia', () => {
    it('la quita', () => {
      const cuenta = User.create(datos({ mascotaPropiaActualizadaEl: GUARDADA_EL }), AHORA);

      expect(cuenta.sinMascotaPropia().mascotaPropiaActualizadaEl).toBeUndefined();
      expect(cuenta.mascotaPropiaActualizadaEl).toEqual(GUARDADA_EL);
    });

    it('quitar la que no hay, y no estar elegida, devuelve esta misma cuenta', () => {
      const cuenta = User.create(datos(), AHORA);

      expect(cuenta.sinMascotaPropia()).toBe(cuenta);
    });

    it('si era la mascota elegida, vuelve al personaje de siempre y conserva el nombre', () => {
      const cuenta = User.create(
        datos({
          mascotaPropiaActualizadaEl: GUARDADA_EL,
          mascota: { forma: 'propia', nombre: 'Luma', color: '#a2d9b6', accesorio: 'bufanda' },
        }),
        AHORA,
      );

      expect(cuenta.sinMascotaPropia().mascota).toEqual({
        forma: 'fungito',
        nombre: 'Luma',
        color: '#a2d9b6',
        accesorio: 'bufanda',
      });
    });

    it('si la mascota elegida es otra, no se toca', () => {
      const cuenta = User.create(
        datos({
          mascotaPropiaActualizadaEl: GUARDADA_EL,
          mascota: { forma: 'sparky', nombre: 'Chispa' },
        }),
        AHORA,
      );

      expect(cuenta.sinMascotaPropia().mascota).toEqual({ forma: 'sparky', nombre: 'Chispa' });
    });

    it('con la forma propia pero sin marca (un estado incoherente), tambien se arregla', () => {
      const cuenta = User.create(datos({ mascota: { forma: 'propia', nombre: 'Mia' } }), AHORA);
      const arreglada = cuenta.sinMascotaPropia();

      expect(arreglada).not.toBe(cuenta);
      expect(arreglada.mascota).toEqual({ forma: 'fungito', nombre: 'Mia' });
    });
  });
});
