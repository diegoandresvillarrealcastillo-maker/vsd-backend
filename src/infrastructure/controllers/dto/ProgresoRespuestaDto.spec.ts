import { describe, expect, it } from 'vitest';
import { Activity, DireccionEscala, type Frecuencia } from '../../../domain/model/Activity.js';
import { ActivityId } from '../../../domain/model/Identifier.js';
import { Modulo } from '../../../domain/model/Preferencias.js';
import { etapaPara } from '../../../domain/model/Sendero.js';
import { ProgresoRespuestaDto } from './ProgresoRespuestaDto.js';

function unaActividad(frecuencia: Frecuencia, id = '12121212-1212-4121-8121-121212121212') {
  return Activity.create({
    id: new ActivityId(id),
    nombre: 'Movimiento del día',
    direccionEscala: DireccionEscala.SIN_PUNTAJE,
    frecuencia,
  });
}

function conFrecuencia(frecuencia: Frecuencia) {
  const actividad = unaActividad(frecuencia);

  return ProgresoRespuestaDto.desde({
    modulo: Modulo.BIENESTAR,
    sesiones: 0,
    etapa: etapaPara(0),
    hoy: [{ actividad, hecha: false }],
    sugeridas: [],
  }).hoy[0];
}

describe('ProgresoRespuestaDto: la frecuencia de cada actividad (SCRUM-92)', () => {
  it('una diaria sale sin dias', () => {
    expect(conFrecuencia({ tipo: 'diaria' })?.frecuencia).toEqual({ tipo: 'diaria' });
  });

  it('una unica sale sin dias', () => {
    expect(conFrecuencia({ tipo: 'unica' })?.frecuencia).toEqual({ tipo: 'unica' });
  });

  it('una semanal lleva sus dias, 1 es lunes', () => {
    expect(conFrecuencia({ tipo: 'semanal', dias: [1, 5] })?.frecuencia).toEqual({
      tipo: 'semanal',
      dias: [1, 5],
    });
  });
});

describe('ProgresoRespuestaDto: lo sugerido (SCRUM-184)', () => {
  it('las sugeridas salen aparte de lo que toca hoy, con la misma forma', () => {
    const toca = unaActividad({ tipo: 'diaria' });
    const sugerida = unaActividad(
      { tipo: 'semanal', dias: [2] },
      '34343434-3434-4343-8343-343434343434',
    );

    const dto = ProgresoRespuestaDto.desde({
      modulo: Modulo.BIENESTAR,
      sesiones: 4,
      etapa: etapaPara(4),
      hoy: [{ actividad: toca, hecha: true }],
      sugeridas: [{ actividad: sugerida, hecha: false }],
    });

    expect(dto.hoy.map((una) => una.id)).toEqual([toca.id.value]);
    expect(dto.sugeridas).toEqual([
      {
        id: sugerida.id.value,
        nombre: 'Movimiento del día',
        hecha: false,
        frecuencia: { tipo: 'semanal', dias: [2] },
      },
    ]);
  });

  it('sin sugeridas, una lista vacia: el cliente nunca recibe un campo que falta', () => {
    const dto = ProgresoRespuestaDto.desde({
      modulo: Modulo.BIENESTAR,
      sesiones: 0,
      etapa: etapaPara(0),
      hoy: [],
      sugeridas: [],
    });

    expect(dto.sugeridas).toEqual([]);
  });
});
