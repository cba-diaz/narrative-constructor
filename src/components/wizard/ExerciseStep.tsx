import { useState, useEffect, useCallback } from 'react';
import { Exercise, ExerciseField } from '@/data/exercises';
import { ExerciseData } from '@/hooks/usePitchStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ExerciseStepProps {
  exercise: Exercise;
  exerciseNumber: number;
  totalExercises: number;
  initialData: ExerciseData;
  onSave: (data: ExerciseData) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
}

// Map of field IDs to their previous field (for "Los 5 Por Qués")
const PORQUE_CHAIN: Record<string, { prevField: string; questionNumber: number }> = {
  'porque_1': { prevField: 'problema_inicial', questionNumber: 1 },
  'porque_2': { prevField: 'porque_1', questionNumber: 2 },
  'porque_3': { prevField: 'porque_2', questionNumber: 3 },
  'porque_4': { prevField: 'porque_3', questionNumber: 4 },
  'porque_5': { prevField: 'porque_4', questionNumber: 5 },
};

export function ExerciseStep({
  exercise,
  exerciseNumber,
  totalExercises,
  initialData,
  onSave,
  onNext,
  onBack,
  isFirst
}: ExerciseStepProps) {
  const [formData, setFormData] = useState<ExerciseData>(initialData);
  const [dynamicLabels, setDynamicLabels] = useState<Record<string, string>>({});
  const [loadingFields, setLoadingFields] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Check if this is the "5 Por Qués" exercise
  const isCincoPorQues = exercise.id === '1_1';

  // Update form when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Generate dynamic question when previous field changes
  const generateDynamicQuestion = useCallback(async (fieldId: string, previousAnswer: string) => {
    if (!isCincoPorQues || !PORQUE_CHAIN[fieldId] || !previousAnswer.trim()) {
      return;
    }

    setLoadingFields(prev => ({ ...prev, [fieldId]: true }));

    try {
      const { data, error } = await supabase.functions.invoke('generate-why-question', {
        body: {
          previousAnswer: previousAnswer.trim(),
          questionNumber: PORQUE_CHAIN[fieldId].questionNumber,
        },
      });

      if (error) {
        console.error('Error generating question:', error);
        return;
      }

      if (data?.question) {
        setDynamicLabels(prev => ({ ...prev, [fieldId]: data.question }));
      }
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error && error.message.includes('429')) {
        toast({
          title: "Límite de solicitudes alcanzado",
          description: "Por favor espera un momento antes de continuar.",
          variant: "destructive",
        });
      }
    } finally {
      setLoadingFields(prev => ({ ...prev, [fieldId]: false }));
    }
  }, [isCincoPorQues, toast]);

  // Trigger generation when previous field value changes
  useEffect(() => {
    if (!isCincoPorQues) return;

    // Check each "porque" field and generate if previous has content
    Object.entries(PORQUE_CHAIN).forEach(([fieldId, { prevField }]) => {
      const prevValue = formData[prevField];
      if (prevValue && prevValue.trim().length > 10 && !dynamicLabels[fieldId]) {
        generateDynamicQuestion(fieldId, prevValue);
      }
    });
  }, [formData, isCincoPorQues, dynamicLabels, generateDynamicQuestion]);

  const handleFieldChange = (fieldId: string, value: string) => {
    const newData = { ...formData, [fieldId]: value };
    setFormData(newData);
  };

  // Handle blur to trigger generation
  const handleFieldBlur = (fieldId: string) => {
    if (!isCincoPorQues) return;

    // Find which field depends on this one
    const dependentField = Object.entries(PORQUE_CHAIN).find(
      ([_, { prevField }]) => prevField === fieldId
    );

    if (dependentField) {
      const [depFieldId] = dependentField;
      const currentValue = formData[fieldId];
      if (currentValue && currentValue.trim().length > 5) {
        generateDynamicQuestion(depFieldId, currentValue);
      }
    }
  };

  const handleNext = () => {
    onSave(formData);
    onNext();
  };

  const handleBack = () => {
    onSave(formData);
    onBack();
  };

  const renderField = (field: ExerciseField) => {
    const value = formData[field.id] || '';
    const isLoading = loadingFields[field.id];
    
    // Get dynamic label if available
    const displayLabel = dynamicLabels[field.id] || field.label;
    const hasDynamicLabel = !!dynamicLabels[field.id];

    switch (field.type) {
      case 'input':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium flex items-center gap-2">
              {isLoading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
              {hasDynamicLabel && <Sparkles className="w-3 h-3 text-primary" />}
              <span className={hasDynamicLabel ? "text-primary" : ""}>{displayLabel}</span>
            </Label>
            <Input
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              onBlur={() => handleFieldBlur(field.id)}
              placeholder={field.placeholder}
              className="w-full"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium flex items-center gap-2">
              {isLoading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
              {hasDynamicLabel && <Sparkles className="w-3 h-3 text-primary" />}
              <span className={hasDynamicLabel ? "text-primary" : ""}>{displayLabel}</span>
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              onBlur={() => handleFieldBlur(field.id)}
              placeholder={field.placeholder}
              className="min-h-[100px] resize-none"
            />
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-3">
            <Label className="text-sm font-medium">{field.label}</Label>
            <RadioGroup
              value={value}
              onValueChange={(val) => handleFieldChange(field.id, val)}
              className="space-y-2"
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-start space-x-3">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} className="mt-1" />
                  <Label 
                    htmlFor={`${field.id}-${option.value}`} 
                    className="text-sm font-normal cursor-pointer leading-relaxed"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Exercise Header */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Ejercicio {exerciseNumber} de {totalExercises}
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">{exercise.titulo}</h2>
            <p className="text-sm text-muted-foreground">{exercise.instruccion}</p>
          </div>
        </div>
      </div>

      {/* AI Badge for dynamic exercises */}
      {isCincoPorQues && (
        <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 px-3 py-2 rounded-lg border border-primary/20">
          <Sparkles className="w-4 h-4" />
          <span>Las preguntas se generan automáticamente con IA basándose en tus respuestas</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        {exercise.campos.map(renderField)}
      </div>

      {/* Note if present */}
      {exercise.nota && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-primary font-medium">💡 {exercise.nota}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleBack}
          className={cn(isFirst && "invisible")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <Button onClick={handleNext} className="btn-primary-gradient">
          Siguiente
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
