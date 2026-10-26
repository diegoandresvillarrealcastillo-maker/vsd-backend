import { beforeEach, describe, expect, it } from 'vitest';
import {
  VERSION_VIGENTE_DE_LOS_TERMINOS,
  VERSION_VIGENTE_DEL_AVISO,
  VERSIONES_VIGENTES,
} from '../domain/model/AvisoDePrivacidad.js';
import { AccountInactiveError } from '../domain/model/DomainError.js';
import { FechaDeNacimiento } from '../domain/model/FechaDeNacimiento.js';
import { UserId } from '../domain/model/Identifier.js';
import type { Mascota } from '../domain/model/Preferencias.js';
import { CAMPOS_MODIFICABLES, Rol, TipoDeConsentimiento, User } from '../domain/model/User.js';
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
    versionTerminos?: string;
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
          terminos: {
            versionPolitica: cambios.versionTerminos ?? VERSION_VIGENTE_DE_LOS_TERMINOS,
            aceptadoEn,
          },
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

      it('volver a aceptar los dos textos cuando cambian anade una fila de cada uno y deja las anteriores (SCRUM-237)', async () => {
        const antes = unaCuenta({ versionPolitica: '2026-09-1', versionTerminos: '2026-10-1' });
        const ahora = new Date('2026-11-02T15:30:00.000Z');

        await banco.repositorio.save(antes);
        await banco.repositorio.save(
          antes.conTextosAceptados(
            {
              aviso: { versionPolitica: VERSION_VIGENTE_DEL_AVISO, aceptadoEn: ahora },
              terminos: { versionPolitica: VERSION_VIGENTE_DE_LOS_TERMINOS, aceptadoEn: ahora },
            },
            ahora,
          ),
        );

        const historial = await banco.repositorio.consentimientosDe(new UserId(PERSONA));

        expect(historial.map((fila) => `${fila.tipo} ${fila.version}`).sort()).toEqual(
          [
            'aviso_de_privacidad 2026-09-1',
            'terminos 2026-10-1',
            `aviso_de_privacidad ${VERSION_VIGENTE_DEL_AVISO}`,
            `terminos ${VERSION_VIGENTE_DE_LOS_TERMINOS}`,
          ].sort(),
        );

        // Y la cuenta, al leerla de nuevo, esta al dia: lo guardado es lo vigente.
        const recargada = await banco.repositorio.findById(new UserId(PERSONA));

        expect(recargada?.textosPendientes(VERSIONES_VIGENTES)).toEqual([]);
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
        await banco.repositorio.borrarConTodo(new UserId(PERSONA));

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

    it('el permiso del acompanamiento por dias seguidos empieza apagado y se conserva al cambiarlo (SCRUM-177)', async () => {
      await banco.repositorio.save(unaCuenta());

      expect((await banco.repositorio.findById(new UserId(PERSONA)))?.acompanamientoPorDias).toBe(
        false,
      );

      await banco.repositorio.save(unaCuenta().conPreferencias({ acompanamientoPorDias: true }));

      expect((await banco.repositorio.findById(new UserId(PERSONA)))?.acompanamientoPorDias).toBe(
        true,
      );
    });

    it('cambiar otra preferencia no apaga el permiso del acompanamiento ni el del diario', async () => {
      await banco.repositorio.save(
        unaCuenta().conPreferencias({
          acompanamientoPorDias: true,
          diarioConRecomendaciones: true,
        }),
      );

      const antes = await banco.repositorio.findById(new UserId(PERSONA));

      await banco.repositorio.save(antes!.conPreferencias({ nombre: 'Luna' }));

      const despues = await banco.repositorio.findById(new UserId(PERSONA));

      expect(despues?.acompanamientoPorDias).toBe(true);
      expect(despues?.diarioConRecomendaciones).toBe(true);
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

      await banco.repositorio.borrarConTodo(new UserId(PERSONA));

      await expect(banco.repositorio.findById(new UserId(PERSONA))).resolves.toBeNull();
      await expect(banco.repositorio.findById(new UserId(OTRA_PERSONA))).resolves.not.toBeNull();
    });

    it('borrar una cuenta que no existe no es un error', async () => {
      await expect(banco.repositorio.borrarConTodo(new UserId(PERSONA))).resolves.toBeUndefined();
    });

    it('una cuenta no puede leer los datos de otra', async () => {
      // La regla del dominio, comprobada contra lo que de verdad se guardo y
      // no contra un objeto construido en la prueba.
      await banco.repositorio.save(unaCuenta());

      const una = await banco.repositorio.findById(new UserId(PERSONA));

      expect(una?.puedeLeerDatosDe(new UserId(PERSONA))).toBe(true);
      expect(una?.puedeLeerDatosDe(new UserId(OTRA_PERSONA))).toBe(false);
    });

    describe('dar de baja la cuenta con constancia (SCRUM-190, ADR 0026)', () => {
      const CUANDO = new Date('2026-10-14T15:00:00.000Z');

      async function conDosCuentas() {
        await banco.repositorio.save(unaCuenta({ nombre: 'Ana' }));
        await banco.repositorio.save(
          unaCuenta({
            id: OTRA_PERSONA,
            correo: 'otra@ejemplo.test',
            idProveedorAuth: 'supabase|bbbb-2222',
          }),
        );
      }

      it('la cuenta ya no se encuentra, ni por nuestro identificador ni por el del proveedor', async () => {
        await conDosCuentas();

        await banco.repositorio.inactivarConTodo(new UserId(PERSONA), CUANDO);

        await expect(banco.repositorio.findById(new UserId(PERSONA))).resolves.toBeNull();
        await expect(
          banco.repositorio.findByIdProveedorAuth('supabase|aaaa-1111'),
        ).resolves.toBeNull();
      });

      it('queda marcada como dada de baja para el identificador que traia su token', async () => {
        await conDosCuentas();

        await banco.repositorio.inactivarConTodo(new UserId(PERSONA), CUANDO);

        await expect(
          banco.repositorio.estaInactivadaPorProveedor('supabase|aaaa-1111'),
        ).resolves.toBe(true);
      });

      it('una cuenta que sigue activa, o que nunca existio, no esta dada de baja', async () => {
        await conDosCuentas();

        await banco.repositorio.inactivarConTodo(new UserId(PERSONA), CUANDO);

        await expect(
          banco.repositorio.estaInactivadaPorProveedor('supabase|bbbb-2222'),
        ).resolves.toBe(false);
        await expect(banco.repositorio.estaInactivadaPorProveedor('no-existe')).resolves.toBe(
          false,
        );
      });

      it('lo de la otra persona sigue entero', async () => {
        await conDosCuentas();

        await banco.repositorio.inactivarConTodo(new UserId(PERSONA), CUANDO);

        const otra = await banco.repositorio.findById(new UserId(OTRA_PERSONA));

        expect(otra?.correo).toBe('otra@ejemplo.test');
        await expect(
          banco.repositorio.consentimientosDe(new UserId(OTRA_PERSONA)),
        ).resolves.not.toEqual([]);
      });

      it('el correo queda libre: la misma persona puede volver a registrarse con el mismo', async () => {
        await conDosCuentas();
        await banco.repositorio.inactivarConTodo(new UserId(PERSONA), CUANDO);

        // Una identidad nueva en el proveedor y un identificador nuestro nuevo,
        // con el mismo correo de siempre.
        await banco.repositorio.save(
          unaCuenta({
            id: '33333333-3333-4333-8333-333333333333',
            correo: 'persona@ejemplo.test',
            idProveedorAuth: 'supabase|cccc-3333',
          }),
        );

        const nueva = await banco.repositorio.findByIdProveedorAuth('supabase|cccc-3333');

        expect(nueva?.correo).toBe('persona@ejemplo.test');
        expect(nueva?.id.value).toBe('33333333-3333-4333-8333-333333333333');
        // La de antes sigue dada de baja: otra identidad no la resucita.
        await expect(
          banco.repositorio.estaInactivadaPorProveedor('supabase|aaaa-1111'),
        ).resolves.toBe(true);
      });

      it('dar de baja una cuenta que no existe no es un error y no deja constancia', async () => {
        await expect(
          banco.repositorio.inactivarConTodo(new UserId(PERSONA), CUANDO),
        ).resolves.toBeUndefined();

        await expect(
          banco.repositorio.estaInactivadaPorProveedor('supabase|aaaa-1111'),
        ).resolves.toBe(false);
      });

      it('una orden que llega despues de la baja no vuelve a crear la cuenta', async () => {
        // La carrera: una peticion cargo la cuenta, la baja termino, y la peticion guarda. Sin
        // esto, `save` la crearia de nuevo con su nombre y su correo.
        const cargada = unaCuenta({ nombre: 'Ana' });

        await banco.repositorio.save(cargada);
        await banco.repositorio.inactivarConTodo(new UserId(PERSONA), CUANDO);

        await expect(
          banco.repositorio.save(cargada.conZonaHoraria('Europe/Madrid')),
        ).rejects.toThrow(AccountInactiveError);

        await expect(banco.repositorio.findById(new UserId(PERSONA))).resolves.toBeNull();
      });

      it('dar de baja dos veces la misma no es un error', async () => {
        await conDosCuentas();

        await banco.repositorio.inactivarConTodo(new UserId(PERSONA), CUANDO);
        await expect(
          banco.repositorio.inactivarConTodo(new UserId(PERSONA), CUANDO),
        ).resolves.toBeUndefined();

        await expect(
          banco.repositorio.estaInactivadaPorProveedor('supabase|aaaa-1111'),
        ).resolves.toBe(true);
      });
    });

    describe('la baja pendiente (SCRUM-267, ADR 0040)', () => {
      // Fechas de hace mucho a proposito: las suites de integracion comparten base y corren en
      // paralelo, y `bajasPendientes` mira las marcas de todas. Con un corte antiguo, solo ve las
      // de este contrato y el orden y el limite se pueden comprobar sin que otra suite los mueva.
      const PEDIDA = new Date('2000-01-01T10:00:00.000Z');
      const MAS_TARDE = new Date('2000-01-01T10:05:00.000Z');
      const AUN_MAS_TARDE = new Date('2000-01-01T10:10:00.000Z');
      const EL_DIA_SIGUIENTE = new Date('2000-01-02T10:00:00.000Z');
      const TERCERA = '33333333-3333-4333-8333-333333333333';

      async function conTresCuentas() {
        await banco.repositorio.save(unaCuenta());
        await banco.repositorio.save(
          unaCuenta({
            id: OTRA_PERSONA,
            correo: 'otra@ejemplo.test',
            idProveedorAuth: 'supabase|bbbb',
          }),
        );
        await banco.repositorio.save(
          unaCuenta({
            id: TERCERA,
            correo: 'tercera@ejemplo.test',
            idProveedorAuth: 'supabase|cccc',
          }),
        );
      }

      it('marcar una cuenta que existe devuelve true y la deja pendiente con lo que se pidio', async () => {
        await banco.repositorio.save(unaCuenta());

        await expect(banco.repositorio.marcarBaja(new UserId(PERSONA), true, PEDIDA)).resolves.toBe(
          true,
        );

        await expect(banco.repositorio.bajasPendientes(EL_DIA_SIGUIENTE, 10)).resolves.toEqual([
          { id: new UserId(PERSONA), conConstancia: true, pedidaEl: PEDIDA },
        ]);
      });

      it('marcar no cambia nada visible: la cuenta sigue entera hasta que la baja termina', async () => {
        await banco.repositorio.save(unaCuenta({ nombre: 'Ana' }));
        await banco.repositorio.marcarBaja(new UserId(PERSONA), true, PEDIDA);

        const cuenta = await banco.repositorio.findById(new UserId(PERSONA));

        expect(cuenta?.nombre).toBe('Ana');
        await expect(
          banco.repositorio.estaInactivadaPorProveedor('supabase|aaaa-1111'),
        ).resolves.toBe(false);
      });

      it('marcar una cuenta que no existe devuelve false y no deja nada', async () => {
        await expect(banco.repositorio.marcarBaja(new UserId(PERSONA), true, PEDIDA)).resolves.toBe(
          false,
        );

        await expect(banco.repositorio.bajasPendientes(EL_DIA_SIGUIENTE, 10)).resolves.toEqual([]);
      });

      it('marcar dos veces no es un error y la primera marca manda', async () => {
        await banco.repositorio.save(unaCuenta());

        await banco.repositorio.marcarBaja(new UserId(PERSONA), false, PEDIDA);
        await expect(
          banco.repositorio.marcarBaja(new UserId(PERSONA), true, MAS_TARDE),
        ).resolves.toBe(true);

        await expect(banco.repositorio.bajasPendientes(EL_DIA_SIGUIENTE, 10)).resolves.toEqual([
          { id: new UserId(PERSONA), conConstancia: false, pedidaEl: PEDIDA },
        ]);
      });

      it('solo devuelve las pedidas antes del corte, no las de despues ni las del mismo instante', async () => {
        await conTresCuentas();
        await banco.repositorio.marcarBaja(new UserId(PERSONA), true, PEDIDA);
        await banco.repositorio.marcarBaja(new UserId(OTRA_PERSONA), true, MAS_TARDE);
        await banco.repositorio.marcarBaja(new UserId(TERCERA), true, EL_DIA_SIGUIENTE);

        const ids = async (corte: Date) =>
          (await banco.repositorio.bajasPendientes(corte, 10)).map((baja) => baja.id.value);

        await expect(ids(PEDIDA)).resolves.toEqual([]);
        await expect(ids(MAS_TARDE)).resolves.toEqual([PERSONA]);
        await expect(ids(EL_DIA_SIGUIENTE)).resolves.toEqual([PERSONA, OTRA_PERSONA]);
      });

      it('las devuelve de la mas antigua a la mas reciente y no pasa del limite', async () => {
        await conTresCuentas();
        await banco.repositorio.marcarBaja(new UserId(TERCERA), true, PEDIDA);
        await banco.repositorio.marcarBaja(new UserId(PERSONA), true, MAS_TARDE);
        await banco.repositorio.marcarBaja(new UserId(OTRA_PERSONA), true, AUN_MAS_TARDE);

        const todas = await banco.repositorio.bajasPendientes(EL_DIA_SIGUIENTE, 10);
        const dos = await banco.repositorio.bajasPendientes(EL_DIA_SIGUIENTE, 2);

        expect(todas.map((baja) => baja.id.value)).toEqual([TERCERA, PERSONA, OTRA_PERSONA]);
        expect(dos.map((baja) => baja.id.value)).toEqual([TERCERA, PERSONA]);
      });

      it('dar de baja con constancia se lleva la marca', async () => {
        await banco.repositorio.save(unaCuenta());
        await banco.repositorio.marcarBaja(new UserId(PERSONA), true, PEDIDA);

        await banco.repositorio.inactivarConTodo(new UserId(PERSONA), MAS_TARDE);

        await expect(banco.repositorio.bajasPendientes(EL_DIA_SIGUIENTE, 10)).resolves.toEqual([]);
      });

      it('borrar sin constancia se lleva la marca', async () => {
        await banco.repositorio.save(unaCuenta());
        await banco.repositorio.marcarBaja(new UserId(PERSONA), false, PEDIDA);

        await banco.repositorio.borrarConTodo(new UserId(PERSONA));

        await expect(banco.repositorio.bajasPendientes(EL_DIA_SIGUIENTE, 10)).resolves.toEqual([]);
      });

      it('la marca de una persona no toca a las demas al terminar', async () => {
        await conTresCuentas();
        await banco.repositorio.marcarBaja(new UserId(PERSONA), true, PEDIDA);
        await banco.repositorio.marcarBaja(new UserId(OTRA_PERSONA), true, PEDIDA);

        await banco.repositorio.inactivarConTodo(new UserId(PERSONA), MAS_TARDE);

        const quedan = await banco.repositorio.bajasPendientes(EL_DIA_SIGUIENTE, 10);

        expect(quedan.map((baja) => baja.id.value)).toEqual([OTRA_PERSONA]);
        await expect(banco.repositorio.findById(new UserId(OTRA_PERSONA))).resolves.not.toBeNull();
      });
    });

    describe('guardarCambios: solo lo que cambio (SCRUM-258)', () => {
      const CUANDO = new Date('2026-10-20T09:00:00.000Z');
      const LUMA = { forma: 'brote', nombre: 'Luma', color: '#a2d9b6', accesorio: 'ninguno' };
      const leer = () => banco.repositorio.findById(new UserId(PERSONA));

      /** Lo que lee una peticion antes de cambiar lo suyo. */
      async function leida(): Promise<User> {
        const cuenta = await leer();

        if (cuenta === null) {
          throw new Error('La cuenta de la prueba no esta guardada.');
        }

        return cuenta;
      }

      it('una peticion que solo cambia la foto no enciende lo que otra acababa de apagar', async () => {
        // Es la carrera de la auditoria: la peticion de la foto lee la cuenta, sube el archivo
        // (lo lento) y guarda. Entretanto la persona apago dos permisos. Guardar la cuenta entera
        // los dejaba otra vez encendidos con lo que habia leido.
        await banco.repositorio.save(
          unaCuenta().conPreferencias({
            diarioConRecomendaciones: true,
            acompanamientoPorDias: true,
          }),
        );
        const laDeLaFoto = await leida();
        const laDeLosPermisos = await leida();

        await banco.repositorio.guardarCambios(
          laDeLosPermisos,
          laDeLosPermisos.conPreferencias({
            diarioConRecomendaciones: false,
            acompanamientoPorDias: false,
          }),
        );

        const quedo = await banco.repositorio.guardarCambios(
          laDeLaFoto,
          laDeLaFoto.conFoto(CUANDO),
        );

        // Lo que devuelve es lo que quedo guardado, no lo que se habia leido.
        expect(quedo?.fotoActualizadaEl).toEqual(CUANDO);
        expect(quedo?.diarioConRecomendaciones).toBe(false);
        expect(quedo?.acompanamientoPorDias).toBe(false);

        const guardada = await leida();

        expect(guardada.fotoActualizadaEl).toEqual(CUANDO);
        expect(guardada.diarioConRecomendaciones).toBe(false);
        expect(guardada.acompanamientoPorDias).toBe(false);
      });

      it('lo que el dispositivo informa de la zona no pisa lo que la persona acababa de elegir', async () => {
        await banco.repositorio.save(unaCuenta({ modulosActivos: ['cognicion'] }));
        const laDeLaZona = await leida();
        const laDeLasPreferencias = await leida();

        await banco.repositorio.guardarCambios(
          laDeLasPreferencias,
          laDeLasPreferencias.conPreferencias({
            nombre: 'Ana',
            modulosActivos: ['emociones'],
            mascota: LUMA,
          }),
        );
        await banco.repositorio.guardarCambios(
          laDeLaZona,
          laDeLaZona.conZonaHoraria('Europe/Madrid'),
        );

        const guardada = await leida();

        expect(guardada.zonaHoraria).toBe('Europe/Madrid');
        expect(guardada.nombre).toBe('Ana');
        expect(guardada.modulosActivos).toEqual(['emociones']);
        expect(guardada.mascota).toEqual(LUMA);
      });

      it('cambiar las preferencias no pisa la foto que se subio entretanto', async () => {
        await banco.repositorio.save(unaCuenta());
        const laDeLasPreferencias = await leida();
        const laDeLaFoto = await leida();

        await banco.repositorio.guardarCambios(laDeLaFoto, laDeLaFoto.conFoto(CUANDO));
        await banco.repositorio.guardarCambios(
          laDeLasPreferencias,
          laDeLasPreferencias.conPreferencias({ nombre: 'Ana' }),
        );

        const guardada = await leida();

        expect(guardada.nombre).toBe('Ana');
        expect(guardada.fotoActualizadaEl).toEqual(CUANDO);
      });

      it('quitar la foto la deja vacia, y quitar la mascota propia devuelve al personaje de siempre', async () => {
        await banco.repositorio.save(
          unaCuenta({ nombre: 'Ana' })
            .conFoto(CUANDO)
            .conMascotaPropia(CUANDO)
            .conPreferencias({ mascota: { forma: 'propia', nombre: 'Luma' } }),
        );

        const antes = await leida();
        await banco.repositorio.guardarCambios(antes, antes.sinFoto().sinMascotaPropia());

        const guardada = await leida();

        expect(guardada.fotoActualizadaEl).toBeUndefined();
        expect(guardada.mascotaPropiaActualizadaEl).toBeUndefined();
        // Conserva el nombre que le habia puesto.
        expect(guardada.mascota?.nombre).toBe('Luma');
        expect(guardada.mascota?.forma).not.toBe('propia');
        expect(guardada.nombre).toBe('Ana');
      });

      it('volver a aceptar un texto guarda la version nueva, la anota en el historial y no toca lo demas', async () => {
        await banco.repositorio.save(
          unaCuenta({ versionPolitica: '2026-09-1', versionTerminos: '2026-09-1' }),
        );
        const laDeLosTextos = await leida();
        const laDeLasPreferencias = await leida();

        await banco.repositorio.guardarCambios(
          laDeLasPreferencias,
          laDeLasPreferencias.conPreferencias({ acompanamientoPorDias: true }),
        );
        await banco.repositorio.guardarCambios(
          laDeLosTextos,
          laDeLosTextos.conTextosAceptados(
            { aviso: { versionPolitica: '2026-10-3', aceptadoEn: CUANDO } },
            CUANDO,
          ),
        );

        const guardada = await leida();

        expect(guardada.consentimiento?.versionPolitica).toBe('2026-10-3');
        // Los terminos no se tocaron, y lo que la persona acababa de encender sigue encendido.
        expect(guardada.terminos?.versionPolitica).toBe('2026-09-1');
        expect(guardada.acompanamientoPorDias).toBe(true);

        const historial = await banco.repositorio.consentimientosDe(new UserId(PERSONA));

        expect(
          historial
            .filter((fila) => fila.tipo === TipoDeConsentimiento.AVISO_DE_PRIVACIDAD)
            .map((fila) => fila.version),
        ).toEqual(['2026-09-1', '2026-10-3']);
        expect(
          historial.filter((fila) => fila.tipo === TipoDeConsentimiento.TERMINOS),
        ).toHaveLength(1);
      });

      it('completar el registro de una cuenta anterior guarda la fecha de nacimiento y lo aceptado', async () => {
        await banco.repositorio.save(unaCuenta({ anteriorAlRegistro: true }));
        const antes = await leida();

        const completa = antes.conRegistroCompleto(
          {
            fechaDeNacimiento: FechaDeNacimiento.restaurar('1998-03-14'),
            consentimiento: { versionPolitica: VERSION_VIGENTE_DEL_AVISO, aceptadoEn: CUANDO },
            terminos: { versionPolitica: VERSION_VIGENTE_DE_LOS_TERMINOS, aceptadoEn: CUANDO },
          },
          CUANDO,
        );

        await banco.repositorio.guardarCambios(antes, completa);

        const guardada = await leida();

        expect(guardada.registroCompleto()).toBe(true);
        expect(guardada.fechaDeNacimiento?.valor).toBe('1998-03-14');
        expect(guardada.terminos?.versionPolitica).toBe(VERSION_VIGENTE_DE_LOS_TERMINOS);
        await expect(
          banco.repositorio.consentimientosDe(new UserId(PERSONA)),
        ).resolves.toHaveLength(3);
      });

      it('guarda todos los campos que se pueden cambiar, ninguno se queda por el camino', async () => {
        await banco.repositorio.save(unaCuenta({ anteriorAlRegistro: true }));
        const antes = await leida();

        const despues = antes
          .conRegistroCompleto(
            {
              fechaDeNacimiento: FechaDeNacimiento.restaurar('1998-03-14'),
              consentimiento: { versionPolitica: '2026-10-1', aceptadoEn: CUANDO },
              terminos: { versionPolitica: '2026-10-1', aceptadoEn: CUANDO },
            },
            CUANDO,
          )
          .conPreferencias({
            nombre: 'Ana',
            modulosActivos: ['emociones', 'bienestar'],
            mascota: LUMA,
            diarioConRecomendaciones: true,
            acompanamientoPorDias: true,
          })
          .conZonaHoraria('Asia/Tokyo')
          .conFoto(CUANDO)
          .conMascotaPropia(CUANDO);

        // Si algun campo no cambiara aqui, la prueba no probaria ese campo.
        expect(despues.camposCambiadosDesde(antes).size).toBe(CAMPOS_MODIFICABLES.length);

        await banco.repositorio.guardarCambios(antes, despues);

        expect((await leida()).camposCambiadosDesde(despues).size).toBe(0);
      });

      it('sin cambios no escribe nada y devuelve la cuenta como esta guardada', async () => {
        await banco.repositorio.save(unaCuenta({ nombre: 'Ana' }));
        const antes = await leida();

        const quedo = await banco.repositorio.guardarCambios(antes, antes);

        expect(quedo?.camposCambiadosDesde(antes).size).toBe(0);
        expect(quedo?.nombre).toBe('Ana');
      });

      it('una cuenta que ya no existe no se vuelve a crear', async () => {
        await banco.repositorio.save(unaCuenta());
        const cargada = await leida();

        await banco.repositorio.borrarConTodo(new UserId(PERSONA));

        await expect(
          banco.repositorio.guardarCambios(cargada, cargada.conFoto(CUANDO)),
        ).resolves.toBeNull();
        await expect(leer()).resolves.toBeNull();
        expect(await banco.contar()).toBe(0);
      });

      it('una cuenta dada de baja tampoco se vuelve a crear', async () => {
        await banco.repositorio.save(unaCuenta({ nombre: 'Ana' }));
        const cargada = await leida();

        await banco.repositorio.inactivarConTodo(new UserId(PERSONA), CUANDO);

        await expect(
          banco.repositorio.guardarCambios(cargada, cargada.conZonaHoraria('Europe/Madrid')),
        ).resolves.toBeNull();
        await expect(leer()).resolves.toBeNull();
      });

      it('solo toca la cuenta de quien es: la de otra persona queda como estaba', async () => {
        await banco.repositorio.save(unaCuenta({ nombre: 'Ana' }));
        await banco.repositorio.save(
          unaCuenta({
            id: OTRA_PERSONA,
            correo: 'otra@ejemplo.test',
            idProveedorAuth: 'supabase|bbbb-2222',
            nombre: 'Luis',
          }),
        );
        const antes = await leida();

        await banco.repositorio.guardarCambios(antes, antes.conPreferencias({ nombre: 'Ana M.' }));

        const deLaOtra = await banco.repositorio.findById(new UserId(OTRA_PERSONA));

        expect(deLaOtra?.nombre).toBe('Luis');
        expect((await leida()).nombre).toBe('Ana M.');
      });
    });
  });
}
