import { describe, expect, it, vi } from 'vitest';
import type { EventoDeSeguridad } from '../../domain/model/EventoDeSeguridad.js';
import { crearHuellaDeIp } from './huellaDeIp.js';
import { RegistroDeSeguridadEnSalida } from './RegistroDeSeguridadEnSalida.js';

const AHORA = new Date('2026-10-08T15:00:00.000Z');
const IDENTIFICADOR = '8f14e45f-ceea-467a-9575-0d9a1c3c7b11';
const IP = '203.0.113.9';

function armar(extra: { copiarA?: { encolar: (linea: Record<string, unknown>) => void } } = {}) {
  const lineas: string[] = [];
  const registro = new RegistroDeSeguridadEnSalida({
    ambiente: 'preproduction',
    huellaDeIp: crearHuellaDeIp('una-clave-de-prueba-bien-larga'),
    escribir: (linea) => lineas.push(linea),
    reloj: () => AHORA,
    ...extra,
  });

  return {
    registro,
    lineas,
    leida: () => JSON.parse(lineas[0] ?? 'null') as Record<string, unknown>,
  };
}

describe('RegistroDeSeguridadEnSalida', () => {
  it('escribe una sola linea JSON por evento, con el canal que permite separarla', () => {
    const { registro, lineas, leida } = armar();

    registro.registrar({ tipo: 'CUENTA_BORRADA', idUsuario: IDENTIFICADOR, idPeticion: 'abc' });

    expect(lineas).toHaveLength(1);
    expect(lineas[0]).not.toContain('\n');
    expect(leida()).toMatchObject({
      canal: 'seguridad',
      version: 1,
      en: '2026-10-08T15:00:00.000Z',
      ambiente: 'preproduction',
      tipo: 'CUENTA_BORRADA',
      idUsuario: IDENTIFICADOR,
      idPeticion: 'abc',
    });
  });

  const EVENTOS: readonly [string, EventoDeSeguridad, Record<string, unknown>][] = [
    [
      'CUENTA_BORRADA',
      { tipo: 'CUENTA_BORRADA', idUsuario: IDENTIFICADOR },
      { idUsuario: IDENTIFICADOR },
    ],
    [
      'DATOS_EXPORTADOS',
      { tipo: 'DATOS_EXPORTADOS', idUsuario: IDENTIFICADOR },
      { idUsuario: IDENTIFICADOR },
    ],
    [
      'PERMISO_DEL_DIARIO_CAMBIADO',
      { tipo: 'PERMISO_DEL_DIARIO_CAMBIADO', idUsuario: IDENTIFICADOR, activado: true },
      { idUsuario: IDENTIFICADOR, activado: true },
    ],
    [
      'TOKEN_RECHAZADO',
      { tipo: 'TOKEN_RECHAZADO', motivo: 'TOKEN_INVALIDO' },
      { motivo: 'TOKEN_INVALIDO' },
    ],
    [
      'CUENTA_NO_REGISTRADA',
      { tipo: 'CUENTA_NO_REGISTRADA', idProveedor: IDENTIFICADOR },
      { idProveedor: IDENTIFICADOR },
    ],
    [
      'ARCHIVO_PELIGROSO_RECHAZADO',
      {
        tipo: 'ARCHIVO_PELIGROSO_RECHAZADO',
        idUsuario: IDENTIFICADOR,
        motivo: 'MASCOTA_SVG_PELIGROSO',
      },
      { idUsuario: IDENTIFICADOR, motivo: 'MASCOTA_SVG_PELIGROSO' },
    ],
  ];

  it.each(EVENTOS)('%s lleva sus campos y nada mas', (tipo, evento, esperados) => {
    const { registro, leida } = armar();

    registro.registrar(evento);

    expect(leida()).toEqual({
      canal: 'seguridad',
      version: 1,
      en: '2026-10-08T15:00:00.000Z',
      ambiente: 'preproduction',
      tipo,
      ...esperados,
    });
  });

  describe('la IP', () => {
    it('nunca se escribe: sale su huella', () => {
      const { registro, lineas, leida } = armar();

      registro.registrar({ tipo: 'TOKEN_RECHAZADO', motivo: 'TOKEN_INVALIDO', ip: IP });

      expect(lineas[0]).not.toContain(IP);
      expect(leida()['huellaDeIp']).toBe(crearHuellaDeIp('una-clave-de-prueba-bien-larga')(IP));
      expect(leida()).not.toHaveProperty('ip');
    });

    it('sin IP no hay huella', () => {
      const { registro, leida } = armar();

      registro.registrar({ tipo: 'TOKEN_RECHAZADO', motivo: 'TOKEN_INVALIDO' });

      expect(leida()).not.toHaveProperty('huellaDeIp');
    });
  });

  describe('lo que no esta en el catalogo no sale', () => {
    it('descarta campos de sobra aunque alguien los cuele', () => {
      const { registro, lineas } = armar();
      const colado = {
        tipo: 'CUENTA_BORRADA',
        idUsuario: IDENTIFICADOR,
        correo: 'persona@ejemplo.co',
        nombre: 'Una Persona',
        fechaDeNacimiento: '1999-05-04',
        contenido: 'lo que escribio en su diario',
        token: 'token-falso-de-prueba',
      } as unknown as EventoDeSeguridad;

      registro.registrar(colado);

      const texto = lineas.join('\n');

      for (const prohibido of [
        'persona@ejemplo.co',
        'Una Persona',
        '1999-05-04',
        'diario',
        'token-falso-de-prueba',
      ]) {
        expect(texto).not.toContain(prohibido);
      }

      expect(texto).toContain(IDENTIFICADOR);
    });

    it('no escribe un tipo que el catalogo no conoce', () => {
      const { registro, lineas } = armar();

      registro.registrar({ tipo: 'ALGO_NUEVO' } as unknown as EventoDeSeguridad);

      expect(lineas).toEqual([]);
    });

    it('descarta lo que no es texto ni booleano y recorta el texto largo', () => {
      const { registro, leida } = armar();

      registro.registrar({
        tipo: 'ARCHIVO_PELIGROSO_RECHAZADO',
        idUsuario: { dato: 'un objeto' },
        motivo: 'x'.repeat(500),
      } as unknown as EventoDeSeguridad);

      const linea = leida();

      expect(linea).not.toHaveProperty('idUsuario');
      expect(String(linea['motivo'])).toHaveLength(100);
    });
  });

  describe('nunca estorba', () => {
    it('si escribir falla, no lanza', () => {
      const registro = new RegistroDeSeguridadEnSalida({
        ambiente: 'preproduction',
        huellaDeIp: () => 'x',
        escribir: () => {
          throw new Error('la salida se cerro');
        },
      });

      expect(() =>
        registro.registrar({ tipo: 'CUENTA_BORRADA', idUsuario: IDENTIFICADOR }),
      ).not.toThrow();
    });

    it('si la huella falla, no lanza', () => {
      const registro = new RegistroDeSeguridadEnSalida({
        ambiente: 'preproduction',
        huellaDeIp: () => {
          throw new Error('sin clave');
        },
        escribir: () => undefined,
      });

      expect(() =>
        registro.registrar({ tipo: 'TOKEN_RECHAZADO', motivo: 'TOKEN_INVALIDO', ip: IP }),
      ).not.toThrow();
    });
  });

  describe('la copia por HTTP', () => {
    it('recibe la misma linea que sale por la salida estandar', () => {
      const encolar = vi.fn();
      const { registro, leida } = armar({ copiarA: { encolar } });

      registro.registrar({ tipo: 'DATOS_EXPORTADOS', idUsuario: IDENTIFICADOR, ip: IP });

      expect(encolar).toHaveBeenCalledTimes(1);
      expect(encolar).toHaveBeenCalledWith(leida());
      expect(JSON.stringify(encolar.mock.calls)).not.toContain(IP);
    });

    it('si la copia falla, la linea ya salio y no se lanza nada', () => {
      const { registro, lineas } = armar({
        copiarA: {
          encolar: () => {
            throw new Error('cola rota');
          },
        },
      });

      expect(() =>
        registro.registrar({ tipo: 'CUENTA_BORRADA', idUsuario: IDENTIFICADOR }),
      ).not.toThrow();
      expect(lineas).toHaveLength(1);
    });

    it('al cerrar la aplicacion deja que la copia mande lo que le queda', async () => {
      const alCerrar = vi.fn(() => Promise.resolve());
      const { registro } = armar({
        copiarA: { encolar: vi.fn(), onModuleDestroy: alCerrar } as never,
      });

      await registro.onModuleDestroy();

      expect(alCerrar).toHaveBeenCalledTimes(1);
    });
  });
});
