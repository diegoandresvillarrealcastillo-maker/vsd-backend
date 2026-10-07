import { describe, expect, it } from 'vitest';
import {
  InvalidIdentifierError,
  InvalidTaskError,
  StaleTaskError,
  TaskNotFoundError,
} from '../../domain/model/DomainError.js';
import type { ClientOperationId, PendienteId, UserId } from '../../domain/model/Identifier.js';
import { PendienteId as IdDePendiente } from '../../domain/model/Identifier.js';
import type { Pendiente } from '../../domain/model/Pendiente.js';
import type { PendientesRepositoryPort } from '../../domain/ports/out/PendientesRepositoryPort.js';
import { PendientesUseCaseImpl } from './PendientesUseCaseImpl.js';

const ZONA = 'America/Bogota';
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

  /**
   * Lo que pasa justo antes de la proxima escritura: otro dispositivo cambia el
   * pendiente entre que el caso de uso lo leyo y lo escribe. Cada funcion se usa
   * una sola vez, en orden.
   */
  private readonly alEscribir: (() => void)[] = [];

  antesDeLaProximaEscritura(cambio: () => void): void {
    this.alEscribir.push(cambio);
  }

  /** Como la base: solo escribe si la version sigue siendo la que se leyo. */
  actualizar(pendiente: Pendiente, versionAnterior: number) {
    this.alEscribir.shift()?.();

    const posicion = this.todos.findIndex(
      (uno) => uno.id.equals(pendiente.id) && uno.version === versionAnterior,
    );

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

    const { pendientes } = await semaforo.consultar(PERSONA, ZONA);

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

    expect((await semaforo.consultar(PERSONA, ZONA)).pendientes).toHaveLength(0);
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
    expect((await semaforo.consultar(PERSONA, ZONA)).recordatorio?.nivel).toBe('urgente');

    await semaforo.editar({
      userId: PERSONA,
      pendienteId: pendiente.id.value,
      posponerHasta: new Date(reloj.ahora.getTime() + 7 * UN_DIA),
    });

    reloj.ahora = new Date(INICIO.getTime() + 12 * UN_DIA);
    expect((await semaforo.consultar(PERSONA, ZONA)).recordatorio).toBeNull();

    reloj.ahora = new Date(INICIO.getTime() + 15 * UN_DIA);
    expect((await semaforo.consultar(PERSONA, ZONA)).recordatorio).not.toBeNull();
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

    const { pendientes, recordatorio } = await semaforo.consultar(PERSONA, ZONA);

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
    // Borrar es idempotente (SCRUM-133): el de otra persona responde como uno
    // que ya no esta, y, lo que importa, no se toca.
    await expect(semaforo.borrar(OTRA, suyo.id.value)).resolves.toBeUndefined();
    expect((await semaforo.consultar(PERSONA, ZONA)).pendientes).toHaveLength(1);
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

    expect((await semaforo.consultar(PERSONA, ZONA)).pendientes).toHaveLength(0);
  });

  it('borrar dos veces el mismo no falla: la segunda es la respuesta perdida que se reintenta', async () => {
    const { semaforo } = armar();
    const pendiente = await semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto: 'Fuera dos veces',
      nivel: 'urgente',
    });

    await semaforo.borrar(PERSONA, pendiente.id.value);

    await expect(semaforo.borrar(PERSONA, pendiente.id.value)).resolves.toBeUndefined();
    expect((await semaforo.consultar(PERSONA, ZONA)).pendientes).toHaveLength(0);
  });

  it('borrar uno que nunca existio tampoco falla', async () => {
    const { semaforo } = armar();

    await expect(
      semaforo.borrar(PERSONA, '97979797-ffff-4fff-8fff-ffffffffffff'),
    ).resolves.toBeUndefined();
  });

  it('un identificador mal formado se rechaza', async () => {
    const { semaforo } = armar();

    await expect(semaforo.borrar(PERSONA, 'no-es-un-uuid')).rejects.toThrow(InvalidIdentifierError);
  });
});

describe('La fecha limite en el semaforo (SCRUM-119)', () => {
  it('se anota con fecha limite, y sin ella como siempre', async () => {
    const { semaforo } = armar();

    const con = await semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto: 'Entregar el informe',
      nivel: 'prioridad',
      fechaLimite: '2026-10-12',
    });
    const sin = await semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto: 'Algo general',
      nivel: 'aplazable',
    });

    expect(con.fechaLimite).toBe('2026-10-12');
    expect(sin.fechaLimite).toBeUndefined();
  });

  it('una fecha que no es un dia real impide anotarlo', async () => {
    const { semaforo, repositorio } = armar();

    await expect(
      semaforo.crear({
        userId: PERSONA,
        clientOperationId: operacion(),
        texto: 'Entregar el informe',
        nivel: 'prioridad',
        fechaLimite: '2026-02-30',
      }),
    ).rejects.toThrow(/fecha límite/);
    expect(repositorio.todos).toHaveLength(0);
  });

  it('el recordatorio llega el dia limite, contado en la zona de la persona', async () => {
    const { semaforo, reloj } = armar();
    // 9 p. m. del 1 de octubre en Bogota; en Madrid ya es el 2.
    reloj.ahora = new Date('2026-10-02T02:00:00.000Z');

    await semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto: 'Pagar la matricula',
      nivel: 'aplazable',
      fechaLimite: '2026-10-02',
    });

    expect((await semaforo.consultar(PERSONA, 'America/Bogota')).recordatorio).toBeNull();
    expect((await semaforo.consultar(PERSONA, 'Europe/Madrid')).recordatorio).toMatchObject({
      fechaLimite: '2026-10-02',
      tono: 'plazo',
    });
  });

  it('se puede poner, cambiar y quitar la fecha de uno que ya existe', async () => {
    const { semaforo } = armar();
    const creado = await semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto: 'Algo',
      nivel: 'urgente',
    });

    const con = await semaforo.editar({
      userId: PERSONA,
      pendienteId: creado.id.value,
      fechaLimite: '2026-10-12',
    });
    const sin = await semaforo.editar({
      userId: PERSONA,
      pendienteId: creado.id.value,
      fechaLimite: null,
    });

    expect(con.fechaLimite).toBe('2026-10-12');
    expect(sin.fechaLimite).toBeUndefined();
  });
});

describe('Editar con version (SCRUM-134)', () => {
  /** Un pendiente de PERSONA, ya guardado, en la version 1. */
  async function uno(texto = 'Llamar a la EPS') {
    const base = armar();
    const creado = await base.semaforo.crear({
      userId: PERSONA,
      clientOperationId: operacion(),
      texto,
      nivel: 'urgente',
    });

    return { ...base, creado };
  }

  /** Lo que hace otro dispositivo: cambia el pendiente directamente en el almacen. */
  function otroDispositivo(
    repositorio: PendientesDePrueba,
    id: PendienteId,
    cambios: Parameters<Pendiente['editar']>[0],
  ): void {
    const posicion = repositorio.todos.findIndex((p) => p.id.equals(id));
    const actual = repositorio.todos[posicion];

    if (actual === undefined) {
      throw new Error('el pendiente de la prueba no esta');
    }

    repositorio.todos[posicion] = actual.editar(cambios, INICIO);
  }

  it('con la version vigente se aplica y la sube', async () => {
    const { semaforo, creado } = await uno();

    const editado = await semaforo.editar({
      userId: PERSONA,
      pendienteId: creado.id.value,
      texto: 'Llamar a la EPS hoy',
      version: 1,
    });

    expect(editado).toMatchObject({ texto: 'Llamar a la EPS hoy', version: 2 });
  });

  it('con una version vieja y otro cambio es un conflicto, y no toca nada', async () => {
    const { semaforo, repositorio, creado } = await uno();

    otroDispositivo(repositorio, creado.id, { texto: 'Lo cambio el otro' });

    await expect(
      semaforo.editar({
        userId: PERSONA,
        pendienteId: creado.id.value,
        nivel: 'aplazable',
        version: 1,
      }),
    ).rejects.toThrow(StaleTaskError);

    const guardado = repositorio.todos.find((p) => p.id.equals(creado.id));

    expect(guardado).toMatchObject({ texto: 'Lo cambio el otro', nivel: 'urgente', version: 2 });
  });

  it('marcarlo como hecho con una version vieja se aplica sobre lo vigente', async () => {
    const { semaforo, repositorio, creado } = await uno();

    otroDispositivo(repositorio, creado.id, { texto: 'Lo cambio el otro' });

    const editado = await semaforo.editar({
      userId: PERSONA,
      pendienteId: creado.id.value,
      hecho: true,
      version: 1,
    });

    // Hecho Y con el texto del otro dispositivo: no se perdio ninguna de las dos.
    expect(editado).toMatchObject({ hecho: true, texto: 'Lo cambio el otro', version: 3 });
  });

  it('reabrirlo con una version vieja es un conflicto: depende de lo que se vio', async () => {
    const { semaforo, repositorio, creado } = await uno();

    otroDispositivo(repositorio, creado.id, { hecho: true });

    await expect(
      semaforo.editar({
        userId: PERSONA,
        pendienteId: creado.id.value,
        hecho: false,
        version: 1,
      }),
    ).rejects.toThrow(StaleTaskError);
  });

  it('marcarlo como hecho y cambiar otra cosa con una version vieja tambien es un conflicto', async () => {
    const { semaforo, repositorio, creado } = await uno();

    otroDispositivo(repositorio, creado.id, { texto: 'Lo cambio el otro' });

    await expect(
      semaforo.editar({
        userId: PERSONA,
        pendienteId: creado.id.value,
        hecho: true,
        nivel: 'prioridad',
        version: 1,
      }),
    ).rejects.toThrow(StaleTaskError);
  });

  it('un reintento cuya respuesta se perdio no choca consigo mismo', async () => {
    const { semaforo, creado } = await uno();
    const edicion = {
      userId: PERSONA,
      pendienteId: creado.id.value,
      texto: 'Llamar hoy',
      nivel: 'prioridad',
      version: 1,
    };

    const primera = await semaforo.editar(edicion);
    // El dispositivo no se entero y reenvia la misma edicion con la version de antes.
    const reintento = await semaforo.editar(edicion);

    expect(primera.version).toBe(2);
    expect(reintento.version).toBe(2);
    expect(reintento).toMatchObject({ texto: 'Llamar hoy', nivel: 'prioridad' });
  });

  it('un reintento tampoco sube la version ni cambia la hora de edicion', async () => {
    const { semaforo, reloj, creado } = await uno();
    const edicion = { userId: PERSONA, pendienteId: creado.id.value, texto: 'Hoy', version: 1 };

    const primera = await semaforo.editar(edicion);

    reloj.ahora = new Date(INICIO.getTime() + UN_DIA);

    const reintento = await semaforo.editar(edicion);

    expect(reintento.editadoEn).toEqual(primera.editadoEn);
  });

  it('dos dispositivos que piden lo mismo coinciden sin conflicto', async () => {
    const { semaforo, repositorio, creado } = await uno();

    otroDispositivo(repositorio, creado.id, { nivel: 'aplazable' });

    const editado = await semaforo.editar({
      userId: PERSONA,
      pendienteId: creado.id.value,
      nivel: 'aplazable',
      version: 1,
    });

    expect(editado).toMatchObject({ nivel: 'aplazable', version: 2 });
  });

  it('sin version no se comprueba nada, como antes de este cambio', async () => {
    const { semaforo, repositorio, creado } = await uno();

    otroDispositivo(repositorio, creado.id, { texto: 'Lo cambio el otro' });

    const editado = await semaforo.editar({
      userId: PERSONA,
      pendienteId: creado.id.value,
      nivel: 'aplazable',
    });

    expect(editado).toMatchObject({ texto: 'Lo cambio el otro', nivel: 'aplazable', version: 3 });
  });

  it('con la version vigente, una escritura que se cuela entre leer y escribir es un conflicto', async () => {
    const { semaforo, repositorio, creado } = await uno();

    repositorio.antesDeLaProximaEscritura(() =>
      otroDispositivo(repositorio, creado.id, { texto: 'Se colo' }),
    );

    await expect(
      semaforo.editar({
        userId: PERSONA,
        pendienteId: creado.id.value,
        nivel: 'aplazable',
        version: 1,
      }),
    ).rejects.toThrow(StaleTaskError);

    // Lo que se colo se conserva, y lo que se pedia no se aplico.
    expect(repositorio.todos.find((p) => p.id.equals(creado.id))).toMatchObject({
      texto: 'Se colo',
      nivel: 'urgente',
    });
  });

  it('marcarlo como hecho se reintenta si algo se cuela, y no pierde lo que se colo', async () => {
    const { semaforo, repositorio, creado } = await uno();

    repositorio.antesDeLaProximaEscritura(() =>
      otroDispositivo(repositorio, creado.id, { texto: 'Se colo' }),
    );

    const editado = await semaforo.editar({
      userId: PERSONA,
      pendienteId: creado.id.value,
      hecho: true,
      version: 1,
    });

    expect(editado).toMatchObject({ hecho: true, texto: 'Se colo', version: 3 });
  });

  it('sin version tambien se reintenta si algo se cuela', async () => {
    const { semaforo, repositorio, creado } = await uno();

    repositorio.antesDeLaProximaEscritura(() =>
      otroDispositivo(repositorio, creado.id, { texto: 'Se colo' }),
    );

    const editado = await semaforo.editar({
      userId: PERSONA,
      pendienteId: creado.id.value,
      nivel: 'aplazable',
    });

    expect(editado).toMatchObject({ texto: 'Se colo', nivel: 'aplazable' });
  });

  it('el reintento tiene un limite: tres escrituras que se cuelan seguidas es un conflicto', async () => {
    const { semaforo, repositorio, creado } = await uno();

    for (let vez = 0; vez < 3; vez += 1) {
      repositorio.antesDeLaProximaEscritura(() =>
        otroDispositivo(repositorio, creado.id, { texto: `Se colo ${vez}` }),
      );
    }

    await expect(
      semaforo.editar({
        userId: PERSONA,
        pendienteId: creado.id.value,
        hecho: true,
        version: 1,
      }),
    ).rejects.toThrow(StaleTaskError);
  });

  it('con dos intentos que se cuelan, el tercero todavia gana', async () => {
    const { semaforo, repositorio, creado } = await uno();

    for (let vez = 0; vez < 2; vez += 1) {
      repositorio.antesDeLaProximaEscritura(() =>
        otroDispositivo(repositorio, creado.id, { texto: `Se colo ${vez}` }),
      );
    }

    const editado = await semaforo.editar({
      userId: PERSONA,
      pendienteId: creado.id.value,
      hecho: true,
      version: 1,
    });

    expect(editado).toMatchObject({ hecho: true, texto: 'Se colo 1' });
  });

  it('si lo borran entre leer y escribir, no existe (no es un conflicto)', async () => {
    const { semaforo, repositorio, creado } = await uno();

    repositorio.antesDeLaProximaEscritura(() => {
      repositorio.todos = [];
    });

    await expect(
      semaforo.editar({
        userId: PERSONA,
        pendienteId: creado.id.value,
        nivel: 'aplazable',
        version: 1,
      }),
    ).rejects.toThrow(TaskNotFoundError);
  });

  it('marcarlo como hecho tras borrarlo tambien dice que no existe', async () => {
    const { semaforo, repositorio, creado } = await uno();

    repositorio.antesDeLaProximaEscritura(() => {
      repositorio.todos = [];
    });

    await expect(
      semaforo.editar({
        userId: PERSONA,
        pendienteId: creado.id.value,
        hecho: true,
        version: 1,
      }),
    ).rejects.toThrow(TaskNotFoundError);
  });

  it('el pendiente de otra persona no se alcanza, ni acertando la version', async () => {
    const { semaforo, repositorio, creado } = await uno();

    await expect(
      semaforo.editar({
        userId: OTRA,
        pendienteId: creado.id.value,
        hecho: true,
        version: 1,
      }),
    ).rejects.toThrow(TaskNotFoundError);
    expect(repositorio.todos.find((p) => p.id.equals(creado.id))?.hecho).toBe(false);
  });

  it('una edicion vacia sigue siendo un error aunque traiga la version vigente', async () => {
    const { semaforo, creado } = await uno();

    await expect(
      semaforo.editar({ userId: PERSONA, pendienteId: creado.id.value, version: 1 }),
    ).rejects.toThrow(InvalidTaskError);
  });
});
