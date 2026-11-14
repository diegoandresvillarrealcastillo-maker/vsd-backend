import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Ambiente, type Configuracion } from './environment.js';

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
    .addTag('Catalogo', 'Categorias y actividades disponibles')
    .addTag('Asistente', 'VSD IA')
    .addTag('Estado', 'Comprobacion de vida del servicio')
    // El token que devuelve Supabase al iniciar sesion. Todas las rutas lo
    // exigen salvo las marcadas con @Publico(), que hoy son el estado del
    // servicio y el catalogo.
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Token de acceso de Supabase. El navegador lo obtiene al iniciar sesion y lo envia en la cabecera Authorization.',
      },
      'sesion',
    )
    .build();

  return SwaggerModule.createDocument(app, configuracion) as unknown as Record<string, unknown>;
}

/**
 * Publica la documentacion navegable, solo al desarrollar en local (SCRUM-155).
 *
 * Un catalogo completo de la API, con todos sus esquemas y ejemplos, le
 * ahorra trabajo a quien busque debilidades. Antes solo se ocultaba en
 * produccion, y preproduccion —con cuentas reales de prueba— la publicaba a
 * cualquiera que probara `/api/docs`. El contrato no se pierde: vive en
 * `openapi.json` del repositorio, y el frontend lo consume de ahi.
 */
export function configurarDocumentacion(app: INestApplication, configuracion: Configuracion): void {
  if (configuracion.ambiente !== Ambiente.DESARROLLO) {
    return;
  }

  SwaggerModule.setup('api/docs', app, construirDocumento(app) as never);
}
