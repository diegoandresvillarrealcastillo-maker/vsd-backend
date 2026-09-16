# ADR 0009 — Versionado de las entradas de diario y la regla de no sobrescribir

Estado: aceptado · 15/09/2026

## Contexto

El módulo Mi Diario (RF14) introduce el primer dato del sistema que **se edita**.

Todo lo demás se crea una vez y no se toca. Un resultado registra lo que pasó en
un momento: no se corrige, se añade otro. Por eso le basta con
`id_operacion_cliente` y su restricción `UNIQUE`: ese mecanismo resuelve
duplicados, que es el único problema que puede tener algo que nunca cambia.

Una entrada de diario es distinta. Alguien la escribe, la relee al día siguiente
y le añade un párrafo. Si la escribió en el celular sin conexión y la edita en el
computador antes de que el celular sincronice, existen dos versiones de la misma
entrada, ambas legítimas, y el identificador de operación no dice cuál es más
reciente porque es el mismo en las dos.

El requerimiento no funcional de integridad de datos exige que la sincronización
no pierda información pendiente. El riesgo asociado está clasificado como alto.

## Decisión

`ENTRADA_DIARIO` lleva un campo `version`, entero, que aumenta con cada edición.
Al sincronizar se compara la versión que trae el dispositivo con la que tiene el
servidor.

**La sincronización nunca sobrescribe.** Si el servidor tiene una versión más
reciente, la entrada que llega del dispositivo **no** reemplaza a la del
servidor: se guarda como una entrada nueva, marcada como copia, con su propio
identificador, y se le avisa a la persona para que decida qué hacer.

Perder un párrafo que alguien escribió en un mal momento no es un error de
datos recuperable. Preferimos que queden dos copias y un aviso antes que un
texto perdido en silencio.

## Alternativas consideradas

**Gana la última escritura.** Es la más simple: la versión más reciente
reemplaza a la anterior. Se descarta porque en un diario personal el costo de
equivocarse es perder algo que alguien escribió sobre sí mismo, y eso no se
recupera. Es una solución razonable para una preferencia de usuario, no para
esto.

**Fusión automática de los dos textos.** Combinar ambas versiones sin
intervención. Se descarta porque una fusión mal hecha produce un texto que la
persona no escribió, mezclando frases de dos momentos distintos. Es peor que
tener dos copias claras.

**Bloqueo de edición mientras haya cambios sin sincronizar.** Impedir editar
desde otro dispositivo hasta que se sincronice. Se descarta porque rompe el RF9:
el diario tiene que poder usarse sin conexión, y un bloqueo lo vuelve inútil
justo cuando más se necesita.

**Historial completo de versiones.** Guardar cada edición como una fila nueva.
Resuelve el problema y añade función, pero multiplica el almacenamiento del
contenido más sensible del sistema y complica el RF12, que debe poder borrarlo
todo. Se descarta por alcance; la regla de no sobrescribir da la garantía que
importa sin ese costo.

## Consecuencias

**A favor.** Nadie pierde lo que escribió. La regla es simple de explicar y de
probar. No depende de relojes sincronizados entre dispositivos, que es donde
fallan las soluciones basadas en marcas de tiempo.

**En contra.** Pueden aparecer entradas duplicadas que la persona tiene que
resolver a mano. La interfaz del Ciclo 8 debe mostrar con claridad que una
entrada es una copia y de dónde viene; una copia sin explicación confunde más
que ayudar.

**A vigilar.** Si las copias resultan frecuentes en el uso real, conviene
revisar si el problema está en la frecuencia de sincronización y no en la regla.
