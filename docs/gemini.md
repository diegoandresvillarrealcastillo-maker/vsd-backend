# Gemini con respaldo por reglas

VSD IA aplica primero su motor determinista. Las senales de riesgo, el lenguaje
ofensivo, los recursos verificados y las preguntas que ya conoce nunca salen a
Gemini. Solo una pregunta general de salud que las reglas no reconocen puede
enviarse al proveedor.

## Configuracion

En Render se configura `GEMINI_API_KEY` como secreto del backend. La clave no
se pone en Vercel, en una variable `VITE_*`, en Git ni en registros.

PRE conserva temporalmente el nombre anterior `GEMINI_PRE_API_KEY`; no se deben
configurar las dos variables al mismo tiempo.

El servidor usa primero `gemini-3.5-flash-lite` y, si el proyecto no tiene ese
modelo, intenta `gemini-3.1-flash-lite`. Si Google devuelve un error, agota la
cuota, tarda mas de quince segundos o entrega una salida invalida, VSD IA
devuelve exactamente la respuesta por reglas. La persona no ve codigos internos
ni un error del proveedor.

## Limites de salud

Gemini puede explicar informacion general de salud fisica y mental, bienestar,
sueno, alimentacion, actividad fisica, salud sexual, prevencion y autocuidado.
No diagnostica, receta, indica dosis ni recomienda tratamientos personalizados.
Las posibles urgencias reciben una remision fija a atencion urgente.

El backend no envia el identificador de la cuenta, correo, nombre de mascota,
diario, resultados ni archivos. Aun asi, una persona puede escribir datos
sensibles dentro de su pregunta. La interfaz y la politica de privacidad deben
informar que el texto puede ser procesado por Google. El nivel gratuito puede
usar entradas y salidas para mejorar sus productos.

## Verificacion

Con una cuenta adulta autenticada:

1. una pregunta conocida, como `¿Dónde busco ayuda?`, debe usar las reglas;
2. una pregunta general, como `¿Qué es la hipertensión?`, debe recibir una
   explicacion breve sin diagnostico;
3. una peticion de diagnostico o dosis debe remitir a un profesional;
4. una expresion de riesgo debe devolver los recursos de VSD sin llamar a
   Gemini;
5. con una clave invalida o cuota agotada, una pregunta desconocida debe
   devolver el mensaje y las sugerencias del motor por reglas.

Render registra solo la categoria del fallo y, si aplica, el estado HTTP. Nunca
registra la clave, la pregunta ni la respuesta de Google.
