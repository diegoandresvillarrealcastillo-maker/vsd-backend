import { beforeEach, describe, expect, it } from 'vitest';
import { VERSION_VIGENTE_DEL_AVISO } from '../../domain/model/AvisoDePrivacidad.js';
import {
  InvalidTimeZoneError,
  MissingConsentError,
  OutdatedPrivacyNoticeError,
} from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import { Rol, User } from '../../domain/model/User.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { RegistrarCuentaUseCaseImpl } from './RegistrarCuentaUseCaseImpl.js';

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

    return Promise.resolve();
  }

  async borrarConTodo(id: UserId, antesDeConfirmar: () => Promise<void>): Promise<void> {
    await antesDeConfirmar();
    this.porId.delete(id.value);
  }

  get cantidad(): number {
    return this.porId.size;
  }
}

function crearCasoDeUso(): { caso: RegistrarCuentaUseCaseImpl; cuentas: RepositorioDoble } {
  const cuentas = new RepositorioDoble();

  const caso = new RegistrarCuentaUseCaseImpl(
    cuentas,
    () => new UserId(ID_NUEVO),
    () => AHORA,
  );

  return { caso, cuentas };
}

const ALTA = {
  idProveedorAuth: 'supabase|aaaa-1111',
  correo: 'persona@ejemplo.test',
  versionPolitica: VERSION_VIGENTE_DEL_AVISO,
};

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

  it('rechaza un aviso que no es el vigente, y no crea nada', async () => {
    // La prueba que define SCRUM-85. Aceptarlo dejaria registrado que la
    // persona dio permiso a un texto distinto del que esta en vigor.
    await expect(caso.execute({ ...ALTA, versionPolitica: '1.0' })).rejects.toThrow(
      OutdatedPrivacyNoticeError,
    );

    expect(cuentas.cantidad).toBe(0);
  });

  it('quien ya tenia cuenta con un aviso anterior conserva su version', async () => {
    // La version vigente solo se exige al darse de alta. Una cuenta creada con
    // un aviso anterior sigue entrando, y su consentimiento no se toca: es la
    // prueba de lo que acepto aquel dia.
    const fecha = new Date('2026-09-01T10:00:00.000Z');

    await cuentas.save(
      User.create(
        {
          id: new UserId('33333333-3333-4333-8333-333333333333'),
          correo: ALTA.correo,
          idProveedorAuth: ALTA.idProveedorAuth,
          rol: Rol.USUARIO,
          consentimiento: { versionPolitica: '1.0', aceptadoEn: fecha },
          registradoEn: fecha,
        },
        AHORA,
      ),
    );

    const cuenta = await caso.execute({ ...ALTA, versionPolitica: '1.0' });

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
  const orden = {
    idProveedorAuth: 'proveedor-zona',
    correo: 'zona@ejemplo.test',
    versionPolitica: VERSION_VIGENTE_DEL_AVISO,
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
