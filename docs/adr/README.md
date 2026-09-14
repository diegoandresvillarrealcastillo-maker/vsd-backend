# Decisiones de arquitectura (ADR)

Un ADR registra **una decision y por que se tomo**, incluidas las
alternativas que se descartaron. Sirve para que dentro de seis meses
nadie tenga que reconstruir de memoria por que el proyecto es como es.

## Indice

| ADR | Decision | Estado |
|---|---|---|
| [0001](0001-dos-repositorios-separados.md) | Dos repositorios separados en lugar de un monorepo | Aceptada |
| [0002](0002-arquitectura-hexagonal.md) | Arquitectura hexagonal en tres capas | Aceptada |
| [0003](0003-uuid-como-clave-primaria.md) | UUID como clave primaria | Aceptada |
| [0004](0004-autenticacion-sin-contrasenas.md) | Autenticacion sin contrasenas con Supabase Auth | Aceptada |

## Reglas

- **Un ADR no se edita.** Si la decision deja de ser valida, se escribe
  un ADR nuevo que la reemplaza y el viejo pasa a estado *Reemplazado*,
  con un enlace al que lo sustituye.
- Estados posibles: *Propuesta*, *Aceptada*, *Reemplazada*, *Rechazada*.
- Formato: contexto, decision, alternativas consideradas, consecuencias.
- Las consecuencias incluyen **lo que se pierde**, no solo lo que se gana.
  Un ADR sin desventajas no esta terminado.
