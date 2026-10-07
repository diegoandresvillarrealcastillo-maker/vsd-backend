# ADR 0017: Un SVG que sube una persona se reescribe, no se limpia

- **Estado:** aceptado
- **Fecha:** 2026-10-07
- **Tarea:** SCRUM-122
- **Se apoya en:** [ADR 0016](0016-los-archivos-de-cada-persona-viven-en-storage-y-solo-los-toca-la-api.md)
  (donde viven los archivos y quien los toca).

## Contexto

SCRUM-122 deja que una persona suba **un SVG** como su mascota. Un JPEG o un PNG
son datos; un SVG es un **documento**: puede llevar scripts, manejadores de
eventos (`onload`), enlaces y referencias a otros sitios, otros documentos
incrustados (`<foreignObject>`), animaciones que cambian un enlace despues de la
revision, hojas de estilo, y una declaracion de tipo de documento (DOCTYPE) con
entidades que sirven para agotar la memoria del servidor o leer archivos suyos.
Aceptar uno que subio otra persona y devolverselo tal cual seria **guardar y
servir codigo ajeno**.

El ticket pide «saneamiento estricto en el servidor» y que se muestre **solo como
`<img>`, nunca incrustado**. En ese modo el navegador no ejecuta scripts ni carga
nada externo, y esa es una barrera real. Pero es **la segunda**: el archivo se
guarda, se exporta (derecho de acceso) y se puede abrir suelto, y no debe llevar
nada peligroso en ninguno de esos casos.

## Decision

**El SVG que llega no se limpia: se reconstruye. Lo que se guarda, se devuelve y
se exporta es un SVG nuevo, escrito por el servidor desde una lista blanca. No
queda un solo byte del original.**

1. **Un lector de XML estricto, sin dependencias** (`LectorDeSvg`). Lee lo justo
   para un dibujo de trazos y rechaza todo lo demas: sin DOCTYPE ni entidades
   propias (por ahi entran la expansion de entidades y la lectura de archivos del
   servidor), sin CDATA, sin instrucciones de procesamiento (`<?xml-stylesheet`),
   solo las cinco entidades predefinidas y las referencias numericas —que se
   resuelven **antes** de mirar el valor, para que `&#106;avascript:` se vea como
   lo que es—, y solo los espacios de nombres del SVG y de los editores
   conocidos. Con limites: 20 niveles, 2000 elementos, 64 atributos por elemento.
   Excepcion: el DOCTYPE **oficial** de SVG 1.0 y 1.1, sin subconjunto interno,
   que escriben Illustrator y otros editores; se descarta.
2. **Una lista blanca de 16 elementos** (`svg`, `g`, `defs`, `path`, `circle`,
   `ellipse`, `rect`, `line`, `polyline`, `polygon`, `linearGradient`,
   `radialGradient`, `stop`, `clipPath`, `mask`, `use`) y de los atributos de cada
   uno. Todo lo demas, o se descarta si es inofensivo (titulos, descripciones,
   metadatos, lo que dejan Inkscape y otros editores, `class`, `data-*`), o se
   rechaza el archivo entero.
3. **Cada valor se valida contra su tipo y no se corrige:** un numero es un
   numero (con tope), un color es un color, una referencia es `#algo`, un trazo
   solo lleva las letras de un trazo. Un valor que no cumple es un rechazo. El
   `style="..."` en linea se lee con las mismas reglas y **se convierte en
   atributos**; una barra invertida o un comentario dentro (con lo que se escribe
   `url` sin que se note) es un rechazo.
4. **Todo el arbol se mira antes de usarlo**, tambien lo que despues se
   descarta: un `<script>` escondido dentro de los metadatos se rechaza igual.
   Un archivo hecho para atacar es mejor decirlo que limpiarlo en silencio.
5. **Rechazar con un motivo que dice que hacer.** `peligroso` (scripts,
   manejadores, enlaces fuera del archivo, animaciones, DOCTYPE y entidades),
   `no-admitido` (textos, imagenes de mapa de bits, filtros, estilos, patrones:
   es inofensivo pero esta version no lo pinta bien, y decirlo evita un dibujo al
   que le faltan partes sin saber por que), `no-es-svg` y `demasiado-complejo`.
   Los mensajes **nunca** repiten lo que traia el archivo.
6. **Un `<use>` no puede apuntar a algo que tenga otro `<use>`** (es como se
   construye un dibujo que se multiplica a si mismo, y tambien un ciclo), y hay
   un maximo de 100.
7. **Se escribe de nuevo**, con un orden fijo, solo con lo que paso. Es estable:
   limpiar lo que ya esta limpio no cambia nada.
8. **Al devolverlo**, la respuesta lleva `Content-Security-Policy: default-src
'none'; style-src 'none'; sandbox`, `X-Content-Type-Options: nosniff`,
   `Content-Disposition: attachment` y `Cache-Control: no-store`: si alguien lo
   abriera suelto, queda inerte.
9. **Bucket propio** (`mascotas-propias`, privado, 100 KB, solo `image/svg+xml`)
   y **marca propia** en la cuenta (`usuario.mascota_propia_actualizada_el`), por
   el mismo camino que la foto (ADR 0016). Elegirla como mascota
   (`mascota.forma = 'propia'`) **exige** que exista; quitarla devuelve a quien
   la tenia elegida al personaje de siempre, con el nombre que le habia puesto.

## Alternativas descartadas

- **Una libreria de saneamiento (DOMPurify con jsdom, sanitize-html).** Es lo que
  se suele hacer, y lo habitual es **limpiar** un documento: leerlo con un
  analizador de HTML y quitarle lo malo. Se descarto por tres razones: arrastra
  un arbol grande de dependencias a un servicio que hoy tiene pocas; sanea con un
  analizador **distinto** del que despues lo abre, y esas diferencias de lectura
  son donde se han colado casi todos los ataques; y una lista negra que quita lo
  malo falla cuando aparece algo malo que no estaba en la lista. Reconstruir
  desde una lista blanca falla del lado seguro.
- **Quitar lo peligroso con expresiones regulares.** Nunca. Con SVG, XML y
  entidades es imposible hacerlo bien.
- **Convertir el SVG a una imagen de mapa de bits en el servidor.** Es lo mas
  seguro, pero exige una libreria nativa (rsvg, sharp) que Render tendria que
  compilar, y pierde el dibujo vectorial y la posibilidad de animarlo bien.
- **Fiarse de que se muestra como `<img>`.** Es una barrera real y se mantiene,
  pero no cubre el archivo guardado, la exportacion ni un SVG abierto suelto.
- **Sanear en el navegador.** El navegador de quien ataca no es de fiar.

## Consecuencias

Lo que se gana:

- Lo que se guarda **no puede llevar nada que no este en la lista**, y eso es
  verificable: una prueba toma miles de variaciones de ataques y de dibujos
  validos y comprueba que cada una se rechaza o sale limpia, sin direcciones, sin
  manejadores, solo con elementos de la lista, y estable al limpiarla otra vez.
- No hay dependencia nueva.
- La persona sabe **por que** se rechazo su archivo.

Lo que se pierde:

- **Un SVG normal de un editor puede no pasar.** No se admiten textos (hay que
  convertirlos a trazos), imagenes de mapa de bits, filtros ni hojas de estilo
  (`<style>`). La aplicacion lleva una guia paso a paso y un PDF para preparar el
  archivo, y las opciones de cada editor que lo dejan listo.
- **Es un saneador escrito a mano**, y su seguridad es nuestra: no la respalda una
  libreria con anos de uso. Se sostiene con una bateria de ataques conocidos, una
  prueba de miles de variaciones reproducibles y mutaciones del propio saneador
  (rompi a proposito 52 cosas: 51 hicieron fallar pruebas y la que queda es una
  defensa que hoy no se puede alcanzar porque los validadores ya excluyen esos
  caracteres). **No lo ha revisado nadie de fuera.** Conviene que lo mire una
  segunda persona con ojos de atacante antes de abrirlo a quien no es del equipo.
- **Limites conocidos que no se cierran aqui:** una cadena larga de degradados que
  heredan unos de otros (`href`) no tiene tope y un navegador la recorre al
  pintar; y un dibujo valido pero con muchos trazos puede ser lento de pintar
  (los limites de 2000 elementos y 80 000 caracteres de trazo lo acotan, no lo
  eliminan).
- **Un SVG mas grande que 100 KB no entra.** Un dibujo de trazos limpio pesa
  mucho menos; el limite es una decision de producto que se puede subir.
- La mascota propia **no trae las cuatro expresiones** de los personajes (normal,
  feliz, celebrando, dormida): el frontend las sustituye con animacion.
