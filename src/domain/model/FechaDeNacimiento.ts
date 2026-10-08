import { Calendario, type Dia } from './Calendario.js';
import { InvalidBirthDateError } from './DomainError.js';

/** Mas que esto no vive nadie. Una fecha mas vieja es un error de escritura, no una persona. */
const ANOS_MAXIMOS = 120;

const PARTES = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * La fecha de nacimiento declarada por la persona (S-01 de la auditoria 360).
 *
 * Es lo que prueba la mayoria de edad, y por eso es un valor y no un texto:
 * solo se construye con una fecha real, que ya paso y que no es de hace mas de
 * 120 anos. Se guarda el dia completo y no solo un "es mayor de edad": es la
 * prueba de lo que declaro, sale en su exportacion y se borra con la cuenta.
 *
 * ## Que dia es "hoy"
 *
 * La edad se calcula contra el dia **local** de la persona (`Calendario`), no
 * contra UTC. Quien cumple 18 hoy en Bogota a las 8 p. m. es mayor de edad en
 * ese momento aunque en UTC ya sea manana.
 *
 * ## Los nacidos un 29 de febrero
 *
 * Cumplen anos el 1 de marzo en los anos que no son bisiestos. Es la lectura
 * que no adelanta la mayoria de edad ni un dia: el 28 de febrero todavia no
 * cumplieron.
 */
export class FechaDeNacimiento {
  private constructor(
    readonly anio: number,
    readonly mes: number,
    readonly dia: number,
  ) {}

  /**
   * @param texto Un dia con formato AAAA-MM-DD.
   * @param hoy El dia local de la persona. Una fecha de nacimiento posterior o
   *   igual a hoy no es valida: nadie nace en el futuro, ni hoy se registra.
   */
  static crear(texto: string, hoy: Dia): FechaDeNacimiento {
    const partes = PARTES.exec(texto);

    if (!partes || !Calendario.esDia(texto)) {
      throw new InvalidBirthDateError();
    }

    const fecha = new FechaDeNacimiento(Number(partes[1]), Number(partes[2]), Number(partes[3]));

    if (texto >= hoy || fecha.edadEn(hoy) > ANOS_MAXIMOS) {
      throw new InvalidBirthDateError();
    }

    return fecha;
  }

  /**
   * La fecha tal como esta guardada, sin volver a juzgarla.
   *
   * `crear` es para lo que llega: exige que la fecha sea de una persona que hoy
   * puede registrarse. Lo que ya esta guardado paso esa prueba cuando entro, y
   * volver a pasarla al leerlo haria fallar una cuenta valida por el simple
   * hecho de que el reloj del servidor hoy diga otra cosa. Solo comprueba que
   * sea un dia real.
   */
  static restaurar(texto: string): FechaDeNacimiento {
    const partes = PARTES.exec(texto);

    if (!partes || !Calendario.esDia(texto)) {
      throw new InvalidBirthDateError();
    }

    return new FechaDeNacimiento(Number(partes[1]), Number(partes[2]), Number(partes[3]));
  }

  /** Los anos cumplidos a la fecha `hoy`. */
  edadEn(hoy: Dia): number {
    const [anioHoy, mesHoy, diaHoy] = FechaDeNacimiento.partes(hoy);
    const cumplioEsteAnio = mesHoy > this.mes || (mesHoy === this.mes && diaHoy >= this.dia);

    return anioHoy - this.anio - (cumplioEsteAnio ? 0 : 1);
  }

  /** AAAA-MM-DD, como se guarda y como sale en la exportacion. */
  get valor(): Dia {
    return `${String(this.anio).padStart(4, '0')}-${String(this.mes).padStart(2, '0')}-${String(this.dia).padStart(2, '0')}`;
  }

  equals(otra: FechaDeNacimiento): boolean {
    return this.valor === otra.valor;
  }

  private static partes(dia: Dia): [number, number, number] {
    const partes = PARTES.exec(dia);

    if (!partes) {
      throw new RangeError(`"${dia}" no es un dia con formato AAAA-MM-DD.`);
    }

    return [Number(partes[1]), Number(partes[2]), Number(partes[3])];
  }
}
