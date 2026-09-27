import { SetMetadata } from '@nestjs/common';

export const ES_PUBLICO = 'vsd:ruta-publica';

/**
 * Marca una ruta como accesible sin haber iniciado sesion.
 *
 * El guardia se aplica a **toda** la API y las excepciones se declaran una a
 * una aqui. Es al reves de lo que suele hacerse —proteger ruta por ruta— y es
 * a proposito: olvidarse de este decorador deja una ruta publica cerrada, que
 * se nota en cuanto alguien la usa; olvidarse de proteger deja una ruta
 * privada abierta, que no se nota nunca.
 *
 * El primer olvido produce una queja. El segundo, una fuga.
 */
export const Publico = (): MethodDecorator & ClassDecorator => SetMetadata(ES_PUBLICO, true);
