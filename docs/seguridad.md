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
5. **RLS en PostgreSQL como defensa en profundidad**, no como defensa
   principal. Prisma se conecta con un rol de aplicacion y no propaga el
   JWT del usuario a la sesion de PostgreSQL, asi que RLS no puede ser
   la unica barrera.

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
