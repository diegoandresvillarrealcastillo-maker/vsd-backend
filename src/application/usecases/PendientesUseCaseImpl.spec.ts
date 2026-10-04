import { describe, expect, it } from 'vitest';
import { InvalidIdentifierError, TaskNotFoundError } from '../../domain/model/DomainError.js';
import type { ClientOperationId, PendienteId, UserId } from '../../domain/model/Identifier.js';
import { PendienteId as IdDePendiente } from '../../domain/model/Identifier.js';
import type { Pendiente } from '../../domain/model/Pendiente.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';
import { PendientesUseCaseImpl } from './PendientesUseCaseImpl.js';

const PERSONA = '11111111-1111-4111-8111-111111111111';
const OTRA = '22222222-2222-4222-9222-222222222222';
const INICIO = new Date('2026-10-01T15:00:00.000Z');
const UN_DIA = 24 * 60 * 60 * 1000;

/** Un semaforo de prueba sobre el puerto: guarda, busca y filtra los hechos. */
class PendientesDePrueba implements PendientesRepositoryPort {
  todos: Pendiente[] = [];

  vigentesDe(userId: UserId, hechosDesde: Date) {
    return Promise.resolve(
      this.de(userId).filter(
        (uno) => !uno.hecho || uno.editadoEn.getTime() >= hechosDesde.getTime(),
      ),
    );
  }

  todosDe(userId: UserId) {
    return Promise.resolve(this.de(userId));
  }

  porId(userId: UserId, id: PendienteId) {
    return Promise.resolve(this.de(userId).find((uno) => uno.id.equals(id)) ?? null);
  }

  porOperacion(userId: UserId, operacion: ClientOperationId) {
    return Promise.resolve(
      this.de(userId).find((uno) => uno.clientOperationId.equals(operacion)) ?? null,
    );
  }

  guardarNuevo(pendiente: Pendiente) {
    this.todos.push(pendiente);

    return Promise.resolve(pendiente);
  }

  actualizar(pendiente: Pendiente) {
    const posicion = this.todos.findIndex((uno) => uno.id.equals(pendiente.id));

    if (posicion === -1) {
      return Promise.resolve(null);
    }

    this.todos[posicion] = pendiente;

    return Promise.resolve(pendiente);
  }

  borrar(userId: UserId, id: PendienteId) {
    const antes = this.todos.length;

    this.todos = this.todos.filter((uno) => !(uno.id.equals(id) && uno.perteneceA(userId)));

    return Promise.resolve(this.todos.length < antes);
  }

  private de(userId: UserId) {
    return this.todos.filter((uno) => uno.perteneceA(userId));
  }
}

function armar() {
  const reloj = { ahora: INICIO };
  const repositorio = new PendientesDePrueba();
  let ids = 0;
  const semaforo = new PendientesUseCaseImpl(
    repositorio,
    () => {
      ids += 1;

      return new IdDePendiente('55555555-5555-4555-a555-' + String(ids).padStart(12, '0'));
    },
    () => reloj.ahora,
  );

  return { reloj, repositorio, semaforo };
}

let operaciones = 0;
function operacion(): string {
  operaciones += 1;

  return '66666666-6666-4666-a666-' + String(operaciones).padStart(12, '0');
}

describe('PendientesUseCaseImpl', () => {
  it('ordena por color y antiguedad, y deja los hechos al final', async () => {
    const { semaforo, reloj } = armar();

    await semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto: 'A',
      nivel: 'aplazable',
    });
    reloj.ahora = new Date(INICIO.getTime() + 1000);
    const hecho = await semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto: 'H',
      nivel: 'urgente',
    });
    await semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto: 'U',
      nivel: 'urgente',
    });
    await semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto: 'P',
      nivel: 'prioridad',
    });
    await semaforo.editar({ userId: PERSONA, pendienteId: hecho.id.value, hecho: true });

    const { pendientes } = await semaforo.consultar(PERSONA);

    expect(pendientes.map((uno) => uno.texto)).toEqual(['U', 'P', 'A', 'H']);
  });

  it('los hechos se dejan de ver a los siete dias', async () => {
    const { semaforo, reloj } = armar();
    const pendiente = await semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto: 'Tachado',
      nivel: 'urgente',
    });

    await semaforo.editar({ userId: PERSONA, pendienteId: pendiente.id.value, hecho: true });
    reloj.ahora = new Date(INICIO.getTime() + 8 * UN_DIA);

    expect((await semaforo.consultar(PERSONA)).pendientes).toHaveLength(0);
  });

  it('el mismo clientOperationId no duplica', async () => {
    const { semaforo, repositorio } = armar();
    const op = operacion();

    const uno = await semaforo.crear({
      userId: PERSONA,
      clientOperationId: op,
      texto: 'X',
      nivel: 'urgente',
    });
    const otro = await semaforo.crear({
      userId: PERSONA,
      clientOperationId: op,
      texto: 'X',
      nivel: 'urgente',
    });

    expect(otro.id.equals(uno.id)).toBe(true);
    expect(repositorio.todos).toHaveLength(1);
  });

  it('posponer una semana oculta el recordatorio esa semana', async () => {
    // El criterio de la tarea, de punta a punta por el caso de uso.
    const { semaforo, reloj } = armar();
    const pendiente = await semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto: 'Pedir la cita',
      nivel: 'urgente',
    });

    reloj.ahora = new Date(INICIO.getTime() + 8 * UN_DIA);
    expect((await semaforo.consultar(PERSONA)).recordatorio?.nivel).toBe('urgente');

    await semaforo.editar({
      userId: PERSONA,
      pendienteId: pendiente.id.value,
      posponerHasta: new Date(reloj.ahora.getTime() + 7 * UN_DIA),
    });

    reloj.ahora = new Date(INICIO.getTime() + 12 * UN_DIA);
    expect((await semaforo.consultar(PERSONA)).recordatorio).toBeNull();

    reloj.ahora = new Date(INICIO.getTime() + 15 * UN_DIA);
    expect((await semaforo.consultar(PERSONA)).recordatorio).not.toBeNull();
  });

  it('el recordatorio sugiere subir de nivel sin subirlo', async () => {
    const { semaforo, reloj } = armar();

    await semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto: 'Leer',
      nivel: 'aplazable',
    });
    reloj.ahora = new Date(INICIO.getTime() + 31 * UN_DIA);

    const { pendientes, recordatorio } = await semaforo.consultar(PERSONA);

    expect(recordatorio?.nivelSugerido).toBe('prioridad');
    expect(recordatorio?.tono).toBe('suave');
    expect(pendientes[0]?.nivel).toBe('aplazable');
  });

  it('el pendiente de otra persona responde igual que uno que no existe', async () => {
    const { semaforo } = armar();
    const suyo = await semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto: 'Mio',
      nivel: 'urgente',
    });

    await expect(
      semaforo.editar({ userId: OTRA, pendienteId: suyo.id.value, hecho: true }),
    ).rejects.toThrow(TaskNotFoundError);
    await expect(semaforo.borrar(OTRA, suyo.id.value)).rejects.toThrow(TaskNotFoundError);
    expect((await semaforo.consultar(PERSONA)).pendientes).toHaveLength(1);
  });

  it('borrar lo quita', async () => {
    const { semaforo } = armar();
    const pendiente = await semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto: 'Fuera',
      nivel: 'urgente',
    });

    await semaforo.borrar(PERSONA, pendiente.id.value);

    expect((await semaforo.consultar(PERSONA)).pendientes).toHaveLength(0);
  });

  it('un identificador mal formado se rechaza', async () => {
    const { semaforo } = armar();

    await expect(semaforo.borrar(PERSONA, 'no-es-un-uuid')).rejects.toThrow(InvalidIdentifierError);
  });
});
