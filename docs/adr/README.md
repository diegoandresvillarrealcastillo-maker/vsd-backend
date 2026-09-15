# Decisiones de arquitectura (ADR)

Un ADR registra **una decision y por que se tomo**, incluidas las
alternativas que se descartaron. Sirve para que dentro de seis meses
nadie tenga que reconstruir de memoria por que el proyecto es como es.

## Indice

| ADR                                                 | Decision                                           | Estado   |
| --------------------------------------------------- | -------------------------------------------------- | -------- |
| [0001](0001-dos-repositorios-separados.md)          | Dos repositorios separados en lugar de un monorepo | Aceptada |
| [0002](0002-arquitectura-hexagonal.md)              | Arquitectura hexagonal en tres capas               | Aceptada |
| [0003](0003-uuid-como-clave-primaria.md)            | UUID como clave primaria                           | Aceptada |
| [0004](0004-autenticacion-sin-contrasenas.md)       | Autenticacion sin contrasenas con Supabase Auth    | Aceptada |
| [0005](0005-vitest-como-ejecutor-de-pruebas.md)     | Vitest como ejecutor de pruebas                    | Aceptada |
| [0006](0006-el-dominio-se-escribe-sin-framework.md) | El dominio se escribe sin framework                | Aceptada |
| [0007](0007-nestjs-12-y-modulos-esm.md)             | NestJS 12 y modulos ESM                            | Aceptada |

## Reglas

- **Un ADR no se edita.** Si la decision deja de ser valida, se escribe
  un ADR nuevo que la reemplaza y el viejo pasa a estado _Reemplazado_,
  con un enlace al que lo sustituye.
- Estados posibles: _Propuesta_, _Aceptada_, _Reemplazada_, _Rechazada_.
- Formato: contexto, decision, alternativas consideradas, consecuencias.
- Las consecuencias incluyen **lo que se pierde**, no solo lo que se gana.
  Un ADR sin desventajas no esta terminado.
