import { describe, expect, it } from 'vitest';
import { ActivityResult } from '../../../domain/model/ActivityResult.js';
import {
  ActivityId,
  ClientOperationId,
  ResultId,
  SesionId,
  UserId,
} from '../../../domain/model/Identifier.js';
import type { DatosExportados } from '../../../domain/ports/in/ExportarDatosUseCase.js';
import { unaCuenta } from '../../../pruebas/contratoDeUsuarios.js';
import { sinFilas } from '../../../pruebas/reunir.js';
import { PNG_REAL_DE_8_X_6 } from '../../../pruebas/fotosDePrueba.js';
import { ExportacionDto } from './ExportacionDto.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';

function datosConAvisos(
  preferencias: Partial<DatosExportados['avisos']['preferencias']>,
): DatosExportados {
  return {
    generadoEn: new Date('2026-10-08T15:00:00.000Z'),
    cuenta: unaCuenta(),
    consentimientos: [],
    resultados: sinFilas(),
    entradasDeDiario: sinFilas(),
    pendientes: sinFilas(),
    avisos: {
      preferencias: {
        userId: new UserId(PERSONA),
        minutoSemaforo: null,
        frecuenciaSemaforo: 'manana' as const,
        minutoRacha: null,
        minutoManana: null,
        minutoNoche: null,
        zonaHoraria: 'America/Bogota',
        ...preferencias,
      },
      navegadores: 2,
    },
    foto: null,
    mascotaPropia: null,
    datoCurioso: null,
  };
}

/** La exportacion es el derecho de acceso de la Ley 1581: todo lo que se guarda, sale. */
describe('ExportacionDto: los avisos', () => {
  it('sin nada encendido, todo sale apagado', () => {
    expect(ExportacionDto.sinListas(datosConAvisos({})).avisos).toEqual({
      horaSemaforo: null,
      frecuenciaSemaforo: 'manana',
      horaRacha: null,
      recordatorioManana: false,
      recordatorioNoche: false,
      navegadores: 2,
    });
  });

  it('las horas salen como HH:MM y los recordatorios de las 8:00 y las 20:00, encendidos (SCRUM-126)', () => {
    const { avisos } = ExportacionDto.sinListas(
      datosConAvisos({
        minutoSemaforo: 480,
        minutoRacha: 1170,
        minutoManana: 480,
        minutoNoche: 1200,
      }),
    );

    expect(avisos).toEqual({
      horaSemaforo: '08:00',
      frecuenciaSemaforo: 'manana',
      horaRacha: '19:30',
      recordatorioManana: true,
      recordatorioNoche: true,
      navegadores: 2,
    });
  });

  it('cada recordatorio sale por separado', () => {
    expect(ExportacionDto.sinListas(datosConAvisos({ minutoNoche: 1200 })).avisos).toMatchObject({
      recordatorioManana: false,
      recordatorioNoche: true,
    });
  });
});

describe('ExportacionDto: la foto de perfil (SCRUM-120)', () => {
  const CON_FOTO: DatosExportados = {
    ...datosConAvisos({}),
    foto: {
      contenido: PNG_REAL_DE_8_X_6,
      tipo: 'image/png',
      actualizadaEl: new Date('2026-10-09T15:30:00.123Z'),
    },
  };

  it('sin foto, sale null', () => {
    expect(ExportacionDto.sinListas(datosConAvisos({})).foto).toBeNull();
  });

  it('con foto, sale el archivo en base64, con su tipo y su fecha', () => {
    expect(ExportacionDto.sinListas(CON_FOTO).foto).toEqual({
      tipo: 'image/png',
      actualizadaEl: '2026-10-09T15:30:00.123Z',
      contenidoBase64: Buffer.from(PNG_REAL_DE_8_X_6).toString('base64'),
    });
  });

  it('el base64 vuelve a ser exactamente la imagen', () => {
    const devuelta = new Uint8Array(
      Buffer.from(ExportacionDto.sinListas(CON_FOTO).foto?.contenidoBase64 ?? '', 'base64'),
    );

    expect(devuelta).toEqual(PNG_REAL_DE_8_X_6);
  });
});

describe('ExportacionDto: la mascota propia (SCRUM-122)', () => {
  const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><circle r="1"/></svg>';
  const CON_MASCOTA: DatosExportados = {
    ...datosConAvisos({}),
    mascotaPropia: {
      contenido: new TextEncoder().encode(SVG),
      tipo: 'image/svg+xml',
      actualizadaEl: new Date('2026-10-12T09:00:00.000Z'),
    },
  };

  it('sin mascota propia, sale null', () => {
    expect(ExportacionDto.sinListas(datosConAvisos({})).mascotaPropia).toBeNull();
  });

  it('con mascota propia, sale el SVG como texto, con su tipo y su fecha', () => {
    expect(ExportacionDto.sinListas(CON_MASCOTA).mascotaPropia).toEqual({
      tipo: 'image/svg+xml',
      actualizadaEl: '2026-10-12T09:00:00.000Z',
      contenido: SVG,
    });
  });

  it('el texto con tildes y enes sale tal cual', () => {
    const dto = ExportacionDto.sinListas({
      ...CON_MASCOTA,
      mascotaPropia: {
        contenido: new TextEncoder().encode('<svg><g id="ñandú-áé"/></svg>'),
        tipo: 'image/svg+xml',
        actualizadaEl: new Date('2026-10-12T09:00:00.000Z'),
      },
    });

    expect(dto.mascotaPropia?.contenido).toBe('<svg><g id="ñandú-áé"/></svg>');
  });
});

/** El cursor de los datos curiosos es un dato personal (SCRUM-185): sale en la exportacion. */
describe('ExportacionDto: el dato curioso', () => {
  it('sin ninguno, es nulo', () => {
    expect(ExportacionDto.sinListas(datosConAvisos({})).datoCurioso).toBeNull();
  });

  it('con uno, sale el texto y el dia, no el identificador', () => {
    const datos: DatosExportados = {
      ...datosConAvisos({}),
      datoCurioso: { dia: '2026-10-12', texto: 'Los pulpos tienen tres corazones.' },
    };

    expect(ExportacionDto.sinListas(datos).datoCurioso).toEqual({
      dia: '2026-10-12',
      texto: 'Los pulpos tienen tres corazones.',
    });
  });
});

describe('ExportacionDto: la sesion de cada resultado (ADR 0030, Ley 1581)', () => {
  const SESION = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  let n = 0;

  function resultado(sesion?: string): ActivityResult {
    n++;

    return ActivityResult.create(
      {
        id: new ResultId(`dddddddd-dddd-4ddd-8ddd-${String(n).padStart(12, '0')}`),
        userId: new UserId(PERSONA),
        activityId: new ActivityId('33333333-3333-4333-a333-333333333333'),
        clientOperationId: new ClientOperationId(
          `eeeeeeee-eeee-4eee-8eee-${String(n).padStart(12, '0')}`,
        ),
        completedAt: new Date('2026-10-01T12:00:00.000Z'),
        dia: '2026-10-01',
        sessionId: sesion === undefined ? undefined : new SesionId(sesion),
      },
      new Date('2026-10-02T00:00:00.000Z'),
    );
  }

  it('el resultado de una sesion lleva su titulo, y no su identificador', () => {
    const dto = ExportacionDto.resultado({
      resultado: resultado(SESION),
      titulo: 'Respiración 4-6',
    });

    expect(dto).toMatchObject({ sesion: 'Respiración 4-6' });
    expect(JSON.stringify(dto)).not.toContain(SESION);
  });

  it('un resultado sin sesion sale como siempre, sin el campo', () => {
    const dto = ExportacionDto.resultado({ resultado: resultado() });

    expect(dto).not.toHaveProperty('sesion');
  });

  it('una sesion que ya no existe no inventa un titulo: el resultado sale sin el campo', () => {
    const dto = ExportacionDto.resultado({ resultado: resultado(SESION), titulo: undefined });

    expect(dto).not.toHaveProperty('sesion');
    expect(JSON.stringify(dto)).not.toContain(SESION);
  });
});

describe('ExportacionDto: la frecuencia del semaforo (SCRUM-146)', () => {
  it('sale lo que la persona eligio, sin convertirlo en horas', () => {
    const { avisos } = ExportacionDto.sinListas(
      datosConAvisos({ minutoSemaforo: 480, frecuenciaSemaforo: 'dos_veces' }),
    );

    expect(avisos.horaSemaforo).toBe('08:00');
    expect(avisos.frecuenciaSemaforo).toBe('dos_veces');
  });
});
