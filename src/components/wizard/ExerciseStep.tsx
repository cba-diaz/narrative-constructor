import { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise, ExerciseField } from '@/data/exercises';
import { ExerciseData } from '@/hooks/usePitchStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lightbulb, Cloud, CloudOff, Loader2, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ProgressiveReductionExercise,
  HeadlineExercise,
  InvestorProfiler,
  ThreeActsExercise,
  ProblemDiggerExercise,
  CustomerStoryBuilder,
  SuperpowerDetector,
} from '@/components/exercises';

interface ExerciseStepProps {
  exercise: Exercise;
  exerciseNumber: number;
  totalExercises: number;
  initialData: ExerciseData;
  onSave: (data: ExerciseData) => void;
  onNext: () => void;
  onBack: () => void;
  onSkipToFinal: () => void;
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
  onSkipToFinal,
  isFirst
}: ExerciseStepProps) {
  const [formData, setFormData] = useState<ExerciseData>(initialData);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasChangesRef = useRef(false);

  // Update form only when switching exercises, not on every initialData change
  useEffect(() => {
    setFormData(initialData);
    formDataRef.current = initialData;
    hasChangesRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  // Store the latest formData in a ref to avoid stale closure issues
  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Store onSave in a ref to avoid dependency issues
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Auto-save function using refs to avoid stale closures
  const performSave = useCallback(() => {
    if (hasChangesRef.current) {
      setSaveStatus('saving');
      onSaveRef.current(formDataRef.current);
      hasChangesRef.current = false;
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }, []);

  // Set up auto-save interval (every 30 seconds)
  useEffect(() => {
    autoSaveIntervalRef.current = setInterval(() => {
      performSave();
    }, 30000);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [performSave]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (hasChangesRef.current) {
        onSaveRef.current(formDataRef.current);
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleFieldChange = useCallback((fieldId: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [fieldId]: value };
      formDataRef.current = updated;
      return updated;
    });
    hasChangesRef.current = true;
    setSaveStatus('idle');
    
    // Debounced save after 3 seconds of no typing
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      performSave();
    }, 3000);
  }, [performSave]);

  const handleNext = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    onSave(formData);
    hasChangesRef.current = false;
    onNext();
  };

  const handleBack = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    onSave(formData);
    hasChangesRef.current = false;
    onBack();
  };

  const handleSkipToFinal = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    onSave(formData);
    hasChangesRef.current = false;
    onSkipToFinal();
  };

  // Render specialized component if componentType is set
  const renderSpecializedComponent = () => {
    switch (exercise.componentType) {
      case 'progressive-reduction':
        return (
          <ProgressiveReductionExercise
            data={formData}
            onChange={handleFieldChange}
          />
        );
      case 'headline':
        return (
          <HeadlineExercise
            data={formData}
            onChange={handleFieldChange}
          />
        );
      case 'investor-profiler':
        return (
          <InvestorProfiler
            data={formData}
            onChange={handleFieldChange}
          />
        );
      case 'three-acts':
        return (
          <ThreeActsExercise
            data={formData}
            onChange={handleFieldChange}
          />
        );
      case 'problem-digger':
        return (
          <ProblemDiggerExercise
            data={formData}
            onChange={handleFieldChange}
          />
        );
      case 'customer-story':
        return (
          <CustomerStoryBuilder
            data={formData}
            onChange={handleFieldChange}
          />
        );
      case 'superpower-detector':
        return (
          <SuperpowerDetector
            data={formData}
            onChange={handleFieldChange}
          />
        );
      default:
        return null;
    }
  };

  const renderField = (field: ExerciseField) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'input':
      case 'url':
      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type={field.type === 'url' ? 'url' : field.type === 'number' ? 'number' : 'text'}
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

      case 'time':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type="time"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const hasSpecializedComponent = !!exercise.componentType;

  return (
    <div className="space-y-6">
      {/* Exercise Header */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Ejercicio {exerciseNumber} de {totalExercises}
              </div>
              {/* Save Status Indicator */}
              <div className="flex items-center gap-1.5 text-xs">
                {saveStatus === 'saving' && (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">Guardando...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <Cloud className="w-3 h-3 text-success" />
                    <span className="text-success">Guardado</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <CloudOff className="w-3 h-3 text-destructive" />
                    <span className="text-destructive">Error al guardar</span>
                  </>
                )}
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">{exercise.titulo}</h2>
            <p className="text-sm text-muted-foreground">{exercise.instruccion}</p>
          </div>
        </div>
      </div>

      {/* Content - either specialized component or form fields */}
      <div className="space-y-4">
        {hasSpecializedComponent ? (
          renderSpecializedComponent()
        ) : (
          exercise.campos.map(renderField)
        )}
      </div>

      {/* Note if present */}
      {exercise.nota && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-primary font-medium">💡 {exercise.nota}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="space-y-3 pt-4 border-t border-border">
        {/* Skip to final */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground hover:text-primary"
          onClick={handleSkipToFinal}
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Ir al paso final
        </Button>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            className={cn(isFirst && "invisible")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="flex items-center gap-3">
            {/* Manual Save Button */}
            <Button
              variant="outline"
              onClick={() => {
                if (saveTimeoutRef.current) {
                  clearTimeout(saveTimeoutRef.current);
                }
                setSaveStatus('saving');
                onSave(formData);
                hasChangesRef.current = false;
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 2000);
              }}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2"
            >
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Cloud className="w-4 h-4 text-success" />
                  Guardado
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4" />
                  Guardar
                </>
              )}
            </Button>

            <Button onClick={handleNext} className="btn-primary-gradient">
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
