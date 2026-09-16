import { describe, expect, it, vi } from 'vitest';
import { PrismaService } from './PrismaService.js';

/**
 * El ciclo de vida de la conexion.
 *
 * Render reinicia el servicio en cada despliegue y el plan gratuito de
 * Supabase tiene un limite bajo de conexiones. Unas cuantas conexiones
 * huerfanas lo agotan, y el sintoma no se parece en nada a la causa: la
 * aplicacion empieza a fallar al conectar sin que nadie haya tocado nada.
 *
 * Lo que se comprueba aqui es que los ganchos hagan su trabajo. Que el sistema
 * operativo entregue la senal al proceso es cosa de Node y de NestJS, y en
 * Windows no se puede simular de forma fiable: `kill('SIGINT')` termina el
 * proceso de golpe en lugar de entregarle nada.
 */
describe('PrismaService', () => {
  const URL_FICTICIA = 'postgresql://x:y@localhost:1/db';

  it('se conecta al iniciarse el modulo', async () => {
    const servicio = new PrismaService(URL_FICTICIA);
    const conectar = vi.spyOn(servicio, '$connect').mockResolvedValue(undefined);

    await servicio.onModuleInit();

    expect(conectar).toHaveBeenCalledOnce();
  });

  it('cierra la conexion al destruirse el modulo', async () => {
    const servicio = new PrismaService(URL_FICTICIA);
    const desconectar = vi.spyOn(servicio, '$disconnect').mockResolvedValue(undefined);

    await servicio.onModuleDestroy();

    expect(desconectar).toHaveBeenCalledOnce();
  });

  it('no abre la conexion solo por construirse', () => {
    // Importa porque el cableado crea el servicio al levantar el modulo. Si
    // conectara en el constructor, cualquier prueba que arme el contenedor
    // abriria una conexion sin pedirla.
    const conectar = vi.spyOn(PrismaService.prototype, '$connect').mockResolvedValue(undefined);

    new PrismaService(URL_FICTICIA);

    expect(conectar).not.toHaveBeenCalled();
    conectar.mockRestore();
  });
});
