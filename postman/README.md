# Coleccion de Postman

Sirve para dos cosas: probar la API a mano mientras se desarrolla, y
demostrarla ante el comite sin depender de que nada se copie bien en el
momento.

| Archivo                               | Que es                                     |
| ------------------------------------- | ------------------------------------------ |
| `vsd-health.postman_collection.json`  | Las 13 peticiones, con sus comprobaciones. |
| `vsd-health.postman_environment.json` | Las variables. Se versiona con marcadores. |

## Que hace distinto

**No hay que copiar el token a mano.** La primera peticion inicia sesion
contra Supabase con correo y contrasena, igual que hace el navegador, y guarda
el `access_token` en el entorno. Las demas lo usan solas.

Eso importa mas de lo que parece: el token de acceso dura **una hora**, y el
sintoma de que caduco es que todo empieza a responder 401 de golpe sin que
nadie haya tocado nada. Con este esquema, se vuelve a lanzar la peticion 0 y
listo.

**Cada peticion comprueba su propio resultado.** Son 36 comprobaciones
automaticas, asi que la coleccion se puede ejecutar entera y mostrar el
resultado en lugar de ir pulsando botones uno por uno.

**Estan los caminos de error, no solo los de exito.** Es la parte que de
verdad demuestra algo: que sin token no se registra nada, que el cuerpo no
puede elegir de quien es un resultado, y que cada regla del dominio responde
con su codigo.

## Preparar

### 1. Levantar lo que hace falta

```bash
npm run db:arriba      # PostgreSQL en Docker
npm run db:aplicar     # migraciones, la primera vez
npm run start:dev      # la API en el puerto 3000
```

### 2. Importar los dos archivos

En Postman, **Import**, y arrastra los dos archivos de esta carpeta.

Despues selecciona el entorno **VSD Health - DEV** en el desplegable de arriba
a la derecha. Mientras diga _No Environment_, las variables no existen y
ninguna peticion sabe siquiera a que direccion ir.

### 3. Completar cuatro variables

El entorno se versiona con marcadores, igual que `.env.example`. Hay que
rellenarlo con valores reales, y esos valores **no vuelven al repositorio**.

| Variable      | De donde sale                                     |
| ------------- | ------------------------------------------------- |
| `supabaseUrl` | `VITE_SUPABASE_URL` de `vsd-frontend/.env.local`  |
| `anonKey`     | `VITE_SUPABASE_ANON_KEY` del mismo archivo        |
| `correo`      | Una cuenta de prueba, con el correo ya confirmado |
| `contrasena`  | La de esa cuenta                                  |

La clave anonima es publica por diseno —viaja en el paquete que descarga
cualquier navegador— pero aqui se deja como marcador por coherencia con el
resto del proyecto: en el repositorio no entran valores reales de
configuracion, sean secretos o no.

## Usar

Boton **Run** sobre la coleccion. El orden importa: la peticion 0 deja el
token, la 3 deja el identificador del resultado que usa la 4.

Tambien se puede ejecutar sin abrir Postman:

```bash
npx newman run postman/vsd-health.postman_collection.json \
  -e postman/vsd-health.postman_environment.json
```

Con el entorno tal como esta en el repositorio, esa orden falla en todo lo que
necesita sesion y pasa en lo demas. Es lo correcto: sin credenciales no hay
sesion que valga.

## Que demuestra cada peticion

| #    | Que demuestra                                                       |
| ---- | ------------------------------------------------------------------- |
| 0    | Se inicia sesion. La contrasena va a Supabase, nunca a nuestra API. |
| 1, 2 | Las rutas publicas responden sin sesion y no filtran de mas.        |
| 3    | Se registra un resultado. Devuelve el **nivel**, nunca el puntaje.  |
| 4    | Reenviar la misma operacion devuelve **el mismo** resultado.        |
| 5    | Sin token no se registra nada: 401.                                 |
| 6    | El cuerpo no puede decir de quien es el resultado: 400.             |
| 7-10 | Las reglas del dominio, cada una con su codigo.                     |
| 11   | El asistente responde y no devuelve lo que la persona escribio.     |
| 12   | Ante una senal de riesgo, **siempre** lineas de atencion.           |

Cada peticion lleva su propia descripcion dentro de Postman explicando por que
esta hecha asi. Si alguien pregunta en la sustentacion, el argumento ya esta
escrito ahi.

## Lo que no se debe hacer

**No exportar el entorno con las credenciales dentro.** Si hay que compartirlo,
se vacian `correo` y `contrasena` antes. Un entorno exportado con la contrasena
es la contrasena.

**No commitear el entorno relleno.** El CI pasa Gitleaks sobre todo el
historial y borrarlo en un commit posterior no lo quita de ahi.

## Cuando algo falla

| Sintoma                                | Causa                                                          |
| -------------------------------------- | -------------------------------------------------------------- |
| `ECONNREFUSED`                         | La API no esta arrancada.                                      |
| `unresolved variable`                  | Falta seleccionar el entorno arriba a la derecha.              |
| `invalid_credentials` en la peticion 0 | Correo o contrasena mal, o la cuenta nunca confirmo el correo. |
| Todo responde 401 de golpe             | El token caduco. Relanza la peticion 0.                        |
| `SESION_REQUERIDA`                     | No llego cabecera de autorizacion.                             |
| `SESION_INVALIDA`                      | Llego un token, pero no paso la verificacion.                  |

La diferencia entre los dos ultimos codigos es util al diagnosticar y no se le
cuenta a quien llama: los dos son 401 y ninguno explica mas. Distinguir
"caducado" de "firma invalida" le ahorraria trabajo a quien este probando
combinaciones.

## Otras formas de probar lo mismo

- **Swagger**, en `http://localhost:3000/api/docs` mientras el servidor corre.
- **`peticiones.http`**, en la raiz del repositorio, con la extension REST
  Client de VS Code.

Las tres llaman a la misma API. Postman es la que queda versionada y la que se
puede ejecutar de una sola vez.
