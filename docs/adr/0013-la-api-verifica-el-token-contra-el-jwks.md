# ADR 0013 — La API verifica el token contra el JWKS de Supabase

- **Estado:** Aceptada
- **Fecha:** 2026-09-23
- **Ciclo:** 5

## Contexto

Hasta ahora la API no sabia quien llamaba. El identificador de la
persona viajaba **en el cuerpo de la peticion**, tanto al registrar un
resultado como al preguntarle al asistente.

Eso dejaba el aislamiento en manos de quien llamaba. Cualquiera con
`curl` podia escribir el identificador de otra persona y la API se lo
creia. En el caso del asistente era peor que un registro mal atribuido:
el asistente personaliza su respuesta con el historial reciente de quien
pregunta, asi que preguntando en nombre de otro se leia en la respuesta
cuanto habia usado la aplicacion esa persona.

El trabajo del [ADR 0010](0010-aislamiento-en-la-base-de-datos.md) no
servia de nada mientras tanto. Las politicas de PostgreSQL filtran por
`vsd.usuario_actual`, y ese valor salia del mismo cuerpo de la peticion:
la base aislaba perfectamente a la persona que el cliente hubiera
decidido ser.

Desde el [ADR 0012](0012-contrasena-y-google-en-lugar-del-enlace-magico.md)
quien entra recibe de Supabase un **JWT**. El navegador ya lo tiene. La
decision es como comprueba la API que ese token es autentico.

## Decision

La API verifica cada token contra el **JWKS** de Supabase: la lista de
claves publicas que el proyecto publica en
`<SUPABASE_URL>/auth/v1/.well-known/jwks.json`.

Se comprueban cuatro cosas, y ninguna se lee del propio token:

| Que   | Contra que                             | Por que                                                                                               |
| ----- | -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `alg` | Lista fija en el codigo: ES256 y RS256 | Ver abajo                                                                                             |
| `iss` | `<SUPABASE_URL>/auth/v1`               | Un token de otro proyecto de Supabase es valido y esta firmado; lo unico que falla es quien lo emitio |
| `aud` | `authenticated`                        | Deja fuera los tokens de servicio                                                                     |
| `exp` | El reloj, con 10s de tolerancia        | Desfase entre Supabase y el servidor                                                                  |

De ahi sale un identificador, y **ese** es el que se le da a
`set_config('vsd.usuario_actual', ...)`. El campo `userId` desaparece
de los cuerpos de peticion.

El guardia se registra para **toda** la API, y las rutas abiertas se
declaran una a una con `@Publico()`. Hoy son dos: el estado del servicio,
que consulta el proveedor de despliegue sin tener cuenta, y el catalogo,
que es el mismo texto para todo el mundo. Es al reves de proteger ruta
por ruta, y es deliberado: olvidar el decorador deja una ruta publica
cerrada, que se nota en cuanto alguien la usa; olvidar proteger deja una
ruta privada abierta, que no se nota nunca.

### Por que el JWKS y no `SUPABASE_JWT_SECRET`

Supabase ofrece tambien un secreto compartido con el que firma en HS256.
Es mas facil de configurar: una variable de entorno y listo. Se descarta
por dos razones.

**El secreto compartido sirve para firmar, no solo para comprobar.**
Tenerlo en la API significa que filtrar la configuracion del servidor
basta para fabricar la identidad de cualquier persona. Con la clave
publica, lo peor que puede hacer quien la obtenga es exactamente lo que
ya podia hacer cualquiera: comprobar firmas.

**La rotacion.** Las claves se cambian cada cierto tiempo. El JWKS se
consulta solo y guarda el resultado; con el secreto en una variable de
entorno, cada rotacion es un despliegue y un rato de tokens rechazados
en medio.

### Por que la lista de algoritmos esta fijada en el codigo

Es la parte que mas facil seria hacer mal. Si la verificacion aceptara
el algoritmo que declara la cabecera del token, existiria la **confusion
de algoritmo**: la clave publica esta publicada a proposito, asi que
cualquiera la tiene, y bastaria con firmar un token propio en HS256
usando esa clave publica como si fuera el secreto compartido. La firma
cuadraria y el token seria aceptado.

Por eso la lista vive en el codigo, contiene solo algoritmos asimetricos
y **no incluye HS256**. Hay una prueba que intenta exactamente ese
ataque y comprueba que se rechaza.

### Lo que el guardia no hace

No autoriza. Sabe quien eres; no decide que puedes.

Es una distincion que conviene sostener, porque el sitio natural para
empezar a meter permisos es justo este. La autorizacion vive mas adentro:
en las politicas de la base, que filtran por la identidad que el guardia
establece, y en el dominio, que ya sabe que el rol de administrador no da
acceso a los datos de nadie.

Ligado a eso: del token **no sale ningun permiso**. Supabase incluye un
campo `role`, pero vale `authenticated` para todo el mundo porque nombra
el rol de PostgreSQL de la sesion, no el de VSD Health. Y viaja tambien
`user_metadata`, donde cualquiera puede escribir desde el navegador
llamando a `updateUser`: un token con `user_metadata.rol =
"administrador"` tiene la firma perfectamente valida. Nuestro rol vive en
la tabla `usuario`, que es nuestra.

## Alternativas descartadas

**Seguir con el identificador en el cuerpo y confiar en el frontend.**
Es lo que habia. Una de las reglas del proyecto dice que la seguridad
nunca debe depender unicamente del frontend, y aqui dependia
enteramente: el navegador podia enviar lo que quisiera.

**Verificar con `SUPABASE_JWT_SECRET` en HS256.** Mas simple de montar.
Descartada por lo de arriba: pone en el servidor una clave que permite
firmar, y ata la rotacion a un despliegue.

**Preguntarle a Supabase por cada peticion** (`GET /auth/v1/user` con
el token). Verifica de verdad y ademas detecta sesiones revocadas al
instante. Descartada porque anade una llamada de red a cada peticion de
la API, y porque ata nuestra disponibilidad a la suya: si Supabase tarda,
toda la aplicacion tarda. La revocacion se cubre con la caducidad corta
de los tokens de acceso.

**Proteger ruta por ruta en vez de abrir ruta por ruta.** Descartada por
la asimetria del olvido, explicada arriba.

## Consecuencias

### A favor

- Un usuario no puede acceder a informacion de otro aunque conozca su
  UUID, el identificador de una operacion o el endpoint exacto. Ahora lo
  impiden dos capas independientes, y la de la base recibe por fin una
  identidad que el cliente no eligio.
- El aislamiento del ADR 0010 pasa de estar construido a estar en uso.
- La API no guarda ninguna clave capaz de firmar tokens.
- Una rotacion de claves en Supabase no requiere tocar el despliegue.

### En contra

- **`SUPABASE_URL` es obligatoria en los cuatro ambientes, incluido
  desarrollo**, y sin ella el servicio no arranca. Es un paso mas al
  preparar la maquina. Se acepta a proposito: permitir que faltara en
  desarrollo daria un ambiente donde la API no comprueba quien llama, y
  es el ambiente en el que se trabaja todos los dias.
- La primera peticion despues de arrancar paga la consulta del JWKS. Son
  milisegundos y solo la primera, pero existe.
- **Si Supabase no responde, ningun token se puede verificar y la API
  responde 401 a todo.** Se elige eso frente a aceptar tokens sin
  comprobar, que seria no verificar nada justo cuando no se puede
  verificar.
- Un cliente que siga enviando `userId` en el cuerpo recibe un 400, no
  un aviso. Es deliberado —ignorarlo en silencio dejaria al cliente
  creyendo que elige el usuario mientras el servidor usa otro— pero
  significa que el frontend debe actualizarse a la vez.
- Una sesion cerrada en Supabase sigue siendo valida aqui hasta que
  caduca el token de acceso. Es la contrapartida de no preguntar a
  Supabase en cada peticion.
