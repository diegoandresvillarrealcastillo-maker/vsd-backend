import { describe, expect, it } from 'vitest';
import {
  horaDeMinuto,
  MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA,
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
import { calcularLaRacha } from './Racha.js';
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
    ['Chrome, Edge, Brave y Opera', 'https://fcm.googleapis.com/fcm/send/abc123'],
    ['Chrome con la direccion nueva', 'https://fcm.googleapis.com/wp/abc123'],
    ['Firefox', 'https://updates.push.services.mozilla.com/wpush/v2/abc123'],
    ['Firefox en Android', 'https://updates-autopush.push.services.mozilla.com/wpush/v2/abc'],
    ['Safari y iOS', 'https://web.push.apple.com/QGxyz123'],
    ['Windows', 'https://wns2-par02p.notify.windows.com/w/?token=abc123'],
  ])('acepta la direccion de %s', (_servicio, endpoint) => {
    expect(suscripcionValida({ ...SUSCRIPCION, endpoint })).toEqual({ ...SUSCRIPCION, endpoint });
  });

  it.each([
    ['sin https', { ...SUSCRIPCION, endpoint: 'http://fcm.googleapis.com/fcm/send/abc' }],
    ['que no es una URL', { ...SUSCRIPCION, endpoint: 'no es una direccion' }],
    ['con claves raras', { ...SUSCRIPCION, auth: 'tiene espacios y <html>' }],
    [
      'demasiado larga',
      { ...SUSCRIPCION, endpoint: `https://fcm.googleapis.com/${'a'.repeat(1000)}` },
    ],
  ])('rechaza una %s', (_motivo, suscripcion) => {
    expect(() => suscripcionValida(suscripcion)).toThrow(InvalidNotificationSettingError);
  });

  describe('solo a servicios de push conocidos (SCRUM-153)', () => {
    // El API hace una peticion a esta direccion. Si pudiera ser cualquiera,
    // una cuenta lograria que el servidor llamara a donde quisiera.
    it.each([
      ['un sitio cualquiera', 'https://push.example.com/abc'],
      ['la red interna', 'https://localhost/fcm/send/abc'],
      ['una direccion de la red local', 'https://10.0.0.5/fcm/send/abc'],
      ['el servicio de metadatos de la nube', 'https://169.254.169.254/latest/meta-data/'],
      ['una direccion IPv6', 'https://[::1]/fcm/send/abc'],
      ['un dominio que solo lo parece', 'https://fcm.googleapis.com.ajeno.test/fcm/send/abc'],
      ['un dominio que termina igual', 'https://xfcm.googleapis.com/fcm/send/abc'],
      ['el dominio de Mozilla sin nombre delante', 'https://push.services.mozilla.com/abc'],
      ['un dominio pegado al de Windows', 'https://ajeno-notify.windows.com/abc'],
      ['el servicio con un punto al final', 'https://fcm.googleapis.com./fcm/send/abc'],
      ['usuario y contrasena', 'https://usuario:clave@fcm.googleapis.com/fcm/send/abc'],
      ['solo usuario', 'https://fcm.googleapis.com@ajeno.test/fcm/send/abc'],
      ['un puerto', 'https://fcm.googleapis.com:8443/fcm/send/abc'],
      ['el puerto por defecto escrito', 'https://fcm.googleapis.com:443/fcm/send/abc'],
      [
        'una barra invertida que dos lectores entienden distinto',
        'https://fcm.googleapis.com\\@ajeno.test/',
      ],
      ['mayusculas', 'HTTPS://FCM.GOOGLEAPIS.COM/fcm/send/abc'],
      ['sin ruta', 'https://fcm.googleapis.com'],
    ])('rechaza %s', (_motivo, endpoint) => {
      expect(() => suscripcionValida({ ...SUSCRIPCION, endpoint })).toThrow(
        InvalidNotificationSettingError,
      );
    });

    it('el mensaje no repite la direccion recibida', () => {
      try {
        suscripcionValida({ ...SUSCRIPCION, endpoint: 'https://ajeno-secreto.test/abc' });
        expect.unreachable('deberia haber lanzado');
      } catch (error) {
        expect((error as Error).message).not.toContain('ajeno-secreto');
      }
    });
  });

  it('el tope por cuenta es de diez', () => {
    expect(MAXIMO_DE_SUSCRIPCIONES_POR_CUENTA).toBe(10);
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

describe('el aviso de la racha con los dias y la mascota (SCRUM-242)', () => {
  const HOY = '2026-10-21';

  /** `cuantos` dias seguidos que terminan ayer: hoy todavia no hizo nada. */
  function hastaAyer(cuantos: number): string[] {
    return Array.from({ length: cuantos }, (_, i) => {
      const fecha = new Date(Date.UTC(2026, 9, 20 - i));

      return fecha.toISOString().slice(0, 10);
    });
  }

  const SPARKY = { forma: 'sparky', nombre: 'Sparky' };

  /** La racha de 17 dias de octubre que ya uso sus tres congelamientos (huecos el 2, el 4 y el 6). */
  const SIN_CONGELAMIENTOS = [
    '2026-10-01',
    '2026-10-03',
    '2026-10-05',
    ...Array.from({ length: 14 }, (_, i) => `2026-10-${String(7 + i).padStart(2, '0')}`),
  ];

  it('sin argumentos dice lo de siempre, sin numero de dias', () => {
    expect(mensajeDeLaRacha()).toEqual({
      tipo: 'racha',
      titulo: '¿Un momento para ti hoy?',
      cuerpo: 'Tus actividades de hoy te esperan, cuando quieras.',
      ruta: '/panel',
    });
  });

  it('con congelamientos disponibles dice que una actividad evita gastar uno', () => {
    const racha = calcularLaRacha(hastaAyer(12), HOY);

    expect(mensajeDeLaRacha(racha, SPARKY)).toMatchObject({
      tipo: 'racha',
      titulo: 'Tu racha de 12 días',
      cuerpo: 'Sparky: una actividad hoy y no gastas un congelamiento.',
      mascota: 'sparky',
      ruta: '/panel',
    });
  });

  it('sin congelamientos dice que la racha esta en juego, sin prisa', () => {
    const racha = calcularLaRacha(SIN_CONGELAMIENTOS, HOY);

    expect(racha.dias).toBe(17);
    expect(racha.congelamientosDisponibles).toBe(0);
    expect(mensajeDeLaRacha(racha, SPARKY)).toMatchObject({
      titulo: 'Tu racha de 17 días está en juego',
      cuerpo: 'Sparky: una actividad hoy la mantiene. Sin prisa.',
    });
  });

  it('si con una actividad hoy llega a un hito, lo dice', () => {
    expect(mensajeDeLaRacha(calcularLaRacha(hastaAyer(13), HOY), SPARKY)).toMatchObject({
      titulo: 'Hoy puedes llegar a 14 días',
      cuerpo: 'Sparky: una actividad y lo logras.',
    });
    expect(mensajeDeLaRacha(calcularLaRacha(hastaAyer(2), HOY), SPARKY)).toMatchObject({
      titulo: 'Hoy puedes llegar a 3 días',
    });
  });

  it('el hito gana al riesgo, tambien sin congelamientos', () => {
    // 32 dias de agosto y septiembre, y los 17 de octubre con los tres congelamientos usados.
    const antesDeOctubre = Array.from({ length: 32 }, (_, i) =>
      new Date(Date.UTC(2026, 7, 30 + i)).toISOString().slice(0, 10),
    );
    const racha = calcularLaRacha([...antesDeOctubre, ...SIN_CONGELAMIENTOS], HOY);

    expect(racha.dias).toBe(49);
    expect(racha.congelamientosDisponibles).toBe(0);
    expect(mensajeDeLaRacha(racha, SPARKY).titulo).toBe('Hoy puedes llegar a 50 días');
  });

  it.each([
    ['con un dia', hastaAyer(1)],
    ['sin ningun dia, con la llama en descanso', []],
  ])('%s dice lo de siempre', (_nombre, dias) => {
    const mensaje = mensajeDeLaRacha(calcularLaRacha(dias, HOY), SPARKY);

    expect(mensaje.titulo).toBe('¿Un momento para ti hoy?');
    expect(mensaje.cuerpo).toBe('Tus actividades de hoy te esperan, cuando quieras.');
  });

  it('sin mascota la frase empieza con mayuscula y no lleva la clave mascota', () => {
    const mensaje = mensajeDeLaRacha(calcularLaRacha(hastaAyer(12), HOY), null);

    expect(mensaje.cuerpo).toBe('Una actividad hoy y no gastas un congelamiento.');
    expect(mensaje).not.toHaveProperty('mascota');
  });

  it('la mascota propia habla con su nombre pero no manda su forma', () => {
    const mensaje = mensajeDeLaRacha(calcularLaRacha(hastaAyer(12), HOY), {
      forma: 'propia',
      nombre: 'Luna',
    });

    expect(mensaje.cuerpo).toBe('Luna: una actividad hoy y no gastas un congelamiento.');
    expect(mensaje).not.toHaveProperty('mascota');
  });

  it('un nombre largo y con espacios de mas se limpia y se recorta a 20 caracteres', () => {
    const mensaje = mensajeDeLaRacha(calcularLaRacha(hastaAyer(12), HOY), {
      forma: 'gato',
      nombre: '  Chispa   la   Grande y larguísima  ',
    });

    expect(mensaje.cuerpo).toBe(
      'Chispa la Grande y l: una actividad hoy y no gastas un congelamiento.',
    );
    expect(mensaje.mascota).toBe('gato');
  });

  it('un nombre en blanco no deja dos puntos sueltos', () => {
    const mensaje = mensajeDeLaRacha(calcularLaRacha(hastaAyer(12), HOY), {
      forma: 'ori',
      nombre: '   ',
    });

    expect(mensaje.cuerpo).toBe('Una actividad hoy y no gastas un congelamiento.');
    expect(mensaje.mascota).toBe('ori');
  });

  it('ninguna variante dice que algo se perdio ni habla de salud', () => {
    const variantes = [
      calcularLaRacha(hastaAyer(12), HOY),
      calcularLaRacha(SIN_CONGELAMIENTOS, HOY),
      calcularLaRacha(hastaAyer(13), HOY),
      calcularLaRacha(hastaAyer(2), HOY),
      calcularLaRacha([], HOY),
    ].map((racha) => mensajeDeLaRacha(racha, SPARKY));
    const texto = variantes
      .flatMap((mensaje) => [mensaje.titulo, mensaje.cuerpo])
      .join(' ')
      .toLowerCase();

    for (const palabra of [
      'perdi',
      'perdiste',
      'rompi',
      'fall',
      'castig',
      'culpa',
      'resultado',
      'nivel',
      'ánimo',
      'estrés',
      'ansiedad',
      'salud',
    ]) {
      expect(texto).not.toContain(palabra);
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
