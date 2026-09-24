import { Logger, Module } from '@nestjs/common';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import type { PrismaService } from '../persistence/PrismaService.js';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository.js';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository.js';
import { ActivityResultModule } from './ActivityResultModule.js';
import { PRISMA, USER_REPOSITORY } from './tokens.js';

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
 * Que adaptador se usa lo decide la configuracion, igual que en el resto del
 * sistema: con `DATABASE_URL` se usa PostgreSQL, y sin ella el de memoria. La
 * configuracion ya impide arrancar sin base de datos fuera de desarrollo, asi
 * que aqui no hay que volver a comprobarlo.
 */
@Module({
  imports: [ActivityResultModule],
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
  ],
  exports: [USER_REPOSITORY],
})
export class UsuariosModule {}
