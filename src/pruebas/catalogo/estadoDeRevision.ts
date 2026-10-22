import type { Client } from 'pg';

/**
 * Lo que dice la base de la revision de una sesion (`revision`, `revisada_por`, `revisada_el`) y de si esta
 * publicada.
 */
export interface RevisionDeLaSesion {
  readonly publicado: boolean;
  readonly revision: string;
  readonly revisadaPor: string | null;
  readonly revisadaEl: Date | null;
}

/** Como se sembro una sesion: lo que dice el contenido de su mecanica (`publicar` y `revision`). */
export interface SembradaComo {
  readonly publicar: boolean;
  readonly revision: string;
}

/**
 * Si el estado de una sesion en la base es uno que pudo salir de como se sembro, o `undefined` si lo es.
 *
 * Las pruebas de integracion corren contra la base **con todas las migraciones aplicadas**, incluidas las que
 * publican lo revisado (SCRUM-238). Por eso «sembrada pendiente» no quiere decir «sigue pendiente»: puede haberla
 * revisado alguien despues. Lo que no cambia, y esto comprueba, es lo que la base exige siempre:
 *
 * - lo que **no pide revision** sigue sin pedirla y publicado como se sembro;
 * - lo que **pide revision** o sigue pendiente y sin publicar, o esta revisado **a nombre de alguien y con su
 *   fecha**. Nunca publicado sin una cosa ni la otra.
 */
export function problemaDeLaRevision(
  sembrada: SembradaComo,
  fila: RevisionDeLaSesion,
): string | undefined {
  if (sembrada.revision === 'no_requiere') {
    return fila.revision === 'no_requiere' && fila.publicado === sembrada.publicar
      ? undefined
      : `no pide revision y se sembro publicado=${String(sembrada.publicar)}, pero esta ${fila.revision} y publicado=${String(fila.publicado)}`;
  }

  if (fila.revision === 'pendiente') {
    return fila.publicado ? 'esta publicada sin que nadie la haya revisado' : undefined;
  }

  if (fila.revision === 'revisada') {
    return (fila.revisadaPor ?? '').trim() !== '' && fila.revisadaEl !== null
      ? undefined
      : 'esta revisada pero sin decir quien ni cuando';
  }

  return `su revision es "${fila.revision}", que no es ni pendiente ni revisada`;
}

/**
 * Corre `prueba` con el catalogo **como lo dejo la siembra** —todo lo que pide revision, pendiente y sin
 * publicar— y lo deshace todo al terminar.
 *
 * Existe para probar la publicacion contra la base de verdad aunque la base ya la tenga aplicada: una sesion
 * revisada no se puede editar (disparador), asi que para volver a verla pendiente hay que apagar ese disparador,
 * y eso solo se hace aqui, **dentro de una transaccion que se deshace siempre**. Ni el disparador ni las sesiones
 * quedan tocados fuera de la prueba, y las demas pruebas no se enteran.
 *
 * Hace falta ser el dueno de la tabla, como el usuario con el que se aplican las migraciones.
 */
export async function enElCatalogoComoSembrado(
  cliente: Pick<Client, 'query'>,
  prueba: () => Promise<void>,
): Promise<void> {
  await cliente.query('BEGIN');

  try {
    await cliente.query(
      'ALTER TABLE sesion_de_actividad DISABLE TRIGGER sesion_de_actividad_revisada_no_se_edita',
    );
    await cliente.query(
      `UPDATE sesion_de_actividad
          SET revision = 'pendiente', revisada_por = NULL, revisada_el = NULL, publicado = FALSE
        WHERE revision = 'revisada'`,
    );
    await cliente.query(
      'ALTER TABLE sesion_de_actividad ENABLE TRIGGER sesion_de_actividad_revisada_no_se_edita',
    );

    await prueba();
  } finally {
    await cliente.query('ROLLBACK');
  }
}
