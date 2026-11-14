# ADR 0018: El backend se despliega como una imagen de Docker; el frontend, no

- **Estado:** aceptado
- **Fecha:** 2026-10-07
- **Tarea:** SCRUM-131 (la imagen del backend). SCRUM-132 suma la del frontend y
  el entorno completo con un solo comando.

## Contexto

Docker es un requisito de la asignatura, y el entregable lo promete: _"para la
entrega final se preve empaquetar el backend y una base de datos PostgreSQL en
contenedores Docker, de modo que el proyecto completo pueda ejecutarse en
cualquier equipo con un solo comando y sin depender de lo que cada integrante
tenga instalado"_ (seccion 6).

Lo que habia hasta ahora:

- **Backend:** un servicio de Node en Render, que instala, compila y arranca
  con comandos escritos en el panel. No tenia `Dockerfile`.
- **Frontend:** un sitio estatico en Vercel.
- **Docker:** solo un `docker-compose.yml` con dos PostgreSQL, una para
  desarrollar y otra para las pruebas.

Lo que condiciona la decision:

- **Render** puede desplegar un servicio web desde un `Dockerfile`.
  **Vercel no ejecuta contenedores**: compila el proyecto y sirve el resultado.
- Una parte del equipo **no puede usar Docker en su maquina**: Docker Desktop en
  Windows exige elevacion y WSL2 (por eso existe `npm run db:local`). El
  desarrollo diario no puede depender de el.
- El proyecto aplica los _doce factores_ ([ambientes.md](../ambientes.md)): el
  mismo codigo en los tres ambientes, y lo unico que cambia es la configuracion.
  Eso incluye **lo que se ejecuta**, no solo el codigo que contiene.
- Las migraciones las aplica una persona, no el servicio (regla del equipo, y la
  opcion C de PROD).

## Decision

**El backend se construye una vez como imagen y esa misma imagen corre en el CI,
en el entorno completo y en Render. El frontend sigue en Vercel sin contenedor.**

1. **Un `Dockerfile` multi-etapa:** compilacion (todas las dependencias, genera
   el cliente de Prisma y compila), dependencias de produccion, y ejecucion
   (solo las dependencias de produccion y `dist`). Node 24 con la version menor
   fijada, sobre Debian `bookworm-slim`.
2. **Sin migraciones al arrancar.** Una migracion que corre sola en cada
   reinicio es una migracion que nadie reviso, y en PROD se aplica con
   aprobacion.
3. **Ningun secreto en la imagen.** `.dockerignore` funciona por lista blanca: se
   ignora todo y se permite solo lo que la imagen necesita. Un `.env.loquesea`
   nuevo no entra por descuido. Los valores llegan en el momento de ejecutar.
4. **`NODE_ENV=production` por omision.** Si alguien la ejecuta sin configurar
   nada, el servicio se niega a arrancar y dice que falta, en lugar de arrancar
   con los datos en memoria y perderlos al reiniciarse. Render y el compose lo
   sobrescriben con el ambiente que toque.
5. **El proceso corre como `node`, sin privilegios, y el codigo es de solo
   lectura** para ese usuario: no puede reescribirse a si mismo.
6. **El CI construye la imagen, la arranca y la comprueba:** que `/health`
   responda, que su `HEALTHCHECK` llegue a `healthy`, que corra sin ser root, que
   no lleve `.env` ni herramientas de desarrollo, que el codigo no se pueda
   escribir y que sin configuracion se niegue a arrancar.
7. **El cambio del servicio de Render a Docker lo hace una persona en el
   panel.** No se automatiza: se toca un servicio vivo con sus variables.

## Alternativas consideradas

**Todo en Render con Docker (frontend en nginx).** Una sola plataforma. Se
descarta porque se pierden las vistas previas por rama y la CDN de Vercel, y
porque el plan gratuito de Render duerme el servicio: la propia PWA tardaria en
abrir tras un rato de inactividad. El frontend es contenido estatico; un
contenedor no le aporta nada en produccion.

**Docker solo en local y en el CI, Render sigue con Node.** Es el cambio mas
pequeno. Se descarta porque rompe la paridad entre entornos: lo que se prueba
(la imagen) no seria lo que se despliega (el servicio de Node), y un fallo del
`Dockerfile` apareceria el dia de la entrega. Ademas dejaria el requisito
cumplido solo en el papel.

**Un `docker compose` desplegado en Render.** Render no ejecuta archivos de
compose: cada servicio se despliega por separado.

**Una sola imagen con frontend y backend.** Acoplaria dos despliegues que hoy son
independientes y que cambian a ritmos distintos.

**Alpine o distroless en vez de Debian slim.** Alpine usa `musl` en lugar de
`glibc`, y no se probo con `pg` ni con el cliente de Prisma; una diferencia ahi
se descubriria en produccion. Distroless no trae shell, y eso dificulta depurar
un contenedor en el sitio donde mas se necesita. `bookworm-slim` es lo mismo que
el equipo ya conoce, con un peso razonable. Si el peso llegara a importar, esta
es la primera decision que se revisa.

## Consecuencias

**A favor.** Lo que se prueba es lo que se despliega. Un `Dockerfile` roto se
detecta en el pull request y no el dia de la entrega. Cualquier equipo con Docker
puede levantar el sistema sin instalar Node ni PostgreSQL. El comportamiento al
faltar configuracion queda comprobado en el CI.

**En contra.**

- **Dos formas de ejecutar.** El desarrollo diario sigue siendo `npm run
start:dev` (rapido, con recarga) y la imagen es para el CI, el entorno completo
  y Render. Solo la imagen se comprueba automaticamente; el flujo diario es el de
  siempre.
- **La imagen es mas pesada que un despliegue de Node** y Render la reconstruye en
  cada despliegue.
- **`--omit=optional` es una decision que puede romperse en silencio.** El
  lockfile deja pasar a la imagen unos 140 paquetes de desarrollo (la CLI de
  Prisma, TypeScript, React...) porque `@prisma/client` los declara como pares
  opcionales; omitir las dependencias opcionales los quita, y la unica opcional
  real de produccion hoy es `pg-cloudflare`, que solo sirve en Cloudflare
  Workers. Si el dia de manana una dependencia de produccion agrega una opcional
  que si se use, la imagen arrancaria sin ella. El arranque y `/health` lo
  detectarian, pero una ruta poco usada no.
- **`HEALTHCHECK` sin `curl`.** Usa el `fetch` de Node. Lo lee `docker compose`;
  Render tiene su propia comprobacion sobre `/health`.

**A vigilar.** El peso de la imagen (el CI lo imprime) y que la version menor de
Node del `Dockerfile` no se quede atras respecto a la de `.nvmrc`.
