import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * Comprobacion de vida del servicio.
 *
 * La usan el proveedor de despliegue y el equipo para saber si el servicio
 * responde. Devuelve lo minimo: si contestara con la version, las
 * dependencias o el tiempo encendido, estaria dando informacion util a quien
 * busque debilidades sin necesidad alguna.
 */
@ApiTags('Estado')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Comprobar que el servicio responde' })
  @ApiResponse({ status: 200, description: 'El servicio esta operativo.' })
  comprobar(): { estado: string } {
    return { estado: 'ok' };
  }
}
