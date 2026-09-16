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
| `SUPABASE_JWT_SECRET`         | **Solo backend** | Permite falsificar identidades         |
| `DATABASE_URL` / `DIRECT_URL` | **Solo backend** | Acceso directo a la base               |

El frontend **no** tiene acceso ilimitado a la base de datos. Habla con
`vsd-backend`, y es el backend quien decide que devuelve.

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
- **Ninguna de las dos** protege contra un backend comprometido, que podria
  declarar la identidad que quisiera. Esa capa es la autenticacion, y llega
  en el Ciclo 5. Hasta entonces, la identidad viene en la peticion.

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

---

## 5. Datos personales

- Se recoge el minimo necesario para que la funcionalidad exista.
- El consentimiento se solicita **una sola vez**, al crear la cuenta, y
  queda registrado con su fecha y la version del aviso aceptado.
- El usuario puede exportar y eliminar su informacion.
- Los datos de otros usuarios nunca aparecen en registros ni en
  mensajes de error.

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
