import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Newspaper, Check, AlertCircle } from 'lucide-react';

interface HeadlineExerciseProps {
  data: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
}

const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const MAX_WORDS = 8;

export function HeadlineExercise({ data, onChange }: HeadlineExerciseProps) {
  const value = data['titular'] || '';
  const wordCount = countWords(value);
  const isValid = wordCount > 0 && wordCount <= MAX_WORDS;
  const isOverLimit = wordCount > MAX_WORDS;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Newspaper className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-foreground">
              Imagina que mañana tu startup sale en la portada del diario más importante de tu país.
            </p>
            <p className="text-sm font-medium text-primary mt-2">
              ¿Cuál sería el titular?
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="titular" className="text-sm font-medium flex items-center gap-2">
            Tu titular de primera plana
            {isValid && <Check className="w-4 h-4 text-green-600" />}
          </Label>
          <span className={cn(
            "text-xs font-mono",
            wordCount === 0 ? "text-muted-foreground" :
            isOverLimit ? "text-red-600" : "text-green-600"
          )}>
            {wordCount}/{MAX_WORDS} palabras
            {isOverLimit && <AlertCircle className="w-3 h-3 inline ml-1" />}
          </span>
        </div>
        
        <Textarea
          id="titular"
          value={value}
          onChange={(e) => onChange('titular', e.target.value)}
          placeholder="Ej: Startup mexicana revoluciona educación técnica en Latinoamérica"
          className={cn(
            "min-h-[60px] resize-none text-lg font-medium",
            isOverLimit && "border-red-500 focus-visible:ring-red-500"
          )}
        />
      </div>

      {isValid && (
        <div className="relative">
          <div className="bg-background border-4 border-foreground p-6 shadow-lg">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              EL DIARIO NACIONAL
            </div>
            <div className="border-t-4 border-b-4 border-foreground py-4">
              <h1 className="text-2xl font-serif font-bold text-foreground leading-tight">
                {value}
              </h1>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Edición Especial</span>
              <span>Portada</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
