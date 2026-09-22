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
