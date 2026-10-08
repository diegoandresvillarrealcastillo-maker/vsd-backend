import { describe, expect, it } from 'vitest';
import {
  CAMPOS_POR_TIPO,
  CODIGOS_DE_ARCHIVO_PELIGROSO,
  esArchivoPeligroso,
} from './EventoDeSeguridad.js';

describe('El catalogo de eventos de seguridad', () => {
  it('declara los seis hechos acordados y ninguno mas', () => {
    expect(Object.keys(CAMPOS_POR_TIPO).sort()).toEqual([
      'ARCHIVO_PELIGROSO_RECHAZADO',
      'CUENTA_BORRADA',
      'CUENTA_NO_REGISTRADA',
      'DATOS_EXPORTADOS',
      'PERMISO_DEL_DIARIO_CAMBIADO',
      'TOKEN_RECHAZADO',
    ]);
  });

  it('solo admite campos que son identificadores, banderas o codigos cerrados', () => {
    // Si alguien agrega aqui «correo», «nombre» o «contenido», esta prueba
    // obliga a discutirlo antes de que llegue al registro.
    const permitidos = new Set(['idUsuario', 'idProveedor', 'activado', 'motivo']);

    for (const [tipo, campos] of Object.entries(CAMPOS_POR_TIPO)) {
      for (const campo of campos) {
        expect(permitidos.has(campo), `${tipo} declara el campo "${campo}"`).toBe(true);
      }
    }
  });

  it('ningun campo se llama como un dato personal', () => {
    const personales = /correo|email|nombre|token|ip$|nacimiento|contenido|titulo|clave/i;

    for (const campos of Object.values(CAMPOS_POR_TIPO)) {
      for (const campo of campos) {
        expect(personales.test(campo), campo).toBe(false);
      }
    }
  });

  describe('esArchivoPeligroso', () => {
    it.each(CODIGOS_DE_ARCHIVO_PELIGROSO)('%s cuenta', (codigo) => {
      expect(esArchivoPeligroso(codigo)).toBe(true);
    });

    it.each([
      'FOTO_DEMASIADO_PESADA',
      'FOTO_DEMASIADO_GRANDE',
      'MASCOTA_SVG_DEMASIADO_PESADO',
      'MASCOTA_SVG_NO_ADMITIDO',
      'MASCOTA_SVG_DEMASIADO_COMPLEJO',
      'IDENTIFICADOR_INVALIDO',
      '',
    ])('%s es un descuido o no tiene que ver, y no cuenta', (codigo) => {
      expect(esArchivoPeligroso(codigo)).toBe(false);
    });
  });
});
