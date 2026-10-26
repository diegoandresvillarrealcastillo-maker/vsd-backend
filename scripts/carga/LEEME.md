# Laboratorio de carga local (SCRUM-279)

Mide el backend con 100 usuarios recurrentes, **solo en tu equipo** (`127.0.0.1`). No toca PRE ni
PROD, no lee `.env` y no cambia el arranque ni los límites del servicio desplegable.

## Qué hace

- `servidor-local.spec.ts` levanta PostgreSQL temporal (`embedded-postgres`, puerto **55440**) y la
  API (puerto **3000**) con la aplicación, la persistencia y RLS reales (rol `vsd_app`). Crea 100
  cuentas ficticias con 201 entradas de diario cada una y mide la memoria del proceso Node cada
  segundo (`ram-local.csv`). Se detiene con `POST /__qa/stop` o a los 12 minutos.
- Solo dentro de ese proceso de prueba se sustituyen la verificación externa de identidad
  (`qa-user-N`, nada que ver con tokens de Supabase) y los límites de peticiones: 100 usuarios desde
  la misma IP recibirían 429 y no medirían capacidad.
- `pico-local.k6.js` hace dos picos de 100 usuarios, alterna guardados, reintentos idempotentes y
  exportaciones, y observa la recuperación durante 30 s.

## Requisitos

Node y las dependencias del backend (`npm ci`), **k6** y **PowerShell 7** (`pwsh`). Los puertos 3000
y 55440 tienen que estar libres.

```powershell
winget install k6 --source winget
winget install --id Microsoft.PowerShell --exact --source winget
```

## Cómo se corre

Terminal 1, desde la raíz del backend (espera a que `http://localhost:3000/__qa/status` responda):

```powershell
npx --no-install vitest run --config scripts/carga/vitest.config.mts
```

Terminal 2, desde la raíz del backend:

```powershell
pwsh -NoProfile -File scripts/carga/ejecutar-local.ps1 -RssLimitMB 1024
```

Salen `resumen-k6-local.json`, `metricas-k6-local.json` y `ram-local.csv` en la raíz (están en
`.gitignore`). Al terminar, k6 detiene el laboratorio. La base temporal queda en la carpeta
temporal del sistema (`vsd-k6-*`) por si se quiere inspeccionar; se puede borrar.

## Umbrales iniciales (ajustables)

Fallos HTTP < 1 %, cero fallos funcionales, p95 de escritura < 3 s, p95 de exportación < 10 s, RSS
< 1.024 MB y crecimiento final < 256 MB. Son presupuestos de prueba, no garantías: una sola
ejecución no demuestra ausencia de fugas, hay que mirar la curva de varios picos.

## Qué mide y qué no

La memoria es la del proceso Node que aloja la API dentro de Vitest: incluye ese entorno y **no**
incluye PostgreSQL ni k6. Para comparar con un despliegue hay que repetirlo en un proceso
equivalente y medir PostgreSQL aparte.
