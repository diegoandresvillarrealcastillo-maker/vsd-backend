// Vitest no lee `.env` por su cuenta.
import 'dotenv/config';

import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import { describe, expect, it } from 'vitest';
import { ActivityId, SesionId, UserId } from '../../domain/model/Identifier.js';
import { Revision, SesionDeActividad } from '../../domain/model/SesionDeActividad.js';
import {
  type CandidataDeSesion,
  type HechoDeSesion,
  elegirSesionDeHoy,
} from '../../domain/model/SesionDelDia.js';
import { type BancoDeSesiones, contratoDeSesiones } from '../../pruebas/contratoDeSesiones.js';
import { CLAVE_LOCAL, prepararRolDeLaAplicacion } from '../../pruebas/rolDeLaAplicacion.js';
import { PrismaService } from '../persistence/PrismaService.js';
import { PrismaSesionesRepository } from './PrismaSesionesRepository.js';

/**
 * Las sesiones contra PostgreSQL de verdad (SCRUM-205, ADR 0030).
 *
 * Dos cosas:
 *
 * 1. **El mismo contrato que el adaptador en memoria.** Propiedades que valen sea cual sea el orden de
 *    cada persona: no repite, recorre todas, vuelve a empezar, cada persona su orden, lo retirado se
 *    salta salvo lo que se hizo hoy...
 * 2. **Una prueba diferencial.** La consulta de este adaptador es `elegirSesionDeHoy` escrita en SQL.
 *    Se comparan las dos sobre cientos de historiales al azar, dandole a la funcion pura las mismas
 *    claves que calcula la base. Si la consulta se separara de la regla, aqui fallaria.
 *
 * Se conecta como `vsd_app`, igual que la aplicacion: lo que depende de las politicas de seguridad
 * (leer lo propio de `resultado`, solo `SELECT` sobre las sesiones) se prueba de verdad.
 */
const URL_DUENO = process.env['DATABASE_URL'];

if (process.env['PRUEBAS_DE_INTEGRACION'] === 'obligatorias' && URL_DUENO === undefined) {
  throw new Error(
    'Sin DATABASE_URL donde las pruebas de integracion son obligatorias: ' +
      'se habrian saltado en silencio. Revisa el servicio de PostgreSQL del trabajo.',
  );
}

const HOY = '2026-10-16';

function urlDeLaAplicacion(url: string): string {
  const partes = new URL(url);

  partes.username = 'vsd_app';
  partes.password = CLAVE_LOCAL;

  return partes.toString();
}

function nueva(
  mecanica: ActivityId,
  opciones: { publicado?: boolean; titulo?: string } = {},
): SesionDeActividad {
  return SesionDeActividad.create({
    id: new SesionId(randomUUID()),
    idActividad: mecanica,
    titulo: opciones.titulo ?? 'Una sesión',
    nivel: 2,
    parametros: { largo: 4, pasos: ['uno', 'dos'], conSonido: false },
    publicado: opciones.publicado ?? true,
    revision: Revision.NO_REQUIERE,
  });
}

/** Un generador pseudoaleatorio con semilla (mulberry32): la prueba falla igual cada vez. */
function azar(semilla: number): () => number {
  let estado = semilla;

  return () => {
    estado = (estado + 0x6d2b79f5) | 0;
    let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe.skipIf(URL_DUENO === undefined)('PrismaSesionesRepository contra PostgreSQL', () => {
  const categoria = randomUUID();
  const mecanicas: string[] = [];
  const personas: string[] = [];
  const sesionesCreadas: string[] = [];

  let dueno: Client;
  let prisma: PrismaService;
  let repositorio: PrismaSesionesRepository;

  async function comoAdministrador(): Promise<void> {
    await dueno.query("SELECT set_config('vsd.rol_actual', 'administrador', false)");
  }

  async function nuevaMecanica(): Promise<ActivityId> {
    const id = randomUUID();

    await comoAdministrador();
    await dueno.query(
      `INSERT INTO actividad (id_actividad, id_categoria, nombre, tipo, direccion_escala, motor, frecuencia)
       VALUES ($1, $2, $3, 'juego', 'sin_puntaje', 'guia_paso_a_paso', 'rotativa')`,
      [id, categoria, `Mecanica ${id}`],
    );
    mecanicas.push(id);

    return new ActivityId(id);
  }

  async function nuevaPersona(): Promise<string> {
    const id = randomUUID();

    await dueno.query("SELECT set_config('vsd.usuario_actual', $1, false)", [id]);
    await dueno.query(
      `INSERT INTO usuario (id_usuario, correo, id_proveedor_auth, version_politica_aceptada, fecha_aceptacion_politica)
       VALUES ($1, $2, $3, '1.0', now())`,
      [id, `${id}@ejemplo.test`, `proveedor-de-prueba-${id}`],
    );
    personas.push(id);

    return id;
  }

  async function sembrar(sesiones: readonly SesionDeActividad[]): Promise<void> {
    await comoAdministrador();

    for (const sesion of sesiones) {
      await dueno.query(
        `INSERT INTO sesion_de_actividad (id_sesion, id_actividad, titulo, nivel, parametros, publicado, revision)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, 'no_requiere')`,
        [
          sesion.id.value,
          sesion.idActividad.value,
          sesion.titulo,
          sesion.nivel,
          JSON.stringify(sesion.parametros),
          sesion.publicado,
        ],
      );
      sesionesCreadas.push(sesion.id.value);
    }
  }

  async function hacer(
    persona: string,
    sesion: SesionDeActividad,
    dia: string,
    hechaEn: Date = new Date(`${dia}T12:00:00Z`),
  ): Promise<void> {
    await dueno.query("SELECT set_config('vsd.usuario_actual', $1, false)", [persona]);
    await dueno.query(
      `INSERT INTO resultado (id_resultado, id_usuario, id_actividad, id_operacion_cliente, id_sesion, fecha, dia)
       VALUES ($1, $2, $3, $4, $5, $6, $7::date)`,
      [
        randomUUID(),
        persona,
        sesion.idActividad.value,
        randomUUID(),
        sesion.id.value,
        hechaEn,
        dia,
      ],
    );
  }

  async function abrir(): Promise<BancoDeSesiones> {
    dueno = new Client({ connectionString: URL_DUENO });
    await dueno.connect();
    await prepararRolDeLaAplicacion(dueno);
    await comoAdministrador();
    await dueno.query(
      `INSERT INTO categoria (id_categoria, nombre) VALUES ($1, 'Pruebas de sesiones')`,
      [categoria],
    );

    prisma = new PrismaService(urlDeLaAplicacion(URL_DUENO ?? ''));
    await prisma.onModuleInit();
    repositorio = new PrismaSesionesRepository(prisma);

    return {
      repositorio,
      mecanicaNueva: nuevaMecanica,
      personaNueva: nuevaPersona,
      sembrar,
      hacer,
      cerrar: async () => {
        await prisma?.onModuleDestroy();
        await comoAdministrador();
        await dueno.query('DELETE FROM resultado WHERE id_usuario = ANY($1)', [personas]);
        await dueno.query('DELETE FROM sesion_de_actividad WHERE id_sesion = ANY($1)', [
          sesionesCreadas,
        ]);
        await dueno.query('DELETE FROM usuario WHERE id_usuario = ANY($1)', [personas]);
        await dueno.query('DELETE FROM actividad WHERE id_actividad = ANY($1)', [mecanicas]);
        await dueno.query('DELETE FROM categoria WHERE id_categoria = $1', [categoria]);
        await dueno.end();
      },
    };
  }

  contratoDeSesiones(abrir, nueva);

  it('lo que persona A hizo no lo lee quien consulta como persona B (RLS de resultado)', async () => {
    const mecanica = await nuevaMecanica();
    const a = await nuevaPersona();
    const b = await nuevaPersona();
    const sesiones = Array.from({ length: 4 }, () => nueva(mecanica));
    await sembrar(sesiones);

    for (let d = 1; d <= 3; d++) {
      const dia = new Date(Date.parse(`${HOY}T00:00:00Z`) - d * 86_400_000)
        .toISOString()
        .slice(0, 10);
      const delDia = (await repositorio.sesionesDeHoy(new UserId(a), [mecanica], dia)).get(
        mecanica.value,
      )!;

      await hacer(
        a,
        sesiones.find((s) => s.id.value === delDia.id.value)!,
        dia,
      );
    }

    // Consultando como B se ve su propio orden, sin ningun hecho de A.
    const comoB = await repositorio.sesionesDeHoy(new UserId(b), [mecanica], HOY);
    const comoBConUnaPersonaNueva = await repositorio.sesionesDeHoy(
      new UserId(await nuevaPersona()),
      [mecanica],
      HOY,
    );

    expect(comoB.get(mecanica.value)).toBeDefined();
    expect(comoBConUnaPersonaNueva.size).toBe(1);

    // Y B sin historial recibe lo mismo que si A no hubiera hecho nada: la sesion de menor clave.
    const claves = await dueno.query<{ id: string }>(
      `SELECT id_sesion::text AS id
       FROM sesion_de_actividad WHERE id_actividad = $1 AND publicado
       ORDER BY hashtextextended(id_sesion::text || ':' || $2::text, 0), id_sesion`,
      [mecanica.value, b],
    );

    expect(comoB.get(mecanica.value)?.id.value).toBe(claves.rows[0]?.id);
  });

  it('es la misma regla que elegirSesionDeHoy sobre cientos de historiales al azar', async () => {
    const dado = azar(20261016);
    const entre = (minimo: number, maximo: number) =>
      minimo + Math.floor(dado() * (maximo - minimo + 1));
    const haceDias = (n: number) =>
      new Date(Date.parse(`${HOY}T00:00:00Z`) - n * 86_400_000).toISOString().slice(0, 10);

    let conSesion = 0;
    let sinSesion = 0;
    let hechasHoy = 0;
    let todasHechas = 0;

    for (let escenario = 0; escenario < 160; escenario++) {
      const mecanica = await nuevaMecanica();
      const persona = await nuevaPersona();
      const cuantas = entre(1, 8);
      const sesiones = Array.from({ length: cuantas }, () =>
        nueva(mecanica, { publicado: dado() < 0.8 }),
      );

      await sembrar(sesiones);

      // Un historial al azar: hasta 14 veces, dentro de los ultimos 500 dias, algunas hoy y algunas a la
      // misma hora, para que tambien se pruebe como se desempata.
      const veces = entre(0, 14);

      for (let i = 0; i < veces; i++) {
        const sesion = sesiones[entre(0, cuantas - 1)]!;
        // Hoy, justo en el borde de la ventana (363 a 366 dias) o en cualquier momento del ultimo ano y medio.
        const azarDelDia = dado();
        const dia = haceDias(
          azarDelDia < 0.12 ? 0 : azarDelDia < 0.35 ? entre(363, 366) : entre(0, 500),
        );
        const hora = String(entre(0, 5)).padStart(2, '0');

        await hacer(persona, sesion, dia, new Date(`${dia}T${hora}:00:00Z`));
      }

      // Lo que dice la base...
      const mapa = await repositorio.sesionesDeHoy(new UserId(persona), [mecanica], HOY);
      const deLaBase = mapa.get(mecanica.value)?.id.value ?? null;

      // ... frente a la regla pura, con las mismas claves que calcula la base.
      const claves = await dueno.query<{ id: string; clave: string }>(
        `SELECT id_sesion::text AS id, hashtextextended(id_sesion::text || ':' || $2::text, 0)::text AS clave
         FROM sesion_de_actividad WHERE id_actividad = $1`,
        [mecanica.value, persona],
      );
      const claveDe = new Map(claves.rows.map((fila) => [fila.id, BigInt(fila.clave)]));
      const candidatas: CandidataDeSesion[] = sesiones.map((sesion) => ({
        sesion,
        clave: claveDe.get(sesion.id.value)!,
      }));
      const hechosEnLaBase = await dueno.query<{ id: string; dia: Date; fecha: Date }>(
        'SELECT id_sesion::text AS id, dia, fecha FROM resultado WHERE id_usuario = $1 AND id_sesion IS NOT NULL',
        [persona],
      );
      const hechos: HechoDeSesion[] = hechosEnLaBase.rows.map((fila) => ({
        idSesion: fila.id,
        dia: fila.dia.toISOString().slice(0, 10),
        hechaEn: fila.fecha,
      }));
      const delDominio = elegirSesionDeHoy(candidatas, hechos, HOY)?.id.value ?? null;

      expect(deLaBase, `escenario ${escenario}`).toBe(delDominio);

      if (deLaBase === null) {
        sinSesion++;
      } else {
        conSesion++;
      }

      if (hechos.some((hecho) => hecho.dia === HOY)) {
        hechasHoy++;
      }

      if (veces > 0 && sesiones.every((s) => hechos.some((h) => h.idSesion === s.id.value))) {
        todasHechas++;
      }
    }

    // La prueba solo vale si recorrio de verdad las situaciones que importan.
    expect(conSesion).toBeGreaterThan(100);
    expect(sinSesion).toBeGreaterThan(0);
    expect(hechasHoy).toBeGreaterThan(5);
    expect(todasHechas).toBeGreaterThan(0);
  }, 120_000);
});
