import { describe, expect, it } from 'vitest';
import { ActivityResult } from '../../../domain/model/ActivityResult.js';
import { DocumentoDelDiario } from '../../../domain/model/DocumentoDelDiario.js';
import { EntradaDeDiario } from '../../../domain/model/EntradaDeDiario.js';
import {
  ActivityId,
  ClientOperationId,
  EntradaId,
  PendienteId,
  ResultId,
  SesionId,
  UserId,
} from '../../../domain/model/Identifier.js';
import { Pendiente } from '../../../domain/model/Pendiente.js';
import type {
  DatosExportados,
  ResultadoExportado,
} from '../../../domain/ports/in/ExportarDatosUseCase.js';
import { unaCuenta } from '../../../pruebas/contratoDeUsuarios.js';
import { EntradaDelDiarioDto } from './EntradaDelDiarioDto.js';
import { ExportacionDto } from './ExportacionDto.js';
import { exportacionEnFlujo } from './exportacionEnFlujo.js';
import { PendienteDto } from './PendienteDto.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';
const AHORA = new Date('2026-10-25T15:00:00.000Z');
const SESION = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

function numero(n: number): string {
  return String(n).padStart(12, '0');
}

function resultado(n: number): ResultadoExportado {
  return {
    resultado: ActivityResult.create(
      {
        id: new ResultId(`dddddddd-dddd-4ddd-8ddd-${numero(n)}`),
        userId: new UserId(PERSONA),
        activityId: new ActivityId('33333333-3333-4333-a333-333333333333'),
        clientOperationId: new ClientOperationId(`eeeeeeee-eeee-4eee-8eee-${numero(n)}`),
        completedAt: new Date('2026-10-01T12:00:00.000Z'),
        dia: '2026-10-01',
        sessionId: n % 2 === 0 ? new SesionId(SESION) : undefined,
      },
      AHORA,
    ),
    titulo: n % 2 === 0 ? 'Respiración 4-6' : undefined,
  };
}

function entrada(n: number): EntradaDeDiario {
  return EntradaDeDiario.guardada({
    id: new EntradaId(`33333333-3333-4333-a333-${numero(n)}`),
    userId: new UserId(PERSONA),
    clientOperationId: new ClientOperationId(`44444444-4444-4444-a444-${numero(n)}`),
    dia: '2026-10-02',
    documento: DocumentoDelDiario.desdeTextoPlano(`Hoy escribí «${n}», con "comillas" y ñ`),
    version: 1,
    creadaEn: AHORA,
    editadaEn: AHORA,
  });
}

function pendiente(n: number): Pendiente {
  return Pendiente.nuevo(
    {
      id: new PendienteId(`55555555-5555-4555-a555-${numero(n)}`),
      userId: new UserId(PERSONA),
      clientOperationId: new ClientOperationId(`66666666-6666-4666-a666-${numero(n)}`),
      texto: `Pendiente ${n}`,
      nivel: 'urgente',
    },
    AHORA,
  );
}

async function* hasta<T>(
  cantidad: number,
  hacer: (n: number) => T,
): AsyncGenerator<T, void, undefined> {
  for (let n = 1; n <= cantidad; n++) {
    yield await Promise.resolve(hacer(n));
  }
}

function datos(cantidad: number): DatosExportados {
  return {
    generadoEn: AHORA,
    cuenta: unaCuenta(),
    consentimientos: [
      { tipo: 'aviso_de_privacidad', version: '2026-10-3', aceptadoEn: AHORA },
      { tipo: 'terminos', version: '2026-10-3', aceptadoEn: AHORA },
    ],
    resultados: hasta(cantidad, resultado),
    entradasDeDiario: hasta(cantidad, entrada),
    pendientes: hasta(cantidad, pendiente),
    avisos: {
      preferencias: {
        userId: new UserId(PERSONA),
        minutoSemaforo: 480,
        frecuenciaSemaforo: 'manana',
        minutoRacha: null,
        minutoManana: null,
        minutoNoche: 1200,
        zonaHoraria: 'America/Bogota',
      },
      navegadores: 2,
    },
    foto: null,
    mascotaPropia: null,
    datoCurioso: { dia: '2026-10-12', texto: 'Los pulpos tienen tres corazones.' },
  };
}

async function escribir(origen: DatosExportados): Promise<string> {
  let texto = '';

  for await (const trozo of exportacionEnFlujo(origen)) {
    texto += trozo;
  }

  return texto;
}

/**
 * La exportacion por piezas es el mismo JSON de siempre (SCRUM-262): el cliente (la descarga en
 * PDF, quien se lleva el archivo) no sabe que cambio la manera de escribirlo.
 */
describe('exportacionEnFlujo', () => {
  it('escribe el mismo JSON que el objeto armado entero, con las claves en el mismo orden', async () => {
    const cantidad = 450;
    const esperado = ExportacionDto.sinListas(datos(0));

    // El objeto entero, en el orden en que `ExportacionDto` declara sus campos.
    const entero = {
      generadoEn: esperado.generadoEn,
      cuenta: esperado.cuenta,
      fechaNacimiento: esperado.fechaNacimiento,
      consentimientos: esperado.consentimientos,
      resultados: Array.from({ length: cantidad }, (_, i) =>
        ExportacionDto.resultado(resultado(i + 1)),
      ),
      entradasDeDiario: Array.from({ length: cantidad }, (_, i) =>
        EntradaDelDiarioDto.desde(entrada(i + 1)),
      ),
      pendientes: Array.from({ length: cantidad }, (_, i) => PendienteDto.desde(pendiente(i + 1))),
      avisos: esperado.avisos,
      foto: esperado.foto,
      mascotaPropia: esperado.mascotaPropia,
      datoCurioso: esperado.datoCurioso,
    };

    const escrito = await escribir(datos(cantidad));

    expect(escrito).toBe(JSON.stringify(entero));
  });

  it('las claves son las de ExportacionDto, en este orden', async () => {
    const claves = Object.keys(JSON.parse(await escribir(datos(2))) as object);

    expect(claves).toEqual([
      'generadoEn',
      'cuenta',
      'fechaNacimiento',
      'consentimientos',
      'resultados',
      'entradasDeDiario',
      'pendientes',
      'avisos',
      'foto',
      'mascotaPropia',
      'datoCurioso',
    ]);
  });

  it('sin resultados, diario ni pendientes, las tres listas salen vacias', async () => {
    const salida = JSON.parse(await escribir(datos(0))) as Record<string, unknown>;

    expect(salida['resultados']).toEqual([]);
    expect(salida['entradasDeDiario']).toEqual([]);
    expect(salida['pendientes']).toEqual([]);
    expect(salida['avisos']).toMatchObject({ horaSemaforo: '08:00', recordatorioNoche: true });
  });

  it('el resultado de una sesion lleva su titulo y nunca su identificador', async () => {
    const texto = await escribir(datos(4));
    const salida = JSON.parse(texto) as { resultados: { sesion?: string }[] };

    expect(salida.resultados.map((r) => r.sesion)).toEqual([
      undefined,
      'Respiración 4-6',
      undefined,
      'Respiración 4-6',
    ]);
    expect(texto).not.toContain(SESION);
  });

  it('si una lista falla a mitad, lo escrito no es un JSON valido', async () => {
    const origen: DatosExportados = {
      ...datos(0),
      resultados: (async function* () {
        yield await Promise.resolve(resultado(1));
        throw new Error('la base se cayo');
      })(),
    };
    let texto = '';

    const recorrer = async () => {
      for await (const trozo of exportacionEnFlujo(origen)) {
        texto += trozo;
      }
    };

    await expect(recorrer()).rejects.toThrow('la base se cayo');
    expect(() => JSON.parse(texto) as unknown).toThrow();
  });
});
