import { beforeEach, describe, expect, it } from 'vitest';
import {
  VERSION_VIGENTE_DE_LOS_TERMINOS,
  VERSION_VIGENTE_DEL_AVISO,
} from '../domain/model/AvisoDePrivacidad.js';
import { FechaDeNacimiento } from '../domain/model/FechaDeNacimiento.js';
import { UserId } from '../domain/model/Identifier.js';
import type { Mascota } from '../domain/model/Preferencias.js';
import { Rol, TipoDeConsentimiento, User } from '../domain/model/User.js';
import type { UserRepositoryPort } from '../domain/ports/out/UserRepositoryPort.js';

/**
 * La misma bateria de pruebas para todos los adaptadores de cuentas.
 *
 * Es lo que pide SCRUM-62, y la razon esta en el propio ticket: si el
 * adaptador en memoria y el de Prisma no se comportan igual, **el que miente
 * es el de memoria**, y todas las pruebas del sistema que lo usan dejan de
 * significar algo. Pasan describiendo un sistema que no existe.
 *
 * Escribir las pruebas dos veces no valdria: se irian separando poco a poco, y
 * la diferencia aparaceria el dia que algo falle en produccion y no en local.
 * Escritas una sola vez, esa separacion es imposible.
 *
 * Lo que NO se prueba aqui son las garantias que solo da la base: las
 * restricciones UNIQUE, las transacciones y las politicas de aislamiento. Un
 * Map no tiene nada de eso, asi que exigirlo aqui obligaria a simularlo en el
 * adaptador de memoria, que es como se construye un doble que se parece cada
 * vez menos a lo real. Eso vive en las pruebas de integracion.
 */

/** Lo que cada adaptador tiene que saber hacer para correr esta bateria. */
export interface BancoDePruebas {
  readonly repositorio: UserRepositoryPort;
  /** Deja el almacen vacio antes de cada prueba. */
  limpiar: () => Promise<void>;
  /** Cuantas cuentas hay guardadas. Para comprobar que no se duplican. */
  contar: () => Promise<number>;
}

const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA_PERSONA = '22222222-2222-4222-9222-222222222222';

/**
 * Una cuenta valida, con lo que se quiera cambiar.
 *
 * Por defecto tiene el registro completo —fecha de nacimiento y los terminos
 * aceptados—, que es lo normal. `anteriorAlRegistro` da una de las que se
 * crearon antes de que se pidieran, que no puede usar la aplicacion hasta
 * completarlo.
 */
export function unaCuenta(
  cambios: {
    id?: string;
    correo?: string;
    idProveedorAuth?: string;
    rol?: Rol;
    nombre?: string;
    versionPolitica?: string;
    aceptadoEn?: Date;
    anteriorAlRegistro?: boolean;
    modulosActivos?: readonly string[];
    mascota?: Mascota;
    fotoActualizadaEl?: Date;
    mascotaPropiaActualizadaEl?: Date;
  } = {},
): User {
  const aceptadoEn = cambios.aceptadoEn ?? new Date('2026-09-01T10:00:00.000Z');

  return User.create({
    id: new UserId(cambios.id ?? PERSONA),
    correo: cambios.correo ?? 'persona@ejemplo.test',
    idProveedorAuth: cambios.idProveedorAuth ?? 'supabase|aaaa-1111',
    rol: cambios.rol ?? Rol.USUARIO,
    consentimiento: {
      versionPolitica: cambios.versionPolitica ?? VERSION_VIGENTE_DEL_AVISO,
      aceptadoEn,
    },
    ...(cambios.anteriorAlRegistro === true
      ? {}
      : {
          terminos: { versionPolitica: VERSION_VIGENTE_DE_LOS_TERMINOS, aceptadoEn },
          fechaDeNacimiento: FechaDeNacimiento.restaurar('1998-03-14'),
        }),
    registradoEn: new Date('2026-09-01T10:00:00.000Z'),
    ...(cambios.nombre === undefined ? {} : { nombre: cambios.nombre }),
    ...(cambios.modulosActivos === undefined ? {} : { modulosActivos: cambios.modulosActivos }),
    ...(cambios.mascota === undefined ? {} : { mascota: cambios.mascota }),
    ...(cambios.fotoActualizadaEl === undefined
      ? {}
      : { fotoActualizadaEl: cambios.fotoActualizadaEl }),
    ...(cambios.mascotaPropiaActualizadaEl === undefined
      ? {}
      : { mascotaPropiaActualizadaEl: cambios.mascotaPropiaActualizadaEl }),
  });
}

export function pruebasDelPuertoDeUsuarios(
  nombre: string,
  preparar: () => Promise<BancoDePruebas> | BancoDePruebas,
): void {
  describe(nombre, () => {
    let banco: BancoDePruebas;

    beforeEach(async () => {
      banco = await preparar();
      await banco.limpiar();
    });

    it('guarda una cuenta y la encuentra por nuestro identificador', async () => {
      await banco.repositorio.save(unaCuenta());

      const encontrada = await banco.repositorio.findById(new UserId(PERSONA));

      expect(encontrada?.id.value).toBe(PERSONA);
      expect(encontrada?.correo).toBe('persona@ejemplo.test');
    });

    it('la encuentra tambien por el identificador del proveedor', async () => {
      // Es la busqueda con la que empieza cada peticion: lo unico que trae el
      // token es este identificador, y hay que llegar desde el a la cuenta.
      await banco.repositorio.save(unaCuenta());

      const encontrada = await banco.repositorio.findByIdProveedorAuth('supabase|aaaa-1111');

      expect(encontrada?.id.value).toBe(PERSONA);
    });

    it('buscar una cuenta que no existe devuelve ausencia, no lanza', async () => {
      // Devolver null y no lanzar es deliberado: la primera vez que alguien
      // entra, Supabase ya lo conoce y nosotros todavia no. Eso es lo normal,
      // no un error.
      await expect(banco.repositorio.findById(new UserId(OTRA_PERSONA))).resolves.toBeNull();
      await expect(banco.repositorio.findByIdProveedorAuth('no-existe')).resolves.toBeNull();
    });

    it('guardar dos veces la misma cuenta no crea una segunda', async () => {
      await banco.repositorio.save(unaCuenta());
      await banco.repositorio.save(unaCuenta());

      await expect(banco.contar()).resolves.toBe(1);
    });

    it('guardar de nuevo actualiza lo que cambio', async () => {
      await banco.repositorio.save(unaCuenta());
      await banco.repositorio.save(unaCuenta({ nombre: 'Como quiere que la llamen' }));

      const encontrada = await banco.repositorio.findById(new UserId(PERSONA));

      expect(encontrada?.nombre).toBe('Como quiere que la llamen');
      await expect(banco.contar()).resolves.toBe(1);
    });

    it('conserva el consentimiento con su version y su fecha', async () => {
      // No basta con un si o un no. Las politicas cambian, y ante una
      // reclamacion hay que poder demostrar a que dio permiso cada quien y
      // cuando. Ley 1581 de 2012.
      await banco.repositorio.save(unaCuenta({ versionPolitica: '2.1' }));

      const encontrada = await banco.repositorio.findById(new UserId(PERSONA));

      expect(encontrada?.consentimiento?.versionPolitica).toBe('2.1');
      expect(encontrada?.consentimiento?.aceptadoEn.toISOString()).toBe('2026-09-01T10:00:00.000Z');
      expect(encontrada?.puedeTratarDatosDeSalud()).toBe(true);
    });

    it('conserva la fecha de nacimiento y los terminos aceptados', async () => {
      await banco.repositorio.save(unaCuenta());

      const encontrada = await banco.repositorio.findById(new UserId(PERSONA));

      expect(encontrada?.fechaDeNacimiento?.valor).toBe('1998-03-14');
      expect(encontrada?.terminos?.versionPolitica).toBe(VERSION_VIGENTE_DE_LOS_TERMINOS);
      expect(encontrada?.terminos?.aceptadoEn.toISOString()).toBe('2026-09-01T10:00:00.000Z');
      expect(encontrada?.registroCompleto()).toBe(true);
    });

    it('una cuenta anterior a que se pidiera el registro vuelve incompleta, sin inventar nada', async () => {
      await banco.repositorio.save(unaCuenta({ anteriorAlRegistro: true }));

      const encontrada = await banco.repositorio.findById(new UserId(PERSONA));

      expect(encontrada?.fechaDeNacimiento).toBeUndefined();
      expect(encontrada?.terminos).toBeUndefined();
      expect(encontrada?.registroCompleto()).toBe(false);
    });

    it('completar el registro de una cuenta anterior lo guarda, y cambiar otras cosas no lo pierde', async () => {
      await banco.repositorio.save(unaCuenta({ anteriorAlRegistro: true }));

      const antigua = await banco.repositorio.findById(new UserId(PERSONA));
      const completa = antigua?.conRegistroCompleto({
        fechaDeNacimiento: FechaDeNacimiento.restaurar('1990-12-31'),
        consentimiento: {
          versionPolitica: VERSION_VIGENTE_DEL_AVISO,
          aceptadoEn: new Date('2026-10-05T10:00:00.000Z'),
        },
        terminos: {
          versionPolitica: VERSION_VIGENTE_DE_LOS_TERMINOS,
          aceptadoEn: new Date('2026-10-05T10:00:00.000Z'),
        },
      });

      await banco.repositorio.save(completa ?? unaCuenta());
      await banco.repositorio.save(
        (await banco.repositorio.findById(new UserId(PERSONA)))?.conPreferencias({
          nombre: 'Ana',
        }) ?? unaCuenta(),
      );

      const encontrada = await banco.repositorio.findById(new UserId(PERSONA));

      expect(encontrada?.registroCompleto()).toBe(true);
      expect(encontrada?.fechaDeNacimiento?.valor).toBe('1990-12-31');
      expect(encontrada?.consentimiento?.aceptadoEn.toISOString()).toBe('2026-10-05T10:00:00.000Z');
    });

    describe('el historial de lo aceptado (L-05)', () => {
      it('guardar una cuenta anota el aviso y los terminos', async () => {
        await banco.repositorio.save(unaCuenta());

        const historial = await banco.repositorio.consentimientosDe(new UserId(PERSONA));

        expect(historial.map((fila) => [fila.tipo, fila.version])).toEqual(
          expect.arrayContaining([
            [TipoDeConsentimiento.AVISO_DE_PRIVACIDAD, VERSION_VIGENTE_DEL_AVISO],
            [TipoDeConsentimiento.TERMINOS, VERSION_VIGENTE_DE_LOS_TERMINOS],
          ]),
        );
        expect(historial).toHaveLength(2);
        expect(historial[0]?.aceptadoEn.toISOString()).toBe('2026-09-01T10:00:00.000Z');
      });

      it('guardar de nuevo la misma cuenta, o cambiarle otras cosas, no repite lo anotado', async () => {
        await banco.repositorio.save(unaCuenta());
        await banco.repositorio.save(unaCuenta());
        await banco.repositorio.save(unaCuenta({ nombre: 'Ana' }));

        await expect(
          banco.repositorio.consentimientosDe(new UserId(PERSONA)),
        ).resolves.toHaveLength(2);
      });

      it('aceptar otra version anade una fila y deja la anterior', async () => {
        await banco.repositorio.save(unaCuenta({ versionPolitica: '2026-09-1' }));
        await banco.repositorio.save(
          unaCuenta({
            versionPolitica: '2026-10-1b',
            aceptadoEn: new Date('2026-10-02T10:00:00.000Z'),
          }),
        );

        const historial = await banco.repositorio.consentimientosDe(new UserId(PERSONA));
        const avisos = historial.filter(
          (fila) => fila.tipo === TipoDeConsentimiento.AVISO_DE_PRIVACIDAD,
        );

        expect(avisos.map((fila) => fila.version)).toEqual(['2026-09-1', '2026-10-1b']);
      });

      it('aceptar de nuevo la misma version otro dia tambien queda anotado', async () => {
        // Es lo que pasa cuando una cuenta anterior completa su registro con las
        // casillas: la version es la misma y lo que cambia es que ahora la dio.
        await banco.repositorio.save(unaCuenta());
        await banco.repositorio.save(
          unaCuenta({ aceptadoEn: new Date('2026-10-05T10:00:00.000Z') }),
        );

        const historial = await banco.repositorio.consentimientosDe(new UserId(PERSONA));

        expect(
          historial
            .filter((fila) => fila.tipo === TipoDeConsentimiento.AVISO_DE_PRIVACIDAD)
            .map((fila) => fila.aceptadoEn.toISOString()),
        ).toEqual(['2026-09-01T10:00:00.000Z', '2026-10-05T10:00:00.000Z']);
      });

      it('lo de una persona no aparece en el historial de otra', async () => {
        await banco.repositorio.save(unaCuenta());

        await expect(
          banco.repositorio.consentimientosDe(new UserId(OTRA_PERSONA)),
        ).resolves.toEqual([]);
      });

      it('borrar la cuenta borra tambien su historial', async () => {
        await banco.repositorio.save(unaCuenta());
        await banco.repositorio.borrarConTodo(new UserId(PERSONA), () => Promise.resolve());

        await expect(banco.repositorio.consentimientosDe(new UserId(PERSONA))).resolves.toEqual([]);
      });
    });

    it('conserva el rol', async () => {
      await banco.repositorio.save(
        unaCuenta({ id: OTRA_PERSONA, correo: 'admin@ejemplo.test', rol: Rol.ADMINISTRADOR }),
      );

      const encontrada = await banco.repositorio.findById(new UserId(OTRA_PERSONA));

      expect(encontrada?.esAdministrador()).toBe(true);
    });

    it('dos cuentas distintas no se pisan', async () => {
      await banco.repositorio.save(unaCuenta());
      await banco.repositorio.save(
        unaCuenta({
          id: OTRA_PERSONA,
          correo: 'otra@ejemplo.test',
          idProveedorAuth: 'supabase|bbbb-2222',
        }),
      );

      const una = await banco.repositorio.findByIdProveedorAuth('supabase|aaaa-1111');
      const otra = await banco.repositorio.findByIdProveedorAuth('supabase|bbbb-2222');

      expect(una?.id.value).toBe(PERSONA);
      expect(otra?.id.value).toBe(OTRA_PERSONA);
      await expect(banco.contar()).resolves.toBe(2);
    });

    it('una cuenta nueva sale sin modulos elegidos y sin mascota', async () => {
      // La lista vacia es lo que lleva a la bienvenida (SCRUM-90). Si el
      // adaptador devolviera null o los tres modulos, nadie la veria.
      await banco.repositorio.save(unaCuenta());

      const encontrada = await banco.repositorio.findById(new UserId(PERSONA));

      expect(encontrada?.modulosActivos).toEqual([]);
      expect(encontrada?.haElegidoModulos()).toBe(false);
      expect(encontrada?.mascota).toBeUndefined();
    });

    it('conserva los modulos activos y la mascota', async () => {
      const luma = { forma: 'brote', color: '#a2d9b6', accesorio: 'bufanda', nombre: 'Luma' };

      await banco.repositorio.save(unaCuenta());
      await banco.repositorio.save(
        unaCuenta().conPreferencias({ modulosActivos: ['emociones', 'cognicion'], mascota: luma }),
      );

      const encontrada = await banco.repositorio.findById(new UserId(PERSONA));

      expect(encontrada?.modulosActivos).toEqual(['cognicion', 'emociones']);
      expect(encontrada?.mascota).toEqual(luma);
      await expect(banco.contar()).resolves.toBe(1);
    });

    it('el permiso sobre el diario empieza apagado y se conserva al cambiarlo (SCRUM-108)', async () => {
      await banco.repositorio.save(unaCuenta());

      expect(
        (await banco.repositorio.findById(new UserId(PERSONA)))?.diarioConRecomendaciones,
      ).toBe(false);

      await banco.repositorio.save(unaCuenta().conPreferencias({ diarioConRecomendaciones: true }));

      expect(
        (await banco.repositorio.findById(new UserId(PERSONA)))?.diarioConRecomendaciones,
      ).toBe(true);
    });

    it('la zona horaria empieza en la de Colombia y se conserva al cambiarla (SCRUM-123)', async () => {
      await banco.repositorio.save(unaCuenta());

      expect((await banco.repositorio.findById(new UserId(PERSONA)))?.zonaHoraria).toBe(
        'America/Bogota',
      );

      await banco.repositorio.save(unaCuenta().conZonaHoraria('Europe/Madrid'));

      expect((await banco.repositorio.findById(new UserId(PERSONA)))?.zonaHoraria).toBe(
        'Europe/Madrid',
      );
    });

    it('cambiar las preferencias no devuelve la zona a la de Colombia', async () => {
      await banco.repositorio.save(unaCuenta().conZonaHoraria('Asia/Tokyo'));

      const guardada = await banco.repositorio.findById(new UserId(PERSONA));
      await banco.repositorio.save((guardada ?? unaCuenta()).conPreferencias({ nombre: 'Ana' }));

      expect((await banco.repositorio.findById(new UserId(PERSONA)))?.zonaHoraria).toBe(
        'Asia/Tokyo',
      );
    });

    it('la marca de la foto empieza vacia, se guarda, se conserva al cambiar otras cosas y se quita (SCRUM-120)', async () => {
      const guardadaEl = new Date('2026-10-09T15:30:00.123Z');
      const leer = () => banco.repositorio.findById(new UserId(PERSONA));

      await banco.repositorio.save(unaCuenta());

      expect((await leer())?.fotoActualizadaEl).toBeUndefined();

      await banco.repositorio.save(unaCuenta().conFoto(guardadaEl));

      expect((await leer())?.fotoActualizadaEl).toEqual(guardadaEl);

      // Guardar otra cosa de la cuenta no borra la foto.
      await banco.repositorio.save(
        (await leer())?.conPreferencias({ nombre: 'Ana' }) ?? unaCuenta(),
      );

      expect((await leer())?.fotoActualizadaEl).toEqual(guardadaEl);

      await banco.repositorio.save((await leer())?.conZonaHoraria('Asia/Tokyo') ?? unaCuenta());

      expect((await leer())?.fotoActualizadaEl).toEqual(guardadaEl);

      // Y quitarla la deja vacia: el UPDATE escribe NULL, no se salta la columna.
      await banco.repositorio.save((await leer())?.sinFoto() ?? unaCuenta());

      expect((await leer())?.fotoActualizadaEl).toBeUndefined();
    });

    it('la marca de la mascota propia empieza vacia, se guarda, se conserva al cambiar otras cosas y se quita (SCRUM-122)', async () => {
      const guardadaEl = new Date('2026-10-12T09:00:00.456Z');
      const leer = () => banco.repositorio.findById(new UserId(PERSONA));

      await banco.repositorio.save(unaCuenta());

      expect((await leer())?.mascotaPropiaActualizadaEl).toBeUndefined();

      await banco.repositorio.save(unaCuenta().conMascotaPropia(guardadaEl));

      expect((await leer())?.mascotaPropiaActualizadaEl).toEqual(guardadaEl);

      // Guardar otra cosa de la cuenta no la borra, ni la foto la pisa.
      await banco.repositorio.save(
        (await leer())?.conPreferencias({ nombre: 'Ana' }) ?? unaCuenta(),
      );
      await banco.repositorio.save((await leer())?.conZonaHoraria('Asia/Tokyo') ?? unaCuenta());
      await banco.repositorio.save(
        (await leer())?.conFoto(new Date('2026-10-09T15:30:00.123Z')) ?? unaCuenta(),
      );
      await banco.repositorio.save((await leer())?.sinFoto() ?? unaCuenta());

      expect((await leer())?.mascotaPropiaActualizadaEl).toEqual(guardadaEl);

      // Quitarla la deja vacia: el UPDATE escribe NULL, no se salta la columna.
      await banco.repositorio.save((await leer())?.sinMascotaPropia() ?? unaCuenta());

      expect((await leer())?.mascotaPropiaActualizadaEl).toBeUndefined();
    });

    it('elegir la mascota propia se guarda, y quitarla devuelve al personaje de siempre (SCRUM-122)', async () => {
      const leer = () => banco.repositorio.findById(new UserId(PERSONA));
      const conMascota = unaCuenta().conMascotaPropia(new Date('2026-10-12T09:00:00.000Z'));

      await banco.repositorio.save(
        conMascota.conPreferencias({ mascota: { forma: 'propia', nombre: 'Luma' } }),
      );

      expect((await leer())?.mascota).toEqual({ forma: 'propia', nombre: 'Luma' });

      await banco.repositorio.save((await leer())?.sinMascotaPropia() ?? unaCuenta());

      expect((await leer())?.mascota).toEqual({ forma: 'fungito', nombre: 'Luma' });
      expect((await leer())?.mascotaPropiaActualizadaEl).toBeUndefined();
    });

    it('un personaje sin color ni accesorio vuelve igual, sin campos inventados', async () => {
      // SCRUM-99: si el adaptador rellenara con texto vacio, el dominio lo
      // rechazaria al leer y la cuenta dejaria de cargar.
      const sparky = { forma: 'sparky', nombre: 'Chispita' };

      await banco.repositorio.save(unaCuenta().conPreferencias({ mascota: sparky }));

      const encontrada = await banco.repositorio.findById(new UserId(PERSONA));

      expect(encontrada?.mascota).toStrictEqual(sparky);
    });

    it('borrar una cuenta la quita y deja las demas', async () => {
      await banco.repositorio.save(unaCuenta());
      await banco.repositorio.save(
        unaCuenta({
          id: OTRA_PERSONA,
          correo: 'otra@ejemplo.test',
          idProveedorAuth: 'supabase|bbbb',
        }),
      );

      await banco.repositorio.borrarConTodo(new UserId(PERSONA), () => Promise.resolve());

      await expect(banco.repositorio.findById(new UserId(PERSONA))).resolves.toBeNull();
      await expect(banco.repositorio.findById(new UserId(OTRA_PERSONA))).resolves.not.toBeNull();
    });

    it('si lo de fuera falla, el borrado se deshace', async () => {
      // Es la garantia de todo o nada. Si el proveedor no borra la identidad,
      // la cuenta tiene que seguir aqui entera para poder reintentar.
      await banco.repositorio.save(unaCuenta());

      await expect(
        banco.repositorio.borrarConTodo(new UserId(PERSONA), () =>
          Promise.reject(new Error('el proveedor no respondio')),
        ),
      ).rejects.toThrow('el proveedor no respondio');

      await expect(banco.repositorio.findById(new UserId(PERSONA))).resolves.not.toBeNull();
    });

    it('borrar una cuenta que no existe no es un error', async () => {
      await expect(
        banco.repositorio.borrarConTodo(new UserId(PERSONA), () => Promise.resolve()),
      ).resolves.toBeUndefined();
    });

    it('una cuenta no puede leer los datos de otra', async () => {
      // La regla del dominio, comprobada contra lo que de verdad se guardo y
      // no contra un objeto construido en la prueba.
      await banco.repositorio.save(unaCuenta());

      const una = await banco.repositorio.findById(new UserId(PERSONA));

      expect(una?.puedeLeerDatosDe(new UserId(PERSONA))).toBe(true);
      expect(una?.puedeLeerDatosDe(new UserId(OTRA_PERSONA))).toBe(false);
    });
  });
}
