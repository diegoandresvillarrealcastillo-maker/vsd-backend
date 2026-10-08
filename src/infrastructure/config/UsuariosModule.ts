import { Logger, Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ActualizarPreferenciasUseCaseImpl } from '../../application/usecases/ActualizarPreferenciasUseCaseImpl.js';
import { BorrarCuentaUseCaseImpl } from '../../application/usecases/BorrarCuentaUseCaseImpl.js';
import { ExportarDatosUseCaseImpl } from '../../application/usecases/ExportarDatosUseCaseImpl.js';
import { FotoDePerfilUseCaseImpl } from '../../application/usecases/FotoDePerfilUseCaseImpl.js';
import { MascotaPropiaUseCaseImpl } from '../../application/usecases/MascotaPropiaUseCaseImpl.js';
import { RegistrarCuentaUseCaseImpl } from '../../application/usecases/RegistrarCuentaUseCaseImpl.js';
import { PESO_MAXIMO_DE_LA_FOTO, TIPOS_DE_FOTO } from '../../domain/model/FotoDePerfil.js';
import { PESO_MAXIMO_DEL_SVG, TIPO_DEL_SVG } from '../../domain/model/svg/SvgDeMascota.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { AlmacenPersonalPort } from '../../domain/ports/out/AlmacenPersonalPort.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';
import type { BorrarCuentaUseCase } from '../../domain/ports/in/BorrarCuentaUseCase.js';
import type { ProveedorDeIdentidadPort } from '../../domain/ports/out/ProveedorDeIdentidadPort.js';
import type { RegistroDeSeguridadPort } from '../../domain/ports/out/RegistroDeSeguridadPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { AlmacenPersonalEnMemoria } from '../almacenamiento/AlmacenPersonalEnMemoria.js';
import { AlmacenPersonalEnSupabase } from '../almacenamiento/AlmacenPersonalEnSupabase.js';
import { GuardiaDeCuenta } from '../auth/GuardiaDeCuenta.js';
import {
  IdentidadesDeSupabase,
  IdentidadesSinAdministracion,
} from '../auth/IdentidadesDeSupabase.js';
import { AvisoController } from '../controllers/AvisoController.js';
import { CuentaController } from '../controllers/CuentaController.js';
import { FotoDePerfilController } from '../controllers/FotoDePerfilController.js';
import { MascotaPropiaController } from '../controllers/MascotaPropiaController.js';
import type { PrismaService } from '../persistence/PrismaService.js';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository.js';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository.js';
import { ActivityResultModule } from './ActivityResultModule.js';
import { AvisosModule } from './AvisosModule.js';
import { DiarioModule } from './DiarioModule.js';
import type { Configuracion } from './environment.js';
import { PendientesModule } from './PendientesModule.js';
import {
  ACTIVITY_RESULT_REPOSITORY,
  ACTUALIZAR_PREFERENCIAS,
  ALMACEN_DE_FOTOS,
  ALMACEN_DE_MASCOTAS,
  AVISOS_REPOSITORY,
  BORRAR_CUENTA,
  CONFIGURACION,
  DIARIO_REPOSITORY,
  EXPORTAR_DATOS,
  FOTO_DE_PERFIL,
  MASCOTA_PROPIA,
  PENDIENTES_REPOSITORY,
  PRISMA,
  PROVEEDOR_DE_IDENTIDAD,
  REGISTRAR_CUENTA,
  REGISTRO_DE_SEGURIDAD,
  USER_REPOSITORY,
} from './tokens.js';

/**
 * Cableado de las cuentas.
 *
 * Vive en su propio modulo y no dentro del de resultados porque no tienen nada
 * que ver: uno guarda lo que alguien hizo y el otro guarda quien es. Que hoy
 * los dos necesiten el mismo cliente de Prisma es una coincidencia de
 * infraestructura, no una relacion entre las dos cosas.
 *
 * Importa `ActivityResultModule` unicamente para alcanzar el proveedor de
 * Prisma, que es el que decide si hay base de datos. Cuando eso se mueva a un
 * modulo de persistencia propio, esta importacion desaparece.
 *
 * ## El segundo guardia
 *
 * Aqui se registra `GuardiaDeCuenta`, que traduce la identidad del proveedor
 * en la cuenta de VSD Health. Se registra **despues** de `GuardiaDeSesion`
 * —que vive en `AutenticacionModule`, importado antes en `AppModule`— porque
 * necesita la identidad que aquel deja en la peticion.
 */
@Module({
  // El diario y los pendientes, para la exportacion de datos.
  imports: [ActivityResultModule, DiarioModule, PendientesModule, AvisosModule],
  controllers: [CuentaController, FotoDePerfilController, MascotaPropiaController, AvisoController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useFactory: (prisma: PrismaService | null): UserRepositoryPort => {
        const registro = new Logger('Persistencia');

        if (prisma === null) {
          registro.warn('Sin DATABASE_URL: las cuentas se guardan en memoria.');

          return new InMemoryUserRepository();
        }

        registro.log('Cuentas sobre PostgreSQL.');

        return new PrismaUserRepository(prisma);
      },
      inject: [PRISMA],
    },
    {
      provide: REGISTRAR_CUENTA,
      useFactory: (
        cuentas: UserRepositoryPort,
        identidades: ProveedorDeIdentidadPort,
        borrado: BorrarCuentaUseCase,
      ) => {
        const registro = new Logger('Registro');

        return new RegistrarCuentaUseCaseImpl(cuentas, identidades, borrado, {
          // Sin fecha, sin correo y sin identificador: lo que importa es saber
          // que paso y si hay que limpiar algo a mano. Es el rastro minimo de
          // un rechazo por edad mientras no hay registro de eventos de seguridad
          // (A-01 de la auditoria 360).
          menorDeEdad: (identidadBorrada) => {
            if (identidadBorrada) {
              registro.warn('MENOR_DE_EDAD: registro rechazado y su identidad borrada.');
            } else {
              registro.error(
                'MENOR_DE_EDAD: registro rechazado, pero NO se pudo borrar su identidad en el proveedor. Hay que limpiarla a mano.',
              );
            }
          },
        });
      },
      inject: [USER_REPOSITORY, PROVEEDOR_DE_IDENTIDAD, BORRAR_CUENTA],
    },
    {
      provide: ACTUALIZAR_PREFERENCIAS,
      useFactory: (cuentas: UserRepositoryPort) => new ActualizarPreferenciasUseCaseImpl(cuentas),
      inject: [USER_REPOSITORY],
    },
    {
      provide: PROVEEDOR_DE_IDENTIDAD,
      useFactory: (configuracion: Configuracion): ProveedorDeIdentidadPort =>
        configuracion.claveDeServicioDeSupabase === undefined
          ? new IdentidadesSinAdministracion()
          : new IdentidadesDeSupabase(
              configuracion.urlDeSupabase,
              configuracion.claveDeServicioDeSupabase,
            ),
      inject: [CONFIGURACION],
    },
    {
      // Los archivos de las fotos (SCRUM-120, ADR 0016). Con la clave de
      // servicio, en un bucket privado de Supabase Storage; sin ella —en local—,
      // en memoria. La misma clave que ya borra identidades.
      provide: ALMACEN_DE_FOTOS,
      useFactory: (configuracion: Configuracion): AlmacenPersonalPort => {
        const registro = new Logger('Almacenamiento');

        if (configuracion.claveDeServicioDeSupabase === undefined) {
          registro.warn(
            'Sin SUPABASE_SERVICE_ROLE_KEY: las fotos de perfil se guardan en memoria.',
          );

          return new AlmacenPersonalEnMemoria();
        }

        registro.log('Fotos de perfil en un bucket privado de Supabase Storage.');

        return new AlmacenPersonalEnSupabase(
          configuracion.urlDeSupabase,
          configuracion.claveDeServicioDeSupabase,
          'fotos-de-perfil',
          { tiposPermitidos: TIPOS_DE_FOTO, pesoMaximo: PESO_MAXIMO_DE_LA_FOTO },
        );
      },
      inject: [CONFIGURACION],
    },
    {
      // Los archivos de la mascota propia (SCRUM-122, ADR 0017): su propio
      // bucket privado, con su propio limite y su propio tipo, aunque con la
      // misma clave y el mismo adaptador que las fotos.
      provide: ALMACEN_DE_MASCOTAS,
      useFactory: (configuracion: Configuracion): AlmacenPersonalPort => {
        const registro = new Logger('Almacenamiento');

        if (configuracion.claveDeServicioDeSupabase === undefined) {
          registro.warn(
            'Sin SUPABASE_SERVICE_ROLE_KEY: las mascotas propias se guardan en memoria.',
          );

          return new AlmacenPersonalEnMemoria();
        }

        registro.log('Mascotas propias en un bucket privado de Supabase Storage.');

        return new AlmacenPersonalEnSupabase(
          configuracion.urlDeSupabase,
          configuracion.claveDeServicioDeSupabase,
          'mascotas-propias',
          { tiposPermitidos: [TIPO_DEL_SVG], pesoMaximo: PESO_MAXIMO_DEL_SVG },
        );
      },
      inject: [CONFIGURACION],
    },
    {
      provide: MASCOTA_PROPIA,
      useFactory: (cuentas: UserRepositoryPort, almacen: AlmacenPersonalPort) =>
        new MascotaPropiaUseCaseImpl(cuentas, almacen),
      inject: [USER_REPOSITORY, ALMACEN_DE_MASCOTAS],
    },
    {
      provide: FOTO_DE_PERFIL,
      useFactory: (cuentas: UserRepositoryPort, almacen: AlmacenPersonalPort) =>
        new FotoDePerfilUseCaseImpl(cuentas, almacen),
      inject: [USER_REPOSITORY, ALMACEN_DE_FOTOS],
    },
    {
      provide: BORRAR_CUENTA,
      useFactory: (
        cuentas: UserRepositoryPort,
        identidades: ProveedorDeIdentidadPort,
        fotos: AlmacenPersonalPort,
        mascotas: AlmacenPersonalPort,
      ) => new BorrarCuentaUseCaseImpl(cuentas, identidades, [fotos, mascotas]),
      inject: [USER_REPOSITORY, PROVEEDOR_DE_IDENTIDAD, ALMACEN_DE_FOTOS, ALMACEN_DE_MASCOTAS],
    },
    {
      provide: EXPORTAR_DATOS,
      useFactory: (
        cuentas: UserRepositoryPort,
        resultados: ActivityResultRepositoryPort,
        diario: DiarioRepositoryPort,
        pendientes: PendientesRepositoryPort,
        avisos: AvisosRepositoryPort,
        fotos: AlmacenPersonalPort,
        mascotas: AlmacenPersonalPort,
      ) =>
        new ExportarDatosUseCaseImpl(
          cuentas,
          resultados,
          diario,
          pendientes,
          avisos,
          fotos,
          mascotas,
        ),
      inject: [
        USER_REPOSITORY,
        ACTIVITY_RESULT_REPOSITORY,
        DIARIO_REPOSITORY,
        PENDIENTES_REPOSITORY,
        AVISOS_REPOSITORY,
        ALMACEN_DE_FOTOS,
        ALMACEN_DE_MASCOTAS,
      ],
    },
    {
      provide: APP_GUARD,
      useFactory: (
        cuentas: RegistrarCuentaUseCaseImpl,
        reflector: Reflector,
        seguridad: RegistroDeSeguridadPort,
      ) => new GuardiaDeCuenta(cuentas, reflector, seguridad),
      inject: [REGISTRAR_CUENTA, Reflector, REGISTRO_DE_SEGURIDAD],
    },
  ],
  exports: [USER_REPOSITORY, REGISTRAR_CUENTA],
})
export class UsuariosModule {}
