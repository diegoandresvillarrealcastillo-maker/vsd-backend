# Seguridad y privacidad

VSD Health trata datos sobre el estado emocional y cognitivo de
personas. La legislacion colombiana los clasifica como **datos
sensibles** (Ley 1581 de 2012, Decreto 1377 de 2013). Las reglas de este
documento no son recomendaciones.

---

## 1. Secretos

**Ningun secreto entra al repositorio.** Nunca se versionan archivos
`.env`, tokens, contrasenas, claves de API, credenciales, claves de rol
de servicio ni datos reales de usuarios.

Lo unico versionado es `.env.example`, con los nombres de las variables
y valores de ejemplo.

El CI ejecuta Gitleaks sobre **todo el historial** en cada Pull Request.
Borrar un secreto en un commit posterior no lo elimina del historial.

### Si un secreto se filtra

1. **Rotar la credencial en el proveedor primero.** Quitarla del codigo
   no la invalida: ya esta publicada y hay que asumir que fue copiada.
2. Avisar al equipo.
3. Solo despues limpiar el repositorio.

---

## 2. Que puede ver el navegador

Todo lo que llega al frontend es publico. El usuario puede abrir las
herramientas de desarrollo y leerlo.

| Variable                      | Donde vive       | Por que                                |
| ----------------------------- | ---------------- | -------------------------------------- |
| `VITE_SUPABASE_ANON_KEY`      | Frontend         | Publica por diseno                     |
| `VITE_API_BASE_URL`           | Frontend         | Publica                                |
| `SUPABASE_SERVICE_ROLE_KEY`   | **Solo backend** | Salta todas las politicas de seguridad |
| `SUPABASE_URL`                | Los dos          | Es la direccion publica del proyecto   |
| `DATABASE_URL` / `DIRECT_URL` | **Solo backend** | Acceso directo a la base               |

El frontend **no** tiene acceso ilimitado a la base de datos. Habla con
`vsd-backend`, y es el backend quien decide que devuelve.

`SUPABASE_JWT_SECRET` no aparece en esta tabla porque **el backend no lo
usa**. Es el secreto con el que Supabase puede firmar tokens, y tenerlo
en el servidor significaria que filtrar la configuracion basta para
fabricar la identidad de cualquiera. La API verifica contra la clave
publica del JWKS, que no sirve para firmar.
Ver [ADR 0013](adr/0013-la-api-verifica-el-token-contra-el-jwks.md).

---

## 3. Aislamiento entre usuarios

> Un usuario jamas puede acceder a informacion de otro. Ni conociendo su
> UUID, ni su identificador, ni la URL, ni el endpoint, ni su correo.
> No puede leer, editar, eliminar ni descargar informacion ajena.

Esto se implementa asi:

1. **La autorizacion vive en la capa de aplicacion.** El caso de uso
   recibe la identidad del solicitante y comprueba que el recurso le
   pertenece antes de devolverlo. No es tarea del controlador.
2. **Nunca se confia en un identificador que llega del cliente** para
   decidir de quien es un dato. La identidad sale del token verificado.
3. **Las claves primarias son UUID**, no enteros consecutivos, de modo
   que no se pueden enumerar.
   Ver [ADR 0003](adr/0003-uuid-como-clave-primaria.md).
4. **Toda regla de acceso tiene una prueba en negativo** que verifica
   que un tercero recibe un rechazo.
5. **Row Level Security en PostgreSQL**, desde SCRUM-59. La identidad si
   llega a la sesion de la base: viaja en la variable `vsd.usuario_actual`,
   que la aplicacion fija dentro de cada transaccion. Si nadie la fija, no
   se ve nada. Las politicas se versionan como migracion, no se configuran
   a mano en Supabase.
   Ver [ADR 0010](adr/0010-aislamiento-en-la-base-de-datos.md).
6. **La aplicacion se conecta con el rol `vsd_app`**, que no es dueno de
   ninguna tabla ni tiene privilegios especiales. Es lo que la deja sujeta
   a las politicas: el dueno de una tabla esta exento de las suyas. Al
   arrancar se comprueba, y fuera de desarrollo una conexion sin
   aislamiento impide arrancar.

### Hasta donde llega cada capa, y hasta donde no

Conviene ser exacto, porque decir "tenemos RLS" sin mas suena a mas
proteccion de la que hay:

- **El caso de uso** protege contra una peticion que pide datos ajenos.
- **RLS** protege contra un error nuestro: una consulta que olvide filtrar,
  un endpoint nuevo que no repita la comprobacion. Sin el, ese olvido
  devuelve datos de mas sin dar ningun error.
- **La autenticacion**, desde SCRUM-64, protege contra quien mienta sobre
  quien es. Cada peticion trae un token firmado por Supabase, la API lo
  verifica contra el JWKS del proyecto y de ahi sale la identidad. El
  cuerpo de la peticion ya no puede decir de quien es un dato: el campo
  desaparecio del contrato y enviarlo produce un 400.
  Ver [ADR 0013](adr/0013-la-api-verifica-el-token-contra-el-jwks.md).
- **Ninguna de las tres** protege contra un backend comprometido, que
  podria declarar a la base la identidad que quisiera. Esa es la frontera
  real de este diseno, y conviene decirla en voz alta en lugar de
  sugerir que no existe.

### Entre autenticar y operar hay un paso

Un token de Supabase dice quien es la persona **para Supabase**. Nuestra base
usa su propio identificador, y son distintos a proposito: usar el del proveedor
como clave primaria ataria todo el modelo de datos al proveedor de
autenticacion, y sustituirlo obligaria a reescribir todas las claves foraneas.

Por eso hay una traduccion, y ocurre en un segundo guardia que se aplica a toda
la API. Busca la cuenta por el identificador del proveedor y la deja disponible
para el resto de la peticion; si no existe, responde **403 con
`CUENTA_NO_REGISTRADA`**.

Es 403 y no 401 a proposito: el token es autentico y la sesion vale, asi que
decir "no estas autenticado" mandaria a la persona a iniciar sesion otra vez,
que es exactamente lo que no arregla el problema. Lo que falta es completar el
alta en `POST /api/cuenta`.

Ese orden importa tambien para lo que se guarda. `resultado.id_usuario` y
`entrada_diario.id_usuario` son claves foraneas contra **nuestro**
identificador. Escribir el del proveedor ahi hace que PostgreSQL rechace la
fila, y es un fallo que ninguna prueba con adaptadores en memoria puede ver,
porque un `Map` no tiene claves foraneas. Se detecto con la primera persona
real y se cubre desde entonces con una prueba de integracion que recorre el
camino completo, de la cabecera HTTP a la fila guardada.

### El alta no concede privilegios

El rol lo fija el caso de uso y **no se recibe**. No es una comprobacion que
alguien pueda olvidar: el dato no existe en la orden de alta. Si alguien lo
anadiera al cuerpo de la peticion, la validacion lo rechaza por campo no
declarado.

Una escalada de privilegios por confiar en el cuerpo de la peticion es el error
clasico, y aqui es imposible por construccion.

### Autenticar no es autorizar

El guardia sabe quien eres; no decide que puedes. Esa distincion se
sostiene a proposito, porque el sitio natural para empezar a meter
permisos es justo el guardia, y entonces la seguridad acabaria viviendo
en un solo archivo.

Del token **no sale ningun permiso**. Supabase incluye un campo `role`,
pero vale `authenticated` para todo el mundo: nombra el rol de PostgreSQL
de la sesion, no el de VSD Health. Y viaja tambien `user_metadata`, donde
cualquiera puede escribir desde el navegador llamando a `updateUser`; un
token con `user_metadata.rol = "administrador"` tiene la firma
perfectamente valida. El rol de VSD Health vive en la tabla `usuario`.

### Que rutas estan abiertas

El guardia se aplica a toda la API y las excepciones se declaran una a
una con `@Publico()`. Hoy son dos:

| Ruta                | Por que esta abierta                                              |
| ------------------- | ----------------------------------------------------------------- |
| `GET /health`       | La consulta el proveedor de despliegue, que no tiene cuenta       |
| `GET /api/catalogo` | Mismo contenido para todo el mundo, no sale de la cuenta de nadie |

Hay ademas una ruta que **si exige token pero no exige cuenta**, marcada con
`@SinCuenta()`: `POST /api/cuenta`. Tiene que ser asi por definicion, porque es
la que crea la cuenta que todas las demas exigen; sin esa marca, darse de alta
requeriria estar ya dado de alta.

Es al reves de proteger ruta por ruta, y es deliberado: olvidar el
decorador deja una ruta publica cerrada, que se nota en cuanto alguien la
usa; olvidar proteger deja una ruta privada abierta, que no se nota nunca.

### La seguridad nunca depende solo del frontend

Ocultar un boton no es un control de acceso. Toda restriccion visible en
la interfaz debe existir tambien en el backend. La interfaz mejora la
experiencia; el backend es quien decide.

---

## 4. Almacenamiento en el dispositivo

**No se usa `localStorage` para informacion sensible estructurada.**

`localStorage` es accesible desde cualquier script de la pagina, guarda
texto plano y no tiene control de expiracion.

El funcionamiento sin conexion usa **IndexedDB** a traves de un
adaptador. `localStorage` queda reservado para preferencias no sensibles
como el tema visual o el idioma.

### La cache HTTP del navegador es otra cosa (SCRUM-133)

Las copias propias de la aplicacion viven en IndexedDB, por persona, y se borran
al cerrar sesion. La **cache HTTP** del navegador no: sobrevive al cierre de
sesion y, en un equipo compartido (las salas de computo), la ve quien se sienta
despues. Por eso:

- **Toda lectura (`GET`) de algo de una persona responde `Cache-Control:
no-store`**: la cuenta, el diario, los pendientes, el progreso, los avisos, la
  foto, la mascota y la exportacion. Las demas operaciones (`POST`, `PATCH`,
  `PUT`, `DELETE`) no las guarda el navegador. Cada lectura tiene su prueba.
- **Lo publico** (el catalogo y la version del aviso) no lleva nada de nadie, asi
  que se deja guardar y se **revalida**: Express calcula el `ETag` y responde 304
  sin cuerpo si no cambio. El `ETag` se expone por CORS para que la aplicacion
  pueda leerlo.

---

## 5. Datos personales

- Se recoge el minimo necesario para que la funcionalidad exista.
- El consentimiento se solicita **una sola vez**, al crear la cuenta, y
  queda registrado con su fecha y la version del aviso aceptado.
- El usuario puede exportar y eliminar su informacion:
  - `GET /api/cuenta/exportacion` devuelve en JSON todo lo que se guarda
    de quien firma el token: la cuenta, los resultados, el diario, los
    pendientes, la hora de cada aviso y la foto de perfil, si tiene (en
    base64). De los navegadores suscritos solo dice cuántos son: sus
    direcciones y claves sirven para mandarle avisos a ese equipo, no para
    leerlas.
  - `DELETE /api/cuenta`, con la frase `BORRAR MI CUENTA`, borra la cuenta
    con todo lo suyo, sus archivos en Storage y su identidad en Supabase
    Auth. Es todo o nada: si Supabase no responde, la transaccion se deshace
    y no se borra nada. Los archivos se borran antes que la identidad: lo
    irreversible va al final.
  - `SUPABASE_SERVICE_ROLE_KEY` el backend la usa para **dos** cosas: borrar
    la identidad y guardar, leer y borrar los archivos de las personas en
    Supabase Storage (ADR 0016). Nunca para leer ni escribir datos de la
    base, que siguen pasando por `vsd_app` y sus politicas.
  - **La foto de perfil** (SCRUM-120). El navegador nunca habla con Storage:
    solo con la API. El bucket es privado y no tiene politicas, asi que ni la
    clave publica ni la sesion de otra persona abren nada. Ninguna ruta de la
    foto lleva un identificador: es siempre la de quien firma el token. La API
    no se fia del navegador y comprueba el tipo, el peso (menos de 50 KB), que
    el contenido sea lo que dice ser y su tamano en pixeles (hasta 1024 por
    lado). Se sirve con `Cache-Control: no-store`.
  - **La mascota propia, un SVG** (SCRUM-122, ADR 0017). Un SVG es un documento
    que puede llevar scripts, enlaces y entidades, asi que **no se guarda lo que
    llega: se reconstruye** desde una lista blanca de elementos y atributos, con
    un lector estricto (sin DOCTYPE, entidades, CDATA ni instrucciones de
    procesamiento) y cada valor validado contra su tipo. Lo peligroso se rechaza
    entero, con un motivo. Se muestra solo como `<img>`, y al devolverlo lleva una
    politica (`Content-Security-Policy: default-src 'none'; sandbox`) que lo deja
    inerte si alguien lo abre suelto. Va en su propio bucket privado y entra en la
    exportacion y en el borrado de la cuenta. **Es un saneador escrito a mano y no
    lo ha revisado nadie de fuera.**
  - Toda tabla nueva que guarde algo de una persona debe declarar su clave
    hacia `usuario` con `ON DELETE CASCADE`. La prueba
    `borradoDeCuenta.integracion.spec.ts` recorre cada tabla con columna
    `id_usuario` y falla si alguna conserva filas despues del borrado.
- Los datos de otros usuarios nunca aparecen en registros ni en
  mensajes de error.
- **Lo que alguien escribe no sale nunca por el registro.** Esto vale para el
  diario y para el texto libre de los resultados.
  - El registro de peticiones anota método, ruta, estado y duración, nunca el
    cuerpo.
  - De los errores de Prisma se anota el nombre, el código y la traza, nunca
    el mensaje, que repite los argumentos.
  - Un cuerpo que no se puede leer responde 400 o 413 sin anotarse, porque el
    mensaje de un JSON mal formado cita un trozo del cuerpo.
  - Los mensajes de error del diario dicen qué parte está mal, nunca qué
    contiene.
  - Hay pruebas que escuchan el registro de verdad y comprueban que el texto no
    aparece.
- El diario lo lee solo quien lo escribe; ni el administrador. Se edita solo
  durante su primera hora, y eso lo impone la base: un `UPDATE` directo con el
  rol de la aplicación, pasada esa hora, no encuentra la fila.
- **El diario no se analiza sin permiso** (SCRUM-108). Por defecto se guarda y
  se devuelve, y nada más: no se busca ninguna señal en lo que se escribe.
  - Solo si la persona enciende «Recomendaciones según mi diario» en su perfil
    se revisa lo escrito para ofrecerle las líneas de atención.
  - Lo puede apagar cuando quiera.
  - Las cuentas que ya existían quedaron apagadas.

El rol de administrador gestiona el catalogo de contenidos —categorias,
actividades y recursos de apoyo— y **no tiene acceso** a los resultados,
al historial ni a la informacion personal de ningun usuario.

---

## 6. Limite clinico

**VSD Health no diagnostica, no formula medicamentos y no reemplaza a
psicologos, medicos ni psiquiatras.**

Es una restriccion de seguridad, no de mercadotecnia: presentar un
resultado orientativo como un diagnostico puede llevar a alguien a no
buscar ayuda profesional.

En consecuencia:

- Los resultados se expresan en lenguaje orientativo.
- Los instrumentos clinicos con licencia restringida quedan excluidos.
- Ante senales de alerta, la aplicacion remite a recursos de ayuda
  profesional.

---

## 7. Marco legal aplicable

- **Ley 1581 de 2012** — proteccion de datos personales.
- **Decreto 1377 de 2013** — reglamentacion y tratamiento de datos sensibles.
- **Ley 1616 de 2013** — salud mental en Colombia.
- Concepto de la Superintendencia de Industria y Comercio sobre datos
  sensibles de salud.
