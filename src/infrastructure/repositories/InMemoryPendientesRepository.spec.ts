import { describe, expect, it } from 'vitest';
import { ClientOperationId, PendienteId, UserId } from '../../domain/model/Identifier.js';
import { Pendiente } from '../../domain/model/Pendiente.js';
import { InMemoryPendientesRepository } from './InMemoryPendientesRepository.js';

const PERSONA = new UserId('11111111-1111-4111-8111-111111111111');
const OTRA = new UserId('22222222-2222-4222-9222-222222222222');
const AHORA = new Date('2026-10-07T12:00:00.000Z');

let contador = 0;
function nuevo(persona = PERSONA, texto = 'Llamar a la EPS'): Pendiente {
  contador += 1;
  const sufijo = String(contador).padStart(12, '0');

  return Pendiente.nuevo(
    {
      id: new PendienteId('55555555-5555-4555-a555-' + sufijo),
      userId: persona,
      clientOperationId: new ClientOperationId('66666666-6666-4666-a666-' + sufijo),
      texto,
      nivel: 'urgente',
    },
    AHORA,
  );
}

describe('InMemoryPendientesRepository: la version (SCRUM-134)', () => {
  it('guarda la edicion si la version sigue siendo la que se leyo', async () => {
    const repositorio = new InMemoryPendientesRepository();
    const uno = await repositorio.guardarNuevo(nuevo());

    const editado = await repositorio.actualizar(uno.editar({ texto: 'Dos' }, AHORA), uno.version);

    expect(editado).toMatchObject({ texto: 'Dos', version: 2 });
    expect((await repositorio.porId(PERSONA, uno.id))?.texto).toBe('Dos');
  });

  it('con una version vieja no escribe nada y devuelve null', async () => {
    const repositorio = new InMemoryPendientesRepository();
    const uno = await repositorio.guardarNuevo(nuevo());

    await repositorio.actualizar(uno.editar({ texto: 'Del otro dispositivo' }, AHORA), 1);

    const rechazada = await repositorio.actualizar(uno.editar({ texto: 'Pisaria' }, AHORA), 1);

    expect(rechazada).toBeNull();
    expect((await repositorio.porId(PERSONA, uno.id))?.texto).toBe('Del otro dispositivo');
  });

  it('con una version que todavia no existe tampoco escribe', async () => {
    const repositorio = new InMemoryPendientesRepository();
    const uno = await repositorio.guardarNuevo(nuevo());

    expect(await repositorio.actualizar(uno.editar({ hecho: true }, AHORA), 5)).toBeNull();
    expect((await repositorio.porId(PERSONA, uno.id))?.hecho).toBe(false);
  });

  it('otra persona no lo actualiza ni acertando la version', async () => {
    const repositorio = new InMemoryPendientesRepository();
    const suyo = await repositorio.guardarNuevo(nuevo());
    const ajeno = Pendiente.guardado({ ...suyo, userId: OTRA }).editar({ hecho: true }, AHORA);

    expect(await repositorio.actualizar(ajeno, suyo.version)).toBeNull();
    expect((await repositorio.porId(PERSONA, suyo.id))?.hecho).toBe(false);
  });

  it('uno que ya no existe devuelve null', async () => {
    const repositorio = new InMemoryPendientesRepository();
    const uno = await repositorio.guardarNuevo(nuevo());

    await repositorio.borrar(PERSONA, uno.id);

    expect(await repositorio.actualizar(uno.editar({ hecho: true }, AHORA), 1)).toBeNull();
  });
});
