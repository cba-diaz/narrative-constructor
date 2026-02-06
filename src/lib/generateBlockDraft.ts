import { ExerciseData } from '@/hooks/usePitchStore';

/**
 * Generates a pre-filled draft for a block based on exercise data.
 * Each section maps its exercise fields into a narrative that follows
 * the block's recommended structure.
 */
export function generateBlockDraft(
  sectionNumber: number,
  exercisesData: Record<string, ExerciseData>,
  protagonistData?: {
    nombre: string;
    edad: string;
    profesion: string;
    ciudad: string;
    contexto?: string;
    aspiracion?: string;
    frustracion?: string;
  }
): string {
  switch (sectionNumber) {
    case 1:
      return generateSection1Draft(exercisesData);
    case 2:
      return generateSection2Draft(exercisesData, protagonistData);
    case 3:
      return generateSection3Draft(exercisesData);
    case 4:
      return generateSection4Draft(exercisesData);
    case 5:
      return generateSection5Draft(exercisesData);
    case 6:
      return generateSection6Draft(exercisesData);
    case 7:
      return generateSection7Draft(exercisesData);
    case 8:
      return generateSection8Draft(exercisesData);
    case 9:
      return generateSection9Draft(exercisesData, protagonistData);
    default:
      return '';
  }
}

// SECTION 1: EL PROBLEMA
function generateSection1Draft(data: Record<string, ExerciseData>): string {
  const protagonist = data['1_4'] || {};
  const scale = data['1_5'] || {};
  const digger = data['1_3'] || {};

  const parts: string[] = [];

  // 1. Personaje
  if (protagonist.nombre) {
    let personaje = `${protagonist.nombre}`;
    if (protagonist.edad) personaje += ` tiene ${protagonist.edad} años`;
    if (protagonist.ciudad) personaje += ` y vive en ${protagonist.ciudad}`;
    personaje += '.';
    if (protagonist.profesion) {
      personaje += ` ${protagonist.profesion}.`;
    }
    parts.push(personaje);
  }

  // 2. Aspiración y frustración (momento + consecuencia)
  if (protagonist.aspiracion) {
    parts.push(protagonist.aspiracion + '.');
  }

  // Root problem from digger
  const rootProblem = digger['nivel_5'] || digger['nivel_4'] || digger['nivel_3'] || '';
  if (rootProblem) {
    parts.push(`El problema es que ${rootProblem.toLowerCase().replace(/\.$/, '')}.`);
  } else if (protagonist.frustracion) {
    parts.push(`El problema es que ${protagonist.frustracion.toLowerCase().replace(/\.$/, '')}.`);
  }

  // 3. Contexto/consecuencia
  if (protagonist.contexto) {
    parts.push(protagonist.contexto + '.');
  }

  // 4. Escala
  if (scale.cantidad) {
    let escala = '';
    if (scale.tangible) {
      escala = scale.tangible;
    } else {
      escala = `Hay ${scale.cantidad} personas que enfrentan este problema`;
      if (scale.frecuencia) escala += ` ${scale.frecuencia}`;
    }
    parts.push(escala.replace(/\.$/, '') + '.');
  }

  return cleanDraft(parts.join(' '));
}

// SECTION 2: LA SOLUCIÓN
function generateSection2Draft(data: Record<string, ExerciseData>, protagonist?: { nombre: string; profesion?: string; [k: string]: any }): string {
  const story = data['2_1'] || {};
  const steps = data['2_2'] || {};
  const parts: string[] = [];

  // If customer story was generated, use it
  if (story['historia_generada']) {
    parts.push(story['historia_generada']);
  } else {
    // Build from steps
    if (protagonist?.nombre) {
      parts.push(`${protagonist.nombre} entra a nuestra plataforma.`);
    }
    if (steps.reveal) {
      parts.push(steps.reveal.replace(/\.$/, '') + '.');
    }
    if (steps.transformacion) {
      parts.push(steps.transformacion.replace(/\.$/, '') + '.');
    }
  }

  if (steps.vision) {
    parts.push(`El resultado: ${steps.vision.replace(/\.$/, '')}.`);
  }

  return cleanDraft(parts.join(' '));
}

// SECTION 3: EL SUPERPODER
function generateSection3Draft(data: Record<string, ExerciseData>): string {
  const detector = data['3_1'] || {};
  const stage = data['3_2'] || {};
  const parts: string[] = [];

  if (detector['competidor_nombre']) {
    parts.push(`${detector['competidor_nombre']} ${detector['competidor_que_hace'] || 'opera en este espacio'}.`);
  }

  if (detector['diferenciacion']) {
    parts.push(`Nosotros nos diferenciamos porque ${detector['diferenciacion'].toLowerCase().replace(/\.$/, '')}.`);
  }

  // Mad-lib generated narrative
  if (detector['narrativa_generada']) {
    parts.push(detector['narrativa_generada']);
  }

  if (stage.validacion_etapa) {
    parts.push(stage.validacion_etapa.replace(/\.$/, '') + '.');
  }

  return cleanDraft(parts.join(' '));
}

// SECTION 4: LA TRACCIÓN
function generateSection4Draft(data: Record<string, ExerciseData>): string {
  const metric = data['4_1'] || {};
  const timeline = data['4_2'] || {};
  const momentum = data['4_3'] || {};
  const parts: string[] = [];

  // Main metric
  if (metric.numero_hoy) {
    const tipoLabel = metric.tipo_metrica === 'otra' ? (metric.otra_metrica || 'unidades') : (metric.tipo_metrica || 'usuarios');
    parts.push(`Hoy tenemos ${metric.numero_hoy} ${tipoLabel}.`);
    if (metric.numero_6_meses && metric.crecimiento) {
      parts.push(`Hace 6 meses eran ${metric.numero_6_meses}. Crecimos ${metric.crecimiento}.`);
    }
  }

  // Timeline hitos
  if (timeline.hito_1_fecha && timeline.hito_1_metrica) {
    parts.push(`En ${timeline.hito_1_fecha}: ${timeline.hito_1_metrica}.`);
    if (timeline.hito_1_contexto) parts.push(timeline.hito_1_contexto.replace(/\.$/, '') + '.');
  }
  if (timeline.hito_3_fecha && timeline.hito_3_metrica) {
    parts.push(`En ${timeline.hito_3_fecha}: ${timeline.hito_3_metrica}.`);
  }

  // Momentum
  if (momentum.logro_reciente) {
    parts.push(momentum.logro_reciente.replace(/\.$/, '') + '.');
  }
  if (momentum.senal_crecimiento) {
    parts.push(momentum.senal_crecimiento.replace(/\.$/, '') + '.');
  }

  return cleanDraft(parts.join(' '));
}

// SECTION 5: EL MERCADO
function generateSection5Draft(data: Record<string, ExerciseData>): string {
  const units = data['5_1'] || {};
  const westeros = data['5_2'] || {};
  const circles = data['5_3'] || {};
  const parts: string[] = [];

  if (units.cantidad_inicial && units.unidad) {
    parts.push(`Hay ${units.cantidad_inicial} ${units.unidad}.`);
  }
  if (units.cantidad_expandido) {
    parts.push(`En el mercado expandido son ${units.cantidad_expandido}.`);
  }
  if (units.valor_promedio) {
    parts.push(`A un precio promedio de ${units.valor_promedio}, la oportunidad es significativa.`);
  }

  // Competitors
  if (westeros.lannister_nombre) {
    parts.push(`Nuestro competidor más cercano es ${westeros.lannister_nombre}.`);
    if (westeros.lannister_debilidad) {
      parts.push(`Su debilidad: ${westeros.lannister_debilidad.replace(/\.$/, '')}.`);
    }
  }

  // Expansion
  if (circles.circulo_1) {
    parts.push(circles.circulo_1.replace(/\.$/, '') + '.');
  }
  if (circles.circulo_2) {
    parts.push(`Próxima expansión: ${circles.circulo_2.replace(/\.$/, '')}.`);
  }

  return cleanDraft(parts.join(' '));
}

// SECTION 6: EL MODELO
function generateSection6Draft(data: Record<string, ExerciseData>): string {
  const mechanism = data['6_1'] || {};
  const economics = data['6_2'] || {};
  const scale = data['6_3'] || {};
  const parts: string[] = [];

  if (mechanism.cliente && mechanism.precio) {
    parts.push(`${mechanism.cliente} paga ${mechanism.precio}${mechanism.frecuencia ? ' ' + mechanism.frecuencia : ''}.`);
  }
  if (mechanism.fuentes_multiples) {
    parts.push(mechanism.fuentes_multiples.replace(/\.$/, '') + '.');
  }

  if (economics.cac && economics.ltv) {
    parts.push(`El costo de adquisición es ${economics.cac}. El valor de vida del cliente es ${economics.ltv}.`);
    if (economics.ratio) {
      parts.push(`La relación LTV/CAC es de ${economics.ratio}.`);
    }
  }

  if (scale.escala_sin_costo) {
    parts.push(scale.escala_sin_costo.replace(/\.$/, '') + '.');
  }

  return cleanDraft(parts.join(' '));
}

// SECTION 7: LA PETICIÓN
function generateSection7Draft(data: Record<string, ExerciseData>): string {
  const ask = data['7_1'] || {};
  const dest = data['7_2'] || {};
  const results = data['7_3'] || {};
  const parts: string[] = [];

  if (ask.monto) {
    parts.push(`Buscamos ${ask.monto}.`);
  }

  // Destinations
  for (let i = 1; i <= 3; i++) {
    const name = dest[`cat_${i}_nombre`];
    const pct = dest[`cat_${i}_porcentaje`];
    const detail = dest[`cat_${i}_detalle`];
    if (name && pct) {
      parts.push(`El ${pct} va a ${name.toLowerCase()}.`);
      if (detail) parts.push(detail.replace(/\.$/, '') + '.');
    }
  }

  // Results
  const metrics = [results.metrica_1, results.metrica_2, results.metrica_3].filter(Boolean);
  if (metrics.length > 0) {
    parts.push(`Con esto, proyectamos alcanzar ${metrics.join(', ')}.`);
  }

  return cleanDraft(parts.join(' '));
}

// SECTION 8: EL EQUIPO
function generateSection8Draft(data: Record<string, ExerciseData>): string {
  const team = data['8_1'] || {};
  const complement = data['8_2'] || {};
  const parts: string[] = [];

  // Founders
  for (let i = 1; i <= 3; i++) {
    const name = team[`fundador_${i}_nombre`];
    const role = team[`fundador_${i}_rol`];
    const exp = team[`fundador_${i}_experiencia`];
    if (name) {
      let line = name;
      if (role) line += `, ${role}`;
      line += '.';
      if (exp) line += ` ${exp.replace(/\.$/, '')}.`;
      parts.push(line);
    }
  }

  if (complement?.historia_equipo) {
    parts.push(complement.historia_equipo.replace(/\.$/, '') + '.');
  }

  if (complement?.falta) {
    parts.push(`Necesitamos: ${complement.falta.replace(/\.$/, '')}.`);
  }

  return cleanDraft(parts.join('\n\n'));
}

// SECTION 9: EL CIERRE
function generateSection9Draft(data: Record<string, ExerciseData>, protagonist?: { nombre: string; [k: string]: any }): string {
  const close = data['9_1'] || {};
  const parts: string[] = [];

  // Reconnect with protagonist
  if (protagonist?.nombre) {
    parts.push(`${protagonist.nombre} hoy`);
    if (close.cambio_protagonista) {
      parts.push(close.cambio_protagonista.replace(/\.$/, '') + '.');
    } else {
      parts.push('tiene una vida diferente.');
    }
  }

  if (close.vision_mundo) {
    parts.push(close.vision_mundo.replace(/\.$/, '') + '.');
  }

  if (close.llamado_accion) {
    parts.push(close.llamado_accion.replace(/\.$/, '') + '.');
  }

  if (close.siguiente_paso) {
    parts.push(close.siguiente_paso.replace(/\.$/, '') + '.');
  }

  return cleanDraft(parts.join(' '));
}

/** Remove double spaces, trim, fix double periods */
function cleanDraft(text: string): string {
  return text
    .replace(/\.{2,}/g, '.')
    .replace(/\.\s*\./g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
