# ============================================================
#  VSD Health - imagen del backend (SCRUM-131)
# ============================================================
#  La misma imagen corre en tres sitios: el computador de cada
#  integrante (docker compose), el CI y Render. Lo unico que
#  cambia entre uno y otro es la configuracion, que entra por
#  variables de entorno. Ver docs/ambientes.md y el ADR 0018.
#
#    docker build -t vsd-api .
#    docker run --rm -p 3000:3000 --env-file .env vsd-api
#
#  Tres etapas, para que lo que se ejecuta no arrastre lo que
#  solo hace falta para construir:
#
#    compilacion   todas las dependencias, genera el cliente de
#                  Prisma y compila TypeScript.
#    dependencias  solo las de produccion.
#    ejecucion     la imagen final: dependencias + dist.
#
#  Lo que esta imagen NO hace, a proposito:
#
#    - No aplica migraciones al arrancar. Las aplica una persona
#      (docs/ambientes.md). Una migracion que corre sola en cada
#      reinicio es una migracion que nadie reviso.
#    - No lleva ningun .env, ni se lo copia. Los secretos entran
#      en el momento de ejecutar, nunca en una capa de la imagen.
# ============================================================

# Node 24, como .nvmrc, pero con la version menor fijada: evita que una
# construccion del jueves cambie de runtime respecto a la del martes. Al subir
# de menor, se cambia aqui y se prueba en el CI como cualquier otro cambio.
ARG IMAGEN_DE_NODE=node:24.21-bookworm-slim

# ---------- 1. Compilacion ----------
FROM ${IMAGEN_DE_NODE} AS compilacion
WORKDIR /app

# HUSKY=0: `prepare` instala ganchos de git y aqui no hay repositorio.
ENV HUSKY=0 \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_UPDATE_NOTIFIER=false

# El esquema y su configuracion van ANTES de instalar: `postinstall` ejecuta
# `prisma generate`, que los necesita. Con este orden, cambiar el codigo no
# invalida la capa de las dependencias.
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci

COPY tsconfig.json nest-cli.json ./
COPY src ./src
RUN npm run build

# ---------- 2. Dependencias de produccion ----------
FROM ${IMAGEN_DE_NODE} AS dependencias
WORKDIR /app

ENV HUSKY=0 \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_UPDATE_NOTIFIER=false

COPY package.json package-lock.json ./
# --ignore-scripts: `postinstall` ejecuta `prisma generate` y `prepare` ejecuta
# husky, y los dos son herramientas de desarrollo que aqui no se instalan. El
# cliente de Prisma ya viene generado de la etapa anterior.
#
# --omit=optional: sin esto la imagen arrastra unos 140 paquetes de desarrollo
# (la CLI de Prisma, TypeScript, React...) porque @prisma/client los declara
# como pares opcionales, y npm los trata como "dev y opcional" y se los lleva
# aunque se pida --omit=dev. La unica dependencia opcional real de produccion
# es pg-cloudflare, que solo sirve para Cloudflare Workers.
RUN npm ci --omit=dev --omit=optional --ignore-scripts \
    && npm cache clean --force

# ---------- 3. Ejecucion ----------
FROM ${IMAGEN_DE_NODE} AS ejecucion
WORKDIR /app

# Por omision, produccion: si alguien lo ejecuta sin configurar nada, el
# servicio se niega a arrancar (pide la base de datos y la clave de servicio)
# en lugar de arrancar en memoria y perder los datos al reiniciarse. Render y
# el compose sobrescriben este valor.
ENV NODE_ENV=production \
    PORT=3000

COPY package.json ./
COPY --from=dependencias /app/node_modules ./node_modules
# El cliente que genero `prisma generate` vive fuera de @prisma/client.
COPY --from=compilacion /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=compilacion /app/dist ./dist

# Sin privilegios, y el codigo de solo lectura: lo copia root, el proceso corre
# como `node` y no puede reescribirse a si mismo.
USER node

EXPOSE 3000

# Lo usa `docker compose` (depends_on: service_healthy). Render tiene su propia
# comprobacion sobre /health y no lee esta. Sin curl en la imagen: se usa el
# fetch de Node.
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"]

CMD ["node", "dist/infrastructure/main.js"]
