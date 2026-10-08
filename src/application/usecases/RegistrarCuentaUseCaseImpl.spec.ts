import { beforeEach, describe, expect, it } from 'vitest';
import {
  VERSION_VIGENTE_DE_LOS_TERMINOS,
  VERSION_VIGENTE_DEL_AVISO,
} from '../../domain/model/AvisoDePrivacidad.js';
import {
  InvalidBirthDateError,
  InvalidTimeZoneError,
  MissingConsentError,
  OutdatedPrivacyNoticeError,
  OutdatedTermsError,
  UnderageError,
} from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import { Rol, User, type ConsentimientoAceptado } from '../../domain/model/User.js';
import type { RegistrarCuentaCommand } from '../../domain/ports/in/RegistrarCuentaUseCase.js';
import type { ProveedorDeIdentidadPort } from '../../domain/ports/out/ProveedorDeIdentidadPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { BorrarCuentaUseCaseImpl } from './BorrarCuentaUseCaseImpl.js';
import {
  RegistrarCuentaUseCaseImpl,
  type RegistroDeRechazos,
} from './RegistrarCuentaUseCaseImpl.js';

const ID_NUEVO = '11111111-1111-4111-8111-111111111111';
const AHORA = new Date('2026-09-25T10:00:00.000Z');

/**
 * Doble del repositorio, escrito aqui mismo.
 *
 * No se usa `InMemoryUserRepository` a proposito, aunque haria lo mismo: vive
 * en `infrastructure/` y la regla de fronteras impide que `application/`
 * dependa de esa capa, tambien en las pruebas. Esa regla es justo lo que
 * mantiene al caso de uso ejecutable sin framework ni base de datos, asi que
 * saltarsela por comodidad seria vaciarla de sentido.
 */
class RepositorioDoble implements UserRepositoryPort {
  private readonly porId = new Map<string, User>();

  /** Cuantas veces se llamo a `save`. */
  guardados = 0;

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
    this.guardados += 1;
    this.porId.set(user.id.value, user);

    return Promise.resolve();
  }

  consentimientosDe(): Promise<readonly ConsentimientoAceptado[]> {
    return Promise.resolve([]);
  }

  async borrarConTodo(id: UserId, antesDeConfirmar: () => Promise<void>): Promise<void> {
    await antesDeConfirmar();
    this.porId.delete(id.value);
  }

  get cantidad(): number {
    return this.porId.size;
  }
}

/** El proveedor de identidad: recuerda a quien se le borro la identidad. */
class IdentidadesDoble implements ProveedorDeIdentidadPort {
  readonly borradas: string[] = [];

  /** Para simular que el proveedor no responde. */
  fallaAlBorrar = false;

  borrarIdentidad(idProveedorAuth: string): Promise<void> {
    if (this.fallaAlBorrar) {
      return Promise.reject(new Error('el proveedor no respondio'));
    }

    this.borradas.push(idProveedorAuth);

    return Promise.resolve();
  }
}

/** El registro: solo recibe si se pudo borrar la identidad, nunca datos de la persona. */
class RegistroDoble implements RegistroDeRechazos {
  readonly menores: boolean[] = [];

  menorDeEdad(identidadBorrada: boolean): void {
    this.menores.push(identidadBorrada);
  }
}

interface Escenario {
  caso: RegistrarCuentaUseCaseImpl;
  cuentas: RepositorioDoble;
  identidades: IdentidadesDoble;
  registro: RegistroDoble;
}

function crearCasoDeUso(ahora: Date = AHORA): Escenario {
  const cuentas = new RepositorioDoble();
  const identidades = new IdentidadesDoble();
  const registro = new RegistroDoble();

  const caso = new RegistrarCuentaUseCaseImpl(
    cuentas,
    identidades,
    new BorrarCuentaUseCaseImpl(cuentas, identidades),
    registro,
    () => new UserId(ID_NUEVO),
    () => ahora,
  );

  return { caso, cuentas, identidades, registro };
}

/** Un alta correcta: mayor de edad y con las dos casillas marcadas. */
const ALTA: RegistrarCuentaCommand = {
  idProveedorAuth: 'supabase|aaaa-1111',
  correo: 'persona@ejemplo.test',
  fechaNacimiento: '1998-03-14',
  versionPolitica: VERSION_VIGENTE_DEL_AVISO,
  versionTerminos: VERSION_VIGENTE_DE_LOS_TERMINOS,
  aceptaAviso: true,
  aceptaTerminos: true,
};

/** Una cuenta de las que se crearon antes de que se pidieran la fecha y las casillas. */
function cuentaAnterior(): User {
  const fecha = new Date('2026-09-01T10:00:00.000Z');

  return User.create(
    {
      id: new UserId('33333333-3333-4333-8333-333333333333'),
      correo: ALTA.correo,
      idProveedorAuth: ALTA.idProveedorAuth,
      rol: Rol.USUARIO,
      consentimiento: { versionPolitica: '1.0', aceptadoEn: fecha },
      registradoEn: fecha,
    },
    AHORA,
  );
}

describe('Alta de cuenta', () => {
  let caso: RegistrarCuentaUseCaseImpl;
  let cuentas: RepositorioDoble;

  beforeEach(() => {
    ({ caso, cuentas } = crearCasoDeUso());
  });

  it('crea la cuenta la primera vez', async () => {
    const cuenta = await caso.execute(ALTA);

    expect(cuenta.id.value).toBe(ID_NUEVO);
    expect(cuenta.correo).toBe('persona@ejemplo.test');
    expect(cuenta.idProveedorAuth).toBe('supabase|aaaa-1111');
    expect(cuentas.cantidad).toBe(1);
  });

  it('el identificador de la cuenta es NUESTRO, no el del proveedor', async () => {
    // Es la distincion que causaba que PostgreSQL rechazara los resultados:
    // `resultado.id_usuario` es clave foranea contra el nuestro.
    const cuenta = await caso.execute(ALTA);

    expect(cuenta.id.value).not.toBe(cuenta.idProveedorAuth);
  });

  it('registra el consentimiento con su version y su fecha', async () => {
    // No basta con un si o un no. Ante una reclamacion hay que poder demostrar
    // a que dio permiso cada quien y cuando. Ley 1581 de 2012.
    const cuenta = await caso.execute(ALTA);

    expect(cuenta.consentimiento?.versionPolitica).toBe(VERSION_VIGENTE_DEL_AVISO);
    expect(cuenta.consentimiento?.aceptadoEn).toEqual(AHORA);
    expect(cuenta.puedeTratarDatosDeSalud()).toBe(true);
  });

  it('registra los terminos con su version y su fecha, y la fecha de nacimiento', async () => {
    const cuenta = await caso.execute(ALTA);

    expect(cuenta.terminos?.versionPolitica).toBe(VERSION_VIGENTE_DE_LOS_TERMINOS);
    expect(cuenta.terminos?.aceptadoEn).toEqual(AHORA);
    expect(cuenta.fechaDeNacimiento?.valor).toBe('1998-03-14');
    expect(cuenta.registroCompleto()).toBe(true);
  });

  it('sin consentimiento no crea nada', async () => {
    await expect(caso.execute({ ...ALTA, versionPolitica: '   ' })).rejects.toThrow(
      MissingConsentError,
    );

    expect(cuentas.cantidad).toBe(0);
  });

  it('el segundo acceso devuelve la cuenta existente, no crea otra', async () => {
    const primera = await caso.execute(ALTA);
    const segunda = await caso.execute(ALTA);

    expect(segunda.id.value).toBe(primera.id.value);
    expect(cuentas.cantidad).toBe(1);
  });

  it('volver a entrar no sobrescribe el consentimiento guardado', async () => {
    // La fecha y la version guardadas son la prueba de lo que acepto esa
    // persona ese dia. Actualizarlas en cada inicio de sesion borraria esa
    // prueba justo cuando hiciera falta demostrarla.
    await caso.execute(ALTA);

    const segunda = await caso.execute({ ...ALTA, versionPolitica: '9.9' });

    expect(segunda.consentimiento?.versionPolitica).toBe(VERSION_VIGENTE_DEL_AVISO);
  });

  it('volver a entrar no cambia la fecha de nacimiento declarada', async () => {
    await caso.execute(ALTA);

    const segunda = await caso.execute({ ...ALTA, fechaNacimiento: '1980-01-01' });

    expect(segunda.fechaDeNacimiento?.valor).toBe('1998-03-14');
  });

  it('volver a entrar sin mandar nada del registro tambien devuelve la cuenta', async () => {
    await caso.execute(ALTA);

    const segunda = await caso.execute({
      idProveedorAuth: ALTA.idProveedorAuth,
      correo: ALTA.correo,
    });

    expect(segunda.id.value).toBe(ID_NUEVO);
    expect(cuentas.cantidad).toBe(1);
  });

  it('rechaza un aviso que no es el vigente, y no crea nada', async () => {
    // La prueba que define SCRUM-85. Aceptarlo dejaria registrado que la
    // persona dio permiso a un texto distinto del que esta en vigor.
    await expect(caso.execute({ ...ALTA, versionPolitica: '1.0' })).rejects.toThrow(
      OutdatedPrivacyNoticeError,
    );

    expect(cuentas.cantidad).toBe(0);
  });

  it('rechaza unos terminos que no son los vigentes, y no crea nada', async () => {
    await expect(caso.execute({ ...ALTA, versionTerminos: '1.0' })).rejects.toThrow(
      OutdatedTermsError,
    );

    expect(cuentas.cantidad).toBe(0);
  });

  it('quien ya tenia cuenta con un aviso anterior conserva su version', async () => {
    // La version vigente solo se exige al darse de alta. Una cuenta creada con
    // un aviso anterior sigue entrando, y su consentimiento no se toca: es la
    // prueba de lo que acepto aquel dia.
    await cuentas.save(cuentaAnterior());

    const cuenta = await caso.execute({
      idProveedorAuth: ALTA.idProveedorAuth,
      correo: ALTA.correo,
      versionPolitica: '1.0',
    });

    expect(cuenta.consentimiento?.versionPolitica).toBe('1.0');
    expect(cuentas.cantidad).toBe(1);
  });

  it('normaliza el correo a minusculas', async () => {
    const cuenta = await caso.execute({ ...ALTA, correo: '  Persona@Ejemplo.TEST  ' });

    expect(cuenta.correo).toBe('persona@ejemplo.test');
  });

  it('guarda el nombre cuando llega, y lo omite cuando viene vacio', async () => {
    const con = await caso.execute({ ...ALTA, nombre: '  Diego  ' });

    expect(con.nombre).toBe('Diego');

    const { caso: otro } = crearCasoDeUso();
    const sin = await otro.execute({ ...ALTA, nombre: '   ' });

    expect(sin.nombre).toBeUndefined();
  });

  it('buscar por proveedor devuelve ausencia cuando no existe', async () => {
    await expect(caso.buscarPorProveedor('supabase|no-existe')).resolves.toBeNull();
  });
});

describe('El consentimiento tiene que ser explicito (S-02)', () => {
  it('enviar la version sola ya no basta: sin las casillas no se crea nada', async () => {
    const { caso, cuentas } = crearCasoDeUso();
    const { aceptaAviso: _aviso, aceptaTerminos: _terminos, ...soloLasVersiones } = ALTA;

    await expect(caso.execute(soloLasVersiones)).rejects.toThrow(MissingConsentError);
    expect(cuentas.cantidad).toBe(0);
  });

  it.each([
    ['la del aviso', { aceptaAviso: false }],
    ['la de los terminos', { aceptaTerminos: false }],
    ['las dos', { aceptaAviso: false, aceptaTerminos: false }],
  ])('sin la casilla de %s no se crea nada', async (_cual, casillas) => {
    const { caso, cuentas } = crearCasoDeUso();

    await expect(caso.execute({ ...ALTA, ...casillas })).rejects.toThrow(MissingConsentError);
    expect(cuentas.cantidad).toBe(0);
  });

  it('sin la version de los terminos tampoco', async () => {
    const { caso, cuentas } = crearCasoDeUso();

    await expect(caso.execute({ ...ALTA, versionTerminos: undefined })).rejects.toThrow(
      MissingConsentError,
    );
    expect(cuentas.cantidad).toBe(0);
  });
});

describe('La fecha de nacimiento (S-01)', () => {
  it.each([
    ['falta', undefined],
    ['esta vacia', ''],
    ['no es una fecha', 'ayer'],
    ['es un dia que no existe', '1998-02-30'],
    ['viene con hora', '1998-03-14T00:00:00Z'],
    ['esta en el futuro', '2027-01-01'],
    ['es de hoy', '2026-09-25'],
    ['es de hace mas de 120 anos', '1850-01-01'],
  ])('si %s, no se crea nada', async (_motivo, fechaNacimiento) => {
    const { caso, cuentas, identidades } = crearCasoDeUso();

    await expect(caso.execute({ ...ALTA, fechaNacimiento })).rejects.toThrow(InvalidBirthDateError);

    expect(cuentas.cantidad).toBe(0);
    // Una fecha mal escrita no es un menor: la identidad no se toca.
    expect(identidades.borradas).toEqual([]);
  });
});

describe('Los menores de 18 anos (S-01)', () => {
  it('a 17 anos y 364 dias se rechaza: no se crea la cuenta y se borra la identidad', async () => {
    // Cumple 18 manana (26 de septiembre) y hoy es 25.
    const { caso, cuentas, identidades } = crearCasoDeUso();

    await expect(caso.execute({ ...ALTA, fechaNacimiento: '2008-09-26' })).rejects.toThrow(
      UnderageError,
    );

    expect(cuentas.cantidad).toBe(0);
    expect(identidades.borradas).toEqual(['supabase|aaaa-1111']);
  });

  it('el dia que cumple 18 ya entra', async () => {
    const { caso, cuentas, identidades } = crearCasoDeUso();

    const cuenta = await caso.execute({ ...ALTA, fechaNacimiento: '2008-09-25' });

    expect(cuenta.registroCompleto()).toBe(true);
    expect(cuentas.cantidad).toBe(1);
    expect(identidades.borradas).toEqual([]);
  });

  it('quien cumple 18 hoy en Bogota entra aunque en UTC ya sea manana', async () => {
    // Las 10 p. m. del 25 en Bogota son las 3 a. m. del 26 en UTC.
    const { caso } = crearCasoDeUso(new Date('2026-09-26T03:00:00.000Z'));

    const cuenta = await caso.execute({
      ...ALTA,
      fechaNacimiento: '2008-09-25',
      zonaHoraria: 'America/Bogota',
    });

    expect(cuenta.registroCompleto()).toBe(true);
  });

  it('la edad se cuenta con el dia de la persona, no con el del servidor', async () => {
    // El mismo instante: el 25 a las 10 p. m. en Bogota y el 26 a las 5 a. m. en
    // Madrid. Quien nace un 26 cumple 18 en Madrid pero todavia no en Bogota.
    const instante = new Date('2026-09-26T03:00:00.000Z');
    const bogota = crearCasoDeUso(instante);
    const madrid = crearCasoDeUso(instante);

    await expect(
      bogota.caso.execute({
        ...ALTA,
        fechaNacimiento: '2008-09-26',
        zonaHoraria: 'America/Bogota',
      }),
    ).rejects.toThrow(UnderageError);

    const enMadrid = await madrid.caso.execute({
      ...ALTA,
      fechaNacimiento: '2008-09-26',
      zonaHoraria: 'Europe/Madrid',
    });

    expect(enMadrid.registroCompleto()).toBe(true);
  });

  describe('nacidos un 29 de febrero', () => {
    it('el 28 de febrero de un ano que no es bisiesto todavia no cumplen 18', async () => {
      const { caso, cuentas } = crearCasoDeUso(new Date('2026-02-28T15:00:00.000Z'));

      await expect(caso.execute({ ...ALTA, fechaNacimiento: '2008-02-29' })).rejects.toThrow(
        UnderageError,
      );
      expect(cuentas.cantidad).toBe(0);
    });

    it('el 1 de marzo ya los cumplieron', async () => {
      const { caso } = crearCasoDeUso(new Date('2026-03-01T15:00:00.000Z'));

      const cuenta = await caso.execute({ ...ALTA, fechaNacimiento: '2008-02-29' });

      expect(cuenta.registroCompleto()).toBe(true);
    });
  });

  it('el menor se rechaza antes de pedirle nada mas: ni casillas ni versiones', async () => {
    // A un menor no se le pide aceptar un aviso que no esta en vigor, se le
    // rechaza. Y la identidad se borra igual.
    const { caso, identidades } = crearCasoDeUso();

    await expect(
      caso.execute({
        idProveedorAuth: ALTA.idProveedorAuth,
        correo: ALTA.correo,
        fechaNacimiento: '2010-01-01',
        versionPolitica: '0.0',
      }),
    ).rejects.toThrow(UnderageError);

    expect(identidades.borradas).toEqual(['supabase|aaaa-1111']);
  });

  it('el rechazo se anota sin la fecha, el correo ni el identificador', async () => {
    const { caso, registro } = crearCasoDeUso();

    await expect(caso.execute({ ...ALTA, fechaNacimiento: '2010-01-01' })).rejects.toThrow(
      UnderageError,
    );

    // Lo unico que recibe el registro es si se pudo borrar la identidad.
    expect(registro.menores).toEqual([true]);
  });

  it('si el proveedor no deja borrar la identidad, igual se rechaza y se anota que falto', async () => {
    const { caso, cuentas, identidades, registro } = crearCasoDeUso();
    identidades.fallaAlBorrar = true;

    await expect(caso.execute({ ...ALTA, fechaNacimiento: '2010-01-01' })).rejects.toThrow(
      UnderageError,
    );

    expect(cuentas.cantidad).toBe(0);
    expect(registro.menores).toEqual([false]);
  });

  it('el mensaje no culpa a nadie, dice que no se guardo nada y que se puede volver', async () => {
    const { caso } = crearCasoDeUso();

    const error: unknown = await caso
      .execute({ ...ALTA, fechaNacimiento: '2010-01-01' })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(UnderageError);

    const menor = error as UnderageError;

    expect(menor.code).toBe('MENOR_DE_EDAD');
    expect(menor.message).toMatch(/mayores de 18/);
    expect(menor.message).toMatch(/No guardamos ningún dato/);
    expect(menor.message).toMatch(/Cuando cumplas 18/);
  });

  it('una cuenta anterior que declara ser menor se borra entera, con su identidad', async () => {
    const { caso, cuentas, identidades, registro } = crearCasoDeUso();
    await cuentas.save(cuentaAnterior());

    await expect(caso.execute({ ...ALTA, fechaNacimiento: '2010-01-01' })).rejects.toThrow(
      UnderageError,
    );

    expect(cuentas.cantidad).toBe(0);
    expect(identidades.borradas).toEqual(['supabase|aaaa-1111']);
    expect(registro.menores).toEqual([true]);
  });
});

describe('Las cuentas anteriores a que se pidiera el registro', () => {
  it('entrar sin mandar nada devuelve la cuenta, incompleta, y no guarda nada', async () => {
    const { caso, cuentas } = crearCasoDeUso();
    await cuentas.save(cuentaAnterior());
    const antes = cuentas.guardados;

    const cuenta = await caso.execute({
      idProveedorAuth: ALTA.idProveedorAuth,
      correo: ALTA.correo,
      versionPolitica: VERSION_VIGENTE_DEL_AVISO,
    });

    expect(cuenta.registroCompleto()).toBe(false);
    expect(cuenta.consentimiento?.versionPolitica).toBe('1.0');
    expect(cuentas.guardados).toBe(antes);
  });

  it('completar el registro guarda la fecha, los terminos y el consentimiento explicito', async () => {
    const { caso, cuentas } = crearCasoDeUso();
    await cuentas.save(cuentaAnterior());

    const cuenta = await caso.execute(ALTA);

    expect(cuenta.id.value).toBe('33333333-3333-4333-8333-333333333333');
    expect(cuenta.registroCompleto()).toBe(true);
    expect(cuenta.fechaDeNacimiento?.valor).toBe('1998-03-14');
    expect(cuenta.terminos?.versionPolitica).toBe(VERSION_VIGENTE_DE_LOS_TERMINOS);
    // El consentimiento pasa a ser el que dio con la casilla, de hoy.
    expect(cuenta.consentimiento?.versionPolitica).toBe(VERSION_VIGENTE_DEL_AVISO);
    expect(cuenta.consentimiento?.aceptadoEn).toEqual(AHORA);
    expect(cuentas.cantidad).toBe(1);
  });

  it('completar sin las casillas no cambia nada', async () => {
    const { caso, cuentas } = crearCasoDeUso();
    await cuentas.save(cuentaAnterior());

    await expect(caso.execute({ ...ALTA, aceptaTerminos: false })).rejects.toThrow(
      MissingConsentError,
    );

    const sigue = await caso.buscarPorProveedor(ALTA.idProveedorAuth);

    expect(sigue?.registroCompleto()).toBe(false);
    expect(sigue?.consentimiento?.versionPolitica).toBe('1.0');
  });

  it('completar con una fecha que no sirve no cambia nada', async () => {
    const { caso, cuentas } = crearCasoDeUso();
    await cuentas.save(cuentaAnterior());

    await expect(caso.execute({ ...ALTA, fechaNacimiento: '2999-01-01' })).rejects.toThrow(
      InvalidBirthDateError,
    );

    expect((await caso.buscarPorProveedor(ALTA.idProveedorAuth))?.registroCompleto()).toBe(false);
  });

  it('completar con textos que ya no son los vigentes no cambia nada', async () => {
    const { caso, cuentas } = crearCasoDeUso();
    await cuentas.save(cuentaAnterior());

    await expect(caso.execute({ ...ALTA, versionPolitica: '1.0' })).rejects.toThrow(
      OutdatedPrivacyNoticeError,
    );
    await expect(caso.execute({ ...ALTA, versionTerminos: '1.0' })).rejects.toThrow(
      OutdatedTermsError,
    );
  });

  it('al completar tambien se actualiza la zona que informa el dispositivo', async () => {
    const { caso, cuentas } = crearCasoDeUso();
    await cuentas.save(cuentaAnterior());

    const cuenta = await caso.execute({ ...ALTA, zonaHoraria: 'Europe/Madrid' });

    expect(cuenta.zonaHoraria).toBe('Europe/Madrid');
  });
});

describe('El alta no concede privilegios', () => {
  // La prueba que define SCRUM-63.

  it('la cuenta sale SIEMPRE con rol usuario', async () => {
    const { caso } = crearCasoDeUso();

    const cuenta = await caso.execute(ALTA);

    expect(cuenta.rol).toBe(Rol.USUARIO);
    expect(cuenta.esAdministrador()).toBe(false);
  });

  it('la orden de alta no tiene siquiera un campo de rol', async () => {
    // La proteccion no es una comprobacion que alguien pueda olvidar: es que
    // el dato no existe en el comando. Anadir `rol` aqui no compila, y si se
    // colara en el cuerpo de la peticion HTTP, la validacion lo rechaza por
    // campo no declarado.
    //
    // Se intenta igualmente, por si alguien anadiera el campo en el futuro sin
    // darse cuenta de lo que abre.
    const { caso } = crearCasoDeUso();

    const cuenta = await caso.execute({
      ...ALTA,
      ...({ rol: 'administrador' } as Record<string, unknown>),
    });

    expect(cuenta.rol).toBe(Rol.USUARIO);
  });

  it('una cuenta recien creada no puede leer datos de otra', async () => {
    const { caso } = crearCasoDeUso();

    const cuenta = await caso.execute(ALTA);

    expect(cuenta.puedeLeerDatosDe(cuenta.id)).toBe(true);
    expect(cuenta.puedeLeerDatosDe(new UserId('22222222-2222-4222-9222-222222222222'))).toBe(false);
  });
});

describe('La zona horaria en el alta y en cada entrada (SCRUM-123)', () => {
  const orden: RegistrarCuentaCommand = {
    ...ALTA,
    idProveedorAuth: 'proveedor-zona',
    correo: 'zona@ejemplo.test',
  };

  it('una cuenta nueva nace en la zona del dispositivo', async () => {
    const { caso } = crearCasoDeUso();

    const cuenta = await caso.execute({ ...orden, zonaHoraria: 'Europe/Madrid' });

    expect(cuenta.zonaHoraria).toBe('Europe/Madrid');
  });

  it('sin zona, nace en la de Colombia', async () => {
    const { caso } = crearCasoDeUso();

    expect((await caso.execute(orden)).zonaHoraria).toBe('America/Bogota');
  });

  it('una zona que no existe impide el alta y no crea nada', async () => {
    const { caso, cuentas } = crearCasoDeUso();

    await expect(caso.execute({ ...orden, zonaHoraria: 'Marte/Olympus' })).rejects.toThrow(
      InvalidTimeZoneError,
    );
    expect(cuentas.cantidad).toBe(0);
  });

  it('al entrar desde otra zona, la cuenta pasa a esa zona y se guarda', async () => {
    const { caso, cuentas } = crearCasoDeUso();
    await caso.execute({ ...orden, zonaHoraria: 'America/Bogota' });

    const viajera = await caso.execute({ ...orden, zonaHoraria: 'Europe/Madrid' });

    expect(viajera.zonaHoraria).toBe('Europe/Madrid');
    expect((await cuentas.findByIdProveedorAuth('proveedor-zona'))?.zonaHoraria).toBe(
      'Europe/Madrid',
    );
    expect(cuentas.cantidad).toBe(1);
  });

  it('al entrar desde la misma zona no guarda nada de mas', async () => {
    const { caso, cuentas } = crearCasoDeUso();
    await caso.execute({ ...orden, zonaHoraria: 'Europe/Madrid' });
    let guardados = 0;
    const guardar = cuentas.save.bind(cuentas);
    cuentas.save = (user) => {
      guardados += 1;

      return guardar(user);
    };

    await caso.execute({ ...orden, zonaHoraria: 'Europe/Madrid' });

    expect(guardados).toBe(0);
  });

  it('al entrar sin zona deja la que hay', async () => {
    const { caso } = crearCasoDeUso();
    await caso.execute({ ...orden, zonaHoraria: 'Europe/Madrid' });

    expect((await caso.execute(orden)).zonaHoraria).toBe('Europe/Madrid');
  });

  it('una zona invalida al entrar se rechaza y deja la cuenta como estaba', async () => {
    const { caso, cuentas } = crearCasoDeUso();
    await caso.execute({ ...orden, zonaHoraria: 'Europe/Madrid' });

    await expect(caso.execute({ ...orden, zonaHoraria: 'Marte/Olympus' })).rejects.toThrow(
      InvalidTimeZoneError,
    );
    expect((await cuentas.findByIdProveedorAuth('proveedor-zona'))?.zonaHoraria).toBe(
      'Europe/Madrid',
    );
  });

  it('cambiar de zona no pide otra vez el consentimiento ni lo reescribe', async () => {
    const { caso } = crearCasoDeUso();
    const primera = await caso.execute({ ...orden, zonaHoraria: 'America/Bogota' });

    // Otra version del aviso: a quien ya tiene cuenta no se le exige.
    const viajera = await caso.execute({
      ...orden,
      versionPolitica: '0.1',
      zonaHoraria: 'Europe/Madrid',
    });

    expect(viajera.consentimiento).toEqual(primera.consentimiento);
  });
});
