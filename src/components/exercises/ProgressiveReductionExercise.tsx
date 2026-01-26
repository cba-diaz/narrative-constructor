import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, AlertCircle } from 'lucide-react';

interface ProgressiveReductionExerciseProps {
  data: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
}

const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const steps = [
  { id: 'sin_limite', label: 'Escribe qué hace tu startup sin límite', maxWords: null, placeholder: 'Describe tu startup libremente...' },
  { id: 'max_20', label: 'Ahora en máximo 20 palabras', maxWords: 20, placeholder: 'Reduce tu descripción a 20 palabras...' },
  { id: 'max_12', label: 'Reduce a 12 palabras', maxWords: 12, placeholder: 'Reduce a 12 palabras...' },
  { id: 'max_8', label: 'Tu versión final en 8 palabras', maxWords: 8, placeholder: 'Tu frase final en 8 palabras...' },
];

export function ProgressiveReductionExercise({ data, onChange }: ProgressiveReductionExerciseProps) {
  const getWordCount = (stepId: string) => countWords(data[stepId] || '');
  
  const isStepValid = (stepId: string, maxWords: number | null) => {
    const count = getWordCount(stepId);
    if (maxWords === null) return count > 0;
    return count > 0 && count <= maxWords;
  };

  const getWordCountColor = (stepId: string, maxWords: number | null) => {
    const count = getWordCount(stepId);
    if (maxWords === null) return 'text-muted-foreground';
    if (count === 0) return 'text-muted-foreground';
    if (count <= maxWords) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-sm text-primary font-medium">
          🎯 Este ejercicio te guía a condensar tu idea paso a paso. La frase final de 8 palabras será la apertura de tu pitch.
        </p>
      </div>

      {steps.map((step, index) => {
        const wordCount = getWordCount(step.id);
        const isValid = isStepValid(step.id, step.maxWords);
        const prevStepId = index > 0 ? steps[index - 1].id : null;
        const prevStepHasContent = prevStepId ? getWordCount(prevStepId) > 0 : true;
        const isDisabled = !prevStepHasContent;

        return (
          <div key={step.id} className={cn("space-y-2", isDisabled && "opacity-50")}>
            <div className="flex items-center justify-between">
              <Label htmlFor={step.id} className="text-sm font-medium flex items-center gap-2">
                <Badge variant={isValid ? "default" : "secondary"} className="text-xs">
                  {index + 1}
                </Badge>
                {step.label}
                {isValid && <Check className="w-4 h-4 text-green-600" />}
              </Label>
              <span className={cn("text-xs font-mono", getWordCountColor(step.id, step.maxWords))}>
                {wordCount}{step.maxWords ? `/${step.maxWords}` : ''} palabras
                {step.maxWords && wordCount > step.maxWords && (
                  <AlertCircle className="w-3 h-3 inline ml-1 text-red-600" />
                )}
              </span>
            </div>
            <Textarea
              id={step.id}
              value={data[step.id] || ''}
              onChange={(e) => onChange(step.id, e.target.value)}
              placeholder={step.placeholder}
              disabled={isDisabled}
              className={cn(
                "min-h-[80px] resize-none transition-colors",
                step.maxWords && wordCount > step.maxWords && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
        );
      })}

      {data['max_8'] && getWordCount('max_8') <= 8 && getWordCount('max_8') > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
            ✅ Tu High Concept:
          </p>
          <p className="text-lg font-bold text-green-900 dark:text-green-100">
            "{data['max_8']}"
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            Esta frase será la apertura de tu pitch
          </p>
        </div>
      )}
    </div>
  );
}
