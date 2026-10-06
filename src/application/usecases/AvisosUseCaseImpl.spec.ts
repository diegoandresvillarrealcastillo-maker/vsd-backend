import { describe, expect, it } from 'vitest';
import type {
  PreferenciasDeAviso,
  SuscripcionPush,
  TipoDeAviso,
} from '../../domain/model/Aviso.js';
import type { Dia } from '../../domain/model/Calendario.js';
import { InvalidNotificationSettingError } from '../../domain/model/DomainError.js';
import type { UserId } from '../../domain/model/Identifier.js';
import type { AvisosRepositoryPort } from '../../domain/ports/out/AvisosRepositoryPort.js';
import type { EnviadorDePushPort } from '../../domain/ports/out/EnviadorDePushPort.js';
import { AvisosUseCaseImpl } from './AvisosUseCaseImpl.js';

const ZONA = 'America/Bogota';
const PERSONA = '11111111-1111-4111-8111-111111111111';

/** Lo minimo del puerto para estas pruebas: horas y suscripciones. */
class AvisosDePrueba implements AvisosRepositoryPort {
  minutoSemaforo: number | null = null;
  minutoRacha: number | null = null;
  minutoManana: number | null = null;
  minutoNoche: number | null = null;
  suscripciones: SuscripcionPush[] = [];

  zonaHoraria = 'America/Bogota';

  preferenciasDe(userId: UserId) {
    return Promise.resolve({
      userId,
      minutoSemaforo: this.minutoSemaforo,
      minutoRacha: this.minutoRacha,
      minutoManana: this.minutoManana,
      minutoNoche: this.minutoNoche,
      zonaHoraria: this.zonaHoraria,
    });
  }

  guardarPreferencias(preferencias: PreferenciasDeAviso) {
    this.minutoSemaforo = preferencias.minutoSemaforo;
    this.minutoRacha = preferencias.minutoRacha;
    this.minutoManana = preferencias.minutoManana;
    this.minutoNoche = preferencias.minutoNoche;
    this.zonaHoraria = preferencias.zonaHoraria;

    return Promise.resolve(preferencias);
  }

  suscribir(_userId: UserId, suscripcion: SuscripcionPush) {
    this.suscripciones.push(suscripcion);

    return Promise.resolve();
  }

  desuscribir(_userId: UserId, endpoint: string) {
    this.suscripciones = this.suscripciones.filter((una) => una.endpoint !== endpoint);

    return Promise.resolve();
  }

  suscripcionesDe() {
    return Promise.resolve(this.suscripciones);
  }

  zonasEnUso() {
    return Promise.resolve([]);
  }

  aQuienLeToca(_tipo: TipoDeAviso, _zona: string, _desde: number, _hasta: number, _dia: Dia) {
    return Promise.resolve([]);
  }

  marcarRevisado() {
    return Promise.resolve();
  }
}

function enviador(clavePublica: string | null): EnviadorDePushPort {
  return { clavePublica, enviar: () => Promise.resolve('entregado') };
}

describe('AvisosUseCaseImpl', () => {
  it('sin nada elegido, todos los avisos estan apagados', async () => {
    const avisos = new AvisosUseCaseImpl(new AvisosDePrueba(), enviador('clave-publica'));

    await expect(avisos.consultar(PERSONA)).resolves.toEqual({
      disponible: true,
      clavePublica: 'clave-publica',
      horaSemaforo: null,
      horaRacha: null,
      recordatorioManana: false,
      recordatorioNoche: false,
    });
  });

  it('sin claves VAPID no estan disponibles, y se puede elegir la hora igual', async () => {
    const avisos = new AvisosUseCaseImpl(new AvisosDePrueba(), enviador(null));

    await expect(
      avisos.cambiarHoras({ userId: PERSONA, zonaHoraria: ZONA, horaSemaforo: '08:00' }),
    ).resolves.toMatchObject({ disponible: false, clavePublica: null, horaSemaforo: '08:00' });
  });

  it('cambiar una hora no toca la otra, y null apaga solo esa', async () => {
    const repositorio = new AvisosDePrueba();
    const avisos = new AvisosUseCaseImpl(repositorio, enviador('clave'));

    await avisos.cambiarHoras({
      userId: PERSONA,
      zonaHoraria: ZONA,
      horaSemaforo: '08:00',
      horaRacha: '19:30',
    });

    expect(
      await avisos.cambiarHoras({ userId: PERSONA, zonaHoraria: ZONA, horaSemaforo: '09:15' }),
    ).toMatchObject({
      horaSemaforo: '09:15',
      horaRacha: '19:30',
    });
    expect(
      await avisos.cambiarHoras({ userId: PERSONA, zonaHoraria: ZONA, horaRacha: null }),
    ).toMatchObject({
      horaSemaforo: '09:15',
      horaRacha: null,
    });
    expect(repositorio.minutoSemaforo).toBe(555);
  });

  describe('los recordatorios de las 8:00 y las 20:00 (SCRUM-126)', () => {
    it('se encienden en su hora fija, cada uno por separado', async () => {
      const repositorio = new AvisosDePrueba();
      const avisos = new AvisosUseCaseImpl(repositorio, enviador('clave'));

      expect(
        await avisos.cambiarRecordatorios({ userId: PERSONA, zonaHoraria: ZONA, manana: true }),
      ).toMatchObject({ recordatorioManana: true, recordatorioNoche: false });
      expect(repositorio.minutoManana).toBe(480);
      expect(repositorio.minutoNoche).toBeNull();

      expect(
        await avisos.cambiarRecordatorios({ userId: PERSONA, zonaHoraria: ZONA, noche: true }),
      ).toMatchObject({ recordatorioManana: true, recordatorioNoche: true });
      expect(repositorio.minutoNoche).toBe(1200);
    });

    it('apagar uno no apaga el otro, y no pedir nada deja todo como estaba', async () => {
      const repositorio = new AvisosDePrueba();
      const avisos = new AvisosUseCaseImpl(repositorio, enviador('clave'));

      await avisos.cambiarRecordatorios({
        userId: PERSONA,
        zonaHoraria: ZONA,
        manana: true,
        noche: true,
      });

      expect(
        await avisos.cambiarRecordatorios({ userId: PERSONA, zonaHoraria: ZONA, manana: false }),
      ).toMatchObject({ recordatorioManana: false, recordatorioNoche: true });
      expect(
        await avisos.cambiarRecordatorios({ userId: PERSONA, zonaHoraria: ZONA }),
      ).toMatchObject({ recordatorioManana: false, recordatorioNoche: true });
    });

    it('cambiar las horas del semaforo o de la racha no los apaga', async () => {
      const repositorio = new AvisosDePrueba();
      const avisos = new AvisosUseCaseImpl(repositorio, enviador('clave'));

      await avisos.cambiarRecordatorios({
        userId: PERSONA,
        zonaHoraria: ZONA,
        manana: true,
        noche: true,
      });

      expect(
        await avisos.cambiarHoras({ userId: PERSONA, zonaHoraria: ZONA, horaSemaforo: '09:00' }),
      ).toMatchObject({ horaSemaforo: '09:00', recordatorioManana: true, recordatorioNoche: true });
    });

    it('y al reves: encenderlos no mueve las horas de los otros dos', async () => {
      const repositorio = new AvisosDePrueba();
      const avisos = new AvisosUseCaseImpl(repositorio, enviador('clave'));

      await avisos.cambiarHoras({
        userId: PERSONA,
        zonaHoraria: ZONA,
        horaSemaforo: '08:00',
        horaRacha: '19:30',
      });

      expect(
        await avisos.cambiarRecordatorios({ userId: PERSONA, zonaHoraria: ZONA, noche: true }),
      ).toMatchObject({ horaSemaforo: '08:00', horaRacha: '19:30', recordatorioNoche: true });
    });

    it('se leen en la zona de la cuenta, y la cuenta la lleva a las preferencias', async () => {
      const repositorio = new AvisosDePrueba();
      const avisos = new AvisosUseCaseImpl(repositorio, enviador('clave'));

      await avisos.cambiarRecordatorios({
        userId: PERSONA,
        zonaHoraria: 'Europe/Madrid',
        manana: true,
      });

      expect(repositorio.zonaHoraria).toBe('Europe/Madrid');
    });
  });

  it('una hora mal escrita no se guarda', async () => {
    const repositorio = new AvisosDePrueba();
    const avisos = new AvisosUseCaseImpl(repositorio, enviador('clave'));

    await expect(
      avisos.cambiarHoras({ userId: PERSONA, zonaHoraria: ZONA, horaSemaforo: '25:00' }),
    ).rejects.toThrow(InvalidNotificationSettingError);
    expect(repositorio.minutoSemaforo).toBeNull();
  });

  it('suscribe solo lo que parece un navegador', async () => {
    const repositorio = new AvisosDePrueba();
    const avisos = new AvisosUseCaseImpl(repositorio, enviador('clave'));

    await expect(
      avisos.suscribir(PERSONA, { endpoint: 'http://inseguro.test', p256dh: 'a', auth: 'b' }),
    ).rejects.toThrow(InvalidNotificationSettingError);

    await avisos.suscribir(PERSONA, {
      endpoint: 'https://push.example.com/abc',
      p256dh: 'clave-p256dh',
      auth: 'clave-auth',
    });
    await avisos.desuscribir(PERSONA, 'https://push.example.com/abc');

    expect(repositorio.suscripciones).toEqual([]);
  });
});
