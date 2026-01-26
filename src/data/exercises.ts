// Types for exercises
export interface ExerciseField {
  id: string;
  type: 'input' | 'textarea' | 'radio' | 'select' | 'checkbox' | 'number' | 'time' | 'url';
  label: string;
  placeholder?: string;
  options?: { value: string; label: string; followUpField?: ExerciseField }[];
  required?: boolean;
  maxWords?: number;
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
        id: "1_1",
        titulo: "Tu startup en 8 palabras",
        instruccion: "Reduce progresivamente la descripción de tu startup hasta obtener una frase de 8 palabras que será la apertura de tu pitch.",
        campos: [],
        componentType: "progressive-reduction",
        nota: "Esta frase de 8 palabras será la apertura de tu pitch."
      },
      {
        id: "1_2",
        titulo: "El titular de primera plana",
        instruccion: "Si mañana tu startup saliera en la portada del diario más importante de tu país, ¿cuál sería el titular?",
        campos: [],
        componentType: "headline",
        nota: "Un buen titular es memorable y genera curiosidad."
      },
      {
        id: "1_3",
        titulo: "Excavadora de Problemas",
        instruccion: "Excava hasta encontrar la raíz del problema. La respuesta del Nivel 5 es tu problema real. Los niveles 1-4 son síntomas.",
        campos: [],
        componentType: "problem-digger",
        nota: "Si tu solución ataca el Nivel 1, estás poniendo curitas. Ataca el Nivel 5."
      },
      {
        id: "1_4",
        titulo: "Casting del Protagonista",
        instruccion: "Tu problema necesita una persona específica, no un 'segmento de mercado'. Los inversionistas invierten en personas, no en demografías.",
        campos: [
          { id: "nombre", type: "input", label: "Nombre", placeholder: "María, Carlos, etc." },
          { id: "edad", type: "input", label: "Edad", placeholder: "24" },
          { id: "profesion", type: "input", label: "Profesión o rol", placeholder: "Gerente de operaciones, estudiante, etc." },
          { id: "ciudad", type: "input", label: "Ciudad y país", placeholder: "Medellín, Colombia" },
          { id: "contexto", type: "textarea", label: "Contexto: ¿De quién depende? ¿Quién depende de él/ella?", placeholder: "Vive con su mamá y hermana menor. Es el principal ingreso del hogar." },
          { id: "aspiracion", type: "textarea", label: "Aspiración: ¿Qué quiere lograr?", placeholder: "Quiere ser técnico en refrigeración porque vio que pagan tres veces más" },
          { id: "frustracion", type: "textarea", label: "Frustración: ¿Qué lo frustra relacionado con tu problema?", placeholder: "Sabe que tiene potencial pero no puede estudiar porque no puede dejar de trabajar" }
        ]
      },
      {
        id: "1_5",
        titulo: "La Escala del Problema",
        instruccion: "Ahora escala el problema. ¿Cuántas personas viven lo mismo que tu protagonista?",
        campos: [
          { id: "cantidad", type: "input", label: "¿Cuántas personas o empresas enfrentan este problema?", placeholder: "47,000 / 2.3 millones" },
          { id: "frecuencia", type: "input", label: "¿Con qué frecuencia?", placeholder: "cada día / cada mes / cada año" },
          { id: "tangible", type: "textarea", label: "Haz el número tangible. Tradúcelo a algo que se pueda visualizar.", placeholder: "En el tiempo de esta presentación, se generaron 50,000 horas de audio sin transcribir en Latinoamérica" }
        ]
      }
    ]
  },
  // SECTION 2: LA SOLUCIÓN (Chapter 5 - The Solution)
  {
    seccionNumero: 2,
    ejercicios: [
      {
        id: "2_1",
        titulo: "Constructor de Historia de Cliente",
        instruccion: "Construye la historia de transformación de un cliente real. Los inversionistas recuerdan historias, no estadísticas.",
        campos: [],
        componentType: "customer-story",
        nota: "Esta historia debe tener entre 80-120 palabras para el Pitch Kit."
      },
      {
        id: "2_2",
        titulo: "Los 3 pasos de Obi-Wan",
        instruccion: "Como Obi-Wan entrenando a Luke, tu solución debe mostrarse en progresión.",
        campos: [
          { id: "reveal", type: "textarea", label: "EL REVEAL: ¿Cuál es el 'wow' inmediato que genera tu producto?", placeholder: "En 47 segundos tiene las 40 rutas optimizadas" },
          { id: "transformacion", type: "textarea", label: "LA TRANSFORMACIÓN: ¿Qué experimenta el usuario paso a paso?", placeholder: "Primero elige su carrera, luego estudia módulos de 45 min, después hace prácticas reales..." },
          { id: "vision", type: "textarea", label: "LA VISIÓN: ¿Cómo se ve el futuro del usuario en 6-12-24 meses?", placeholder: "En 12 semanas tiene certificación, en 6 meses ya tiene experiencia, en 1 año está capacitando a otros" }
        ]
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
        instruccion: "Tu superpoder es lo que te hace diferente de verdad. Esta suite de 4 módulos te ayudará a encontrarlo y articularlo.",
        campos: [],
        componentType: "superpower-detector",
        nota: "Un superpoder real es algo que un competidor NO podría decir."
      },
      {
        id: "3_2",
        titulo: "Identifica tu etapa de superpoder",
        instruccion: "¿En qué etapa está tu startup? Tu diferenciación se comunica distinto según la etapa.",
        campos: [
          { 
            id: "etapa", 
            type: "radio", 
            label: "Selecciona tu etapa actual",
            options: [
              { value: "idea", label: "Idea/MVP: Mi superpoder es un INSIGHT que nadie más ve" },
              { value: "traccion", label: "Tracción temprana: Mi superpoder es EVIDENCIA de que funciona" },
              { value: "crecimiento", label: "Crecimiento: Mi superpoder es una VENTAJA que se acumula con el tiempo" },
              { value: "escalamiento", label: "Escalamiento: Mi superpoder es un ECOSISTEMA difícil de replicar" }
            ]
          },
          { id: "validacion_etapa", type: "textarea", label: "Según tu etapa, ¿qué valida tu superpoder?", placeholder: "Si Idea: ¿Qué estudios validan tu insight? Si Tracción: ¿Qué resultados demuestran que funciona?" }
        ]
      }
    ]
  },
  // SECTION 4: LA TRACCIÓN
  {
    seccionNumero: 4,
    ejercicios: [
      {
        id: "4_1",
        titulo: "Elige tu métrica protagonista",
        instruccion: "¿Cuál es LA métrica que mejor demuestra tu progreso? Usuarios, clientes, revenue, transacciones... elige una.",
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
          { id: "numero_6_meses", type: "input", label: "¿Cuánto era hace 6 meses?", placeholder: "890" },
          { id: "crecimiento", type: "input", label: "¿Cuál es el % de crecimiento?", placeholder: "163%" }
        ]
      },
      {
        id: "4_2",
        titulo: "Construye tu timeline de tracción",
        instruccion: "Muestra cómo has evolucionado. Los inversionistas quieren ver tendencia, no solo un número.",
        campos: [
          { id: "hito_1_fecha", type: "input", label: "Hito 1 - Fecha (mes/año)", placeholder: "Marzo 2024" },
          { id: "hito_1_metrica", type: "input", label: "Hito 1 - Métrica", placeholder: "120 estudiantes" },
          { id: "hito_1_contexto", type: "textarea", label: "Hito 1 - ¿Qué pasó? ¿Por qué importa?", placeholder: "Lanzamos en Medellín" },
          { id: "hito_2_fecha", type: "input", label: "Hito 2 - Fecha", placeholder: "Agosto 2024" },
          { id: "hito_2_metrica", type: "input", label: "Hito 2 - Métrica", placeholder: "890 estudiantes" },
          { id: "hito_2_contexto", type: "textarea", label: "Hito 2 - ¿Qué pasó?", placeholder: "Expandimos a Bogotá" },
          { id: "hito_3_fecha", type: "input", label: "Hito 3 - Fecha", placeholder: "Diciembre 2024" },
          { id: "hito_3_metrica", type: "input", label: "Hito 3 - Métrica", placeholder: "2,340 graduados" },
          { id: "hito_3_contexto", type: "textarea", label: "Hito 3 - ¿Qué pasó?", placeholder: "4 ciudades operando" }
        ]
      },
      {
        id: "4_3",
        titulo: "El momentum actual",
        instruccion: "Los inversionistas quieren saber que el crecimiento continúa. ¿Qué pasó esta semana o este mes?",
        campos: [
          { id: "logro_reciente", type: "textarea", label: "¿Qué logro reciente puedes mencionar?", placeholder: "Esta semana cerramos con Walmart / Este mes sumamos 92 empresas nuevas" },
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
        titulo: "Traduce tu mercado a unidades humanas",
        instruccion: "El cerebro no procesa '$50 billones'. Necesita unidades tangibles. ¿Cuál es tu 'ticket de cine'?",
        campos: [
          { id: "unidad", type: "input", label: "¿Qué unidad representa tu mercado?", placeholder: "técnicos / tiendas / envíos / transacciones" },
          { id: "cantidad_inicial", type: "input", label: "¿Cuántas hay en tu mercado inicial?", placeholder: "340,000 en Colombia" },
          { id: "cantidad_expandido", type: "input", label: "¿Cuántas hay en tu mercado expandido?", placeholder: "2.3 millones en Latinoamérica" },
          { id: "valor_promedio", type: "input", label: "¿Cuál es el valor promedio por unidad?", placeholder: "$400 por curso" }
        ]
      },
      {
        id: "5_2",
        titulo: "El Censo de Westeros",
        instruccion: "Como Tywin Lannister, necesitas conocer a todos los jugadores en tu mapa.",
        campos: [
          { id: "lannister_nombre", type: "input", label: "Los Lannister (Incumbentes): ¿Quiénes son los gigantes establecidos?", placeholder: "Bancos tradicionales, SENA" },
          { id: "lannister_debilidad", type: "textarea", label: "¿Cuál es su debilidad?", placeholder: "Son lentos, burocráticos, no innovan" },
          { id: "stark_nombre", type: "input", label: "Los Stark (Insurgentes directos): ¿Quién ataca el mismo problema que tú?", placeholder: "Startups locales, competidores directos" },
          { id: "stark_diferencia", type: "textarea", label: "¿Qué hacen bien? ¿Dónde estás mejor posicionado?", placeholder: "Tienen buena marca pero no tienen nuestra red de empresas" },
          { id: "targaryen_nombre", type: "input", label: "Los Targaryen (Disruptores internacionales): ¿Qué jugador global podría entrar?", placeholder: "Coursera, Uber, etc." },
          { id: "targaryen_ventaja", type: "textarea", label: "¿Por qué el contexto local te da ventaja?", placeholder: "No entienden las regulaciones locales, no tienen las alianzas" }
        ]
      },
      {
        id: "5_3",
        titulo: "Tu expansión en círculos",
        instruccion: "Estructura tu mercado como círculos concéntricos. Desde donde ya ganaste hacia donde planeas conquistar.",
        campos: [
          { id: "circulo_1", type: "textarea", label: "Círculo 1 - Donde ya operas:", placeholder: "Colombia: 340,000 vacantes técnicas" },
          { id: "circulo_2", type: "textarea", label: "Círculo 2 - Próxima expansión:", placeholder: "México + Perú: 800,000 vacantes" },
          { id: "circulo_3", type: "textarea", label: "Círculo 3 - Visión regional:", placeholder: "Latinoamérica: 2.3 millones de vacantes" }
        ]
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
        titulo: "Unit Economics",
        instruccion: "¿Cuánto cuesta conseguir un cliente y cuánto genera?",
        campos: [
          { id: "cac", type: "input", label: "CAC: ¿Cuánto cuesta adquirir un cliente?", placeholder: "$42,000 pesos / $380 USD" },
          { id: "ltv", type: "input", label: "LTV: ¿Cuánto genera ese cliente en total?", placeholder: "$2.1 millones / $4,186 USD" },
          { id: "ratio", type: "input", label: "Ratio LTV/CAC:", placeholder: "50:1 / 11:1" },
          { id: "ratio_contexto", type: "textarea", label: "¿Por qué este ratio es bueno para tu industria?", placeholder: "El estándar en edtech es 3:1, nosotros tenemos 50:1" }
        ]
      },
      {
        id: "6_3",
        titulo: "La escalabilidad",
        instruccion: "El mejor negocio tiene partes que escalan sin agregar costos lineales.",
        campos: [
          { id: "escala_sin_costo", type: "textarea", label: "¿Qué parte de tu negocio crece sin agregar costos proporcionales?", placeholder: "El contenido se crea una vez y se usa infinitas veces" },
          { id: "apalancamiento", type: "textarea", label: "¿Dónde está tu apalancamiento operativo?", placeholder: "Cada vendedor genera $45K mensuales en nuevo revenue" }
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
        titulo: "Define tu número",
        instruccion: "Párate frente al espejo y di tu número en voz alta hasta que salga sin temblarte la voz.",
        campos: [
          { id: "monto", type: "input", label: "¿Cuánto dinero estás levantando?", placeholder: "$1.2 millones USD" },
          { id: "por_que_monto", type: "textarea", label: "¿Por qué ese número específico y no otro?", placeholder: "Es lo que necesitamos para llegar a break-even en 18 meses" }
        ]
      },
      {
        id: "7_2",
        titulo: "El destino del capital",
        instruccion: "Máximo 3 categorías. Deben sumar 100%.",
        campos: [
          { id: "cat_1_nombre", type: "input", label: "Categoría 1 - Nombre", placeholder: "Expansión geográfica" },
          { id: "cat_1_porcentaje", type: "input", label: "Categoría 1 - Porcentaje", placeholder: "50%" },
          { id: "cat_1_detalle", type: "textarea", label: "Categoría 1 - ¿Qué específicamente?", placeholder: "Abrir en Ciudad de México y Lima" },
          { id: "cat_2_nombre", type: "input", label: "Categoría 2 - Nombre", placeholder: "Tecnología" },
          { id: "cat_2_porcentaje", type: "input", label: "Categoría 2 - Porcentaje", placeholder: "30%" },
          { id: "cat_2_detalle", type: "textarea", label: "Categoría 2 - ¿Qué específicamente?", placeholder: "Automatizar creación de currículos" },
          { id: "cat_3_nombre", type: "input", label: "Categoría 3 - Nombre", placeholder: "Equipo" },
          { id: "cat_3_porcentaje", type: "input", label: "Categoría 3 - Porcentaje", placeholder: "20%" },
          { id: "cat_3_detalle", type: "textarea", label: "Categoría 3 - ¿Qué específicamente?", placeholder: "Director de operaciones en México y Perú" }
        ]
      },
      {
        id: "7_3",
        titulo: "Los resultados esperados",
        instruccion: "En 18 meses, ¿qué métricas habrás alcanzado?",
        campos: [
          { id: "metrica_1", type: "input", label: "Métrica 1:", placeholder: "15,000 graduados" },
          { id: "metrica_2", type: "input", label: "Métrica 2:", placeholder: "$4M USD en ingresos anuales" },
          { id: "metrica_3", type: "input", label: "Métrica 3:", placeholder: "Break even operativo" },
          { id: "posicionamiento", type: "textarea", label: "¿Cómo te posiciona esto para el siguiente paso?", placeholder: "Listos para Serie A" }
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
        campos: [
          { id: "fundador_1_nombre", type: "input", label: "Fundador 1 - Nombre", placeholder: "Valentina" },
          { id: "fundador_1_rol", type: "input", label: "Fundador 1 - Rol", placeholder: "CEO" },
          { id: "fundador_1_experiencia", type: "textarea", label: "Fundador 1 - ¿Qué experiencia lo califica?", placeholder: "4 años como directora de operaciones en Platzi" },
          { id: "fundador_1_superpoder", type: "textarea", label: "Fundador 1 - ¿Cuál es su superpoder único?", placeholder: "Sabe escalar programas educativos" },
          { id: "fundador_2_nombre", type: "input", label: "Fundador 2 - Nombre", placeholder: "Andrés" },
          { id: "fundador_2_rol", type: "input", label: "Fundador 2 - Rol", placeholder: "COO" },
          { id: "fundador_2_experiencia", type: "textarea", label: "Fundador 2 - ¿Qué experiencia lo califica?", placeholder: "8 años en Siemens coordinando capacitación técnica" },
          { id: "fundador_2_superpoder", type: "textarea", label: "Fundador 2 - ¿Cuál es su superpoder único?", placeholder: "Conoce la industria técnica por dentro" },
          { id: "fundador_3_nombre", type: "input", label: "Fundador 3 - Nombre (opcional)", placeholder: "Camila" },
          { id: "fundador_3_rol", type: "input", label: "Fundador 3 - Rol", placeholder: "CTO" },
          { id: "fundador_3_experiencia", type: "textarea", label: "Fundador 3 - ¿Qué experiencia lo califica?", placeholder: "Lideró matching en Rappi" },
          { id: "fundador_3_superpoder", type: "textarea", label: "Fundador 3 - ¿Cuál es su superpoder único?", placeholder: "Sabe construir algoritmos de matching" }
        ]
      },
      {
        id: "8_2",
        titulo: "La complementariedad",
        instruccion: "No 'somos amigos de la universidad'. ¿Qué habilidades distintas aporta cada uno?",
        campos: [
          { id: "complementariedad", type: "textarea", label: "¿Cómo se complementan las habilidades del equipo?", placeholder: "Uno sabe escalar, otro conoce la industria, otro construye la tecnología" },
          { id: "como_conocieron", type: "textarea", label: "¿Cómo se conocieron y cuánto tiempo llevan trabajando juntos?", placeholder: "Nos conocimos en un programa del BID en 2021. Llevamos 3 años juntos." },
          { id: "momentos_dificiles", type: "textarea", label: "¿Han pasado por momentos difíciles juntos? ¿Cómo los resolvieron?", placeholder: "Casi cerramos en 2022 pero pivoteamos y salimos adelante" }
        ]
      },
      {
        id: "8_3",
        titulo: "El talento que falta",
        instruccion: "Los mejores fundadores saben qué les falta y cómo lo van a conseguir.",
        campos: [
          { id: "rol_faltante", type: "input", label: "¿Qué rol clave falta en tu equipo?", placeholder: "VP de Ventas con red en México" },
          { id: "plan_reclutamiento", type: "textarea", label: "¿Cómo planeas reclutar a esa persona?", placeholder: "Ya tenemos un headhunter trabajando en esto" },
          { id: "candidatos", type: "textarea", label: "¿Tienes candidatos en el pipeline?", placeholder: "Tenemos 3 finalistas, esperamos cerrar el próximo mes" }
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
        titulo: "Reconexión emocional",
        instruccion: "¿Recuerdas a la persona del Bloque 1? ¿Qué le pasó? ¿Cómo cambió su vida?",
        campos: [
          { id: "protagonista_hoy", type: "textarea", label: "¿Cómo está tu protagonista hoy gracias a tu solución?", placeholder: "Carlos hoy gana tres veces más. Se cambió de barrio. Está pagando la universidad de su hermana." }
        ]
      },
      {
        id: "9_2",
        titulo: "La visión del mundo",
        instruccion: "¿Cómo se ve el mundo cuando ganes? Piensa más allá de tu startup.",
        campos: [
          { id: "escala_vision", type: "textarea", label: "¿Cuántas personas podrían vivir lo que vivió tu protagonista?", placeholder: "2.3 millones de vacantes en Latinoamérica esperando un Carlos que las llene" },
          { id: "mundo_diferente", type: "textarea", label: "¿Qué cambia en el mundo si tu startup tiene éxito?", placeholder: "Millones de jóvenes pueden acceder a empleos técnicos bien pagados sin endeudarse" }
        ]
      },
      {
        id: "9_3",
        titulo: "El llamado a la acción",
        instruccion: "Sé específico. Elimina fricción. Hazlo fácil.",
        campos: [
          { id: "siguiente_paso", type: "textarea", label: "¿Cuál es el siguiente paso concreto?", placeholder: "Una llamada de 30 minutos esta semana" },
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
