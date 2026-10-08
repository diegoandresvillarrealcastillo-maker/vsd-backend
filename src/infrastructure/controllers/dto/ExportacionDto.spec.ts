import { describe, expect, it } from 'vitest';
import { UserId } from '../../../domain/model/Identifier.js';
import type { DatosExportados } from '../../../domain/ports/in/ExportarDatosUseCase.js';
import { unaCuenta } from '../../../pruebas/contratoDeUsuarios.js';
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
    resultados: [],
    entradasDeDiario: [],
    pendientes: [],
    avisos: {
      preferencias: {
        userId: new UserId(PERSONA),
        minutoSemaforo: null,
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
  };
}

/** La exportacion es el derecho de acceso de la Ley 1581: todo lo que se guarda, sale. */
describe('ExportacionDto: los avisos', () => {
  it('sin nada encendido, todo sale apagado', () => {
    expect(ExportacionDto.desde(datosConAvisos({})).avisos).toEqual({
      horaSemaforo: null,
      horaRacha: null,
      recordatorioManana: false,
      recordatorioNoche: false,
      navegadores: 2,
    });
  });

  it('las horas salen como HH:MM y los recordatorios de las 8:00 y las 20:00, encendidos (SCRUM-126)', () => {
    const { avisos } = ExportacionDto.desde(
      datosConAvisos({
        minutoSemaforo: 480,
        minutoRacha: 1170,
        minutoManana: 480,
        minutoNoche: 1200,
      }),
    );

    expect(avisos).toEqual({
      horaSemaforo: '08:00',
      horaRacha: '19:30',
      recordatorioManana: true,
      recordatorioNoche: true,
      navegadores: 2,
    });
  });

  it('cada recordatorio sale por separado', () => {
    expect(ExportacionDto.desde(datosConAvisos({ minutoNoche: 1200 })).avisos).toMatchObject({
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
    expect(ExportacionDto.desde(datosConAvisos({})).foto).toBeNull();
  });

  it('con foto, sale el archivo en base64, con su tipo y su fecha', () => {
    expect(ExportacionDto.desde(CON_FOTO).foto).toEqual({
      tipo: 'image/png',
      actualizadaEl: '2026-10-09T15:30:00.123Z',
      contenidoBase64: Buffer.from(PNG_REAL_DE_8_X_6).toString('base64'),
    });
  });

  it('el base64 vuelve a ser exactamente la imagen', () => {
    const devuelta = new Uint8Array(
      Buffer.from(ExportacionDto.desde(CON_FOTO).foto?.contenidoBase64 ?? '', 'base64'),
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
    expect(ExportacionDto.desde(datosConAvisos({})).mascotaPropia).toBeNull();
  });

  it('con mascota propia, sale el SVG como texto, con su tipo y su fecha', () => {
    expect(ExportacionDto.desde(CON_MASCOTA).mascotaPropia).toEqual({
      tipo: 'image/svg+xml',
      actualizadaEl: '2026-10-12T09:00:00.000Z',
      contenido: SVG,
    });
  });

  it('el texto con tildes y enes sale tal cual', () => {
    const dto = ExportacionDto.desde({
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
