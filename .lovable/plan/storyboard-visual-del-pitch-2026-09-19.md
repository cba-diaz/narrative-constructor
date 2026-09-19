# Storyboard visual del pitch

## Objetivo
Agregar en “Tu Pitch Completo” una segunda lectura visual del pitch: nueve cuadros grandes, uno por Bloque, siguiendo la estética de storyboard de la metodología.

## Cambios
- Crear un componente de storyboard reutilizable dentro de la vista del pitch completo.
- Mostrar cada Bloque como una viñeta numerada con su nombre y una síntesis automática del texto existente, sin alterar ni volver a guardar el contenido del usuario.
- Mantener la línea gráfica del sitio: papel crema, tinta oscura, acento rojo, trazos imperfectos y etiquetas editoriales.
- Usar una composición amplia en escritorio y una sola columna legible en móvil.
- Permitir abrir el Bloque correspondiente desde cada viñeta para editarlo.
- Conservar debajo la versión completa en texto, junto con copiar y descargar.

## Detalles técnicos
- La síntesis será local y determinística: primeras frases/palabras hasta un límite visual, sin llamadas a IA ni cambios de base de datos.
- Se usarán los nueve contenidos ya fusionados que recibe `PitchView`, por lo que funciona tanto con borradores recuperados como con contenido guardado en Pitch Kit.
- Los colores y bordes usarán los tokens visuales existentes; no se incorporará la imagen subida como fondo.
- Se comprobarán visualmente escritorio y móvil, además de errores de compilación y ejecución.
