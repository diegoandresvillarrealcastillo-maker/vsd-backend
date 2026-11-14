# ADR 0016: Los archivos de cada persona viven en Storage y solo los toca la API

- **Estado:** aceptado
- **Fecha:** 2026-10-07
- **Tarea:** SCRUM-120 (foto de perfil). Es la base que reutiliza SCRUM-122
  (mascota propia con un SVG).

## Contexto

Hasta ahora todo lo que se guardaba de una persona eran filas de PostgreSQL, y
el aislamiento entre personas lo imponia la base (ADR 0010). SCRUM-120 agrega
algo distinto: **un archivo**, la foto de perfil, de unos 256 px y menos de
50 KB. Es la primera vez que el proyecto usa Supabase Storage, y SCRUM-122 va a
subir otro archivo por persona, un SVG, que hay que **sanear en el servidor**
antes de guardarlo.

Lo que obliga a decidir como se hace:

- Un archivo es un dato personal como cualquier otro: tiene que entrar en la
  exportacion (derecho de acceso) y salir con el borrado de la cuenta (derecho de
  supresion), Ley 1581 de 2012.
- `docs/seguridad.md` decia que la clave de servicio de Supabase se usa **solo**
  para borrar la identidad. Storage le da un segundo uso, y eso no se puede
  hacer en silencio.
- Los limites de tamano y de tipo de un bucket **se fian de lo que declare quien
  sube**: el tipo que cuenta es el `Content-Type` de la peticion, no el
  contenido. Con solo el bucket, un HTML con el tipo `image/png` entra.
- El esquema `storage` de Supabase no existe en la base local ni en la del CI, y
  su documentacion pide tratarlo como de solo lectura. Una politica escrita ahi
  no se puede probar en CI.

## Decision

**El navegador nunca habla con Storage. Solo habla con la API, y la API es la
unica que guarda, lee y borra archivos, en un bucket privado y sin politicas.**

1. **Un bucket privado por tipo de archivo**, hoy `fotos-de-perfil`. Sin
   politicas para ningun rol: con la clave publica o con la sesion de otra
   persona no se puede abrir nada. Su limite de peso (51 200 bytes) y sus tipos
   (`image/jpeg`, `image/png`) los fija el propio bucket, como segunda barrera.
2. **Lo crea la API la primera vez que guarda algo**, con esos limites. No hay un
   paso manual que olvidar al desplegar, y no hace falta una migracion que toque
   el esquema `storage`. Si ya existe, se deja como esta.
3. **Un objeto por persona, y el nombre es su identificador.** El puerto
   `AlmacenPersonalPort` pide todo **por persona** (`guardar(persona, archivo)`,
   `leer(persona)`, `borrar(persona)`) y no tiene un parametro con el que nombrar
   un archivo. La persona sale del token verificado. Pedir el de otra no es algo
   que se prohiba: **no se puede expresar**.
4. **La API usa la clave de servicio**, que es el patron que Supabase documenta
   para un servidor propio, y llama a Storage con `fetch`, como ya hace
   `IdentidadesDeSupabase`.
5. **La API valida el archivo otra vez**, sin fiarse del navegador:
   - el tipo declarado es `image/jpeg` o `image/png`;
   - pesa menos de 50 KB (51 200 bytes);
   - **empieza como lo que dice ser** (la firma de un PNG o el inicio de un JPEG)
     y se lee su tamano en pixeles de la cabecera;
   - ningun lado pasa de 1024 px. Un archivo de pocos bytes puede declarar
     30 000 x 30 000 pixeles y agotar la memoria de quien lo abra.

   Es una validacion de **estructura**, no una decodificacion completa. Basta
   para que un HTML o un script no se haga pasar por imagen; la foto solo la ve
   su dueno, como `<img>`.

6. **La cuenta guarda una marca**, `usuario.foto_actualizada_el`: si hay foto y
   desde cuando. La pantalla la lee con la cuenta, sin una llamada de red aparte,
   y cambia con cada foto nueva, que es lo que le dice al navegador que la que
   tenia guardada ya no vale.
7. **La foto se sirve por `GET /api/cuenta/foto`**, con la sesion y sin guardarse
   en ninguna cache. No hay enlaces firmados a Storage.
8. **Entra en la exportacion** (en base64, con su tipo y su fecha) y **se borra
   con la cuenta**, antes que la identidad: lo irreversible va al final. Si el
   almacenamiento falla, no se borra nada y la persona puede reintentar.

La clave de servicio pasa a tener **dos** usos: borrar la identidad y guardar,
leer y borrar los archivos de ese bucket. Sigue sin usarse para leer ni escribir
datos de la base, que pasan por `vsd_app` y sus politicas.

## Alternativas descartadas

- **Que el navegador suba directo a Storage, con politicas por persona.** Es lo
  mas simple para una foto y es lo que muestra la documentacion de Supabase. Se
  descarto por tres razones: no deja ningun sitio donde sanear el SVG de SCRUM-122
  en el servidor; se fia del tipo que declara el navegador; y las politicas viven
  en el esquema `storage`, que no existe en CI, asi que la regla que mas importa
  —que nadie vea la foto de otra persona— no tendria ninguna prueba automatica.
- **Que la API hable con Storage con el token de la persona**, para que sus
  politicas apliquen. Exige las mismas politicas sin prueba posible y una variable
  nueva en el servidor (la clave publica) que alguien tiene que poner a mano.
- **Enlaces firmados para mostrar la foto.** Es un enlace que sirve a quien lo
  tenga durante su vida util: se copia, se pega, queda en un historial. Una
  peticion con sesion no tiene ese problema.
- **Un bucket publico.** Es lo que Supabase recomienda para fotos de perfil
  publicas. Estas no lo son: son un dato personal que solo ve su dueno.
- **Guardar los bytes en una columna `bytea` de la base.** Era lo mas simple:
  heredaba las politicas por persona, el borrado en cascada y la exportacion sin
  codigo nuevo. Se descarto porque el alcance aprobado de SCRUM-120 pide Storage,
  y porque SCRUM-122 va a necesitar la misma base. Es la opcion a la que volver si
  Storage diera problemas.

## Consecuencias

Lo que se gana:

- No hay ningun camino desde el navegador a un archivo ajeno: ni siquiera uno
  que haya que proteger.
- Un solo sitio donde se valida cada archivo, y SCRUM-122 lo reutiliza: cambia
  la regla de validacion, no el almacenamiento.
- La exportacion y el borrado cubren el archivo, y hay pruebas que lo exigen.

Lo que se pierde:

- **El aislamiento de los archivos lo impone el codigo y no la base.** Es la
  diferencia con ADR 0010, que protege las tablas con politicas. Aqui se
  sostiene con el diseno del puerto y con pruebas de dos personas, y una
  regresion en la API lo romperia sin que la base lo frene.
- **La clave de servicio tiene mas alcance**: ahora tambien puede tocar todos los
  objetos del bucket. Nunca sale de la API, y quien la obtuviera ya tendria
  control de todo el proyecto, pero el riesgo de que una fuga haga mas dano
  crece, y `docs/seguridad.md` lo dice.
- **El adaptador de Supabase no se probo contra un Storage real**, solo contra un
  `fetch` simulado y la documentacion: no hay Storage en CI ni en la base local.
  La primera prueba de verdad es en PRE, y hay una lista de comprobacion en la
  descripcion del cambio.
- **Dos sitios que tienen que coincidir.** Si hay marca sin archivo, para quien
  la pide es lo mismo que no tener foto. Si hay archivo sin marca (un intento a
  medias), nadie lo ve y la siguiente foto, o quitarla, lo limpia. El borrado de
  la cuenta se lleva el archivo antes que la identidad: si la identidad falla
  despues, la persona conserva la cuenta con la marca puesta y sin foto.
- **Cada foto cuesta una peticion a la API**, que ademas va a Storage. Pesan menos
  de 50 KB y el navegador las guarda en memoria mientras la marca no cambie.
- **No se escanea el contenido** mas alla de su estructura.

## Privacidad

La foto es un dato personal que la persona da por voluntad propia, que solo ve
ella y que puede quitar cuando quiera. Entra en la exportacion y sale con el
borrado de la cuenta.

**Pendiente de quienes son duenos del texto del aviso de tratamiento de datos:**
el texto no esta en este repositorio, solo su version
(`VERSION_VIGENTE_DEL_AVISO`). Si el aviso enumera las categorias de datos que se
tratan, habria que sumar la foto y cambiar esa version. Es un cambio de una linea
en el codigo, pero la decision de si hace falta no es tecnica.
