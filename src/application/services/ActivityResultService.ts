import type { ActivityResult } from '../../domain/model/ActivityResult.js';
import type {
  RegisterActivityResultUseCase,
  RegistrarResultadoCommand,
} from '../../domain/ports/in/RegisterActivityResultUseCase.js';

/**
 * Fachada de los casos de uso de resultados.
 *
 * Es el unico punto con el que habla la infraestructura. Hoy expone un solo
 * caso de uso y parece una capa de mas; existe para que, cuando aparezcan
 * consultar historial, exportar datos o eliminar cuenta, los controladores no
 * tengan que conocer una clase distinta por cada operacion.
 *
 * Nota importante: aqui no hay logica de negocio. Si algun dia esta clase
 * empieza a decidir algo, esa decision pertenece a un caso de uso.
 */
export class ActivityResultService {
  constructor(private readonly registrarResultado: RegisterActivityResultUseCase) {}

  async registrar(command: RegistrarResultadoCommand): Promise<ActivityResult> {
    return this.registrarResultado.execute(command);
  }
}
