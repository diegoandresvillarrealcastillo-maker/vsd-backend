# Dónde el sistema se aparta del entregable, y por qué

El entregable académico es la fuente formal del proyecto. El repositorio es lo
que de verdad se ejecuta. Cuando los dos dicen cosas distintas, lo peligroso no
es la diferencia: es que nadie la haya escrito en ninguna parte.

Este documento existe para que esa lista no viva en la cabeza de nadie. Cada
divergencia dice qué decidimos, por qué, y dónde está la decisión completa.

**Regla:** una divergencia sin ADR es un descuido, no una decisión. Si aparece
una nueva, primero se escribe el ADR y después se anota aquí.

---

## 1. Autenticación: sin contraseñas

|                        |                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| **El entregable dice** | Autenticación propia con contraseña, campo `password_hash` en `USUARIO`, citando a INCIBE       |
| **El sistema hace**    | Enlace mágico con Supabase Auth. `password_hash` no existe; en su lugar hay `id_proveedor_auth` |
| **Decisión**           | [ADR 0004](adr/0004-autenticacion-sin-contrasenas.md)                                           |

**Por qué.** Gestionar contraseñas obliga a hacerse cargo del algoritmo de
derivación, la recuperación por correo, la caducidad de los enlaces, el límite
de intentos, el bloqueo por fuerza bruta y la rotación de sesiones. Son seis
sitios donde equivocarse, en un equipo de dos personas con calendario
académico.

Y aquí una filtración de credenciales no expone un carrito de compras: expone
datos de salud. **Sin contraseñas almacenadas no hay contraseñas que filtrar.**

**Lo que cuesta, y hay que decirlo.** Un enlace mágico necesita correo, y el
correo necesita conexión. El RF9 exige que la aplicación funcione sin ella. Una
sesión ya iniciada sobrevive sin red, pero si caduca estando sin conexión, la
persona se queda fuera de su propio diario.

Eso hay que resolverlo en el Ciclo 5 decidiendo la duración de la sesión, no
descubrirlo cuando pase.

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
