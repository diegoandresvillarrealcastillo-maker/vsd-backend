import { describe, expect, it } from 'vitest';
import type {
  MensajeDeAviso,
  PreferenciasDeAviso,
  SuscripcionPush,
} from '../../domain/model/Aviso.js';
import { TipoDeAviso } from '../../domain/model/Aviso.js';
import type { Dia } from '../../domain/model/Calendario.js';
import { ClientOperationId, PendienteId, UserId } from '../../domain/model/Identifier.js';
import { Pendiente } from '../../domain/model/Pendiente.js';
import type { ActivityResultRepositoryPort } from '../../domain/ports/out/ActivityResultRepositoryPort.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';
import type { Entrega, EnviadorDePushPort } from '../../domain/ports/out/EnviadorDePushPort.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';
import { PERSONAS_A_LA_VEZ, RevisarAvisosUseCaseImpl } from './RevisarAvisosUseCaseImpl.js';

const ANA = '11111111-1111-4111-8111-111111111111';
const BETO = '22222222-2222-4222-9222-222222222222';

/** Las 8:00 del 5 de octubre en Bogota (13:00 UTC). */
const OCHO = new Date('2026-10-05T13:00:00.000Z');
const minutos = (cuantos: number) => new Date(OCHO.getTime() + cuantos * 60_000);

/** Las 20:00 del 5 de octubre en Bogota (01:00 UTC del 6). */
const VEINTE = new Date('2026-10-06T01:00:00.000Z');

interface Horas {
  semaforo: number | null;
  racha: number | null;
  manana: number | null;
  noche: number | null;
  zona: string;
}

/** Las horas y las suscripciones de cada persona, como las guardaria la base. */
class AvisosDePrueba implements AvisosRepositoryPort {
  readonly horas = new Map<string, Horas>();
  readonly revisados = new Map<string, Dia>();
  suscripciones = new Map<string, SuscripcionPush[]>();

  elegir(persona: string, semaforo: number | null, racha: number | null, zona = 'America/Bogota') {
    this.poner(persona, { semaforo, racha, zona });
  }

  /** Los recordatorios de las 8:00 y las 20:00 (SCRUM-126); lo demas queda apagado. */
  recordatorios(
    persona: string,
    manana: number | null,
    noche: number | null,
    zona = 'America/Bogota',
  ) {
    this.poner(persona, { manana, noche, zona });
  }

  private poner(persona: string, cambios: Partial<Horas>) {
    this.horas.set(persona, {
      semaforo: null,
      racha: null,
      manana: null,
      noche: null,
      zona: 'America/Bogota',
      ...cambios,
    });
    this.suscripciones.set(persona, [
      { endpoint: `https://push.example.com/${persona}`, p256dh: 'p', auth: 'a' },
    ]);
  }

  preferenciasDe(userId: UserId) {
    const horas = this.horas.get(userId.value);

    return Promise.resolve({
      userId,
      minutoSemaforo: horas?.semaforo ?? null,
      minutoRacha: horas?.racha ?? null,
      minutoManana: horas?.manana ?? null,
      minutoNoche: horas?.noche ?? null,
      zonaHoraria: horas?.zona ?? 'America/Bogota',
    });
  }

  guardarPreferencias(preferencias: PreferenciasDeAviso) {
    return Promise.resolve(preferencias);
  }

  suscribir() {
    return Promise.resolve();
  }

  desuscribir(userId: UserId, endpoint: string) {
    this.suscripciones.set(
      userId.value,
      (this.suscripciones.get(userId.value) ?? []).filter((una) => una.endpoint !== endpoint),
    );

    return Promise.resolve();
  }

  suscripcionesDe(userId: UserId) {
    return Promise.resolve(this.suscripciones.get(userId.value) ?? []);
  }

  zonasEnUso() {
    return Promise.resolve([...new Set([...this.horas.values()].map((horas) => horas.zona))]);
  }

  aQuienLeToca(tipo: TipoDeAviso, zona: string, desde: number, hasta: number, dia: Dia) {
    return Promise.resolve(
      [...this.horas.entries()]
        .filter(([persona, horas]) => {
          const minuto = {
            [TipoDeAviso.SEMAFORO]: horas.semaforo,
            [TipoDeAviso.RACHA]: horas.racha,
            [TipoDeAviso.MANANA]: horas.manana,
            [TipoDeAviso.NOCHE]: horas.noche,
          }[tipo];

          return (
            horas.zona === zona &&
            minuto !== null &&
            minuto >= desde &&
            minuto <= hasta &&
            this.revisados.get(`${persona}:${tipo}`) !== dia
          );
        })
        .map(([persona]) => new UserId(persona)),
    );
  }

  /** Los que otra revision ya reclamo (`persona:tipo`), aunque `aQuienLeToca` los siga devolviendo. */
  readonly yaReclamados = new Set<string>();
  /** Cuantas veces se pregunto, y cuantas a la vez. */
  llamadas = 0;

  marcarRevisado(userId: UserId, tipo: TipoDeAviso, dia: Dia) {
    const clave = `${userId.value}:${tipo}`;

    this.llamadas += 1;

    if (this.yaReclamados.has(clave) || this.revisados.get(clave) === dia) {
      return Promise.resolve(false);
    }

    this.revisados.set(clave, dia);

    return Promise.resolve(true);
  }
}

class EnviadorDePrueba implements EnviadorDePushPort {
  clavePublica: string | null = 'clave-publica';
  readonly entregados: { endpoint: string; mensaje: MensajeDeAviso }[] = [];
  caducadas = new Set<string>();
  fallan = new Set<string>();

  enviar(suscripcion: SuscripcionPush, mensaje: MensajeDeAviso): Promise<Entrega> {
    if (this.fallan.has(suscripcion.endpoint)) {
      return Promise.reject(new Error('El servicio de push respondio 500.'));
    }

    if (this.caducadas.has(suscripcion.endpoint)) {
      return Promise.resolve('caducada');
    }

    this.entregados.push({ endpoint: suscripcion.endpoint, mensaje });

    return Promise.resolve('entregado');
  }

  para(persona: string): MensajeDeAviso[] {
    return this.entregados
      .filter((uno) => uno.endpoint.endsWith(persona))
      .map((uno) => uno.mensaje);
  }
}

function pendientes(porPersona: Record<string, string[]>): PendientesRepositoryPort {
  const de = (userId: UserId) =>
    (porPersona[userId.value] ?? []).map((texto, indice) =>
      Pendiente.nuevo(
        {
          id: new PendienteId(`33333333-3333-4333-8333-${String(indice).padStart(12, '0')}`),
          userId,
          clientOperationId: new ClientOperationId(
            `44444444-4444-4444-8444-${String(indice).padStart(12, '0')}`,
          ),
          texto,
          nivel: 'urgente',
        },
        new Date(OCHO.getTime() - (10 - indice) * 60_000),
      ),
    );

  return {
    vigentesDe: (userId) => Promise.resolve(de(userId)),
    todosDe: (userId) => Promise.resolve(de(userId)),
    porId: () => Promise.resolve(null),
    porOperacion: () => Promise.resolve(null),
    guardarNuevo: (pendiente) => Promise.resolve(pendiente),
    actualizar: () => Promise.resolve(null),
    borrar: () => Promise.resolve(false),
  };
}

/** Quien hizo alguna actividad desde el inicio del dia. */
function resultados(conActividadHoy: string[]): ActivityResultRepositoryPort {
  return {
    hayActividadDesde: (userId: UserId) => Promise.resolve(conActividadHoy.includes(userId.value)),
  } as unknown as ActivityResultRepositoryPort;
}

/** Un servicio de push que tarda un poco, para ver cuantos envios hay a la vez. */
class EnviadorLento extends EnviadorDePrueba {
  enVuelo = 0;
  maximoEnVuelo = 0;

  override async enviar(suscripcion: SuscripcionPush, mensaje: MensajeDeAviso): Promise<Entrega> {
    this.enVuelo += 1;
    this.maximoEnVuelo = Math.max(this.maximoEnVuelo, this.enVuelo);

    await new Promise<void>((resolver) => setTimeout(resolver, 3));

    this.enVuelo -= 1;

    return super.enviar(suscripcion, mensaje);
  }
}

function armar({
  conPendientes = { [ANA]: ['Pagar la matrícula', 'Pedir cita'] },
  conActividadHoy = [],
  enviador = new EnviadorDePrueba(),
  personasALaVez,
}: {
  conPendientes?: Record<string, string[]>;
  conActividadHoy?: string[];
  enviador?: EnviadorDePrueba;
  personasALaVez?: number;
} = {}) {
  const avisos = new AvisosDePrueba();
  const fallos: unknown[] = [];
  const montar = (compartidos: AvisosDePrueba = avisos) =>
    new RevisarAvisosUseCaseImpl(
      compartidos,
      enviador,
      pendientes(conPendientes),
      resultados(conActividadHoy),
      { fallo: (_tipo, error) => fallos.push(error) },
      personasALaVez,
    );
  const revision = montar();

  return { avisos, enviador, revision, fallos, montar };
}

describe('la revision de cada minuto', () => {
  it('cada persona recibe su aviso a las 8:00 de su zona, no de la de otra (SCRUM-123)', async () => {
    const { avisos, enviador, revision } = armar({
      conPendientes: { [ANA]: ['Pagar la matrícula'], [BETO]: ['Pedir cita'] },
    });

    // Las dos eligieron las 8:00. Ana esta en Bogota (13:00 UTC) y Beto en
    // Madrid, donde las 8:00 de ese dia son las 6:00 UTC.
    avisos.elegir(ANA, 480, null, 'America/Bogota');
    avisos.elegir(BETO, 480, null, 'Europe/Madrid');

    // 6:00 UTC: es la hora de Beto y todavia no la de Ana.
    await revision.revisar(new Date('2026-10-05T06:00:00.000Z'));
    expect(enviador.para(BETO)).toHaveLength(1);
    expect(enviador.para(ANA)).toHaveLength(0);

    // 13:00 UTC: ahora es la de Ana, y Beto no recibe un segundo aviso.
    await revision.revisar(OCHO);
    expect(enviador.para(ANA)).toHaveLength(1);
    expect(enviador.para(BETO)).toHaveLength(1);
  });

  it('una zona que el servidor no conoce no detiene a las demas', async () => {
    const { avisos, enviador, revision, fallos } = armar();

    avisos.elegir(BETO, 480, null, 'Marte/Olympus');
    avisos.elegir(ANA, 480, null);

    await revision.revisar(OCHO);

    expect(enviador.para(ANA)).toHaveLength(1);
    expect(fallos).toHaveLength(1);
  });

  it('a la hora elegida manda el semaforo con los pendientes', async () => {
    const { avisos, enviador, revision } = armar();

    avisos.elegir(ANA, 480, null);

    expect(await revision.revisar(minutos(-1))).toEqual({
      personas: 0,
      entregados: 0,
      caducadas: 0,
      fallos: 0,
    });
    expect(await revision.revisar(OCHO)).toEqual({
      personas: 1,
      entregados: 1,
      caducadas: 0,
      fallos: 0,
    });
    expect(enviador.para(ANA)).toEqual([
      expect.objectContaining({
        tipo: 'semaforo',
        titulo: 'Tienes 2 pendientes en tu semáforo',
        cuerpo: 'Pagar la matrícula · Pedir cita',
      }),
    ]);
  });

  it('una sola vez al dia, aunque la revision corra cada minuto', async () => {
    const { avisos, enviador, revision } = armar();

    avisos.elegir(ANA, 480, null);

    await revision.revisar(OCHO);
    await revision.revisar(minutos(1));
    await revision.revisar(minutos(15));

    expect(enviador.para(ANA)).toHaveLength(1);
  });

  it('si el servidor estuvo parado, manda lo de la ultima media hora y nada mas viejo', async () => {
    const { avisos, enviador, revision } = armar();

    avisos.elegir(ANA, 480, null);
    avisos.elegir(BETO, 480, null);

    await revision.revisar(minutos(31));

    expect(enviador.entregados).toEqual([]);

    const { avisos: otros, enviador: otro, revision: otra } = armar();

    otros.elegir(ANA, 480, null);
    await otra.revisar(minutos(30));

    expect(otro.para(ANA)).toHaveLength(1);
  });

  it('cambiar la hora cambia la del siguiente aviso', async () => {
    const { avisos, enviador, revision } = armar();

    avisos.elegir(ANA, 480, null);
    avisos.elegir(ANA, 540, null);

    await revision.revisar(OCHO);
    expect(enviador.para(ANA)).toEqual([]);

    await revision.revisar(minutos(60));
    expect(enviador.para(ANA)).toHaveLength(1);
  });

  it('sin pendientes no hay aviso del semaforo', async () => {
    const { avisos, enviador, revision } = armar({ conPendientes: {} });

    avisos.elegir(ANA, 480, null);
    await revision.revisar(OCHO);

    expect(enviador.entregados).toEqual([]);
  });

  describe('la racha', () => {
    it('recuerda a quien todavia no hizo nada hoy', async () => {
      const { avisos, enviador, revision } = armar();

      avisos.elegir(ANA, null, 480);
      await revision.revisar(OCHO);

      expect(enviador.para(ANA)).toEqual([
        expect.objectContaining({ tipo: 'racha', titulo: '¿Un momento para ti hoy?' }),
      ]);
    });

    it('quien ya hizo una actividad hoy no recibe el recordatorio', async () => {
      const { avisos, enviador, revision } = armar({ conActividadHoy: [ANA] });

      avisos.elegir(ANA, null, 480);
      await revision.revisar(OCHO);

      expect(enviador.entregados).toEqual([]);
    });
  });

  describe('el recordatorio de la manana, a las 8:00 (SCRUM-126)', () => {
    it('sale a las 8:00, con una invitacion para empezar el dia', async () => {
      const { avisos, enviador, revision } = armar();

      avisos.recordatorios(ANA, 480, null);

      expect(await revision.revisar(minutos(-1))).toMatchObject({ personas: 0, entregados: 0 });
      expect(await revision.revisar(OCHO)).toMatchObject({ personas: 1, entregados: 1 });
      expect(enviador.para(ANA)).toEqual([
        expect.objectContaining({ tipo: 'manana', ruta: '/panel' }),
      ]);
    });

    it('sale aunque no haya pendientes ni nada hecho: no depende de lo que la persona haya hecho', async () => {
      const { avisos, enviador, revision } = armar({ conPendientes: {}, conActividadHoy: [ANA] });

      avisos.recordatorios(ANA, 480, null);
      await revision.revisar(OCHO);

      expect(enviador.para(ANA)).toHaveLength(1);
    });

    it('sale una sola vez al dia', async () => {
      const { avisos, enviador, revision } = armar();

      avisos.recordatorios(ANA, 480, null);

      await revision.revisar(OCHO);
      await revision.revisar(minutos(1));
      await revision.revisar(minutos(20));

      expect(enviador.para(ANA)).toHaveLength(1);
    });

    it('cada dia dice algo distinto, sin repetir el de ayer', async () => {
      const { avisos, enviador, revision } = armar();

      avisos.recordatorios(ANA, 480, null);

      await revision.revisar(OCHO);
      await revision.revisar(new Date(OCHO.getTime() + 24 * 60 * 60_000));
      await revision.revisar(new Date(OCHO.getTime() + 48 * 60 * 60_000));

      const titulos = enviador.para(ANA).map((mensaje) => mensaje.titulo);

      expect(titulos).toHaveLength(3);
      expect(titulos[1]).not.toBe(titulos[0]);
      expect(titulos[2]).not.toBe(titulos[1]);
    });

    it('cada persona lo recibe a las 8:00 de su zona', async () => {
      const { avisos, enviador, revision } = armar();

      avisos.recordatorios(ANA, 480, null, 'America/Bogota');
      avisos.recordatorios(BETO, 480, null, 'Europe/Madrid');

      await revision.revisar(new Date('2026-10-05T06:00:00.000Z'));
      expect(enviador.para(BETO)).toHaveLength(1);
      expect(enviador.para(ANA)).toHaveLength(0);

      await revision.revisar(OCHO);
      expect(enviador.para(ANA)).toHaveLength(1);
      expect(enviador.para(BETO)).toHaveLength(1);
    });

    it('quien lo tiene apagado no recibe nada', async () => {
      const { avisos, enviador, revision } = armar();

      avisos.recordatorios(ANA, null, 1200);
      await revision.revisar(OCHO);

      expect(enviador.entregados).toEqual([]);
    });
  });

  describe('el recordatorio de la noche, a las 20:00 (SCRUM-126)', () => {
    it('sale a las 20:00 a quien hoy no hizo ninguna actividad', async () => {
      const { avisos, enviador, revision } = armar();

      avisos.recordatorios(ANA, null, 1200);

      expect(await revision.revisar(new Date(VEINTE.getTime() - 60_000))).toMatchObject({
        personas: 0,
        entregados: 0,
      });
      expect(await revision.revisar(VEINTE)).toMatchObject({ personas: 1, entregados: 1 });
      expect(enviador.para(ANA)).toEqual([
        expect.objectContaining({ tipo: 'noche', ruta: '/panel' }),
      ]);
    });

    it('quien ya hizo una actividad hoy no recibe nada', async () => {
      const { avisos, enviador, revision } = armar({ conActividadHoy: [ANA] });

      avisos.recordatorios(ANA, null, 1200);
      await revision.revisar(VEINTE);

      expect(enviador.entregados).toEqual([]);
    });

    it('con la actividad hecha igual se marca revisado: no se reintenta cada minuto', async () => {
      const { avisos, revision } = armar({ conActividadHoy: [ANA] });

      avisos.recordatorios(ANA, null, 1200);
      await revision.revisar(VEINTE);

      expect(avisos.revisados.get(`${ANA}:noche`)).toBe('2026-10-05');
    });

    it('sale una sola vez al dia', async () => {
      const { avisos, enviador, revision } = armar();

      avisos.recordatorios(ANA, null, 1200);

      await revision.revisar(VEINTE);
      await revision.revisar(new Date(VEINTE.getTime() + 60_000));
      await revision.revisar(new Date(VEINTE.getTime() + 25 * 60_000));

      expect(enviador.para(ANA)).toHaveLength(1);
    });

    it('a las 20:00 de cada zona', async () => {
      const { avisos, enviador, revision } = armar();

      avisos.recordatorios(ANA, null, 1200, 'America/Bogota');
      avisos.recordatorios(BETO, null, 1200, 'Asia/Tokyo');

      // 20:00 en Tokio son las 11:00 UTC del 5; en Bogota todavia son las 6:00.
      await revision.revisar(new Date('2026-10-05T11:00:00.000Z'));
      expect(enviador.para(BETO)).toHaveLength(1);
      expect(enviador.para(ANA)).toHaveLength(0);

      await revision.revisar(VEINTE);
      expect(enviador.para(ANA)).toHaveLength(1);
    });
  });

  it('la manana y la noche de la misma persona salen cada una a su hora', async () => {
    const { avisos, enviador, revision } = armar();

    avisos.recordatorios(ANA, 480, 1200);

    await revision.revisar(OCHO);
    await revision.revisar(VEINTE);

    expect(enviador.para(ANA).map((mensaje) => mensaje.tipo)).toEqual(['manana', 'noche']);
  });

  it('apagar un aviso no apaga el otro', async () => {
    const { avisos, enviador, revision } = armar();

    avisos.elegir(ANA, null, 480);
    await revision.revisar(OCHO);

    expect(enviador.para(ANA).map((mensaje) => mensaje.tipo)).toEqual(['racha']);
  });

  it('un navegador que ya no existe se suelta', async () => {
    const { avisos, enviador, revision } = armar();

    avisos.elegir(ANA, 480, null);
    enviador.caducadas.add(`https://push.example.com/${ANA}`);

    expect(await revision.revisar(OCHO)).toMatchObject({ entregados: 0, caducadas: 1, fallos: 0 });
    expect(await avisos.suscripcionesDe(new UserId(ANA))).toEqual([]);
  });

  it('lo que falla con una persona no detiene a las demas', async () => {
    const { avisos, enviador, revision, fallos } = armar({
      conPendientes: { [ANA]: ['uno'], [BETO]: ['otro'] },
    });

    avisos.elegir(ANA, 480, null);
    avisos.elegir(BETO, 480, null);
    enviador.fallan.add(`https://push.example.com/${ANA}`);

    await revision.revisar(OCHO);

    expect(enviador.para(BETO)).toHaveLength(1);
    expect(fallos).toHaveLength(1);
  });

  it('sin claves VAPID no hace nada', async () => {
    const { avisos, enviador, revision } = armar();

    avisos.elegir(ANA, 480, 480);
    enviador.clavePublica = null;

    expect(await revision.revisar(OCHO)).toEqual({
      personas: 0,
      entregados: 0,
      caducadas: 0,
      fallos: 0,
    });
    expect(avisos.revisados.size).toBe(0);
  });
});

describe('la revision con varias personas a la vez (SCRUM-160)', () => {
  /** Un identificador de prueba por numero. */
  const persona = (numero: number) => `55555555-5555-4555-8555-${String(numero).padStart(12, '0')}`;

  function muchas(cuantas: number) {
    const gente = Array.from({ length: cuantas }, (_, indice) => persona(indice + 1));

    return {
      gente,
      conPendientes: Object.fromEntries(gente.map((una) => [una, ['Algo pendiente']])),
    };
  }

  it('si otra revision ya reclamo el aviso, esta no manda nada ni lo cuenta', async () => {
    const { avisos, enviador, revision, fallos } = armar();

    avisos.elegir(ANA, 480, null);
    // Otra instancia se adelanto: `aQuienLeToca` todavia la devuelve, pero el reclamo ya no.
    avisos.yaReclamados.add(`${ANA}:semaforo`);

    expect(await revision.revisar(OCHO)).toEqual({
      personas: 0,
      entregados: 0,
      caducadas: 0,
      fallos: 0,
    });
    expect(enviador.entregados).toEqual([]);
    expect(fallos).toEqual([]);
  });

  it('dos revisiones a la vez mandan cada aviso una sola vez', async () => {
    const { gente, conPendientes } = muchas(20);
    const { avisos, enviador, montar } = armar({ conPendientes });

    for (const una of gente) {
      avisos.elegir(una, 480, null);
    }

    // Dos instancias del API con los mismos datos, como durante un despliegue.
    const [uno, otro] = await Promise.all([montar().revisar(OCHO), montar().revisar(OCHO)]);

    expect(enviador.entregados).toHaveLength(20);
    expect(new Set(enviador.entregados.map((entrega) => entrega.endpoint)).size).toBe(20);
    // Entre las dos atendieron a cada persona exactamente una vez.
    expect(uno.personas + otro.personas).toBe(20);
    expect(uno.entregados + otro.entregados).toBe(20);
  });

  it('atiende a varias personas a la vez, pero nunca mas que el tope', async () => {
    const { gente, conPendientes } = muchas(24);
    const enviador = new EnviadorLento();
    const { avisos, revision } = armar({ conPendientes, enviador, personasALaVez: 3 });

    for (const una of gente) {
      avisos.elegir(una, 480, null);
    }

    const resumen = await revision.revisar(OCHO);

    expect(resumen).toMatchObject({ personas: 24, entregados: 24, fallos: 0 });
    // Con una navegador por persona, los envios a la vez son las personas a la vez.
    expect(enviador.maximoEnVuelo).toBe(3);
    expect(enviador.enVuelo).toBe(0);
  });

  it('con el tope de fabrica no pasa de PERSONAS_A_LA_VEZ', async () => {
    const { gente, conPendientes } = muchas(30);
    const enviador = new EnviadorLento();
    const { avisos, revision } = armar({ conPendientes, enviador });

    for (const una of gente) {
      avisos.elegir(una, 480, null);
    }

    await revision.revisar(OCHO);

    expect(enviador.maximoEnVuelo).toBe(PERSONAS_A_LA_VEZ);
  });

  it('los navegadores de una misma persona se avisan a la vez, no uno tras otro', async () => {
    const enviador = new EnviadorLento();
    const { avisos, revision } = armar({ enviador, personasALaVez: 1 });

    avisos.elegir(ANA, 480, null);
    avisos.suscripciones.set(
      ANA,
      Array.from({ length: 5 }, (_, indice) => ({
        endpoint: `https://push.example.com/${indice}/${ANA}`,
        p256dh: 'p',
        auth: 'a',
      })),
    );

    const resumen = await revision.revisar(OCHO);

    expect(resumen).toMatchObject({ personas: 1, entregados: 5 });
    expect(enviador.maximoEnVuelo).toBe(5);
  });

  it('cuenta los fallos sin detener a nadie', async () => {
    const { avisos, enviador, revision, fallos } = armar({
      conPendientes: { [ANA]: ['uno'], [BETO]: ['otro'] },
    });

    avisos.elegir(ANA, 480, null);
    avisos.elegir(BETO, 480, null);
    avisos.elegir('66666666-6666-4666-8666-666666666666', 480, null, 'Marte/Olympus');
    enviador.fallan.add(`https://push.example.com/${ANA}`);

    const resumen = await revision.revisar(OCHO);

    // Ana fallo, la zona de Marte fallo, y Beto recibio el suyo.
    expect(resumen).toMatchObject({ personas: 2, entregados: 1, fallos: 2 });
    expect(fallos).toHaveLength(2);
    expect(enviador.para(BETO)).toHaveLength(1);
  });

  it('con mas personas que el tope, todas reciben su aviso', async () => {
    const { gente, conPendientes } = muchas(50);
    const { avisos, enviador, revision } = armar({ conPendientes, personasALaVez: 4 });

    for (const una of gente) {
      avisos.elegir(una, 480, null);
    }

    await revision.revisar(OCHO);

    expect(new Set(enviador.entregados.map((entrega) => entrega.endpoint))).toEqual(
      new Set(gente.map((una) => `https://push.example.com/${una}`)),
    );
  });
});
