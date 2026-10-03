import { describe, expect, it } from 'vitest';
import { Activity, DireccionEscala, type Frecuencia } from '../../../domain/model/Activity.js';
import { ActivityId } from '../../../domain/model/Identifier.js';
import { Modulo } from '../../../domain/model/Preferencias.js';
import { etapaPara } from '../../../domain/model/Sendero.js';
import { ProgresoRespuestaDto } from './ProgresoRespuestaDto.js';

function conFrecuencia(frecuencia: Frecuencia) {
  const actividad = Activity.create({
    id: new ActivityId('12121212-1212-4121-8121-121212121212'),
    nombre: 'Movimiento del día',
    direccionEscala: DireccionEscala.SIN_PUNTAJE,
    frecuencia,
  });

  return ProgresoRespuestaDto.desde({
    modulo: Modulo.BIENESTAR,
    sesiones: 0,
    etapa: etapaPara(0),
    hoy: [{ actividad, hecha: false }],
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
