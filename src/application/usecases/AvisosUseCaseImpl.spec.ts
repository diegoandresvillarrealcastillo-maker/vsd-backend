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
  suscripciones: SuscripcionPush[] = [];

  zonaHoraria = 'America/Bogota';

  preferenciasDe(userId: UserId) {
    return Promise.resolve({
      userId,
      minutoSemaforo: this.minutoSemaforo,
      minutoRacha: this.minutoRacha,
      zonaHoraria: this.zonaHoraria,
    });
  }

  guardarPreferencias(preferencias: PreferenciasDeAviso) {
    this.minutoSemaforo = preferencias.minutoSemaforo;
    this.minutoRacha = preferencias.minutoRacha;
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
  it('sin nada elegido, los dos avisos estan apagados', async () => {
    const avisos = new AvisosUseCaseImpl(new AvisosDePrueba(), enviador('clave-publica'));

    await expect(avisos.consultar(PERSONA)).resolves.toEqual({
      disponible: true,
      clavePublica: 'clave-publica',
      horaSemaforo: null,
      horaRacha: null,
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
