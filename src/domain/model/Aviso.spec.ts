import { describe, expect, it } from 'vitest';
import {
  horaDeMinuto,
  mensajeDeLaManana,
  mensajeDeLaNoche,
  mensajeDeLaRacha,
  mensajeDelSemaforo,
  MINUTO_DE_LA_MANANA,
  MINUTO_DE_LA_NOCHE,
  minutoDeHora,
  semillaDelAviso,
  suscripcionValida,
} from './Aviso.js';
import { InvalidNotificationSettingError } from './DomainError.js';
import { UserId } from './Identifier.js';
import { TEXTOS_DE_LA_MANANA, TEXTOS_DE_LA_NOCHE } from './TextosDeLosRecordatorios.js';

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

describe('las horas fijas de los recordatorios (SCRUM-126)', () => {
  it('son las 8:00 y las 20:00', () => {
    expect(horaDeMinuto(MINUTO_DE_LA_MANANA)).toBe('08:00');
    expect(horaDeMinuto(MINUTO_DE_LA_NOCHE)).toBe('20:00');
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

describe('los recordatorios de la manana y de la noche (SCRUM-126)', () => {
  const PERSONA = new UserId('11111111-1111-4111-8111-111111111111');
  const OTRA = new UserId('22222222-2222-4222-9222-222222222222');

  /** Todos los textos que puede decir cada uno, para vigilarlos de una vez. */
  const TODOS = [...TEXTOS_DE_LA_MANANA, ...TEXTOS_DE_LA_NOCHE];

  it('cada uno lleva su tipo y lleva a donde estan las actividades del dia', () => {
    expect(mensajeDeLaManana(0)).toMatchObject({ tipo: 'manana', ruta: '/panel' });
    expect(mensajeDeLaNoche(0)).toMatchObject({ tipo: 'noche', ruta: '/panel' });
  });

  it('hay variedad de sobra para que no sea el mismo texto todos los dias', () => {
    expect(TEXTOS_DE_LA_MANANA.length).toBeGreaterThanOrEqual(10);
    expect(TEXTOS_DE_LA_NOCHE.length).toBeGreaterThanOrEqual(10);
    expect(new Set(TEXTOS_DE_LA_MANANA.map((texto) => texto.titulo)).size).toBe(
      TEXTOS_DE_LA_MANANA.length,
    );
    expect(new Set(TEXTOS_DE_LA_NOCHE.map((texto) => texto.titulo)).size).toBe(
      TEXTOS_DE_LA_NOCHE.length,
    );
  });

  it('la semilla es la misma para la misma persona el mismo dia, y cambia cada dia', () => {
    expect(semillaDelAviso(PERSONA, '2026-10-05')).toBe(semillaDelAviso(PERSONA, '2026-10-05'));
    expect(semillaDelAviso(PERSONA, '2026-10-06')).toBe(semillaDelAviso(PERSONA, '2026-10-05') + 1);
  });

  it('dos dias seguidos nunca dicen lo mismo, y en un ciclo se dicen todos', () => {
    const dias = Array.from({ length: TEXTOS_DE_LA_NOCHE.length * 2 }, (_, indice) =>
      semillaDelAviso(PERSONA, `2026-11-${String(indice + 1).padStart(2, '0')}`),
    );
    const titulos = dias.map((semilla) => mensajeDeLaNoche(semilla).titulo);

    for (let dia = 1; dia < titulos.length; dia += 1) {
      expect(titulos[dia]).not.toBe(titulos[dia - 1]);
    }

    expect(new Set(titulos.slice(0, TEXTOS_DE_LA_NOCHE.length)).size).toBe(
      TEXTOS_DE_LA_NOCHE.length,
    );
  });

  it('una persona no recibe la misma frase que otra el mismo dia (casi siempre)', () => {
    expect(semillaDelAviso(PERSONA, '2026-10-05')).not.toBe(semillaDelAviso(OTRA, '2026-10-05'));
  });

  it('una semilla fuera de rango no se sale de los textos', () => {
    expect(mensajeDeLaManana(-3).titulo).toBeTruthy();
    expect(mensajeDeLaNoche(123_456_789).titulo).toBeTruthy();
  });

  it('ninguno habla de salud', () => {
    const textos = TODOS.flatMap((texto) => [texto.titulo, texto.cuerpo])
      .join(' ')
      .toLowerCase();

    // Por palabra: "salud" no es "saludar", y un texto puede decir "saludar".
    for (const palabra of [
      /\bresultado/,
      /\bnivel/,
      /(?<!\p{L})ánimo/u,
      /\bestrés/,
      /\bansiedad/,
      /\bdepres/,
      /\bemoci/,
      /\briesgo/,
      /\bsalud\b/,
      /\bterapia/,
      /\bsíntoma/,
      /\bdiagnóst/,
      /\bmedic/,
    ]) {
      expect(textos).not.toMatch(palabra);
    }
  });

  it('ninguno culpa ni presiona: sin cuentas de dias, sin perdidas, sin deudas', () => {
    const textos = TODOS.flatMap((texto) => [texto.titulo, texto.cuerpo])
      .join(' ')
      .toLowerCase();

    for (const frase of [
      'racha',
      'pierd',
      'perdi',
      'olvid',
      'falta',
      'todavía no',
      'aún no',
      'ya no',
      'deberías',
      'tienes que',
      'no puedes',
      'último chance',
    ]) {
      expect(textos).not.toContain(frase);
    }

    // Ni un numero: ni dias seguidos ni cuantas actividades.
    expect(textos).not.toMatch(/\d+\s+(d[ií]as|actividades|veces)/);
  });

  it('cada texto cabe en la pantalla bloqueada, sin recortarse', () => {
    for (const texto of TODOS) {
      expect(texto.titulo.length).toBeLessThanOrEqual(45);
      expect(texto.cuerpo.length).toBeLessThanOrEqual(85);
    }
  });

  it('la noche nunca dice que ya hubo actividad ni la manana pide hacer la de ayer', () => {
    // La noche solo sale si hoy no hubo nada, pero ningun texto lo afirma.
    for (const texto of TEXTOS_DE_LA_NOCHE) {
      expect(`${texto.titulo} ${texto.cuerpo}`.toLowerCase()).not.toMatch(/no hiciste|no hubo/);
    }

    for (const texto of TEXTOS_DE_LA_MANANA) {
      expect(`${texto.titulo} ${texto.cuerpo}`.toLowerCase()).not.toMatch(/ayer/);
    }
  });
});
