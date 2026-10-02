import { describe, expect, it } from 'vitest';
import { UserId } from '../../domain/model/Identifier.js';
import { pruebasDelPuertoDeUsuarios, unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { InMemoryUserRepository } from './InMemoryUserRepository.js';

/**
 * El adaptador en memoria, contra el contrato comun.
 *
 * El mismo archivo de pruebas corre tambien contra PostgreSQL, en
 * `PrismaUserRepository.integracion.spec.ts`. Ahi esta el sentido: si los dos
 * no se comportan igual, el que miente es este, y las pruebas del resto del
 * sistema —que usan este— pasarian describiendo un sistema que no existe.
 */
pruebasDelPuertoDeUsuarios('InMemoryUserRepository', () => {
  const repositorio = new InMemoryUserRepository();

  return {
    repositorio,
    // Se crea uno nuevo en cada preparacion, asi que no hay nada que limpiar.
    limpiar: () => Promise.resolve(),
    contar: () => Promise.resolve(repositorio.cantidad),
  };
});

describe('InMemoryUserRepository, detalles propios del adaptador', () => {
  it('encuentra por proveedor aunque haya muchas cuentas', async () => {
    // Recorre los valores en lugar de mantener un segundo indice. Con dos
    // Map que sincronizar, el dia que uno se quedara atras este adaptador
    // diria cosas que la base no dice.
    const repositorio = new InMemoryUserRepository();

    for (let i = 1; i <= 20; i += 1) {
      const sufijo = String(i).padStart(12, '0');

      await repositorio.save(
        unaCuenta({
          id: `33333333-3333-4333-8333-${sufijo}`,
          correo: `persona${i}@ejemplo.test`,
          idProveedorAuth: `supabase|${i}`,
        }),
      );
    }

    const encontrada = await repositorio.findByIdProveedorAuth('supabase|17');

    expect(encontrada?.correo).toBe('persona17@ejemplo.test');
    expect(repositorio.cantidad).toBe(20);
  });

  it('guardar por segunda vez reemplaza y no acumula', async () => {
    const repositorio = new InMemoryUserRepository();

    await repositorio.save(unaCuenta());
    await repositorio.save(unaCuenta({ nombre: 'Con nombre' }));

    expect(repositorio.cantidad).toBe(1);
    expect(
      (await repositorio.findById(new UserId('11111111-1111-4111-8111-111111111111')))?.nombre,
    ).toBe('Con nombre');
  });
});
