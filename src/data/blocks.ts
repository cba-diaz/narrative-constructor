export interface BlockStructure {
  titulo: string;
  descripcion: string;
}

export interface Block {
  numero: number;
  nombre: string;
  pregunta: string;
  palabrasMin: number;
  palabrasMax: number;
  placeholder: string;
  estructura: BlockStructure[];
  restricciones: string[];
  prohibido: string[];
  ejemplo: string;
}

export const blocks: Block[] = [
  {
    numero: 1,
    nombre: "EL PROBLEMA",
    pregunta: "¿Qué está mal en el mundo?",
    palabrasMin: 80,
    palabrasMax: 120,
    placeholder: "Carlos tiene 24 años y vive en...",
    estructura: [
      {
        titulo: "1. Personaje (15-20 palabras)",
        descripcion: "Presenta a alguien específico. Nombre. Rol. Contexto. No 'empresas que necesitan X', sino una persona con cara."
      },
      {
        titulo: "2. Momento (30 palabras)",
        descripcion: "Describe el instante exacto donde el problema golpea. Hora del día. Día de la semana. Qué sucede."
      },
      {
        titulo: "3. Consecuencia (25 palabras)",
        descripcion: "Qué pierde tu personaje. Tiempo, dinero, oportunidad, dignidad. Qué opciones malas tiene que elegir."
      },
      {
        titulo: "4. Escala (30 palabras)",
        descripcion: "Cuántas personas viven esto. Cada día, mes, año. Traduce el número a algo tangible."
      }
    ],
    restricciones: [
      "Debe incluir un nombre propio",
      "Debe incluir una hora o fecha específica",
      "Debe generar incomodidad en quien escucha"
    ],
    prohibido: [
      "Estadísticas sin rostro ('El 73% de las empresas...')",
      "Términos abstractos ('ineficiencias del mercado')",
      "Problemas genéricos ('falta de digitalización')"
    ],
    ejemplo: "Carlos tiene 24 años y vive en Medellín. Trabaja como mesero ganando el mínimo. Quiere ser técnico en refrigeración industrial porque vio que pagan tres veces más. El problema es que el curso presencial cuesta 8 millones de pesos y dura 18 meses. Carlos no puede dejar de trabajar. No tiene ahorros. Y las empresas que buscan técnicos no pueden esperar año y medio.\n\nEn Colombia hay 47,000 vacantes técnicas sin llenar. Las empresas pierden contratos por falta de personal. Los jóvenes como Carlos pierden oportunidades por falta de acceso."
  },
  {
    numero: 2,
    nombre: "LA SOLUCIÓN",
    pregunta: "¿Cómo lo arreglas?",
    palabrasMin: 80,
    palabrasMax: 120,
    placeholder: "TécnicoYa capacita técnicos en...",
    estructura: [
      {
        titulo: "1. El antes (20 palabras)",
        descripcion: "Recuerda brevemente cómo era el mundo de tu personaje sin tu producto."
      },
      {
        titulo: "2. El momento mágico (25 palabras)",
        descripcion: "Qué hace tu producto en una oración. Sin tecnicismos. Sin siglas. Solo el resultado visible."
      },
      {
        titulo: "3. El después (35 palabras)",
        descripcion: "Cómo cambió la vida de tu personaje. Qué puede hacer ahora que antes no podía."
      },
      {
        titulo: "4. La promesa (30 palabras)",
        descripcion: "Qué pueden esperar todos los usuarios. Generaliza la transformación sin perder especificidad."
      }
    ],
    restricciones: [
      "El personaje del Bloque 1 debe reaparecer",
      "La transformación debe ser visible y medible",
      "Debe generar la sensación de '¿cómo lo hacen?'"
    ],
    prohibido: [
      "Explicar la tecnología ('usamos machine learning para...')",
      "Listar funcionalidades ('tenemos dashboard, reportes, alertas...')",
      "Prometer sin mostrar ('vamos a revolucionar...')"
    ],
    ejemplo: "TécnicoYa capacita técnicos en 12 semanas con clases nocturnas y prácticas los fines de semana.\n\nCarlos entra a nuestra plataforma, elige refrigeración industrial, y empieza a estudiar después del trabajo. Los módulos son de 45 minutos. Las prácticas las hace en empresas aliadas que necesitan técnicos. Al terminar, tiene certificación y tres ofertas de empleo.\n\nEl resultado. Carlos pasó de ganar el mínimo a ganar 3.2 millones mensuales. La empresa que lo contrató llenó una vacante que llevaba 6 meses abierta."
  },
  {
    numero: 3,
    nombre: "EL SUPERPODER",
    pregunta: "¿Por qué tú y no otro?",
    palabrasMin: 70,
    palabrasMax: 110,
    placeholder: "Coursera y Platzi enseñan...",
    estructura: [
      {
        titulo: "1. Reconocimiento (15 palabras)",
        descripcion: "Menciona al competidor más fuerte o la alternativa más obvia. Reconócelo con respeto."
      },
      {
        titulo: "2. Contraste (25 palabras)",
        descripcion: "Qué haces diferente. No mejor. Diferente. La diferencia debe ser específica y verificable."
      },
      {
        titulo: "3. Prueba (30 palabras)",
        descripcion: "Un dato, métrica o resultado que valide tu diferencia. Algo que no puedan decir los demás."
      }
    ],
    restricciones: [
      "Debe mencionar explícitamente a un competidor o alternativa",
      "La diferencia debe ser verificable, no opinable"
    ],
    prohibido: [
      "'Somos mejores porque...'",
      "'Usamos IA / blockchain / tecnología de punta...'",
      "'Somos más baratos / rápidos / fáciles...'",
      "Cualquier frase que un competidor también podría decir"
    ],
    ejemplo: "Coursera y Platzi enseñan habilidades digitales. Pero nadie capacita técnicos industriales en formato flexible.\n\nNosotros sí podemos porque construimos la red de talleres de práctica más grande de Colombia. 340 empresas nos prestan sus instalaciones a cambio de acceso prioritario a nuestros egresados. Ellos consiguen talento. Nosotros conseguimos infraestructura sin invertir capital.\n\nEsto nos permite operar con un costo por alumno 73% menor que los institutos tradicionales. Y entregar técnicos listos para trabajar en una fracción del tiempo."
  },
  {
    numero: 4,
    nombre: "LA TRACCIÓN",
    pregunta: "¿Funciona en el mundo real?",
    palabrasMin: 70,
    palabrasMax: 110,
    placeholder: "En 18 meses graduamos...",
    estructura: [
      {
        titulo: "1. La métrica protagonista (20 palabras)",
        descripcion: "El número que mejor representa tu tracción. Usuarios, clientes, revenue, transacciones. Elige uno."
      },
      {
        titulo: "2. La tendencia (20 palabras)",
        descripcion: "Cómo ha crecido ese número. Incluye período específico y porcentaje."
      },
      {
        titulo: "3. El contexto (25 palabras)",
        descripcion: "Por qué ese número importa en tu industria. Qué significa en comparación con benchmarks."
      },
      {
        titulo: "4. El momentum (25 palabras)",
        descripcion: "Qué está pasando ahora mismo. Esta semana, este mes. Algo que demuestre que el crecimiento continúa."
      }
    ],
    restricciones: [
      "Solo datos de lo que ya pasó, no proyecciones",
      "Fechas específicas, no 'recientemente'",
      "Números exactos, no 'varios' o 'muchos'"
    ],
    prohibido: [
      "'Esperamos llegar a...'",
      "'Proyectamos...'",
      "'Tenemos potencial de...'",
      "Números sin contexto temporal"
    ],
    ejemplo: "En 18 meses graduamos 2,340 técnicos. El 89% consiguió empleo en menos de 30 días.\n\nEmpezamos en Medellín. Hoy operamos en Bogotá, Cali y Barranquilla. Nuestra tasa de empleabilidad subió de 71% a 89% en el último año porque ajustamos el currículo con datos reales de las empresas aliadas.\n\nEste trimestre facturamos 380 millones de pesos. Crecemos 23% mes a mes. Y tenemos lista de espera de 4,200 estudiantes que quieren entrar."
  },
  {
    numero: 5,
    nombre: "EL MERCADO",
    pregunta: "¿Qué tan grande es la oportunidad?",
    palabrasMin: 80,
    palabrasMax: 120,
    placeholder: "En Latinoamérica hay...",
    estructura: [
      {
        titulo: "1. El mercado en unidades humanas (25 palabras)",
        descripcion: "No solo dólares. Cuántas empresas, personas, transacciones. Algo que se pueda visualizar."
      },
      {
        titulo: "2. Tu porción realista (25 palabras)",
        descripcion: "Qué parte de ese mercado puedes capturar en 3-5 años. Sé ambicioso pero creíble."
      },
      {
        titulo: "3. El campo de batalla (25 palabras)",
        descripcion: "Quiénes son los jugadores principales y cómo te diferencias."
      },
      {
        titulo: "4. Tu siguiente paso (25 palabras)",
        descripcion: "Qué mercado adyacente atacarás después. Cómo tu posición actual te da ventaja."
      }
    ],
    restricciones: [
      "El mercado debe expresarse en unidades humanas, no solo dólares",
      "Debe mencionar al menos un competidor por nombre",
      "Debe mostrar progresión lógica de expansión"
    ],
    prohibido: [
      "'El mercado es de $X billones' sin contexto",
      "Ignorar a los competidores",
      "'No tenemos competencia'",
      "TAM/SAM/SOM sin traducción a unidades comprensibles"
    ],
    ejemplo: "En Latinoamérica hay 2.3 millones de vacantes técnicas sin llenar. Solo en Colombia son 340,000.\n\nCada vacante representa un curso que alguien pagaría por tomar. A un precio promedio de 400 dólares por programa, el mercado direccionable en Colombia es de 136 millones de dólares anuales.\n\nNuestro competidor más cercano es el SENA, que es gratuito pero tiene cupos limitados y tiempos largos. Los institutos privados cobran más y no garantizan empleo.\n\nNosotros estamos en el medio. Más rápido que el SENA, más barato que los privados, con empleo garantizado."
  },
  {
    numero: 6,
    nombre: "EL MODELO",
    pregunta: "¿Cómo ganas dinero?",
    palabrasMin: 80,
    palabrasMax: 120,
    placeholder: "Tenemos dos fuentes de ingreso...",
    estructura: [
      {
        titulo: "1. El mecanismo (25 palabras)",
        descripcion: "Quién paga, cuánto paga, con qué frecuencia. La mecánica básica de tu revenue."
      },
      {
        titulo: "2. La unidad económica (30 palabras)",
        descripcion: "Cuánto cuesta adquirir un cliente vs. cuánto genera. LTV/CAC o equivalente."
      },
      {
        titulo: "3. La escalabilidad (30 palabras)",
        descripcion: "Qué parte del negocio crece sin agregar costos proporcionales. Dónde está el apalancamiento."
      }
    ],
    restricciones: [
      "Debe incluir al menos un número de precio o revenue",
      "Debe mostrar que entiendes tu economía unitaria"
    ],
    prohibido: [
      "'Cobramos por uso' sin especificar cuánto",
      "'Freemium' sin explicar conversión",
      "Modelos confusos con múltiples fuentes de ingreso sin jerarquía"
    ],
    ejemplo: "Tenemos dos fuentes de ingreso.\n\nLos estudiantes pagan el curso en cuotas. El precio promedio es 1.6 millones de pesos. El 40% usa financiamiento que ofrecemos con una fintech aliada.\n\nLas empresas pagan una tarifa de colocación cuando contratan a nuestros egresados. Son 800,000 pesos por técnico contratado.\n\nEl 60% de nuestros ingresos viene de estudiantes. El 40% viene de empresas. El costo de adquisición de un estudiante es 42,000 pesos. El valor de vida es 2.1 millones. La relación es de 50 a 1."
  },
  {
    numero: 7,
    nombre: "LA PETICIÓN",
    pregunta: "¿Cuánto necesitas?",
    palabrasMin: 60,
    palabrasMax: 100,
    placeholder: "Buscamos 1.2 millones de dólares...",
    estructura: [
      {
        titulo: "1. El número (10 palabras)",
        descripcion: "Cuánto estás levantando. Sin rangos. Un número. Dilo con convicción."
      },
      {
        titulo: "2. El destino (30 palabras)",
        descripcion: "En qué lo vas a usar. Máximo 3 categorías. Sé específico."
      },
      {
        titulo: "3. El resultado (30 palabras)",
        descripcion: "Qué métricas vas a alcanzar con ese dinero. Qué va a ser diferente en 18 meses."
      }
    ],
    restricciones: [
      "Un solo número de levantamiento, no rango",
      "El destino debe sumar 100% del monto",
      "Los resultados deben ser medibles"
    ],
    prohibido: [
      "Rangos de inversión ('entre 500K y 1M')",
      "Destinos vagos ('para crecer')",
      "Resultados no medibles"
    ],
    ejemplo: "Buscamos 1.2 millones de dólares.\n\nEl 50% va a expansión geográfica. Queremos abrir en Ciudad de México y Lima en los próximos 12 meses.\n\nEl 30% va a tecnología. Vamos a automatizar la creación de currículos con datos de demanda laboral en tiempo real.\n\nEl 20% va a equipo. Necesitamos un director de operaciones en México y otro en Perú.\n\nCon esto, proyectamos alcanzar 15,000 graduados y 4 millones de dólares en ingresos anuales."
  },
  {
    numero: 8,
    nombre: "EL EQUIPO",
    pregunta: "¿Por qué ustedes pueden ejecutar?",
    palabrasMin: 80,
    palabrasMax: 120,
    placeholder: "Somos tres fundadores...",
    estructura: [
      {
        titulo: "1. El equipo fundador (30 palabras)",
        descripcion: "Quiénes son y qué han hecho antes que los califica para este problema. Solo lo relevante."
      },
      {
        titulo: "2. La complementariedad (30 palabras)",
        descripcion: "Por qué funcionan juntos. Qué habilidades distintas aporta cada uno."
      },
      {
        titulo: "3. El próximo talento (30 palabras)",
        descripcion: "Quién falta en el equipo y cómo lo van a reclutar."
      }
    ],
    restricciones: [
      "Solo incluir experiencia relevante al problema que resuelven",
      "Debe mostrar complementariedad real, no solo títulos"
    ],
    prohibido: [
      "Listar títulos universitarios como credencial principal",
      "'Somos amigos de toda la vida'",
      "CVs completos de cada fundador"
    ],
    ejemplo: "Somos tres fundadores.\n\nYo soy Valentina. Fui directora de operaciones en Platzi Colombia durante cuatro años. Ahí aprendí a escalar programas educativos.\n\nMi socio Andrés es ingeniero industrial. Trabajó 8 años en Siemens coordinando programas de capacitación técnica para plantas de manufactura.\n\nCamila es nuestra CTO. Viene de Rappi, donde lideró el equipo de matching entre repartidores y pedidos.\n\nNos conocimos en un programa de innovación del BID en 2021. Llevamos tres años construyendo esto juntos. Nadie se ha ido."
  },
  {
    numero: 9,
    nombre: "EL CIERRE",
    pregunta: "¿Qué quieres que hagan ahora?",
    palabrasMin: 60,
    palabrasMax: 100,
    placeholder: "Carlos hoy gana tres veces más...",
    estructura: [
      {
        titulo: "1. Reconexión emocional (15 palabras)",
        descripcion: "Vuelve a tu personaje del Bloque 1. ¿Cómo cambió su vida?"
      },
      {
        titulo: "2. La visión (20 palabras)",
        descripcion: "Cómo se ve el mundo cuando ganes. No tu empresa. El mundo."
      },
      {
        titulo: "3. El llamado (20 palabras)",
        descripcion: "Qué quieres que hagan ahora mismo. Sé específico sobre el siguiente paso."
      },
      {
        titulo: "4. La facilidad (15 palabras)",
        descripcion: "Cómo pueden dar ese paso. Hazlo fácil. Elimina fricción."
      }
    ],
    restricciones: [
      "Debe mencionar al personaje del Bloque 1",
      "Debe terminar con una acción clara"
    ],
    prohibido: [
      "Terminar con 'gracias'",
      "Terminar con '¿preguntas?'",
      "Terminar pidiendo disculpas o minimizando"
    ],
    ejemplo: "Carlos hoy gana tres veces más que hace un año. Pudo cambiarse de barrio. Está pagando la universidad de su hermana menor.\n\nHay 2.3 millones de vacantes técnicas en Latinoamérica esperando un Carlos que las llene.\n\nNosotros ya probamos que el modelo funciona en Colombia. Ahora queremos llevarlo al resto de la región.\n\nSi esto les hace sentido, el siguiente paso es una llamada de 30 minutos esta semana."
  }
];
