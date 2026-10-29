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

  // ---- el lenguaje ofensivo (SCRUM-192): se responde sin conexion y sin lineas
  { texto: 'eres un idiota', zona: BOGOTA },
  { texto: 'CALLATE', zona: BOGOTA },
  { texto: 'hola, imbécil', zona: BOGOTA },
  { texto: 'vete a la mierda', zona: MADRID },
  // El riesgo va antes que la ofensa.
  { texto: 'eres un idiota, quiero morirme', zona: BOGOTA },
  { texto: 'callate, no aguanto mas', zona: BOGOTA },
  // Desahogo, no insulto: sigue el camino de siempre.
  { texto: 'me siento una mierda', zona: BOGOTA },
  { texto: 'odio mi vida', zona: BOGOTA },
  { texto: 'soy un idiota', zona: BOGOTA },
  { texto: 'me siento inútil', zona: BOGOTA },
  { texto: 'saca la basura', zona: BOGOTA },

  // ---- las erratas (SCRUM-193): se leen como se quisieron escribir
  { texto: 'ola', zona: BOGOTA },
  { texto: 'ola, como bamos', zona: BOGOTA },
  { texto: 'grasias', zona: BOGOTA },
  { texto: 'necesito un sicologo', zona: BOGOTA },
  // Y el riesgo con una errata sigue siendo riesgo.
  { texto: 'kiero morirme', zona: BOGOTA },
  { texto: 'a veces pienso en suisidarme', zona: BOGOTA },
  { texto: 'no aguanto mass', zona: BOGOTA },
  // Lo que cambia de quien se habla no se corrige: no es riesgo.
  { texto: 'mi abuela no aguanta mas', zona: BOGOTA },
  // Una palabra que se parece a un insulto no lo es.
  { texto: 'tanto tiempo', zona: BOGOTA },

  // ---- los caracteres invisibles (SCRUM-258): no esconden lo que se dice
  // Uno en medio de la palabra: el guion blando, el espacio de ancho cero.
  { texto: 'quiero mo\u{200B}rirme', zona: BOGOTA },
  { texto: 'no aguan\u{AD}to mas', zona: BOGOTA },
  // Uno usado en lugar del espacio.
  { texto: 'quiero\u{200B}morirme', zona: BOGOTA },
  // Con una errata a la vez.
  { texto: 'me kie\u{AD}ro matar', zona: BOGOTA },
  // Letras de ancho completo.
  { texto: 'ｑｕｉｅｒｏ ｍｏｒｉｒｍｅ', zona: BOGOTA },
  // Y sin riesgo no se inventa: un saludo con un invisible sigue siendo un saludo.
  { texto: 'hola\u{200B} buenas noches', zona: BOGOTA },
  // Los dos usos a la vez (SCRUM-318): uno en lugar del espacio y otro dentro de la palabra.
  { texto: 'quiero\u{200B}mo\u{200B}rir', zona: BOGOTA },
  { texto: 'no\u{AD}aguan\u{200D}to\u{2060}mas', zona: BOGOTA },
  { texto: 'hoy me siento mal, quiero \u{200B}ma\u{200B}tarme', zona: MADRID },
  // Sin separador no hay expresion, y con invisibles mezclados un saludo sigue siendo un saludo.
  { texto: 'quieromorir', zona: BOGOTA },
  { texto: 'ho\u{200B}la\u{200B}buenas\u{AD}tardes', zona: BOGOTA },

  // ---- lo que no se reconoce: el catalogo, sin lineas de atencion (SCRUM-176)
  { texto: 'a que hora abre la biblioteca', zona: BOGOTA },
  { texto: 'a que hora abre la biblioteca', zona: MADRID },
  // Los tres que antes ensenaban lineas por la red de seguridad, y no estan en la lista de riesgo.
  { texto: 'gracias por todo', zona: BOGOTA },
  { texto: 'adiós, y gracias por todo', zona: BOGOTA },
  { texto: 'chao, ya no estoy', zona: BOGOTA },
  // Y los que si pasaron a la lista de riesgo.
  { texto: 'adiós para siempre', zona: BOGOTA },
  { texto: 'hola, quiero desaparecer', zona: BOGOTA },

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
