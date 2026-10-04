import { describe, expect, it } from 'vitest';
import { InvalidTaskError } from './DomainError.js';
import { ClientOperationId, PendienteId, UserId } from './Identifier.js';
import { DIAS_PARA_RECORDAR, elegirRecordatorio, Pendiente } from './Pendiente.js';

const PERSONA = new UserId('11111111-1111-4111-8111-111111111111');
const ANOTADO = new Date('2026-10-01T15:00:00.000Z');
const UN_DIA = 24 * 60 * 60 * 1000;

let contador = 0;
function nuevo(nivel: string, texto = 'Pagar la matricula', ahora = ANOTADO): Pendiente {
  contador += 1;
  const sufijo = String(contador).padStart(12, '0');

  return Pendiente.nuevo(
    {
      id: new PendienteId('55555555-5555-4555-a555-' + sufijo),
      userId: PERSONA,
      clientOperationId: new ClientOperationId('66666666-6666-4666-a666-' + sufijo),
      texto,
      nivel,
    },
    ahora,
  );
}

function diasDespues(dias: number, desde = ANOTADO): Date {
  return new Date(desde.getTime() + dias * UN_DIA);
}

describe('Un pendiente nuevo', () => {
  it('empieza sin hacer y sin posponer, con el texto recortado', () => {
    const pendiente = nuevo('urgente', '  Llamar a la EPS  ');

    expect(pendiente.texto).toBe('Llamar a la EPS');
    expect(pendiente.hecho).toBe(false);
    expect(pendiente.posponerHasta).toBeUndefined();
  });

  it.each([
    ['vacio', '   '],
    ['de mas de 280 caracteres', 'a'.repeat(281)],
    ['de varias lineas', 'uno\ndos'],
  ])('rechaza un texto %s', (_caso, texto) => {
    expect(() => nuevo('urgente', texto)).toThrow(InvalidTaskError);
  });

  it('rechaza un nivel que no es del semaforo', () => {
    expect(() => nuevo('critico')).toThrow(/urgente, prioridad o aplazable/);
  });
});

describe('Editar', () => {
  it('cambia solo lo que viene', () => {
    const editado = nuevo('aplazable').editar({ nivel: 'prioridad' }, diasDespues(1));

    expect(editado.nivel).toBe('prioridad');
    expect(editado.texto).toBe('Pagar la matricula');
    expect(editado.editadoEn).toEqual(diasDespues(1));
  });

  it('sin nada que cambiar se rechaza', () => {
    expect(() => nuevo('urgente').editar({}, diasDespues(1))).toThrow(/nada que cambiar/);
  });

  it('solo se pospone hacia el futuro, y como mucho 90 dias', () => {
    const pendiente = nuevo('urgente');

    expect(() => pendiente.editar({ posponerHasta: ANOTADO }, ANOTADO)).toThrow(/futura/);
    expect(() => pendiente.editar({ posponerHasta: diasDespues(91) }, ANOTADO)).toThrow(/90/);
    expect(pendiente.editar({ posponerHasta: diasDespues(90) }, ANOTADO).posponerHasta).toEqual(
      diasDespues(90),
    );
  });

  it('posponerHasta null deja de posponer', () => {
    const pospuesto = nuevo('urgente').editar({ posponerHasta: diasDespues(7) }, ANOTADO);

    expect(pospuesto.editar({ posponerHasta: null }, ANOTADO).posponerHasta).toBeUndefined();
  });
});

describe('Los recordatorios', () => {
  it.each([
    ['urgente', 7],
    ['prioridad', 21],
    ['aplazable', 30],
  ] as const)('un %s recuerda a los %i dias, no antes', (nivel, dias) => {
    const pendiente = nuevo(nivel);

    expect(DIAS_PARA_RECORDAR[nivel]).toBe(dias);
    expect(pendiente.recordatorio(diasDespues(dias - 0.01))).toBeNull();
    expect(pendiente.recordatorio(diasDespues(dias))).toMatchObject({ nivel, dias });
  });

  it('sugiere subir un escalon, y urgente ya no tiene donde subir', () => {
    expect(nuevo('aplazable').recordatorio(diasDespues(30))?.nivelSugerido).toBe('prioridad');
    expect(nuevo('prioridad').recordatorio(diasDespues(21))?.nivelSugerido).toBe('urgente');
    expect(nuevo('urgente').recordatorio(diasDespues(7))?.nivelSugerido).toBeNull();
  });

  it('el del aplazable es el suave; urgente y prioridad, el de plazo', () => {
    expect(nuevo('aplazable').recordatorio(diasDespues(30))?.tono).toBe('suave');
    expect(nuevo('prioridad').recordatorio(diasDespues(21))?.tono).toBe('plazo');
    expect(nuevo('urgente').recordatorio(diasDespues(7))?.tono).toBe('plazo');
  });

  it('cada color recuerda al acabarse su plazo: urgente antes que prioridad, y esta antes que aplazable', () => {
    // La logica de Diego: urgente es esta semana, prioridad entre 7 y 21
    // dias, aplazable 21 o mas.
    const a14Dias = diasDespues(14);

    expect(nuevo('urgente').recordatorio(a14Dias)).not.toBeNull();
    expect(nuevo('prioridad').recordatorio(a14Dias)).toBeNull();
    expect(nuevo('aplazable').recordatorio(diasDespues(25))).toBeNull();
  });

  it('sugerir no cambia el nivel: lo sube la persona o nadie', () => {
    const pendiente = nuevo('aplazable');

    pendiente.recordatorio(diasDespues(31));

    expect(pendiente.nivel).toBe('aplazable');
  });

  it('uno hecho no recuerda nada', () => {
    const hecho = nuevo('urgente').editar({ hecho: true }, diasDespues(1));

    expect(hecho.recordatorio(diasDespues(30))).toBeNull();
  });

  it('posponer una semana lo calla esa semana, y despues vuelve', () => {
    // El criterio de la tarea.
    const pendiente = nuevo('urgente');
    const alPosponer = diasDespues(8);

    expect(pendiente.recordatorio(alPosponer)).not.toBeNull();

    const pospuesto = pendiente.editar({ posponerHasta: diasDespues(7, alPosponer) }, alPosponer);

    expect(pospuesto.recordatorio(diasDespues(1, alPosponer))).toBeNull();
    expect(pospuesto.recordatorio(diasDespues(6.99, alPosponer))).toBeNull();
    expect(pospuesto.recordatorio(diasDespues(7, alPosponer))).not.toBeNull();
  });
});

describe('Uno por visita', () => {
  it('de varios que tocan, sale uno: primero el urgente', () => {
    const ahora = diasDespues(40);
    const aplazable = nuevo('aplazable');
    const urgente = nuevo('urgente');
    const prioridad = nuevo('prioridad');

    const elegido = elegirRecordatorio([aplazable, prioridad, urgente], ahora);

    expect(elegido?.pendienteId.equals(urgente.id)).toBe(true);
  });

  it('en el mismo nivel, el mas antiguo', () => {
    const viejo = nuevo('aplazable', 'viejo', ANOTADO);
    const nuevoEnElTiempo = nuevo('aplazable', 'nuevo', diasDespues(1));

    const elegido = elegirRecordatorio([nuevoEnElTiempo, viejo], diasDespues(40));

    expect(elegido?.pendienteId.equals(viejo.id)).toBe(true);
  });

  it('si ninguno toca, ninguno', () => {
    expect(elegirRecordatorio([nuevo('prioridad')], diasDespues(10))).toBeNull();
  });
});
