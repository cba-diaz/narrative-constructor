import { supabase } from '@/integrations/supabase/client';
import { ExerciseData } from '@/hooks/usePitchStore';
import { Block } from '@/data/blocks';

/**
 * Generates a polished block draft using AI, based on exercise data.
 * Includes retry with exponential backoff for transient errors.
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
  },
  maxRetries = 2
): Promise<string> {
  // Check if there's enough exercise data to generate a draft
  const hasData = Object.values(exercisesData).some(
    data => Object.values(data).some(v => v && v.trim().length > 0)
  );
  if (!hasData) return '';

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
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
        lastError = new Error(error.message || 'Error al generar borrador');
        // Don't retry on 402 (payment) or 401 (auth)
        if (error.message?.includes('402') || error.message?.includes('401')) {
          throw lastError;
        }
        // Retry on other errors
        if (attempt < maxRetries) {
          await sleep(1000 * Math.pow(2, attempt));
          continue;
        }
        throw lastError;
      }

      return data?.draft || '';
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Unknown error');
      if (attempt < maxRetries) {
        await sleep(1000 * Math.pow(2, attempt));
        continue;
      }
    }
  }

  throw lastError || new Error('Error al generar borrador');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
