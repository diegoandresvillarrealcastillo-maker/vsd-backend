import { describe, expect, it } from 'vitest';
import {
  horaDeMinuto,
  mensajeDeLaRacha,
  mensajeDelSemaforo,
  minutoDeHora,
  suscripcionValida,
} from './Aviso.js';
import { InvalidNotificationSettingError } from './DomainError.js';

const SUSCRIPCION = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
  p256dh: 'clave-p256dh-de-prueba',
  auth: 'clave-auth-de-prueba',
};

describe('las horas de los avisos', () => {
  it.each([
    ['00:00', 0],
    ['08:30', 510],
    ['23:59', 1439],
  ])('%s son %i minutos, y de vuelta', (hora, minuto) => {
    expect(minutoDeHora(hora)).toBe(minuto);
    expect(horaDeMinuto(minuto)).toBe(hora);
  });

  it.each(['24:00', '8:30', '08:60', '08:30:00', '', 'mañana'])('rechaza "%s"', (hora) => {
    expect(() => minutoDeHora(hora)).toThrow(InvalidNotificationSettingError);
  });
});

describe('las suscripciones', () => {
  it('acepta la que da un navegador', () => {
    expect(suscripcionValida(SUSCRIPCION)).toEqual(SUSCRIPCION);
  });

  it.each([
    ['sin https', { ...SUSCRIPCION, endpoint: 'http://fcm.googleapis.com/fcm/send/abc' }],
    ['que no es una URL', { ...SUSCRIPCION, endpoint: 'no es una direccion' }],
    ['con claves raras', { ...SUSCRIPCION, auth: 'tiene espacios y <html>' }],
    [
      'demasiado larga',
      { ...SUSCRIPCION, endpoint: `https://push.example.com/${'a'.repeat(1000)}` },
    ],
  ])('rechaza una %s', (_motivo, suscripcion) => {
    expect(() => suscripcionValida(suscripcion)).toThrow(InvalidNotificationSettingError);
  });
});

describe('lo que dicen los avisos', () => {
  it('el del semaforo cuenta y nombra los pendientes', () => {
    expect(mensajeDelSemaforo(['Pagar la matrícula', 'Pedir cita'])).toMatchObject({
      tipo: 'semaforo',
      titulo: 'Tienes 2 pendientes en tu semáforo',
      cuerpo: 'Pagar la matrícula · Pedir cita',
    });
  });

  it('nombra tres como mucho y cuenta el resto', () => {
    expect(mensajeDelSemaforo(['a', 'b', 'c', 'd', 'e'])?.cuerpo).toBe('a · b · c y 2 más');
    expect(mensajeDelSemaforo(['uno'])?.titulo).toBe('Tienes 1 pendiente en tu semáforo');
  });

  it('sin pendientes no hay aviso del semaforo', () => {
    expect(mensajeDelSemaforo([])).toBeNull();
  });

  it('el de la racha invita, sin reclamar', () => {
    expect(mensajeDeLaRacha()).toMatchObject({
      tipo: 'racha',
      titulo: '¿Un momento para ti hoy?',
    });
  });

  it('ninguno habla de salud', () => {
    const textos = [mensajeDeLaRacha(), mensajeDelSemaforo(['Pagar la matrícula'])]
      .flatMap((mensaje) => [mensaje?.titulo, mensaje?.cuerpo])
      .join(' ')
      .toLowerCase();

    for (const palabra of [
      'resultado',
      'nivel',
      'ánimo',
      'estrés',
      'ansiedad',
      'riesgo',
      'salud',
    ]) {
      expect(textos).not.toContain(palabra);
    }
  });
});
