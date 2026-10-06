import { describe, expect, it } from 'vitest';
import { UserId } from '../../../domain/model/Identifier.js';
import type { DatosExportados } from '../../../domain/ports/in/ExportarDatosUseCase.js';
import { unaCuenta } from '../../../pruebas/contratoDeUsuarios.js';
import { ExportacionDto } from './ExportacionDto.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';

function datosConAvisos(
  preferencias: Partial<DatosExportados['avisos']['preferencias']>,
): DatosExportados {
  return {
    generadoEn: new Date('2026-10-08T15:00:00.000Z'),
    cuenta: unaCuenta(),
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
