# Documentacion tecnica — VSD Health

Esta carpeta es la fuente unica de la documentacion tecnica del
proyecto, y cubre tanto `vsd-backend` como `vsd-frontend`.

## Indice

| Documento                                | Para que sirve                                        |
| ---------------------------------------- | ----------------------------------------------------- |
| [arquitectura.md](arquitectura.md)       | Como se organiza el codigo y por que                  |
| [ambientes.md](ambientes.md)             | Los tres ambientes DEV, PRE y PROD y su configuracion |
| [dominio.md](dominio.md)                 | Que reglas viven en el dominio y por que              |
| [modelo-de-datos.md](modelo-de-datos.md) | Las seis tablas, sus campos y quien puede verlas      |
| [convenciones.md](convenciones.md)       | Nombres, carpetas y estilo                            |
| [seguridad.md](seguridad.md)             | Reglas de seguridad y privacidad que no se negocian   |
| [adr/](adr/)                             | Decisiones de arquitectura y su justificacion         |

## Como se mantiene

La documentacion se actualiza **en el mismo Pull Request** que cambia el
codigo que describe. Un Pull Request que deja la documentacion
desactualizada no cumple la Definition of Done.

Los ADR son la excepcion: **no se editan**. Una decision que deja de ser
valida se sustituye con un ADR nuevo que la reemplaza, y el ADR viejo
queda marcado como _Reemplazado_. El valor de un ADR esta en registrar
lo que se penso en su momento, no en describir el presente.
