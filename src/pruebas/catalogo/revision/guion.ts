/**
 * El guion de la hoja de revision (SCRUM-228): lo que corre en el navegador de quien revisa.
 *
 * Son dos trozos de JavaScript **como texto**, para que la hoja sea un solo archivo que se abre con doble clic,
 * sin servidor ni internet, y para poder probarlos sin un navegador:
 *
 * - `NUCLEO`: una funcion pura, `construirRespuestas`, que convierte lo marcado en el texto que se copia. Es lo que
 *   lee `publicacion.ts`, asi que el formato vive en un solo sitio y una prueba los junta de punta a punta.
 * - `ENLACE`: lo que lee la pagina (los datos de cada tarjeta) y escribe en ella.
 *
 * Nada se envia a ningun sitio: las respuestas se copian o se descargan, y las lleva una persona.
 */

export const NUCLEO = String.raw`
function construirRespuestas(datos) {
  var etiquetas = { si: 'Aprobada', cambios: 'Aprobada con cambios', no: 'No sale', nada: 'Sin marcar' };
  var lineas = [];
  var sinSalir = [];
  var comentarios = [];

  lineas.push('Revisión a nombre de: ' + (String(datos.revisor || '').trim() || '(sin indicar)'));

  if (datos.fecha) {
    lineas.push('Fecha de la revisión: ' + datos.fecha);
  }

  lineas.push('');
  lineas.push('Mecánicas');

  datos.mecanicas.forEach(function (m) {
    lineas.push(m.codigo + ' · ' + m.nombre + ': ' + etiquetas[m.decision]);

    if (m.decision === 'si') {
      m.sesiones.forEach(function (s) {
        if (s.noSale) {
          sinSalir.push(s.referencia + ' · ' + s.titulo + ': No sale');
        }
      });
    }

    var comentario = String(m.comentario || '').replace(/\s+/g, ' ').trim();

    if (comentario !== '') {
      comentarios.push('Comentario ' + m.codigo + ': ' + comentario);
    }
  });

  if (sinSalir.length > 0) {
    lineas.push('');
    lineas.push('Sesiones que no salen');
    sinSalir.forEach(function (l) { lineas.push(l); });
  }

  if (comentarios.length > 0) {
    lineas.push('');
    lineas.push('Comentarios');
    comentarios.forEach(function (l) { lineas.push(l); });
  }

  return lineas.join('\n') + '\n';
}
`;

export const ENLACE = String.raw`
(function () {
  var tarjetas = Array.prototype.slice.call(document.querySelectorAll('[data-mecanica]'));
  var salida = document.getElementById('salida');
  var avance = document.getElementById('avance');

  function leer() {
    return {
      revisor: document.getElementById('revisor').value,
      fecha: document.getElementById('fecha').value,
      mecanicas: tarjetas.map(function (t) {
        var marcada = t.querySelector('input[type=radio]:checked');
        return {
          codigo: t.getAttribute('data-codigo'),
          nombre: t.getAttribute('data-nombre'),
          decision: marcada ? marcada.value : 'nada',
          comentario: t.querySelector('textarea').value,
          sesiones: Array.prototype.slice.call(t.querySelectorAll('[data-sesion]')).map(function (s) {
            return {
              referencia: s.getAttribute('data-referencia'),
              titulo: s.getAttribute('data-titulo'),
              noSale: s.querySelector('input[type=checkbox]').checked
            };
          })
        };
      })
    };
  }

  function actualizar() {
    var datos = leer();
    var marcadas = datos.mecanicas.filter(function (m) { return m.decision !== 'nada'; }).length;
    var porMarcar = datos.mecanicas.length - marcadas;

    avance.textContent = marcadas + ' de ' + datos.mecanicas.length +
      (datos.mecanicas.length === 1 ? ' mecánica marcada' : ' mecánicas marcadas') +
      (porMarcar === 1 ? ' · la que falta queda pendiente y no se publica' : '') +
      (porMarcar > 1 ? ' · las ' + porMarcar + ' sin marcar quedan pendientes y no se publican' : '');
    salida.value = construirRespuestas(datos);
  }

  document.addEventListener('input', actualizar);
  document.addEventListener('change', actualizar);

  document.getElementById('copiar').addEventListener('click', function () {
    actualizar();
    salida.select();

    var listo = function () { document.getElementById('estado').textContent = 'Copiado. Pégalo en un mensaje o en un archivo de texto.'; };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(salida.value).then(listo, function () { document.execCommand('copy'); listo(); });
    } else {
      document.execCommand('copy');
      listo();
    }
  });

  document.getElementById('descargar').addEventListener('click', function () {
    actualizar();
    var enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(new Blob([salida.value], { type: 'text/plain;charset=utf-8' }));
    enlace.download = 'mis-respuestas.txt';
    enlace.click();
    URL.revokeObjectURL(enlace.href);
  });

  actualizar();
})();
`;
