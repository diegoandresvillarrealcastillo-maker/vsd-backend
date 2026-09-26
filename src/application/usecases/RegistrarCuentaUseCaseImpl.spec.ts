import { beforeEach, describe, expect, it } from 'vitest';
import { MissingConsentError } from '../../domain/model/DomainError.js';
import { UserId } from '../../domain/model/Identifier.js';
import { Rol, type User } from '../../domain/model/User.js';
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
  versionPolitica: '1.0',
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
    const cuenta = await caso.execute({ ...ALTA, versionPolitica: '2.1' });

    expect(cuenta.consentimiento?.versionPolitica).toBe('2.1');
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
    await caso.execute({ ...ALTA, versionPolitica: '1.0' });

    const segunda = await caso.execute({ ...ALTA, versionPolitica: '9.9' });

    expect(segunda.consentimiento?.versionPolitica).toBe('1.0');
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
