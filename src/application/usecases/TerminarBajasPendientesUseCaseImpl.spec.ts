import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserId } from '../../domain/model/Identifier.js';
import type { ProveedorDeIdentidadPort } from '../../domain/ports/out/ProveedorDeIdentidadPort.js';
import { RepositorioConBajas } from '../../pruebas/cuentasConBajaDePrueba.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { BajaDeCuenta } from '../services/BajaDeCuenta.js';
import {
  BAJAS_POR_VUELTA,
  ESPERA_ANTES_DE_REINTENTAR_MS,
  TerminarBajasPendientesUseCaseImpl,
} from './TerminarBajasPendientesUseCaseImpl.js';

/**
 * La tarea que termina las bajas de cuenta que se cortaron (SCRUM-267, ADR 0040). Lo que se vigila:
 * que solo toma las que llevan un rato (no pisa una baja en curso), que respeta si lleva
 * constancia, que una baja que falla no detiene a las demas, y que el tope por vuelta se cumple.
 */
const AHORA = new Date('2026-10-25T15:00:00.000Z');
const HACE = (minutos: number): Date => new Date(AHORA.getTime() - minutos * 60_000);

/** Identificador con el numero al final: `idDe(7)`. */
const idDe = (n: number): string => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const proveedorDe = (n: number): string => `supabase|cuenta-${String(n)}`;

/** El proveedor: puede fallar solo para las identidades que se le digan. */
class ProveedorDoble implements ProveedorDeIdentidadPort {
  readonly borradas: string[] = [];
  readonly fallaPara = new Set<string>();

  borrarIdentidad(idProveedorAuth: string): Promise<void> {
    if (this.fallaPara.has(idProveedorAuth)) {
      return Promise.reject(new Error('Supabase no respondio'));
    }

    this.borradas.push(idProveedorAuth);

    return Promise.resolve();
  }
}

describe('TerminarBajasPendientesUseCaseImpl (SCRUM-267)', () => {
  let cuentas: RepositorioConBajas;
  let proveedor: ProveedorDoble;
  let fallos: unknown[];
  let tarea: TerminarBajasPendientesUseCaseImpl;

  /** Una cuenta con su baja pedida hace `minutos`. */
  async function conBajaPedidaHace(n: number, minutos: number, conConstancia = true) {
    await cuentas.save(
      unaCuenta({
        id: idDe(n),
        idProveedorAuth: proveedorDe(n),
        correo: `p${String(n)}@ejemplo.test`,
      }),
    );
    await cuentas.marcarBaja(new UserId(idDe(n)), conConstancia, HACE(minutos));
  }

  beforeEach(() => {
    cuentas = new RepositorioConBajas();
    proveedor = new ProveedorDoble();
    fallos = [];
    tarea = new TerminarBajasPendientesUseCaseImpl(
      cuentas,
      new BajaDeCuenta(cuentas, proveedor, [], () => AHORA),
      { fallo: (error) => fallos.push(error) },
    );
  });

  it('sin bajas pendientes no hace nada', async () => {
    await expect(tarea.terminar(AHORA)).resolves.toEqual({ tomadas: 0, terminadas: 0, fallos: 0 });
  });

  it('termina las que llevan mas de dos minutos pedidas', async () => {
    await conBajaPedidaHace(1, 3);

    await expect(tarea.terminar(AHORA)).resolves.toEqual({ tomadas: 1, terminadas: 1, fallos: 0 });

    await expect(cuentas.findById(new UserId(idDe(1)))).resolves.toBeNull();
    expect(proveedor.borradas).toEqual([proveedorDe(1)]);
    expect(cuentas.pendientes).toEqual([]);
  });

  it('no pisa una baja que sigue en curso: la que lleva menos de dos minutos se deja', async () => {
    await conBajaPedidaHace(1, 1);
    await conBajaPedidaHace(2, ESPERA_ANTES_DE_REINTENTAR_MS / 60_000);

    await expect(tarea.terminar(AHORA)).resolves.toEqual({ tomadas: 0, terminadas: 0, fallos: 0 });

    // Justo a los dos minutos todavia no: hay que pasarse.
    await expect(cuentas.findById(new UserId(idDe(1)))).resolves.not.toBeNull();
    await expect(cuentas.findById(new UserId(idDe(2)))).resolves.not.toBeNull();
    expect(proveedor.borradas).toEqual([]);
  });

  it('respeta si la baja lleva constancia o no', async () => {
    await conBajaPedidaHace(1, 5, true);
    await conBajaPedidaHace(2, 5, false);

    await tarea.terminar(AHORA);

    await expect(cuentas.estaInactivadaPorProveedor(proveedorDe(1))).resolves.toBe(true);
    await expect(cuentas.estaInactivadaPorProveedor(proveedorDe(2))).resolves.toBe(false);
    await expect(cuentas.findById(new UserId(idDe(2)))).resolves.toBeNull();
  });

  it('una baja que falla no detiene a las demas, y se vuelve a intentar despues', async () => {
    await conBajaPedidaHace(1, 10);
    await conBajaPedidaHace(2, 9);
    await conBajaPedidaHace(3, 8);
    proveedor.fallaPara.add(proveedorDe(2));

    await expect(tarea.terminar(AHORA)).resolves.toEqual({ tomadas: 3, terminadas: 2, fallos: 1 });

    await expect(cuentas.findById(new UserId(idDe(1)))).resolves.toBeNull();
    await expect(cuentas.findById(new UserId(idDe(2)))).resolves.not.toBeNull();
    await expect(cuentas.findById(new UserId(idDe(3)))).resolves.toBeNull();
    expect(cuentas.pendientes.map((baja) => baja.id.value)).toEqual([idDe(2)]);

    proveedor.fallaPara.clear();
    await expect(tarea.terminar(AHORA)).resolves.toEqual({ tomadas: 1, terminadas: 1, fallos: 0 });
    expect(cuentas.pendientes).toEqual([]);
  });

  it('deja dicho que fallo, sin decir de quien', async () => {
    await conBajaPedidaHace(1, 10);
    proveedor.fallaPara.add(proveedorDe(1));

    await tarea.terminar(AHORA);

    expect(fallos).toHaveLength(1);
    expect((fallos[0] as Error).message).toBe('Supabase no respondio');
    expect(JSON.stringify(fallos)).not.toContain(idDe(1));
  });

  it(`toma como mucho ${String(BAJAS_POR_VUELTA)} por vuelta, las mas antiguas primero`, async () => {
    // La 1 es la mas antigua (hace 99 minutos) y la 25 la mas reciente (hace 75).
    for (let n = 1; n <= BAJAS_POR_VUELTA + 5; n += 1) {
      await conBajaPedidaHace(n, 100 - n);
    }

    const resumen = await tarea.terminar(AHORA);

    expect(resumen).toEqual({
      tomadas: BAJAS_POR_VUELTA,
      terminadas: BAJAS_POR_VUELTA,
      fallos: 0,
    });
    // Quedan las 5 mas recientes.
    expect(cuentas.pendientes.map((baja) => baja.id.value).sort()).toEqual(
      [21, 22, 23, 24, 25].map(idDe),
    );
  });

  it('sin registro, un fallo no rompe la vuelta', async () => {
    const sinRegistro = new TerminarBajasPendientesUseCaseImpl(
      cuentas,
      new BajaDeCuenta(cuentas, proveedor, [], () => AHORA),
    );
    await conBajaPedidaHace(1, 10);
    proveedor.fallaPara.add(proveedorDe(1));

    await expect(sinRegistro.terminar(AHORA)).resolves.toEqual({
      tomadas: 1,
      terminadas: 0,
      fallos: 1,
    });
  });

  it('una baja cuya cuenta ya no esta cuenta como terminada y no toca al proveedor', async () => {
    await conBajaPedidaHace(1, 10);
    const hueco = vi.spyOn(cuentas, 'findById').mockResolvedValueOnce(null);

    await expect(tarea.terminar(AHORA)).resolves.toEqual({ tomadas: 1, terminadas: 1, fallos: 0 });

    expect(hueco).toHaveBeenCalledTimes(1);
    expect(proveedor.borradas).toEqual([]);
  });
});
