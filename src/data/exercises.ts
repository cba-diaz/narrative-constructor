// Types for exercises
export interface ExerciseField {
  id: string;
  type: 'input' | 'textarea' | 'radio' | 'select' | 'checkbox' | 'number' | 'time' | 'url';
  label: string;
  placeholder?: string;
  options?: { value: string; label: string; followUpField?: ExerciseField }[];
  required?: boolean;
  maxWords?: number;
  nota?: string;
}

export interface Exercise {
  id: string;
  titulo: string;
  instruccion: string;
  campos: ExerciseField[];
  nota?: string;
  // New: specialized component type
  componentType?: 'progressive-reduction' | 'headline' | 'investor-profiler' | 'three-acts' | 'problem-digger' | 'customer-story' | 'superpower-detector';
}

export interface SectionExercises {
  seccionNumero: number;
  ejercicios: Exercise[];
}

// Exercise data for all 9 sections
export const sectionExercises: SectionExercises[] = [
  // SECTION 1: EL PROBLEMA (Chapter 1 - High Concept + Chapter 4 - Problem)
  {
    seccionNumero: 1,
    ejercicios: [
      {
        id: "1_3",
        titulo: "Casting del Protagonista",
        instruccion: "Tu problema necesita una persona específica, no un 'segmento de mercado'. Los inversionistas invierten en personas, no en demografías.",
        campos: [
          { id: "nombre", type: "input", label: "Nombre", placeholder: "María, Carlos, etc." },
          { id: "edad", type: "input", label: "Edad", placeholder: "24" },
          { id: "profesion", type: "input", label: "Profesión o rol", placeholder: "Gerente de operaciones, estudiante, etc." },
          { id: "ciudad", type: "input", label: "Ciudad y país", placeholder: "Medellín, Colombia" },
          { id: "contexto", type: "textarea", label: "Contexto: ¿De quién depende? ¿Quién depende de él/ella?", placeholder: "Vive con su mamá y hermana menor. Es el principal ingreso del hogar." },
          { id: "aspiracion", type: "textarea", label: "Aspiración: ¿Qué quiere lograr?", placeholder: "Quiere ser técnico en refrigeración porque vio que pagan tres veces más" },
          { id: "frustracion", type: "textarea", label: "Frustración: ¿Qué lo frustra relacionado con tu problema?", placeholder: "Sabe que tiene potencial pero no puede estudiar porque no puede dejar de trabajar" },
          { id: "momento", type: "textarea", label: "¿En qué momento exacto ocurre el problema?", placeholder: "Miércoles a las 6 PM, cuando revisa el saldo después del trabajo y ve que no le alcanza para el arriendo", nota: "El Bloque 1 exige una hora o fecha específica. Este es el dato que convierte el problema abstracto en una escena real." }
        ]
      },
      {
        id: "1_2",
        titulo: "Excavadora de Problemas",
        instruccion: "Excava hasta encontrar la raíz del problema. La respuesta del Nivel 5 es tu problema real. Los niveles 1-4 son síntomas.",
        campos: [],
        componentType: "problem-digger",
        nota: "Si tu solución ataca el Nivel 1, estás poniendo curitas. Ataca el Nivel 5."
      },
      {
        id: "1_4",
        titulo: "La Escala del Problema",
        instruccion: "Ahora escala el problema. ¿Cuántas personas viven lo mismo que tu protagonista?",
        campos: [
          { id: "cantidad", type: "input", label: "¿Cuántas personas o empresas enfrentan este problema?", placeholder: "47,000 / 2.3 millones" },
          { id: "frecuencia", type: "input", label: "¿Con qué frecuencia?", placeholder: "cada día / cada mes / cada año" },
          { id: "tangible", type: "textarea", label: "Haz el número tangible. Tradúcelo a algo que se pueda visualizar.", placeholder: "En el tiempo de esta presentación, se generaron 50,000 horas de audio sin transcribir en Latinoamérica" }
        ]
      },
      {
        id: "1_1",
        titulo: "Tu startup en 8 palabras",
        instruccion: "Ejercicio recomendado. Con todo lo que ya definiste sobre tu problema y protagonista, reduce tu startup a 8 palabras. Esta frase abre tu pitch.",
        campos: [],
        componentType: "progressive-reduction",
        nota: "Esta frase abre tu pitch. Tómate 5 minutos."
      }
    ]
  },
  // SECTION 2: LA SOLUCIÓN (Chapter 5 - The Solution)
  {
    seccionNumero: 2,
    ejercicios: [
      {
        id: "2_1",
        titulo: "Historia de Cliente y Transformación",
        instruccion: "Construye la historia de transformación de un cliente real y muestra la progresión de tu solución. Los inversionistas recuerdan historias, no estadísticas.",
        campos: [],
        componentType: "customer-story",
        nota: "Esta historia debe tener entre 80-120 palabras para el Pitch Kit."
      }
    ]
  },
  // SECTION 3: EL SUPERPODER (Chapter 6 - Superpower)
  {
    seccionNumero: 3,
    ejercicios: [
      {
        id: "3_1",
        titulo: "Detector de Superpoderes",
        instruccion: "Tu superpoder es lo que te hace diferente de verdad. Esta suite de 3 módulos te ayudará a encontrarlo y articularlo.",
        campos: [],
        componentType: "superpower-detector",
        nota: "Un superpoder real es algo que un competidor NO podría decir."
      }
    ]
  },
  // SECTION 4: LA TRACCIÓN
  {
    seccionNumero: 4,
    ejercicios: [
      {
        id: "4_1",
        titulo: "Tracción y momentum",
        instruccion: "Elige tu métrica protagonista, muestra cómo has evolucionado y qué está pasando ahora. Los inversionistas quieren ver tendencia y momentum.",
        campos: [
          { 
            id: "tipo_metrica", 
            type: "radio", 
            label: "Tipo de métrica principal",
            options: [
              { value: "usuarios", label: "Usuarios activos" },
              { value: "clientes", label: "Clientes pagadores" },
              { value: "revenue", label: "Revenue (MRR/ARR)" },
              { value: "transacciones", label: "Transacciones/Volumen" },
              { value: "otra", label: "Otra" }
            ]
          },
          { id: "otra_metrica", type: "input", label: "Si elegiste 'Otra', especifica cuál", placeholder: "Graduados, envíos, etc." },
          { id: "numero_hoy", type: "input", label: "¿Cuánto es ese número HOY?", placeholder: "2,340" },
          { id: "numero_inicio", type: "input", label: "¿Cuánto era cuando empezaste?", placeholder: "50" },
          { id: "crecimiento", type: "input", label: "% de crecimiento (se calcula automáticamente)", placeholder: "Se calcula al llenar los campos anteriores", nota: "Se calcula a partir de tu número inicial y actual" },
          { id: "hito_1_fecha", type: "input", label: "Hito 1 - Fecha (mes/año)", placeholder: "Marzo 2024" },
          { id: "hito_1_metrica", type: "input", label: "Hito 1 - Métrica", placeholder: "120 estudiantes" },
          { id: "hito_1_contexto", type: "textarea", label: "Hito 1 - ¿Qué pasó? ¿Por qué importa?", placeholder: "Lanzamos en Medellín" },
          { id: "hito_2_fecha", type: "input", label: "Hito 2 - Fecha", placeholder: "Agosto 2024" },
          { id: "hito_2_metrica", type: "input", label: "Hito 2 - Métrica", placeholder: "890 estudiantes" },
          { id: "hito_2_contexto", type: "textarea", label: "Hito 2 - ¿Qué pasó? ¿Por qué importa?", placeholder: "Expandimos a Bogotá" },
          { id: "hito_3_fecha", type: "input", label: "Hito 3 - Fecha", placeholder: "Diciembre 2024" },
          { id: "hito_3_metrica", type: "input", label: "Hito 3 - Métrica", placeholder: "2,340 graduados" },
          { id: "hito_3_contexto", type: "textarea", label: "Hito 3 - ¿Qué pasó? ¿Por qué importa?", placeholder: "4 ciudades operando" },
          { id: "logro_reciente", type: "textarea", label: "Momentum: ¿Qué logro reciente puedes mencionar?", placeholder: "Esta semana cerramos con Walmart / Este mes sumamos 92 empresas nuevas" },
          { id: "senal_crecimiento", type: "textarea", label: "¿Qué señal tienes de que el crecimiento va a continuar?", placeholder: "Lista de espera de X / Pipeline de Y clientes" }
        ]
      }
    ]
  },
  // SECTION 5: EL MERCADO
  {
    seccionNumero: 5,
    ejercicios: [
      {
        id: "5_1",
        titulo: "Mapa del territorio",
        instruccion: "El cerebro no procesa '$50 billones'. Traduce tu mercado a personas o empresas reales y muéstralo en tres círculos concéntricos: donde ya operas, tu próxima expansión, y tu visión regional.",
        campos: [
          { id: "unidad", type: "input", label: "¿Qué unidad representa tu mercado?", placeholder: "técnicos / tiendas / pacientes / transacciones" },
          { id: "valor_promedio", type: "input", label: "Valor promedio por unidad", placeholder: "$400 por curso / $1,200 por cliente / $15 por transacción" },
          { id: "circulo_1", type: "textarea", label: "Círculo 1 — Donde ya operas (cantidad + geografía)", placeholder: "Colombia: 340,000 vacantes técnicas sin llenar" },
          { id: "circulo_2", type: "textarea", label: "Círculo 2 — Tu próxima expansión", placeholder: "México + Perú: 800,000 vacantes adicionales" },
          { id: "circulo_3", type: "textarea", label: "Círculo 3 — Tu visión regional", placeholder: "Latinoamérica: 2.3 millones de vacantes técnicas" }
        ],
        nota: "El mercado en unidades humanas siempre es más poderoso que en dólares. Un inversionista visualiza personas, no billones."
      },
      {
        id: "5_2",
        titulo: "Censo de Westeros",
        instruccion: "Como Tywin Lannister, necesitas conocer a todos los jugadores en tu mapa antes de moverte. Nombra a tus competidores y define exactamente dónde estás mejor posicionado.",
        campos: [
          { id: "competidor_principal", type: "input", label: "Competidor #1 — Nombre", placeholder: "SENA, Rappi, Mercado Libre, el banco X...", nota: "Tu competidor más fuerte. Ponlo por nombre propio." },
          { id: "competidor_debilidad", type: "textarea", label: "Debilidad del Competidor #1 — ¿Qué hace mal que tú resuelves?", placeholder: "Son lentos, no garantizan empleo, no entienden el contexto local" },
          { id: "competidor_2", type: "input", label: "Competidor #2 o alternativa — Nombre", placeholder: "Excel manual, contratar un consultor, no hacer nada", nota: "Puede ser otro competidor directo o la alternativa actual (ej. 'no hacer nada')." },
          { id: "tu_ventaja", type: "textarea", label: "Tu ventaja — ¿Por qué estás mejor posicionado que ambos?", placeholder: "Somos los únicos que combinamos formación + colocación laboral garantizada" },
          { id: "barrera", type: "textarea", label: "Tu barrera — ¿Qué no pueden copiar fácilmente?", placeholder: "Llevamos 3 años construyendo la red de 340 empresas aliadas. No se replica en 6 meses." }
        ],
        nota: "El Bloque 5 requiere mencionar al menos un competidor por nombre. Sin este dato, el AI no puede cumplir esa restricción."
      }
    ]
  },
  // SECTION 6: EL MODELO
  {
    seccionNumero: 6,
    ejercicios: [
      {
        id: "6_1",
        titulo: "El mecanismo básico",
        instruccion: "Antes de hablar de unit economics, clarifica la mecánica básica de tu revenue.",
        campos: [
          { id: "cliente", type: "input", label: "¿Quién es tu cliente que paga?", placeholder: "Estudiantes / Empresas / Ambos" },
          { id: "precio", type: "input", label: "¿Cuánto paga?", placeholder: "$299/mes, $1,600 por curso, etc." },
          { id: "frecuencia", type: "input", label: "¿Con qué frecuencia?", placeholder: "Mensual / Una vez / Por transacción" },
          { id: "fuentes_multiples", type: "textarea", label: "Si tienes múltiples fuentes de ingreso, ¿cuál es la principal y qué % representa?", placeholder: "60% estudiantes, 40% empresas" }
        ]
      },
      {
        id: "6_2",
        titulo: "Unit Economics y Escalabilidad",
        instruccion: "¿Cuánto cuesta conseguir un cliente, cuánto genera, y qué parte de tu negocio escala sin costos lineales?",
        campos: [
          { id: "cac", type: "input", label: "CAC: ¿Cuánto cuesta adquirir un cliente?", placeholder: "$42,000 pesos / $380 USD" },
          { id: "ltv", type: "input", label: "LTV: ¿Cuánto genera ese cliente en total?", placeholder: "$2.1 millones / $4,186 USD" },
          { id: "ratio", type: "input", label: "Ratio LTV/CAC:", placeholder: "50:1 / 11:1" },
          { id: "ratio_contexto", type: "textarea", label: "¿Por qué este ratio es bueno para tu industria?", placeholder: "El estándar en edtech es 3:1, nosotros tenemos 50:1" },
          { id: "escala_sin_costo", type: "textarea", label: "¿Qué parte de tu negocio crece sin agregar costos proporcionales?", placeholder: "El contenido se crea una vez y se usa infinitas veces" },
          
        ]
      }
    ]
  },
  // SECTION 7: LA PETICIÓN
  {
    seccionNumero: 7,
    ejercicios: [
      {
        id: "7_1",
        titulo: "Tu petición completa",
        instruccion: "Di tu número en voz alta hasta que salga sin temblarte la voz. Luego define el destino del capital y los resultados que prometes en 18 meses. Los tres van juntos: sin resultados, la petición queda en el aire.",
        campos: [
          { id: "monto", type: "input", label: "¿Cuánto dinero estás levantando?", placeholder: "$1.2 millones USD" },
          { id: "por_que_monto", type: "textarea", label: "¿Por qué ese número y no otro?", placeholder: "Es lo que necesitamos para llegar a break-even en 18 meses" },
          { id: "cat_1_nombre", type: "input", label: "Categoría 1 — Nombre", placeholder: "Expansión geográfica" },
          { id: "cat_1_porcentaje", type: "input", label: "Categoría 1 — Porcentaje", placeholder: "50%" },
          { id: "cat_1_detalle", type: "textarea", label: "Categoría 1 — ¿Qué específicamente?", placeholder: "Abrir en Ciudad de México y Lima" },
          { id: "cat_2_nombre", type: "input", label: "Categoría 2 — Nombre", placeholder: "Tecnología" },
          { id: "cat_2_porcentaje", type: "input", label: "Categoría 2 — Porcentaje", placeholder: "30%" },
          { id: "cat_2_detalle", type: "textarea", label: "Categoría 2 — ¿Qué específicamente?", placeholder: "Automatizar creación de currículos" },
          { id: "cat_3_nombre", type: "input", label: "Categoría 3 — Nombre (opcional)", placeholder: "Equipo" },
          { id: "cat_3_porcentaje", type: "input", label: "Categoría 3 — Porcentaje (opcional)", placeholder: "20%" },
          { id: "cat_3_detalle", type: "textarea", label: "Categoría 3 — ¿Qué específicamente? (opcional)", placeholder: "Director de operaciones en México y Perú" },
          { id: "metrica_1", type: "input", label: "Métrica 1 que alcanzarás en 18 meses", placeholder: "15,000 graduados" },
          { id: "metrica_2", type: "input", label: "Métrica 2 que alcanzarás en 18 meses", placeholder: "$4M USD en ingresos anuales" },
          { id: "metrica_3", type: "input", label: "Métrica 3 que alcanzarás en 18 meses", placeholder: "Break even operativo" }
        ]
      }
    ]
  },
  // SECTION 8: EL EQUIPO
  {
    seccionNumero: 8,
    ejercicios: [
      {
        id: "8_1",
        titulo: "Ficha de cada fundador",
        instruccion: "No CVs completos. Solo experiencia que los califica para ESTE problema.",
        nota: "Fundador 3 (opcional — solo si aplica)",
        campos: [
          { id: "fundador_1_nombre", type: "input", label: "Fundador 1 - Nombre", placeholder: "Valentina" },
          { id: "fundador_1_rol", type: "input", label: "Fundador 1 - Rol", placeholder: "CEO" },
          { id: "fundador_1_experiencia", type: "textarea", label: "Fundador 1 - ¿Qué experiencia lo califica?", placeholder: "4 años como directora de operaciones en Platzi" },
          { id: "fundador_1_superpoder", type: "textarea", label: "Fundador 1 - ¿Cuál es su habilidad clave para ejecutar este negocio?", placeholder: "Sabe escalar programas educativos" },
          { id: "fundador_2_nombre", type: "input", label: "Fundador 2 - Nombre", placeholder: "Andrés" },
          { id: "fundador_2_rol", type: "input", label: "Fundador 2 - Rol", placeholder: "COO" },
          { id: "fundador_2_experiencia", type: "textarea", label: "Fundador 2 - ¿Qué experiencia lo califica?", placeholder: "8 años en Siemens coordinando capacitación técnica" },
          { id: "fundador_2_superpoder", type: "textarea", label: "Fundador 2 - ¿Cuál es su habilidad clave para ejecutar este negocio?", placeholder: "Conoce la industria técnica por dentro" },
          { id: "fundador_3_nombre", type: "input", label: "Fundador 3 - Nombre (opcional)", placeholder: "Camila" },
          { id: "fundador_3_rol", type: "input", label: "Fundador 3 - Rol (opcional)", placeholder: "CTO" },
          { id: "fundador_3_experiencia", type: "textarea", label: "Fundador 3 - ¿Qué experiencia lo califica?", placeholder: "Lideró matching en Rappi" },
          { id: "fundador_3_superpoder", type: "textarea", label: "Fundador 3 - ¿Cuál es su habilidad clave para ejecutar este negocio? (opcional)", placeholder: "Sabe construir algoritmos de matching" }
        ]
      },
      {
        id: "8_2",
        titulo: "Complementariedad y talento faltante",
        instruccion: "¿Cómo funcionan juntos y qué les falta? Los mejores fundadores saben qué les falta.",
        campos: [
          { id: "complementariedad", type: "textarea", label: "¿Cómo se complementan las habilidades del equipo?", placeholder: "Uno sabe escalar, otro conoce la industria, otro construye la tecnología" },
          { id: "como_conocieron", type: "textarea", label: "¿Cómo se conocieron y cuánto tiempo llevan trabajando juntos?", placeholder: "Nos conocimos en un programa del BID en 2021. Llevamos 3 años juntos." },
          { id: "rol_faltante", type: "input", label: "¿Qué rol clave falta en tu equipo?", placeholder: "VP de Ventas con red en México" },
          { id: "plan_reclutamiento", type: "textarea", label: "¿Cómo planeas reclutar a esa persona?", placeholder: "Ya tenemos un headhunter trabajando en esto" }
        ]
      }
    ]
  },
  // SECTION 9: EL CIERRE
  {
    seccionNumero: 9,
    ejercicios: [
      {
        id: "9_1",
        titulo: "Cierre memorable",
        instruccion: "Reconecta con tu protagonista, pinta la visión del mundo y deja claro el siguiente paso. Este es tu momento final.",
        campos: [
          { id: "protagonista_hoy", type: "textarea", label: "¿Cómo está tu protagonista hoy gracias a tu solución?", placeholder: "Carlos hoy gana tres veces más. Se cambió de barrio. Está pagando la universidad de su hermana." },
          { id: "escala_vision", type: "textarea", label: "¿Cuántas personas podrían vivir lo que vivió tu protagonista?", placeholder: "2.3 millones de vacantes en Latinoamérica esperando un Carlos que las llene" },
          { id: "mundo_diferente", type: "textarea", label: "¿Qué cambia en el mundo si tu startup tiene éxito?", placeholder: "Millones de jóvenes pueden acceder a empleos técnicos bien pagados sin endeudarse" },
          { id: "siguiente_paso", type: "textarea", label: "¿Cuál es el siguiente paso concreto?", placeholder: "Una llamada de 30 minutos esta semana", nota: "Termina con un verbo de acción y un tiempo concreto. Prohibido terminar con 'gracias' o '¿preguntas?'" },
          { id: "facilitar", type: "textarea", label: "¿Cómo lo facilitas?", placeholder: "Les mando tres horarios apenas terminemos" }
        ]
      }
    ]
  }
];

// Updated motivational messages (shown after completing each section)
export const sectionMotivationalMessages: Record<number, string> = {
  1: "✓ Tu villano está en escena. Ahora viene el héroe.",
  2: "✓ La solución existe. Pero falta explicar por qué solo tú.",
  3: "✓ Tu superpoder está claro. Ahora a probarlo con números.",
  4: "✓ Los números hablan. Esto no es ficción.",
  5: "✓ El territorio está mapeado. Hora de mostrar cómo ganas dinero.",
  6: "✓ El motor está definido. Ahora viene la petición.",
  7: "✓ Pediste con convicción. Falta presentar al equipo.",
  8: "✓ El equipo está listo. Solo falta el cierre.",
  9: "🎬 ¡Tu pitch está completo! Léelo en voz alta."
};
