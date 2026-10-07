import { describe, expect, it } from 'vitest';
import {
  AccountNotProvisionedError,
  FileStorageUnavailableError,
} from '../../domain/model/DomainError.js';
import type { ActivityResult } from '../../domain/model/ActivityResult.js';
import { DocumentoDelDiario } from '../../domain/model/DocumentoDelDiario.js';
import { EntradaDeDiario } from '../../domain/model/EntradaDeDiario.js';
import {
  ClientOperationId,
  EntradaId,
  PendienteId,
  UserId,
} from '../../domain/model/Identifier.js';
import { Pendiente } from '../../domain/model/Pendiente.js';
import type { User } from '../../domain/model/User.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { DiarioRepositoryPort } from '../../domain/ports/out/DiarioRepositoryPort.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';
import type { AlmacenPersonalPort } from '../../domain/ports/out/AlmacenPersonalPort.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';
import type { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort.js';
import { AlmacenDoble } from '../../pruebas/almacenDePrueba.js';
import { unaCuenta } from '../../pruebas/contratoDeUsuarios.js';
import { PNG_REAL_DE_8_X_6 } from '../../pruebas/fotosDePrueba.js';
import { ExportarDatosUseCaseImpl } from './ExportarDatosUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';
const AHORA = new Date('2026-10-02T15:00:00.000Z');
const ENTRADA = EntradaDeDiario.guardada({
  id: new EntradaId('33333333-3333-4333-a333-333333333333'),
  userId: new UserId(PERSONA),
  clientOperationId: new ClientOperationId('44444444-4444-4444-a444-444444444444'),
  dia: '2026-10-02',
  documento: DocumentoDelDiario.desdeTextoPlano('Hoy dormi mejor'),
  version: 1,
  creadaEn: AHORA,
  editadaEn: AHORA,
});
const PENDIENTE = Pendiente.nuevo(
  {
    id: new PendienteId('55555555-5555-4555-a555-555555555555'),
    userId: new UserId(PERSONA),
    clientOperationId: new ClientOperationId('66666666-6666-4666-a666-666666666666'),
    texto: 'Pagar la matricula',
    nivel: 'urgente',
  },
  AHORA,
);

/** Arma el caso de uso con dobles que anotan por quien les preguntaron. */
function armar(cuenta: User | null, fotos: AlmacenPersonalPort = new AlmacenDoble()) {
  const preguntas: { resultados?: string; desde?: Date; diario?: string; pendientes?: string } = {};

  const cuentas: UserRepositoryPort = {
    findById: () => Promise.resolve(cuenta),
    findByIdProveedorAuth: () => Promise.resolve(null),
    save: () => Promise.resolve(),
    borrarConTodo: () => Promise.resolve(),
  };

  const resultados = {
    ultimosDe: (id: UserId, desde: Date) => {
      preguntas.resultados = id.value;
      preguntas.desde = desde;

      return Promise.resolve([] as readonly ActivityResult[]);
    },
  } as unknown as ActivityResultRepositoryPort;

  const diario = {
    todasDe: (id: UserId) => {
      preguntas.diario = id.value;

      return Promise.resolve([ENTRADA]);
    },
  } as unknown as DiarioRepositoryPort;

  const pendientes = {
    todosDe: (id: UserId) => {
      preguntas.pendientes = id.value;

      return Promise.resolve([PENDIENTE]);
    },
  } as unknown as PendientesRepositoryPort;

  const avisos = {
    preferenciasDe: (id: UserId) =>
      Promise.resolve({ userId: id, minutoSemaforo: 480, minutoRacha: null }),
    suscripcionesDe: () =>
      Promise.resolve([{ endpoint: 'https://push.example.com/a', p256dh: 'p', auth: 'a' }]),
  } as unknown as AvisosRepositoryPort;

  return {
    preguntas,
    casoDeUso: new ExportarDatosUseCaseImpl(
      cuentas,
      resultados,
      diario,
      pendientes,
      avisos,
      fotos,
      () => AHORA,
    ),
  };
}

describe('ExportarDatosUseCaseImpl', () => {
  it('reune la cuenta, los resultados y el diario', async () => {
    const { casoDeUso } = armar(unaCuenta());

    const datos = await casoDeUso.execute(new UserId(PERSONA));

    expect(datos.cuenta.id.value).toBe(PERSONA);
    expect(datos.resultados).toEqual([]);
    expect(datos.entradasDeDiario).toEqual([ENTRADA]);
    expect(datos.pendientes).toEqual([PENDIENTE]);
    expect(datos.generadoEn).toEqual(AHORA);
  });

  it('incluye las horas de los avisos y en cuantos navegadores, sin sus claves (SCRUM-102)', async () => {
    const { casoDeUso } = armar(unaCuenta());

    const datos = await casoDeUso.execute(new UserId(PERSONA));

    expect(datos.avisos).toEqual({
      preferencias: { userId: new UserId(PERSONA), minutoSemaforo: 480, minutoRacha: null },
      navegadores: 1,
    });
    expect(JSON.stringify(datos.avisos)).not.toContain('push.example.com');
  });

  it('pregunta por la misma persona en cada repositorio', async () => {
    const { casoDeUso, preguntas } = armar(unaCuenta());

    await casoDeUso.execute(new UserId(PERSONA));

    expect(preguntas.resultados).toBe(PERSONA);
    expect(preguntas.diario).toBe(PERSONA);
    expect(preguntas.pendientes).toBe(PERSONA);
  });

  it('exporta los resultados desde siempre, no solo los recientes', async () => {
    const { casoDeUso, preguntas } = armar(unaCuenta());

    await casoDeUso.execute(new UserId(PERSONA));

    expect(preguntas.desde?.getTime()).toBe(0);
  });

  it('sin cuenta no hay nada que exportar', async () => {
    const { casoDeUso } = armar(null);

    await expect(casoDeUso.execute(new UserId(PERSONA))).rejects.toThrow(
      AccountNotProvisionedError,
    );
  });

  describe('la foto de perfil (SCRUM-120)', () => {
    const GUARDADA_EL = new Date('2026-10-09T15:30:00.123Z');

    it('sin foto, sale null y ni se pregunta al almacenamiento', async () => {
      const preguntas: string[] = [];
      const fotos: AlmacenPersonalPort = {
        guardar: () => Promise.resolve(),
        leer: (persona) => {
          preguntas.push(persona.value);

          return Promise.resolve(undefined);
        },
        borrar: () => Promise.resolve(),
      };

      const datos = await armar(unaCuenta(), fotos).casoDeUso.execute(new UserId(PERSONA));

      expect(datos.foto).toBeNull();
      expect(preguntas).toEqual([]);
    });

    it('con foto, sale el archivo tal como se guardo, con su tipo y su fecha', async () => {
      const fotos = new AlmacenDoble();

      await fotos.guardar(new UserId(PERSONA), { contenido: PNG_REAL_DE_8_X_6, tipo: 'image/png' });

      const datos = await armar(
        unaCuenta({ fotoActualizadaEl: GUARDADA_EL }),
        fotos,
      ).casoDeUso.execute(new UserId(PERSONA));

      expect(datos.foto).toEqual({
        contenido: PNG_REAL_DE_8_X_6,
        tipo: 'image/png',
        actualizadaEl: GUARDADA_EL,
      });
    });

    it('pregunta por la misma persona que exporta', async () => {
      const preguntas: string[] = [];
      const fotos: AlmacenPersonalPort = {
        guardar: () => Promise.resolve(),
        leer: (persona) => {
          preguntas.push(persona.value);

          return Promise.resolve({ contenido: PNG_REAL_DE_8_X_6, tipo: 'image/png' });
        },
        borrar: () => Promise.resolve(),
      };

      await armar(unaCuenta({ fotoActualizadaEl: GUARDADA_EL }), fotos).casoDeUso.execute(
        new UserId(PERSONA),
      );

      expect(preguntas).toEqual([PERSONA]);
    });

    it('con la marca pero sin el archivo, sale null', async () => {
      const datos = await armar(unaCuenta({ fotoActualizadaEl: GUARDADA_EL })).casoDeUso.execute(
        new UserId(PERSONA),
      );

      expect(datos.foto).toBeNull();
    });

    it('si el almacenamiento falla, la exportacion falla: no sale «todo» con una parte callada', async () => {
      const fotos: AlmacenPersonalPort = {
        guardar: () => Promise.resolve(),
        leer: () => Promise.reject(new Error('Storage no respondio')),
        borrar: () => Promise.resolve(),
      };

      await expect(
        armar(unaCuenta({ fotoActualizadaEl: GUARDADA_EL }), fotos).casoDeUso.execute(
          new UserId(PERSONA),
        ),
      ).rejects.toThrow(FileStorageUnavailableError);
    });
  });
});
