import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Configuracion } from './environment.js';

/**
 * Contrato de la API en formato OpenAPI.
 *
 * Importa mas de lo que parece: es la mitad del mecanismo que evita que los
 * dos repositorios se desincronicen. En el Ciclo 6 el frontend generara sus
 * tipos de TypeScript a partir de este documento, de modo que un cambio en la
 * API que rompa al cliente se detecte al compilar y no en ejecucion.
 * Ver docs/adr/0001-dos-repositorios-separados.md
 */
export function construirDocumento(app: INestApplication): Record<string, unknown> {
  const configuracion = new DocumentBuilder()
    .setTitle('VSD Health API')
    .setDescription(
      'API de VSD Health, herramienta de acompanamiento del bienestar emocional y cognitivo.\n\n' +
        'VSD Health no diagnostica, no formula medicamentos y no reemplaza la atencion de ' +
        'psicologos, medicos ni psiquiatras. Los resultados que devuelve esta API son ' +
        'orientativos.',
    )
    .setVersion('0.1.0')
    .addTag('Resultados', 'Registro de resultados de actividades')
    .addTag('Estado', 'Comprobacion de vida del servicio')
    .build();

  return SwaggerModule.createDocument(app, configuracion) as unknown as Record<string, unknown>;
}

/**
 * Publica la documentacion navegable, salvo en produccion.
 *
 * Un catalogo completo de la API, con todos sus esquemas y ejemplos, le
 * ahorra trabajo a quien busque debilidades. En produccion el contrato lo
 * consume el frontend desde el archivo generado, no desde una ruta publica.
 */
export function configurarDocumentacion(app: INestApplication, configuracion: Configuracion): void {
  if (configuracion.esProduccion) {
    return;
  }

  SwaggerModule.setup('api/docs', app, construirDocumento(app) as never);
}
