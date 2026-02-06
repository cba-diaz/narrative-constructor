import { supabase } from '@/integrations/supabase/client';
import { ExerciseData } from '@/hooks/usePitchStore';
import { Block } from '@/data/blocks';

/**
 * Generates a polished block draft using AI, based on exercise data.
 * The AI respects word limits, restrictions, and prohibitions.
 */
export async function generateBlockDraft(
  sectionNumber: number,
  exercisesData: Record<string, ExerciseData>,
  block: Block,
  protagonistData?: {
    nombre: string;
    edad: string;
    profesion: string;
    ciudad: string;
    contexto?: string;
    aspiracion?: string;
    frustracion?: string;
  }
): Promise<string> {
  // Check if there's enough exercise data to generate a draft
  const hasData = Object.values(exercisesData).some(
    data => Object.values(data).some(v => v && v.trim().length > 0)
  );
  if (!hasData) return '';

  const { data, error } = await supabase.functions.invoke('generate-block-draft', {
    body: {
      sectionNumber,
      exercisesData,
      protagonistData,
      block: {
        nombre: block.nombre,
        palabrasMin: block.palabrasMin,
        palabrasMax: block.palabrasMax,
        estructura: block.estructura,
        restricciones: block.restricciones,
        prohibido: block.prohibido,
        ejemplo: block.ejemplo,
      },
    },
  });

  if (error) {
    console.error('Error generating draft:', error);
    throw new Error(error.message || 'Error al generar borrador');
  }

  return data?.draft || '';
}
