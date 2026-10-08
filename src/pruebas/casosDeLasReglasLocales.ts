import type { ConsultaSinConexion } from './motorLocalDeReferencia.js';

const BOGOTA = 'America/Bogota';
const MADRID = 'Europe/Madrid';
const TOKIO = 'Asia/Tokyo';

/**
 * Frases con las que se comprueba que el dispositivo responde lo mismo que el
 * servidor (SCRUM-141). Se publican en `docs/contratos/reglas-locales.json`, con lo
 * que se espera de cada una, para que el frontend las pruebe tambien.
 *
 * Hay de todo a proposito: lo que se responde sin conexion, lo que no, y sobre todo
 * lo **dificil**: las frases que llevan un saludo delante de algo serio, la
 * negacion que dispara igual y el nombre de la mascota.
 *
 * Agregar un caso aqui es la forma de fijar un comportamiento. Si un caso cambia de
 * resultado, la prueba de conformidad dice cual y el contrato hay que regenerarlo.
 */
export const CASOS_DE_LAS_REGLAS_LOCALES: readonly ConsultaSinConexion[] = [
  // ---- el riesgo, con lineas segun el pais de la zona
  { texto: 'me siento muy mal, quiero hacerme daño', zona: BOGOTA },
  { texto: 'me siento muy mal, quiero hacerme daño', zona: MADRID },
  { texto: 'me siento muy mal, quiero hacerme daño', zona: TOKIO },
  { texto: 'QUIERO MORIRME', zona: BOGOTA },
  { texto: 'ya no puedo más', zona: 'America/Mexico_City' },
  { texto: 'a veces pienso en suicidarme', zona: 'America/New_York' },
  // Se prefiere el falso positivo: no se interpretan negaciones.
  { texto: 'no quiero morirme', zona: BOGOTA },
  // Un saludo delante no esconde lo serio.
  { texto: 'hola, quiero matarme', zona: BOGOTA },
  { texto: 'buenas noches, no aguanto mas', zona: BOGOTA },
  // Una zona que no existe no tiene pais: recibe el directorio, y ningun telefono.
  { texto: 'quiero morirme', zona: 'Narnia/Cair_Paravel' },
  // La zona se lee como la lee IANA: sin importar mayusculas, y con sus alias.
  { texto: 'quiero morirme', zona: 'america/bogota' },
  { texto: 'quiero morirme', zona: 'US/Eastern' },
  { texto: 'quiero morirme', zona: 'Atlantic/Canary' },
  { texto: 'donde busco ayuda', zona: 'Asia/Calcutta' },

  // ---- la charla que se responde sin conexion
  { texto: 'hola', zona: BOGOTA },
  { texto: 'Hola!!!', zona: BOGOTA },
  { texto: 'holaaaaa', zona: BOGOTA },
  { texto: 'buenos días', zona: MADRID },
  { texto: 'buenas tardes', zona: BOGOTA },
  { texto: 'hey', zona: BOGOTA },
  { texto: 'gracias', zona: BOGOTA },
  { texto: 'muchas gracias', zona: BOGOTA },
  { texto: 'mil gracias, amigo', zona: BOGOTA },
  { texto: 'thx', zona: BOGOTA },
  { texto: 'adiós', zona: BOGOTA },
  { texto: 'chao, hasta pronto', zona: BOGOTA },
  { texto: 'nos vemos', zona: BOGOTA },
  { texto: 'buenas noches', zona: BOGOTA },
  { texto: 'me voy a dormir', zona: BOGOTA },
  // El nombre de la mascota cuenta como relleno de la charla.
  { texto: 'hola luma', zona: BOGOTA, mascota: 'Luma' },
  { texto: 'buenas noches, Luma', zona: BOGOTA, mascota: 'Luma' },
  { texto: 'gracias Luma', zona: BOGOTA, mascota: 'Luma' },
  // Sin ese nombre, "luma" es una palabra que no es charla.
  { texto: 'hola luma', zona: BOGOTA },

  // ---- lo que parece charla y no lo es del todo
  { texto: 'hola, como estas', zona: BOGOTA },
  { texto: 'como estas', zona: BOGOTA },
  { texto: 'que puedes hacer', zona: BOGOTA },
  { texto: 'adios y gracias por todo', zona: BOGOTA },
  { texto: 'hola, quiero desaparecer', zona: BOGOTA },
  { texto: 'solo queria saludar', zona: BOGOTA },
  { texto: 'hola, necesito hablar con alguien', zona: BOGOTA },

  // ---- donde buscar ayuda
  { texto: '¿Qué líneas de ayuda hay?', zona: BOGOTA },
  { texto: 'donde busco ayuda', zona: BOGOTA },
  { texto: 'donde busco ayuda', zona: MADRID },
  { texto: 'donde busco ayuda', zona: TOKIO },
  { texto: 'necesito un psicólogo', zona: BOGOTA },
  { texto: 'con quien hablo', zona: 'America/Mexico_City' },
  { texto: 'quiero ir a terapia', zona: BOGOTA },
  { texto: 'necesito ayuda para dormir', zona: BOGOTA },

  // ---- lo que exige conexion
  { texto: 'como duermo mejor', zona: BOGOTA },
  { texto: 'no puedo dormir', zona: BOGOTA },
  { texto: 'que significa mi resultado', zona: BOGOTA },
  { texto: 'que nivel saque', zona: BOGOTA },
  { texto: 'me siento triste', zona: BOGOTA },
  { texto: 'estoy muy sola', zona: BOGOTA },
  { texto: 'cuanto cuesta el parqueadero', zona: BOGOTA },
  { texto: 'asdf qwerty', zona: BOGOTA },
  { texto: '', zona: BOGOTA },
  // "mal" ya no se lee dentro de "normal".
  { texto: 'esto es normal', zona: BOGOTA },
];
