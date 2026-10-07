import { describe, expect, it } from 'vitest';
import {
  JPEG_REAL_DE_8_X_6,
  PNG_REAL_DE_8_X_6,
  unJpeg,
  unPng,
} from '../../pruebas/fotosDePrueba.js';
import { InvalidPhotoError } from './DomainError.js';
import { FotoDePerfil, LADO_MAXIMO_DE_LA_FOTO, PESO_MAXIMO_DE_LA_FOTO } from './FotoDePerfil.js';

/** El codigo con el que falla, o `undefined` si la foto se acepta. */
function rechazo(contenido: Uint8Array, tipo: string): string | undefined {
  try {
    FotoDePerfil.crear(contenido, tipo);

    return undefined;
  } catch (error) {
    expect(error).toBeInstanceOf(InvalidPhotoError);

    return (error as InvalidPhotoError).code;
  }
}

const TEXTO = (valor: string): Uint8Array => new TextEncoder().encode(valor);

describe('FotoDePerfil (SCRUM-120)', () => {
  describe('lo que se acepta', () => {
    it('un JPEG y un PNG de verdad', () => {
      expect(FotoDePerfil.crear(JPEG_REAL_DE_8_X_6, 'image/jpeg').tipo).toBe('image/jpeg');
      expect(FotoDePerfil.crear(PNG_REAL_DE_8_X_6, 'image/png').tipo).toBe('image/png');
    });

    it('conserva el contenido tal cual llego', () => {
      expect(FotoDePerfil.crear(PNG_REAL_DE_8_X_6, 'image/png').contenido).toEqual(
        PNG_REAL_DE_8_X_6,
      );
    });

    it.each(['IMAGE/PNG', 'image/png; charset=binary', '  image/png  '])(
      'el tipo declarado se lee sin mayusculas ni parametros: «%s»',
      (tipo) => {
        expect(FotoDePerfil.crear(PNG_REAL_DE_8_X_6, tipo).tipo).toBe('image/png');
      },
    );

    it('un archivo que es una vista dentro de un bloque mayor', () => {
      // Lo que entrega el lector de cuerpos de Node: el contenido empieza en
      // medio de un bloque compartido, no en el cero.
      const bloque = new Uint8Array(200);
      bloque.set(PNG_REAL_DE_8_X_6, 37);

      const vista = bloque.subarray(37, 37 + PNG_REAL_DE_8_X_6.length);

      expect(vista.byteOffset).toBe(37);
      expect(FotoDePerfil.crear(vista, 'image/png').tipo).toBe('image/png');
    });
  });

  describe('el tipo', () => {
    it.each([
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/jpg',
      'text/html',
      'application/octet-stream',
      'application/json',
      '',
    ])('«%s» no se acepta', (tipo) => {
      expect(rechazo(PNG_REAL_DE_8_X_6, tipo)).toBe('FOTO_TIPO_NO_PERMITIDO');
    });

    it('lo que dice ser y lo que es tienen que coincidir', () => {
      expect(rechazo(PNG_REAL_DE_8_X_6, 'image/jpeg')).toBe('FOTO_NO_ES_UNA_IMAGEN');
      expect(rechazo(JPEG_REAL_DE_8_X_6, 'image/png')).toBe('FOTO_NO_ES_UNA_IMAGEN');
    });

    it.each([
      ['un HTML', '<html><script>alert(1)</script></html>'],
      ['un SVG', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'],
      ['un texto cualquiera', 'esto no es una imagen, pero dice serlo'],
    ])('%s con el tipo de una imagen se rechaza', (_nombre, texto) => {
      expect(rechazo(TEXTO(texto), 'image/png')).toBe('FOTO_NO_ES_UNA_IMAGEN');
      expect(rechazo(TEXTO(texto), 'image/jpeg')).toBe('FOTO_NO_ES_UNA_IMAGEN');
    });

    it('un archivo vacio no es una imagen', () => {
      expect(rechazo(new Uint8Array(0), 'image/png')).toBe('FOTO_NO_ES_UNA_IMAGEN');
    });
  });

  describe('el peso: menos de 50 KB', () => {
    it('justo en el limite se acepta', () => {
      const foto = unPng(256, 256, PESO_MAXIMO_DE_LA_FOTO - unPng(256, 256).length);

      expect(foto.length).toBe(PESO_MAXIMO_DE_LA_FOTO);
      expect(rechazo(foto, 'image/png')).toBeUndefined();
    });

    it('un byte de mas se rechaza, con su propio codigo', () => {
      const foto = unPng(256, 256, PESO_MAXIMO_DE_LA_FOTO + 1 - unPng(256, 256).length);

      expect(foto.length).toBe(PESO_MAXIMO_DE_LA_FOTO + 1);
      expect(rechazo(foto, 'image/png')).toBe('FOTO_DEMASIADO_PESADA');
    });

    it('el peso se mira antes que el contenido: un archivo enorme no se recorre', () => {
      // Basura que ni siquiera empieza como una imagen: si se mirara primero el
      // contenido, el motivo seria otro.
      expect(rechazo(new Uint8Array(PESO_MAXIMO_DE_LA_FOTO + 1), 'image/jpeg')).toBe(
        'FOTO_DEMASIADO_PESADA',
      );
    });

    it('un JPEG tambien', () => {
      const foto = unJpeg(256, 256, PESO_MAXIMO_DE_LA_FOTO);

      expect(rechazo(foto, 'image/jpeg')).toBe('FOTO_DEMASIADO_PESADA');
    });
  });

  describe('el tamano en pixeles: un archivo pequeno no puede declarar uno desmesurado', () => {
    it('justo en el limite se acepta', () => {
      expect(rechazo(unPng(LADO_MAXIMO_DE_LA_FOTO, LADO_MAXIMO_DE_LA_FOTO), 'image/png')).toBe(
        undefined,
      );
      expect(rechazo(unJpeg(LADO_MAXIMO_DE_LA_FOTO, LADO_MAXIMO_DE_LA_FOTO), 'image/jpeg')).toBe(
        undefined,
      );
    });

    it.each([
      ['de ancho', LADO_MAXIMO_DE_LA_FOTO + 1, 10],
      ['de alto', 10, LADO_MAXIMO_DE_LA_FOTO + 1],
      ['en las dos medidas, en un archivo diminuto', 30_000, 30_000],
    ])('uno que pasa %s se rechaza', (_donde, ancho, alto) => {
      expect(rechazo(unPng(ancho, alto), 'image/png')).toBe('FOTO_DEMASIADO_GRANDE');
      expect(rechazo(unJpeg(ancho, alto), 'image/jpeg')).toBe('FOTO_DEMASIADO_GRANDE');
    });

    it('un tamano de cero no es una imagen', () => {
      expect(rechazo(unPng(0, 10), 'image/png')).toBe('FOTO_NO_ES_UNA_IMAGEN');
      expect(rechazo(unPng(10, 0), 'image/png')).toBe('FOTO_NO_ES_UNA_IMAGEN');
      expect(rechazo(unJpeg(0, 10), 'image/jpeg')).toBe('FOTO_NO_ES_UNA_IMAGEN');
      expect(rechazo(unJpeg(10, 0), 'image/jpeg')).toBe('FOTO_NO_ES_UNA_IMAGEN');
    });

    it('se miden los dos lados, cada uno por su cuenta', () => {
      // Con un solo lado pasado del limite, el otro dentro: si solo se leyera
      // uno de los dos, una de estas dos pasaria.
      expect(rechazo(unPng(1025, 1), 'image/png')).toBe('FOTO_DEMASIADO_GRANDE');
      expect(rechazo(unPng(1, 1025), 'image/png')).toBe('FOTO_DEMASIADO_GRANDE');
      expect(rechazo(unJpeg(1025, 1), 'image/jpeg')).toBe('FOTO_DEMASIADO_GRANDE');
      expect(rechazo(unJpeg(1, 1025), 'image/jpeg')).toBe('FOTO_DEMASIADO_GRANDE');
      expect(rechazo(unPng(300, 200), 'image/png')).toBeUndefined();
    });
  });

  describe('archivos rotos o cortados', () => {
    it('un PNG al que le falta su firma, aunque lo demas parezca bien', () => {
      const sinFirma = unPng(8, 8);
      sinFirma[0] = 0x00;

      expect(rechazo(sinFirma, 'image/png')).toBe('FOTO_NO_ES_UNA_IMAGEN');
    });

    it('un JPEG al que le falta su inicio, aunque lo demas parezca bien', () => {
      const sinInicio = unJpeg(8, 8);
      sinInicio[0] = 0x00;

      expect(rechazo(sinInicio, 'image/jpeg')).toBe('FOTO_NO_ES_UNA_IMAGEN');
    });

    it('un PNG cortado antes de su cabecera', () => {
      expect(rechazo(PNG_REAL_DE_8_X_6.slice(0, 20), 'image/png')).toBe('FOTO_NO_ES_UNA_IMAGEN');
    });

    it('un PNG cuyo primer bloque no es la cabecera', () => {
      const raro = unPng(8, 8);
      raro.set(TEXTO('JUNK'), 12);

      expect(rechazo(raro, 'image/png')).toBe('FOTO_NO_ES_UNA_IMAGEN');
    });

    it('un JPEG cortado antes de decir su tamano', () => {
      expect(rechazo(JPEG_REAL_DE_8_X_6.slice(0, 30), 'image/jpeg')).toBe('FOTO_NO_ES_UNA_IMAGEN');
    });

    it('un JPEG que empieza y termina sin decir nunca su tamano', () => {
      expect(rechazo(Uint8Array.from([0xff, 0xd8, 0xff, 0xd9, 0x00, 0x00]), 'image/jpeg')).toBe(
        'FOTO_NO_ES_UNA_IMAGEN',
      );
    });

    it('un JPEG que llega a los datos sin haber dicho su tamano', () => {
      const sinTamano = Uint8Array.from([
        ...[0xff, 0xd8],
        ...[0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00],
        ...[0xff, 0xd9],
      ]);

      expect(rechazo(sinTamano, 'image/jpeg')).toBe('FOTO_NO_ES_UNA_IMAGEN');
    });

    it('un segmento de JPEG con largo imposible', () => {
      const roto = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x00, 0x00, 0x00, 0x00]);

      expect(rechazo(roto, 'image/jpeg')).toBe('FOTO_NO_ES_UNA_IMAGEN');
    });

    it('un JPEG que pierde el hilo entre segmentos', () => {
      const perdido = Uint8Array.from([0xff, 0xd8, 0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc]);

      expect(rechazo(perdido, 'image/jpeg')).toBe('FOTO_NO_ES_UNA_IMAGEN');
    });

    it('un JPEG con relleno FF y reinicios antes del tamano se lee igual', () => {
      const conRelleno = Uint8Array.from([
        ...[0xff, 0xd8],
        // Relleno `FF FF` antes de un marcador, y un reinicio (D0) sin contenido.
        ...[0xff, 0xff, 0xd0],
        ...[0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x20, 0x00, 0x30],
        ...[0x03, 0x01, 0x22, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01],
        ...[0xff, 0xd9],
      ]);

      expect(rechazo(conRelleno, 'image/jpeg')).toBeUndefined();
      // 0x30 = 48 de ancho y 0x20 = 32 de alto: dentro del limite.
    });

    it('un JPEG progresivo (SOF2) tambien dice su tamano', () => {
      const progresivo = unJpeg(256, 256);
      const posicion = progresivo.findIndex(
        (valor, indice) => valor === 0xff && progresivo[indice + 1] === 0xc0,
      );

      progresivo[posicion + 1] = 0xc2;

      expect(rechazo(progresivo, 'image/jpeg')).toBeUndefined();
      // Con un tamano mayor al limite se ve que de verdad lo esta leyendo.
      const grande = unJpeg(2000, 2000);
      grande[grande.findIndex((v, i) => v === 0xff && grande[i + 1] === 0xc0) + 1] = 0xc2;

      expect(rechazo(grande, 'image/jpeg')).toBe('FOTO_DEMASIADO_GRANDE');
    });
  });

  describe('el error no cuenta lo que traia el archivo', () => {
    it('los mensajes no repiten nada del contenido', () => {
      const secreto = 'texto-que-no-debe-salir-nunca';

      try {
        FotoDePerfil.crear(TEXTO(secreto), 'image/png');
        expect.unreachable();
      } catch (error) {
        expect((error as Error).message).not.toContain(secreto);
      }
    });
  });
});
