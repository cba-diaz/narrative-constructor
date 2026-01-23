import { useState, useEffect } from 'react';
import { Exercise, ExerciseField } from '@/data/exercises';
import { ExerciseData } from '@/hooks/usePitchStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  // Update form when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleFieldChange = (fieldId: string, value: string) => {
    const newData = { ...formData, [fieldId]: value };
    setFormData(newData);
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

    switch (field.type) {
      case 'input':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </Label>
            <Input
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="w-full"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
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
