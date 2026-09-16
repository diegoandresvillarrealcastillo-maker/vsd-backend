import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/**
 * Cliente de Prisma, con su ciclo de vida atado al de la aplicacion.
 *
 * Es el **unico** punto del sistema que abre una conexion a PostgreSQL. Vive
 * en `infrastructure/` porque una base de datos es un detalle de
 * infraestructura: el dominio declara que necesita guardar resultados y no le
 * importa si al otro lado hay Prisma, memoria o un archivo.
 *
 * El cierre ordenado importa mas de lo que parece. Render reinicia el servicio
 * cada vez que despliega, y el plan gratuito de Supabase tiene un limite bajo
 * de conexiones: dejar conexiones colgando al apagar acaba agotandolo.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly registro = new Logger('BaseDeDatos');

  constructor(connectionString: string) {
    // Desde Prisma 7 la URL no viaja en el esquema: la recibe el cliente a
    // traves de un adaptador. Quien la lee del entorno es la capa de
    // configuracion, no esta clase.
    super({ adapter: new PrismaPg({ connectionString }) });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.registro.log('Conexion establecida.');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.registro.log('Conexion cerrada.');
  }
}
