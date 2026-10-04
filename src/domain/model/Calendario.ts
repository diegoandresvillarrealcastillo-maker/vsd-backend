/**
 * Que dia es, en la zona horaria de quien usa la aplicacion.
 *
 * Todo lo que dependa de "que dia es" —las actividades del dia, el sendero de
 * cada modulo, el diario y el semaforo— pasa por aqui. Ningun calculo de dia
 * puede usar la fecha UTC directamente.
 *
 * El motivo es concreto: Bogota va cinco horas por detras de UTC. Un registro
 * a las 8 p. m. en Colombia ya es la 1 a. m. del dia siguiente en UTC, y con la
 * fecha UTC la actividad contaria para manana, el diario la pondria en otro dia
 * y el progreso saldria corrido.
 *
 * Usa `Intl`, que es parte del lenguaje y no una dependencia externa: el
 * dominio sigue sin importar nada de fuera.
 */

export const ZONA_HORARIA_POR_DEFECTO = 'America/Bogota';

/** Un dia del calendario local, en formato AAAA-MM-DD. */
export type Dia = string;

const FORMATO_DE_DIA = /^(\d{4})-(\d{2})-(\d{2})$/;

const UN_DIA_EN_MS = 24 * 60 * 60 * 1000;

export class Calendario {
  private readonly formato: Intl.DateTimeFormat;

  constructor(readonly zonaHoraria: string = ZONA_HORARIA_POR_DEFECTO) {
    if (!Calendario.esZonaValida(zonaHoraria)) {
      throw new RangeError(`"${zonaHoraria}" no es una zona horaria IANA conocida.`);
    }

    this.formato = new Intl.DateTimeFormat('en-US', {
      timeZone: zonaHoraria,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  /** Si el nombre es una zona IANA que el entorno conoce, como `America/Bogota`. */
  static esZonaValida(zona: string): boolean {
    if (zona.trim() === '') {
      return false;
    }

    try {
      new Intl.DateTimeFormat('en-US', { timeZone: zona });
      return true;
    } catch {
      return false;
    }
  }

  /** Si el texto es un dia real con formato AAAA-MM-DD: "2026-02-30" no lo es. */
  static esDia(valor: string): boolean {
    const coincidencia = FORMATO_DE_DIA.exec(valor);

    if (!coincidencia) {
      return false;
    }

    const [, anio, mes, dia] = coincidencia;
    const fecha = new Date(Date.UTC(Number(anio), Number(mes) - 1, Number(dia)));

    return fecha.toISOString().slice(0, 10) === valor;
  }

  /** Cuantos dias van de uno a otro: 0 si son el mismo, negativo si va hacia atras. */
  static diasEntre(desde: Dia, hasta: Dia): number {
    return Math.round(
      (Date.parse(`${hasta}T00:00:00Z`) - Date.parse(`${desde}T00:00:00Z`)) / UN_DIA_EN_MS,
    );
  }

  /** El dia local al que pertenece un instante. */
  diaDe(instante: Date): Dia {
    const { anio, mes, dia } = this.partesLocales(instante);

    return `${anio}-${mes}-${dia}`;
  }

  /**
   * El minuto del dia local de un instante, desde la medianoche: las 8:30 son
   * 510. Es la hora a la que se comparan los avisos (SCRUM-102).
   */
  minutoDelDia(instante: Date): number {
    const { hora, minuto } = this.partesLocales(instante);

    return Number(hora) * 60 + Number(minuto);
  }

  /**
   * El dia de la semana de un dia del calendario: 1 es lunes y 7 domingo.
   *
   * No depende de la zona: un dia ya es local. Se calcula sobre su fecha,
   * como si fuera UTC, solo para que el resultado no cambie con la zona del
   * servidor.
   */
  diaDeLaSemana(dia: Dia): number {
    const coincidencia = FORMATO_DE_DIA.exec(dia);

    if (!coincidencia) {
      throw new RangeError(`"${dia}" no es un dia con formato AAAA-MM-DD.`);
    }

    const [, anio, mes, diaDelMes] = coincidencia;
    const domingoEsCero = new Date(
      Date.UTC(Number(anio), Number(mes) - 1, Number(diaDelMes)),
    ).getUTCDay();

    return domingoEsCero === 0 ? 7 : domingoEsCero;
  }

  /**
   * El primer instante de un dia local y el primero del siguiente.
   *
   * Sirve para preguntar a la base "lo de hoy" como un rango de instantes,
   * `[desde, hasta)`, sin que la consulta tenga que saber de zonas horarias.
   * Se calcula con el desfase real de cada borde, asi que tambien sirve en
   * zonas con horario de verano, aunque Colombia no lo tenga.
   */
  limitesDelDia(dia: Dia): { desde: Date; hasta: Date } {
    const coincidencia = FORMATO_DE_DIA.exec(dia);

    if (!coincidencia) {
      throw new RangeError(`"${dia}" no es un dia con formato AAAA-MM-DD.`);
    }

    const [, anio, mes, diaDelMes] = coincidencia;
    const medianocheUtc = Date.UTC(Number(anio), Number(mes) - 1, Number(diaDelMes));

    return {
      desde: this.medianocheLocal(medianocheUtc),
      hasta: this.medianocheLocal(medianocheUtc + UN_DIA_EN_MS),
    };
  }

  /**
   * Convierte la medianoche "de reloj" de un dia en el instante real en que
   * ocurre en la zona. Se corrige dos veces porque el desfase puede cambiar
   * justo entre la estimacion y el resultado.
   */
  private medianocheLocal(medianocheUtc: number): Date {
    let instante = medianocheUtc - this.desfase(medianocheUtc);
    instante = medianocheUtc - this.desfase(instante);

    return new Date(instante);
  }

  /** Cuantos milisegundos va la zona por delante de UTC en ese instante. */
  private desfase(instante: number): number {
    const p = this.partesLocales(new Date(instante));
    const comoSiFueraUtc = Date.UTC(
      Number(p.anio),
      Number(p.mes) - 1,
      Number(p.dia),
      Number(p.hora),
      Number(p.minuto),
      Number(p.segundo),
    );

    return comoSiFueraUtc - Math.floor(instante / 1000) * 1000;
  }

  private partesLocales(
    instante: Date,
  ): Record<'anio' | 'mes' | 'dia' | 'hora' | 'minuto' | 'segundo', string> {
    if (Number.isNaN(instante.getTime())) {
      throw new RangeError('El instante no es una fecha valida.');
    }

    const partes = Object.fromEntries(
      this.formato.formatToParts(instante).map((parte) => [parte.type, parte.value]),
    );

    return {
      anio: partes.year ?? '',
      mes: partes.month ?? '',
      dia: partes.day ?? '',
      hora: partes.hour ?? '',
      minuto: partes.minute ?? '',
      segundo: partes.second ?? '',
    };
  }
}
