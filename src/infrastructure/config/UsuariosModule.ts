import { Logger, Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ActualizarPreferenciasUseCaseImpl } from '../../application/usecases/ActualizarPreferenciasUseCaseImpl.js';
import { BorrarCuentaUseCaseImpl } from '../../application/usecases/BorrarCuentaUseCaseImpl.js';
import { ExportarDatosUseCaseImpl } from '../../application/usecases/ExportarDatosUseCaseImpl.js';
import { RegistrarCuentaUseCaseImpl } from '../../application/usecases/RegistrarCuentaUseCaseImpl.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';
import type { ProveedorDeIdentidadPort } from '../../domain/ports/out/ProveedorDeIdentidadPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { GuardiaDeCuenta } from '../auth/GuardiaDeCuenta.js';
import {
  IdentidadesDeSupabase,
  IdentidadesSinAdministracion,
} from '../auth/IdentidadesDeSupabase.js';
import { AvisoController } from '../controllers/AvisoController.js';
import { CuentaController } from '../controllers/CuentaController.js';
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
  AVISOS_REPOSITORY,
  BORRAR_CUENTA,
  CONFIGURACION,
  DIARIO_REPOSITORY,
  EXPORTAR_DATOS,
  PENDIENTES_REPOSITORY,
  PRISMA,
  PROVEEDOR_DE_IDENTIDAD,
  REGISTRAR_CUENTA,
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
  controllers: [CuentaController, AvisoController],
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
      useFactory: (cuentas: UserRepositoryPort) => new RegistrarCuentaUseCaseImpl(cuentas),
      inject: [USER_REPOSITORY],
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
      provide: BORRAR_CUENTA,
      useFactory: (cuentas: UserRepositoryPort, identidades: ProveedorDeIdentidadPort) =>
        new BorrarCuentaUseCaseImpl(cuentas, identidades),
      inject: [USER_REPOSITORY, PROVEEDOR_DE_IDENTIDAD],
    },
    {
      provide: EXPORTAR_DATOS,
      useFactory: (
        cuentas: UserRepositoryPort,
        resultados: ActivityResultRepositoryPort,
        diario: DiarioRepositoryPort,
        pendientes: PendientesRepositoryPort,
        avisos: AvisosRepositoryPort,
      ) => new ExportarDatosUseCaseImpl(cuentas, resultados, diario, pendientes, avisos),
      inject: [
        USER_REPOSITORY,
        ACTIVITY_RESULT_REPOSITORY,
        DIARIO_REPOSITORY,
        PENDIENTES_REPOSITORY,
        AVISOS_REPOSITORY,
      ],
    },
    {
      provide: APP_GUARD,
      useFactory: (cuentas: RegistrarCuentaUseCaseImpl, reflector: Reflector) =>
        new GuardiaDeCuenta(cuentas, reflector),
      inject: [REGISTRAR_CUENTA, Reflector],
    },
  ],
  exports: [USER_REPOSITORY, REGISTRAR_CUENTA],
})
export class UsuariosModule {}
