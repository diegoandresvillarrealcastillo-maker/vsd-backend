import { describe, expect, it } from 'vitest';

import { Activity, DireccionEscala } from '../../domain/model/Activity.js';
import { Categoria } from '../../domain/model/Categoria.js';
import { ActivityId, CategoryId } from '../../domain/model/Identifier.js';
import type { ActivityRepositoryPort } from '../../domain/ports/out/ActivityRepositoryPort.js';
import { ConsultarCatalogoUseCaseImpl } from './ConsultarCatalogoUseCaseImpl.js';

/**
 * Doble del catalogo. Como en el resto de la capa de aplicacion, no se importa
 * nada de `infrastructure/`: la regla de fronteras lo impide, y con razon.
 */
class CatalogoFalso implements ActivityRepositoryPort {
  constructor(private readonly categorias: readonly Categoria[]) {}

  findById(): Promise<Activity | null> {
    return Promise.resolve(null);
  }

  listarCatalogo(): Promise<readonly Categoria[]> {
    return Promise.resolve(this.categorias);
  }
}

function actividad(nombre: string): Activity {
  return Activity.create({
    id: new ActivityId(crypto.randomUUID()),
    nombre,
    tipo: 'juego',
    descripcion: 'Una actividad de ejemplo.',
    direccionEscala: DireccionEscala.MAYOR_ES_MEJOR,
    puntajeMaximo: 10,
  });
}

function categoria(nombre: string, actividades: readonly Activity[]): Categoria {
  return Categoria.create({
    id: new CategoryId(crypto.randomUUID()),
    nombre,
    actividades,
  });
}

describe('ConsultarCatalogoUseCaseImpl', () => {
  it('devuelve las categorias con sus actividades', async () => {
    const casoDeUso = new ConsultarCatalogoUseCaseImpl(
      new CatalogoFalso([
        categoria('Cognicion', [actividad('Parejas de cartas')]),
        categoria('Emociones', [actividad('Como te sientes hoy')]),
      ]),
    );

    const catalogo = await casoDeUso.ejecutar();

    expect(catalogo.map((c) => c.nombre)).toEqual(['Cognicion', 'Emociones']);
    expect(catalogo[0]?.actividades[0]?.nombre).toBe('Parejas de cartas');
  });

  it('esconde las categorias que se quedaron sin actividades', async () => {
    // El administrador puede retirar todas las de una categoria. Mostrarla
    // vacia deja a la persona pulsando algo que no lleva a ningun sitio.
    const casoDeUso = new ConsultarCatalogoUseCaseImpl(
      new CatalogoFalso([
        categoria('Cognicion', [actividad('Parejas de cartas')]),
        categoria('Bienestar', []),
      ]),
    );

    const catalogo = await casoDeUso.ejecutar();

    expect(catalogo.map((c) => c.nombre)).toEqual(['Cognicion']);
  });

  it('devuelve una lista vacia si no hay nada que ofrecer', async () => {
    const casoDeUso = new ConsultarCatalogoUseCaseImpl(new CatalogoFalso([]));

    await expect(casoDeUso.ejecutar()).resolves.toEqual([]);
  });

  it('no altera el orden que trae el repositorio', async () => {
    // El orden se decide al consultar la base, en un solo sitio. Si lo
    // reordenara tambien el caso de uso, cambiar el criterio obligaria a
    // recordar los dos, y el dia que alguien cambie uno solo nadie lo nota.
    const casoDeUso = new ConsultarCatalogoUseCaseImpl(
      new CatalogoFalso([
        categoria('Zeta', [actividad('Una')]),
        categoria('Alfa', [actividad('Otra')]),
      ]),
    );

    const catalogo = await casoDeUso.ejecutar();

    expect(catalogo.map((c) => c.nombre)).toEqual(['Zeta', 'Alfa']);
  });
});
