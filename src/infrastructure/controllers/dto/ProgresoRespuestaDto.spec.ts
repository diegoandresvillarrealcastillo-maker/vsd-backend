import { describe, expect, it } from 'vitest';
import { Activity, DireccionEscala, type Frecuencia } from '../../../domain/model/Activity.js';
import { ActivityId, SesionId } from '../../../domain/model/Identifier.js';
import { Revision, SesionDeActividad } from '../../../domain/model/SesionDeActividad.js';
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

  it('una rotativa sale sin dias (ADR 0030)', () => {
    expect(conFrecuencia({ tipo: 'rotativa' })?.frecuencia).toEqual({ tipo: 'rotativa' });
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

describe('ProgresoRespuestaDto: el motor y la sesion de hoy (ADR 0030)', () => {
  const SESION = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

  function conMotor() {
    return Activity.create({
      id: new ActivityId('12121212-1212-4121-8121-121212121212'),
      nombre: 'Respiración guiada',
      direccionEscala: DireccionEscala.SIN_PUNTAJE,
      frecuencia: { tipo: 'rotativa' },
      motor: 'guia_paso_a_paso',
    });
  }

  function sesion(actividad: Activity) {
    return SesionDeActividad.create({
      id: new SesionId(SESION),
      idActividad: actividad.id,
      titulo: 'Respiración 4-6',
      nivel: 2,
      parametros: { pasos: [{ texto: 'Inhala', segundos: 4 }], conSonido: false },
      publicado: true,
      revision: Revision.REVISADA,
      revisadaPor: 'Psicología',
      revisadaEl: new Date('2026-10-20T15:00:00.000Z'),
    });
  }

  it('una actividad con motor sale con su motor y la sesion que le toca hoy', () => {
    const actividad = conMotor();

    const dto = ProgresoRespuestaDto.desde({
      modulo: Modulo.BIENESTAR,
      sesiones: 0,
      etapa: etapaPara(0),
      hoy: [{ actividad, hecha: false, sesion: sesion(actividad) }],
      sugeridas: [],
    });

    expect(dto.hoy[0]).toMatchObject({
      motor: 'guia_paso_a_paso',
      frecuencia: { tipo: 'rotativa' },
      sesion: {
        id: SESION,
        titulo: 'Respiración 4-6',
        nivel: 2,
        parametros: { pasos: [{ texto: 'Inhala', segundos: 4 }], conSonido: false },
      },
    });
  });

  it('de la sesion salen solo cuatro campos: nada de la revision ni de quien la hizo', () => {
    const actividad = conMotor();

    const dto = ProgresoRespuestaDto.desde({
      modulo: Modulo.BIENESTAR,
      sesiones: 0,
      etapa: etapaPara(0),
      hoy: [{ actividad, hecha: false, sesion: sesion(actividad) }],
      sugeridas: [],
    });

    expect(Object.keys(dto.hoy[0]?.sesion ?? {}).sort()).toEqual([
      'id',
      'nivel',
      'parametros',
      'titulo',
    ]);
    expect(JSON.stringify(dto)).not.toContain('Psicología');
    expect(JSON.stringify(dto)).not.toContain('revisada');
  });

  it('una sugerida con motor tambien sale con su sesion', () => {
    const actividad = conMotor();

    const dto = ProgresoRespuestaDto.desde({
      modulo: Modulo.BIENESTAR,
      sesiones: 0,
      etapa: etapaPara(0),
      hoy: [],
      sugeridas: [{ actividad, hecha: false, sesion: sesion(actividad) }],
    });

    expect(dto.sugeridas[0]?.sesion?.id).toBe(SESION);
  });

  it('una actividad sin motor sale como siempre: sin motor y sin sesion (asi son las nueve de hoy)', () => {
    const dto = ProgresoRespuestaDto.desde({
      modulo: Modulo.BIENESTAR,
      sesiones: 0,
      etapa: etapaPara(0),
      hoy: [{ actividad: unaActividad({ tipo: 'diaria' }), hecha: false }],
      sugeridas: [],
    });

    expect(dto.hoy[0]).toEqual({
      id: '12121212-1212-4121-8121-121212121212',
      nombre: 'Movimiento del día',
      hecha: false,
      frecuencia: { tipo: 'diaria' },
    });
    expect(dto.hoy[0]).not.toHaveProperty('motor');
    expect(dto.hoy[0]).not.toHaveProperty('sesion');
  });
});
