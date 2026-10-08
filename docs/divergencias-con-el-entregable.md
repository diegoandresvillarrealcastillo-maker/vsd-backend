# Dónde el sistema se aparta del entregable, y por qué

El entregable académico es la fuente formal del proyecto. El repositorio es lo
que de verdad se ejecuta. Cuando los dos dicen cosas distintas, lo peligroso no
es la diferencia: es que nadie la haya escrito en ninguna parte.

Este documento existe para que esa lista no viva en la cabeza de nadie. Cada
divergencia dice qué decidimos, por qué, y dónde está la decisión completa.

**Regla:** una divergencia sin ADR es un descuido, no una decisión. Si aparece
una nueva, primero se escribe el ADR y después se anota aquí.

---

## 1. Autenticación: hay contraseña, pero no la guardamos nosotros

|                        |                                                                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **El entregable dice** | Autenticación propia con contraseña, campo `password_hash` en `USUARIO`, citando a INCIBE                                                             |
| **El sistema hace**    | Correo y contraseña —y Google como opción— a través de Supabase Auth. `password_hash` no existe en nuestra tabla; en su lugar hay `id_proveedor_auth` |
| **Decisión**           | [ADR 0012](adr/0012-contrasena-y-google-en-lugar-del-enlace-magico.md), que reemplaza al [ADR 0004](adr/0004-autenticacion-sin-contrasenas.md)        |

**Qué cambió, y cuándo.** Hasta el Ciclo 5 el sistema no tenía contraseñas en
absoluto: se entraba con un enlace mágico enviado al correo. Esa decisión era
el ADR 0004, y se reemplazó al construir las pantallas de acceso.

El motivo no es que el razonamiento del ADR 0004 fuera falso. Sigue siendo
cierto que sin contraseñas almacenadas no hay contraseñas que filtrar. El
problema es lo que aquel ADR no midió: **con enlace mágico, el correo se paga
en cada inicio de sesión**, y el correo resultó ser la pieza más frágil del
sistema. El remitente gratuito permite dos envíos por hora; con servicio propio
sube a treinta, pero los mensajes caen en spam mientras no haya dominio propio.
Y un enlace de un solo uso va atado al navegador que lo pidió.

Con contraseña, esos tres problemas se pagan solo al recuperar, que ocurre
pocas veces.

**Dónde sigue la divergencia.** El entregable pide que `USUARIO` tenga
`password_hash`, es decir, que **nosotros** guardemos la contraseña. No lo
hacemos: la guarda y la verifica Supabase, y nuestra tabla conserva únicamente
`id_proveedor_auth`.

Esa distinción es la decisión entera: se recupera la **usabilidad** de la
contraseña sin recuperar la **responsabilidad** de almacenarla. Aquí una
filtración de credenciales no expone un carrito de compras, expone datos de
salud, y esa parte del ADR 0004 se conserva intacta.

**Lo que cuesta, y hay que decirlo.** Vuelve a haber algo que se puede olvidar,
reutilizar en otro sitio y elegir débil. Y aparece un flujo de recuperación que
antes no existía. La política de contraseña es hoy el mínimo de ocho caracteres
que impone Supabase; el rechazo de contraseñas ya filtradas solo está en su
plan de pago, así que no se puede activar.

**Sobre el RF9.** El enlace mágico exigía correo _y_ conexión para entrar. La
contraseña solo exige conexión. La sesión ya iniciada sobrevive sin red en los
dos casos, y su duración se decidió en el Ciclo 5: token de acceso de una hora
y refresco de treinta días, con la opción de no recordar el dispositivo para
las salas de cómputo.

## 2. Identificadores: UUID, no enteros

|                        |                                                  |
| ---------------------- | ------------------------------------------------ |
| **El entregable dice** | Claves primarias `INT`                           |
| **El sistema hace**    | `UUID` en las seis tablas                        |
| **Decisión**           | [ADR 0003](adr/0003-uuid-como-clave-primaria.md) |

**Por qué.** Dos razones, y las dos salen de requerimientos del propio
entregable:

**El dispositivo crea registros sin servidor.** El RNF de disponibilidad
offline obliga a que una actividad completada sin conexión tenga identificador
desde el primer momento. Un entero secuencial no se puede generar en el
dispositivo sin arriesgar colisiones cuando dos personas sincronizan.

**Un entero se puede recorrer.** Con `/resultados/123`, probar `124` es
gratis. La restricción del proyecto dice que una persona jamás accede a
información de otra _aun conociendo su identificador o la URL_. Un UUID no se
adivina.

Dicho de otra forma: **el propio entregable pide dos cosas que su tipo de dato
no permite cumplir.** Por eso gana el código.

## 3. La IA: el entregable tiene razón, y se respeta

|                        |                                                                  |
| ---------------------- | ---------------------------------------------------------------- |
| **El entregable dice** | La inteligencia artificial queda **fuera** de la primera versión |
| **El sistema hace**    | Existe VSD IA, y **no es inteligencia artificial**               |
| **Decisión**           | [ADR 0011](adr/0011-la-deteccion-de-riesgo-es-por-reglas.md)     |

**Esta no es una divergencia: es un problema de nombre.**

Lo que se construyó en el Ciclo 4 es una tabla de reglas y una lista de frases.
No hay modelo, no hay aprendizaje, no hay probabilidad. Ante cualquier
respuesta se puede señalar la regla exacta que la produjo.

La exclusión del entregable se respeta al pie de la letra, y además por el
motivo correcto: **la detección de señales de riesgo no se delega a un modelo
ni ahora ni en la Fase 2.** Un modelo acierta casi siempre, y el casi, en este
caso concreto, es una persona sola que pidió ayuda y no la recibió.

**Lo que sí hay que corregir es cómo se llama.** Un producto que se anuncia
como "VSD IA" dentro de un documento que excluye la IA se lee como una
contradicción, aunque por dentro sea determinista. En el documento se describe
por lo que es: asistente por reglas.

## 4. La sesión se guarda en `localStorage`, y el entregable pide que no

|                        |                                                                                                                                                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **El entregable dice** | HU_MF09_001, seguridad y privacidad: «No guardar tokens en LocalStorage; separar datos por usuario y limpiar al cerrar sesión»                                                                                              |
| **El sistema hace**    | El token de acceso (una hora) y el de refresco (treinta días) de Supabase viven en `localStorage`, bajo `vsd.sesion`. **Todo lo demás de la persona** está en IndexedDB, cifrado, una base por persona, y se borra al salir |
| **Decisión**           | [ADR 0021](adr/0021-la-sesion-de-supabase-vive-en-localstorage.md)                                                                                                                                                          |

**Qué se cumple y qué no.** Se cumplen las otras dos mitades de esa línea: los datos
están separados por persona y se limpian al cerrar sesión. No se cumple la primera.

**Por qué.** Sin la sesión guardada no se puede abrir la aplicación sin red, porque
no se sabría de quién es el almacén que hay que abrir; y entrar necesita conexión.
Una cookie `httpOnly` no lo resolvería (la página no la puede leer, así que habría
que guardar aparte quién es la persona) y metería nuestra API, que se duerme, en el
camino del inicio de sesión.

**Lo que cuesta, y hay que decirlo.** Un script que corra dentro de la página puede
leer el token. Lo acota que el de acceso dure una hora; no lo elimina. **Hoy no hay
una política de contenido (CSP)**, ni en Vercel ni en la imagen de nginx: es la
defensa que más reduciría este riesgo y queda para la auditoría de seguridad. Y como
la casilla «Recordar en este dispositivo» viene marcada, en un computador compartido
quien no la desmarca ni cierra sesión deja la suya abierta.

## 5. VSD IA responde algo sin conexión

|                        |                                                                                                                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **El entregable dice** | «No todas las funciones podrán operar sin conexión»; el modo sin conexión es para funciones declaradas (CU-013). VSD IA es un asistente por reglas, y no se dice que funcione sin red                          |
| **El sistema hace**    | Un asistente **mixto**: sin conexión responde saludos, agradecimientos, despedidas, las líneas de atención de su país y «dónde busco ayuda»; todo lo demás dice que necesita conexión                          |
| **Decisión**           | [ADR 0011](adr/0011-la-deteccion-de-riesgo-es-por-reglas.md) (actualización de SCRUM-141) y el punto 11 del [ADR 0019](adr/0019-el-modo-sin-conexion-guarda-en-el-dispositivo-y-envia-una-cola-idempotente.md) |

**Es una ampliación, no una contradicción.** Sigue siendo un asistente por reglas
(divergencia 3): sin conexión se aplican **las mismas reglas que usa el servidor**,
que este publica en `GET /api/asistente/reglas-locales`. El dispositivo no lleva una
lista propia de frases ni de teléfonos, y dos pruebas comprueban que responde igual
que el servidor ante las mismas 58 frases.

**Por qué.** Quien más necesita una línea de atención es quien, justo entonces,
puede no tener red. Que el asistente calle en ese momento sería lo peor que podría
hacer. Lo demás exige conexión y lo dice; **nunca inventa una respuesta**.

**Lo que no queda resuelto.** Sin sesión no hay reglas: viven en el almacén de la
persona, así que las líneas de atención no están en la pantalla de acceso. Y el
paquete no pasa por la caché del service worker, que no toca la API por diseño
(SCRUM-135).

## 6. Lo que exige conexión es más de lo que se acordó

|                        |                                                                                                                                                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **El entregable dice** | Requisito del equipo: todo disponible sin conexión **salvo** el cambio de contraseña, el cambio de correo y la configuración del perfil. HU_MF09_001, criterio 3: lo no disponible «informa la limitación sin simular éxito» |
| **El sistema hace**    | Exigen conexión también entrar, registrarse, recuperar la contraseña, descargar los datos, borrar la cuenta, añadir un módulo y empezar la bienvenida. **El cambio de correo no existe** en la aplicación                    |
| **Decisión**           | [ADR 0022](adr/0022-lo-que-exige-conexion-se-ve-deshabilitado-y-no-se-guarda-para-despues.md)                                                                                                                                |

**Por qué.** Lo que prueba quién es la persona o lo que el servidor decide en el
momento no se puede guardar «para después» sin decirle que ya pasó algo que no ha
pasado. Se ve deshabilitado, con «Necesitas conexión para esto.», y lo escrito no se
pierde.

**Lo que falta.** El cambio de correo no se puede bloquear porque no existe; cuando se
construya, debe exigir conexión. No es una divergencia que se cierre aquí: es una
funcionalidad del entregable que la aplicación no tiene.

## 7. La orientación de una actividad hecha sin conexión llega después

|                        |                                                                                                                                                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **El entregable dice** | CU-008 y CU-013: ante una pérdida de red, «crear operación pendiente si está habilitado». El flujo principal termina mostrando la orientación                                                                                                     |
| **El sistema hace**    | Sin red, el resultado queda guardado en el equipo y **la orientación se muestra al sincronizar**: en la pantalla si sale enseguida, y en el aviso de «Volviste a tener conexión» (con el nombre de la actividad y su nivel) si esperó más de 30 s |
| **Decisión**           | Punto 11 del [ADR 0019](adr/0019-el-modo-sin-conexion-guarda-en-el-dispositivo-y-envia-una-cola-idempotente.md) (decisión del equipo)                                                                                                             |

**Por qué.** La orientación la calcula el servidor, con la regla de cada actividad y
el nivel que corresponde. Calcularla en el dispositivo sería copiar esa regla en un
segundo sitio, donde se desactualiza sin que nada falle; y una orientación equivocada
en un producto de salud es peor que una orientación tarde. Mientras tanto la pantalla
dice «Guardado en este equipo» y **no promete lo que no sabe**.

**Lo que se pierde.** Quien termina una actividad sin red no sabe su orientación hasta
que vuelva la conexión. Si la orientación sugiere acompañamiento, el aviso ofrece las
líneas de atención en ese momento, no antes.

## 8. Se sincroniza con la aplicación abierta

|                        |                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **El entregable dice** | HU_MF09_002, criterio 1: «vuelve la conexión y mi sesión es válida, cuando inicia la sincronización, entonces las operaciones se envían en orden compatible»                    |
| **El sistema hace**    | Envía **mientras la aplicación está abierta** (al volver la red, al abrirla, al volver a la pestaña y cada 30 s si hay algo listo). Con la aplicación cerrada, envía al abrirla |
| **Decisión**           | [ADR 0019](adr/0019-el-modo-sin-conexion-guarda-en-el-dispositivo-y-envia-una-cola-idempotente.md), «Alternativas» y «Consecuencias»                                            |

**Por qué.** La API de sincronización en segundo plano (Background Sync) no existe en
Safari ni en Firefox, y buena parte de las personas usará iPhone: el comportamiento
sería distinto justo donde más se usa. El motor es el mismo, así que si se suma donde
exista no hay que rehacerlo.

**Lo que se pierde.** Lo hecho sin red no llega al servidor hasta que la persona abre
la aplicación otra vez. Si ya dio permiso a los avisos, una notificación neutra la
avisa cuando se envió; **nunca pide el permiso por su cuenta**. Y el criterio se
cumple tal como está escrito (cuando inicia la sincronización, se envía en orden);
lo que no se cumple es la expectativa, razonable, de que ocurra sin abrir nada.

## 9. Docker: el backend en Render como imagen, el frontend en Vercel sin contenedor

|                        |                                                                                                                                                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **El entregable dice** | Sección 6: empaquetar el backend y una base de datos PostgreSQL en contenedores Docker, para que el proyecto se ejecute en cualquier equipo «con un solo comando». Despliegue: Vercel (PWA), Render (backend), Supabase |
| **El sistema hace**    | `docker compose --profile completo up --build` levanta base, migraciones, API y la web. En producción, el backend es una imagen de Docker en Render; el frontend sigue en Vercel, que no ejecuta contenedores           |
| **Decisión**           | [ADR 0018](adr/0018-el-backend-se-despliega-como-una-imagen-de-docker.md)                                                                                                                                               |

**Qué falta, y lo hace una persona.** La imagen existe y el CI la construye y la
prueba, pero **el servicio de Render sigue siendo el de Node de antes**: pasarlo a
Docker se hace a mano en el panel (`ambientes.md`, «Pasar el servicio de Render a
Docker») y todavía no se ha hecho. Hasta entonces, lo que corre en PRE es el
servicio anterior; el `Dockerfile` del repositorio no cambia nada de lo desplegado.

**Lo que no se puede comprobar aquí.** Parte del equipo no puede usar Docker en su
máquina, así que la imagen se ejercita en el CI de GitHub; ver `ambientes.md`.

---

## Lo que ya se reconcilió

No todo lo que se apartó del entregable sigue abierto. Esto ya está corregido
en el documento:

| Cambio                                                                 | Ciclo |
| ---------------------------------------------------------------------- | ----- |
| RF14 y el módulo Mi Diario                                             | 4     |
| Sexta tabla `ENTRADA_DIARIO`                                           | 4     |
| Cuatro campos nuevos en `ACTIVIDAD` (escala, máximo, umbrales, textos) | 4     |
| `puntaje` pasa a admitir nulo                                          | 4     |
| Dos riesgos nuevos y la fila del rol editor                            | 4     |

## Documentos relacionados

- [Modelo de datos](modelo-de-datos.md) — el esquema real, tabla por tabla
- [Seguridad](seguridad.md) — aislamiento, secretos y límite clínico
- [Decisiones de arquitectura](adr/) — por qué el proyecto es como es
