import { describe, expect, it } from 'vitest';
import {
  esLaVersionVigente,
  esLaVersionVigenteDeLosTerminos,
  VERSION_VIGENTE_DE_LOS_TERMINOS,
  VERSION_VIGENTE_DEL_AVISO,
} from './AvisoDePrivacidad.js';

/**
 * Estas cadenas son la prueba legal de que acepto cada persona (Ley 1581 de 2012), asi que se
 * fijan aqui a proposito: cambiar el texto de las paginas legales sin cambiar la cadena dejaria
 * registrado que alguien acepto un texto que nunca vio, y cambiarla sin querer lo mismo al reves.
 *
 * Cuando el texto vuelva a cambiar, este archivo cambia con la cadena: es la lista de que version
 * corresponde a que texto, y se ve en el diff del PR.
 */
describe('las versiones vigentes de los textos legales', () => {
  it('el aviso de privacidad es el que describe la constancia de la baja (SCRUM-235)', () => {
    expect(VERSION_VIGENTE_DEL_AVISO).toBe('2026-10-3');
  });

  it('los terminos son los que ya limitan la responsabilidad segun la ley (SCRUM-235)', () => {
    expect(VERSION_VIGENTE_DE_LOS_TERMINOS).toBe('2026-10-3');
  });

  it.each([VERSION_VIGENTE_DEL_AVISO, VERSION_VIGENTE_DE_LOS_TERMINOS])(
    '%s tiene la forma AAAA-MM-N',
    (version) => {
      expect(version).toMatch(/^\d{4}-(0[1-9]|1[0-2])-[1-9]\d*$/);
    },
  );

  it.each(['2026-09-1', '2026-10-1', '2026-10-2'])(
    'ya no se acepta el aviso anterior %s: el texto cambio y hay que aceptar el nuevo',
    (anterior) => {
      expect(esLaVersionVigente(anterior)).toBe(false);
    },
  );

  it.each(['2026-10-1', '2026-10-2'])('ya no se aceptan los terminos anteriores %s', (anterior) => {
    expect(esLaVersionVigenteDeLosTerminos(anterior)).toBe(false);
  });

  it('acepta la vigente, tolerando los espacios de alrededor', () => {
    expect(esLaVersionVigente(VERSION_VIGENTE_DEL_AVISO)).toBe(true);
    expect(esLaVersionVigente(` ${VERSION_VIGENTE_DEL_AVISO} `)).toBe(true);
    expect(esLaVersionVigenteDeLosTerminos(VERSION_VIGENTE_DE_LOS_TERMINOS)).toBe(true);
    expect(esLaVersionVigenteDeLosTerminos(` ${VERSION_VIGENTE_DE_LOS_TERMINOS} `)).toBe(true);
  });
});
