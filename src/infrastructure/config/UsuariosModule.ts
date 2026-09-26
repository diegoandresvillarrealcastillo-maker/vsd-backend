import { Logger, Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { RegistrarCuentaUseCaseImpl } from '../../application/usecases/RegistrarCuentaUseCaseImpl.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { GuardiaDeCuenta } from '../auth/GuardiaDeCuenta.js';
import { CuentaController } from '../controllers/CuentaController.js';
import type { PrismaService } from '../persistence/PrismaService.js';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository.js';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository.js';
import { ActivityResultModule } from './ActivityResultModule.js';
import { PRISMA, REGISTRAR_CUENTA, USER_REPOSITORY } from './tokens.js';

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
  imports: [ActivityResultModule],
  controllers: [CuentaController],
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
      provide: APP_GUARD,
      useFactory: (cuentas: RegistrarCuentaUseCaseImpl, reflector: Reflector) =>
        new GuardiaDeCuenta(cuentas, reflector),
      inject: [REGISTRAR_CUENTA, Reflector],
    },
  ],
  exports: [USER_REPOSITORY, REGISTRAR_CUENTA],
})
export class UsuariosModule {}
