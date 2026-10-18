import { ENLACE, NUCLEO } from './guion.ts';
import type { MecanicaPorRevisar, SesionPorRevisar } from './porRevisar.ts';
import { lineasParaRevisar, type LineaDeRevision } from './texto.ts';

/**
 * La hoja de revision del catalogo (SCRUM-228): un solo archivo HTML, sin servidor ni internet, para que quien
 * revisa (psicologia, fisioterapia, redaccion) lea **lo que va a leer la persona**, mecanica por mecanica, y
 * marque lo que sale.
 *
 * Generaliza la hoja del piloto (6 sesiones) a todo lo que se siembra pendiente: cada mecanica con su ficha, lo que
 * la ficha pide mirar y sus sesiones, y una decision por mecanica (aprobada, aprobada con cambios, no sale) con la
 * opcion de dejar fuera sesiones sueltas. Al final, «Copiar mis respuestas»: ese texto es lo que lee
 * `publicacion.ts` para escribir **una** migracion con lo revisado.
 *
 * ## Lo que promete
 *
 * - **Nada se publica por abrirla ni por llenarla.** Es un formulario que solo produce texto; lo lleva una persona.
 * - **Los textos son borradores.** La hoja lo dice arriba, antes de cualquier otra cosa.
 * - **Sin marcar es pendiente.** Una mecanica que no se marca no se publica, y la hoja lo dice con cuantas faltan.
 * - **Quien revisa figura con su nombre o rol**, sin datos de contacto: es lo que queda en `revisada_por`.
 */

const escapar = (texto: string): string =>
  texto
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&#39;');

function arbolEnHtml(lineas: readonly LineaDeRevision[]): string {
  return `<ul class="arbol">${lineas
    .map((linea) => {
      const dentro = linea.hijos === undefined ? '' : arbolEnHtml(linea.hijos);

      return `<li><span class="et">${escapar(linea.etiqueta)}</span>${
        linea.texto === undefined ? '' : ` <span class="tx">${escapar(linea.texto)}</span>`
      }${dentro}</li>`;
    })
    .join('')}</ul>`;
}

function sesionEnHtml(sesion: SesionPorRevisar): string {
  return `<li class="sesion" data-sesion data-referencia="${escapar(sesion.referencia)}" data-titulo="${escapar(sesion.titulo)}">
  <div class="sesion-cabecera">
    <strong>${escapar(sesion.referencia)}</strong>
    <span class="tenue">${escapar(sesion.titulo)}</span>
    <label class="fuera"><input type="checkbox"> Esta no sale</label>
  </div>
  ${arbolEnHtml(lineasParaRevisar(sesion.parametros))}
</li>`;
}

const SELLO = { profesional: 'Revisión profesional', ligera: 'Revisión ligera' } as const;

function mecanicaEnHtml(mecanica: MecanicaPorRevisar): string {
  const nombreDelGrupo = `decision-${mecanica.codigo}`;
  const franja =
    mecanica.franja === undefined
      ? ''
      : `<p class="tenue pequeno">Solo se ofrece en la franja: <strong>${escapar(mecanica.franja)}</strong>.</p>`;

  return `<article class="mecanica" data-mecanica data-codigo="${escapar(mecanica.codigo)}" data-nombre="${escapar(mecanica.nombre)}" id="${escapar(mecanica.codigo)}">
  <header>
    <p class="etiqueta">${escapar(mecanica.codigo)} · ${SELLO[mecanica.pedido.revision]}</p>
    <h3>${escapar(mecanica.nombre)}</h3>
  </header>
  <p>${escapar(mecanica.descripcion)}</p>
  ${franja}
  <div class="ficha">
    <p><strong>Quién la revisa:</strong> ${escapar(mecanica.pedido.quien)}</p>
    <p><strong>A qué prestar atención (de la ficha):</strong> ${escapar(mecanica.pedido.foco)}</p>
  </div>
  <details>
    <summary>Leer las ${String(mecanica.sesiones.length)} sesiones</summary>
    <p class="tenue pequeno">Cada sesión es lo que la persona lee en un día. Si una no debe salir, márcala aquí y las demás pueden salir.</p>
    <ol class="sesiones">${mecanica.sesiones.map(sesionEnHtml).join('\n')}</ol>
  </details>
  <fieldset class="decision">
    <legend>Tu decisión sobre ${escapar(mecanica.codigo)}</legend>
    <label><input type="radio" name="${escapar(nombreDelGrupo)}" value="si"> <span><strong>Aprobada</strong> · puede salir tal cual (menos las que marqué «no sale»)</span></label>
    <label><input type="radio" name="${escapar(nombreDelGrupo)}" value="cambios"> <span><strong>Aprobada con cambios</strong> · hay que cambiar algo antes (lo cambia una persona del equipo; nada sale mientras)</span></label>
    <label><input type="radio" name="${escapar(nombreDelGrupo)}" value="no"> <span><strong>No sale</strong> · queda pendiente</span></label>
    <label><input type="radio" name="${escapar(nombreDelGrupo)}" value="nada" checked> <span><strong>Sin marcar</strong> · todavía no la reviso (queda pendiente)</span></label>
  </fieldset>
  <label class="comentario">Comentario (opcional)
    <textarea rows="2" maxlength="600"></textarea>
  </label>
</article>`;
}

export interface DatosDeLaHoja {
  readonly titulo: string;
  readonly mecanicas: readonly MecanicaPorRevisar[];
}

const ESTILOS = `
  :root { --fondo:#f5f6f3; --tarjeta:#fff; --tinta:#17211c; --tenue:#55625b; --linea:#d5ddd7; --acento:#2c6a55; --suave:#e7f0ea; --foco:#1a5ad7; --aviso:#fbefd2; --aviso-tinta:#6b4600; }
  @media (prefers-color-scheme: dark) { :root { --fondo:#111715; --tarjeta:#19211e; --tinta:#e6ede8; --tenue:#a0aea6; --linea:#2d3a34; --acento:#7ec4a6; --suave:#1e2b25; --foco:#8db4ff; --aviso:#3a2d10; --aviso-tinta:#f1d58a; color-scheme: dark; } }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--fondo); color:var(--tinta); font:1rem/1.6 system-ui,-apple-system,"Segoe UI",sans-serif; padding:2rem 16px 5rem; }
  main { max-width:50rem; margin-inline:auto; display:grid; gap:2rem; }
  h1,h2,h3 { margin:0; line-height:1.2; text-wrap:balance; } h1 { font-size:clamp(1.9rem,6vw,2.6rem); } h2 { font-size:1.5rem; } h3 { font-size:1.2rem; }
  p { margin:0; }
  .etiqueta { font-size:.78rem; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--acento); }
  .tenue { color:var(--tenue); } .pequeno { font-size:.9rem; }
  .aviso { background:var(--aviso); color:var(--aviso-tinta); border-radius:14px; padding:14px 18px; display:grid; gap:.4rem; }
  .tarjeta, .mecanica { background:var(--tarjeta); border:1px solid var(--linea); border-radius:18px; padding:20px; display:grid; gap:14px; }
  .ficha { background:var(--suave); border-radius:12px; padding:12px 16px; display:grid; gap:.5rem; font-size:.95rem; }
  label { cursor:pointer; } input[type=text], input[type=date], textarea { width:100%; font:inherit; color:inherit; background:var(--fondo); border:1px solid var(--linea); border-radius:10px; padding:10px 12px; }
  input:focus-visible, textarea:focus-visible, summary:focus-visible, button:focus-visible { outline:3px solid var(--foco); outline-offset:2px; }
  .campos { display:grid; gap:12px; grid-template-columns:repeat(auto-fit,minmax(14rem,1fr)); } .campos label { display:grid; gap:4px; font-weight:600; }
  details { border:1px solid var(--linea); border-radius:12px; padding:4px 14px 12px; } summary { cursor:pointer; font-weight:700; padding:10px 0; min-height:44px; }
  .sesiones { list-style:none; margin:0; padding:0; display:grid; gap:12px; }
  .sesion { border-top:1px solid var(--linea); padding-top:10px; } .sesion-cabecera { display:flex; flex-wrap:wrap; gap:.5rem 1rem; align-items:baseline; } .fuera { margin-left:auto; font-size:.9rem; }
  .arbol { list-style:none; margin:.4rem 0 0; padding-left:1rem; border-left:2px solid var(--linea); display:grid; gap:.25rem; font-size:.95rem; }
  .arbol .arbol { margin-top:.2rem; } .et { font-weight:700; color:var(--acento); } .tx { overflow-wrap:anywhere; }
  .decision { border:1px solid var(--linea); border-radius:12px; padding:10px 14px; display:grid; gap:8px; } .decision legend { font-weight:700; padding-inline:6px; }
  .decision label { display:flex; gap:10px; align-items:flex-start; min-height:44px; padding:6px 0; } .decision input { margin-top:.35rem; width:1.15rem; height:1.15rem; }
  .comentario { display:grid; gap:6px; font-weight:600; font-size:.95rem; } .comentario textarea { font-weight:400; }
  .acciones { display:flex; flex-wrap:wrap; gap:12px; } button { font:inherit; font-weight:700; min-height:48px; padding:10px 20px; border-radius:12px; border:2px solid var(--acento); background:var(--acento); color:var(--fondo); cursor:pointer; } button.secundario { background:transparent; color:var(--acento); }
  #salida { min-height:12rem; font-family:ui-monospace,Menlo,Consolas,monospace; font-size:.85rem; }
  .barra { position:sticky; top:0; z-index:5; background:var(--fondo); border-bottom:1px solid var(--linea); padding:8px 0; font-size:.9rem; }
  @media print { .barra,.acciones { display:none; } details { border:0; } details > * { display:block; } }
`;

/** La hoja completa, como un solo archivo HTML. */
export function htmlDeLaHoja(datos: DatosDeLaHoja): string {
  const totalDeSesiones = datos.mecanicas.reduce((suma, m) => suma + m.sesiones.length, 0);
  const indice = datos.mecanicas
    .map(
      (m) =>
        `<li><a href="#${escapar(m.codigo)}">${escapar(m.codigo)} · ${escapar(m.nombre)}</a> <span class="tenue">(${String(m.sesiones.length)})</span></li>`,
    )
    .join('');

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapar(datos.titulo)}</title>
<style>${ESTILOS}</style>
</head>
<body>
<main>
  <div class="barra" role="status" aria-live="polite"><span id="avance"></span></div>

  <header class="tarjeta">
    <p class="etiqueta">VSD Health · Revisión del contenido</p>
    <h1>${escapar(datos.titulo)}</h1>
    <p>Aquí está lo que la gente va a leer al hacer las actividades: <strong>${String(datos.mecanicas.length)} ${datos.mecanicas.length === 1 ? 'mecánica' : 'mecánicas'} y ${String(totalDeSesiones)} ${totalDeSesiones === 1 ? 'sesión' : 'sesiones'}</strong>. Tu revisión es lo que permite publicarlas.</p>
    <div class="aviso" role="note">
      <p><strong>Estos textos son borradores.</strong> Que estén en el sistema no los aprueba, y <strong>nada se publica por abrir ni llenar esta hoja</strong>: solo produce un texto con tus respuestas, que una persona del equipo lleva al sistema.</p>
      <p>Lo que no marques queda pendiente y no se publica. Si una sesión no debe salir, márcala y las demás de la mecánica pueden salir. Si pides cambios, nada de esa mecánica sale hasta que una persona los haga.</p>
    </div>
  </header>

  <section class="tarjeta" aria-labelledby="quien">
    <h2 id="quien">Quién revisa</h2>
    <div class="campos">
      <label>Tu nombre o rol, como quieres que figure
        <input id="revisor" type="text" autocomplete="off" placeholder="Por ejemplo: Psicóloga clínica, revisión externa">
      </label>
      <label>Fecha en que terminas la revisión
        <input id="fecha" type="date">
      </label>
    </div>
    <p class="tenue pequeno">Sin teléfono ni correo: solo lo que quieres que quede escrito junto a lo que apruebas.</p>
  </section>

  <section class="tarjeta" aria-labelledby="indice">
    <h2 id="indice">Qué hay en esta hoja</h2>
    <ul>${indice}</ul>
  </section>

  ${datos.mecanicas.map(mecanicaEnHtml).join('\n\n')}

  <section class="tarjeta" aria-labelledby="respuestas">
    <h2 id="respuestas">Tus respuestas</h2>
    <p>Cuando termines, copia este texto y mándalo a quien te pasó la hoja (o descárgalo). Puedes volver a editarlo aquí antes.</p>
    <textarea id="salida" readonly aria-label="Tus respuestas, listas para copiar"></textarea>
    <div class="acciones">
      <button id="copiar" type="button">Copiar mis respuestas</button>
      <button id="descargar" type="button" class="secundario">Descargar como archivo</button>
    </div>
    <p id="estado" class="tenue" role="status"></p>
  </section>
</main>
<script>${NUCLEO}</script>
<script>${ENLACE}</script>
</body>
</html>
`;
}
