import React, { useState, useCallback, useEffect } from 'react';
import { Block, blocks } from '@/data/blocks';
import { sectionExercises, sectionMotivationalMessages } from '@/data/exercises';
import { usePitchStore, ExerciseData } from '@/hooks/usePitchStore';
import { WizardStepper } from './wizard/WizardStepper';
import { ExerciseStep } from './wizard/ExerciseStep';
import { FinalBlockStep } from './wizard/FinalBlockStep';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface SectionWizardProps {
  sectionNumber: number;
  onComplete: () => void;
  onBack: () => void;
}

export function SectionWizard({ sectionNumber, onComplete, onBack }: SectionWizardProps) {
  const { 
    data,
    setExerciseData, 
    setSectionStep, 
    getSectionExercises, 
    getSectionStep,
    getProtagonistData,
    setBlockContent,
    saveToPitchKit
  } = usePitchStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const block = blocks.find(b => b.numero === sectionNumber)!;
  const sectionExerciseData = sectionExercises.find(s => s.seccionNumero === sectionNumber);
  const exercises = sectionExerciseData?.ejercicios || [];
  
  const [currentStep, setCurrentStep] = useState(() => getSectionStep(sectionNumber));
  const [pitchKitSaved, setPitchKitSaved] = useState(() => !!data.pitchKit[sectionNumber]?.content);
  const totalSteps = exercises.length + 1; // exercises + final block

  const exercisesData = getSectionExercises(sectionNumber);
  const protagonistData = getProtagonistData();
  const blockContent = data.blocks[sectionNumber] || '';

  // Sync step with store (use ref to avoid infinite loop)
  const prevStepRef = React.useRef(currentStep);
  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      prevStepRef.current = currentStep;
      setSectionStep(sectionNumber, currentStep);
    }
  }, [currentStep, sectionNumber, setSectionStep]);

  // Update pitchKitSaved when data changes
  useEffect(() => {
    setPitchKitSaved(!!data.pitchKit[sectionNumber]?.content);
  }, [data.pitchKit, sectionNumber]);

  const handleExerciseSave = useCallback((exerciseId: string, fieldData: ExerciseData) => {
    setExerciseData(sectionNumber, exerciseId, fieldData);
  }, [sectionNumber, setExerciseData]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const handleSkipToFinal = useCallback(() => {
    setCurrentStep(exercises.length);
  }, [exercises.length]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  }, [currentStep, onBack]);

  const hasAnyExerciseData = useCallback(() => {
    return exercises.some(e => {
      const exData = exercisesData[e.id];
      return !!exData && Object.values(exData).some(v => v && v.trim().length > 0);
    });
  }, [exercises, exercisesData]);

  const handleStepClick = useCallback((step: number) => {
    if (step === exercises.length && !hasAnyExerciseData()) {
      toast({
        title: "Completa al menos un ejercicio antes de escribir el bloque",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setCurrentStep(step);
  }, [exercises.length, hasAnyExerciseData, toast]);

  const handleBlockSave = useCallback((content: string) => {
    setBlockContent(sectionNumber, content);
  }, [sectionNumber, setBlockContent]);

  const handleBlockSaveAndFinish = useCallback((content: string) => {
    setBlockContent(sectionNumber, content);
    
    const isLastSection = sectionNumber === 9;
    toast({
      title: sectionMotivationalMessages[sectionNumber],
      description: isLastSection ? "Léelo en voz alta. Practica hasta que fluya." : undefined,
      duration: 4000,
    });
    
    onComplete();
  }, [sectionNumber, setBlockContent, toast, onComplete]);

  const handleSaveToPitchKit = useCallback((content: string) => {
    saveToPitchKit(sectionNumber, content);
    setPitchKitSaved(true);
    toast({
      title: `¡Bloque ${sectionNumber} guardado en Pitch Kit!`,
      description: "Puedes ver tu Pitch Kit completo desde el Hub",
      duration: 3000,
    });
  }, [sectionNumber, saveToPitchKit, toast]);


  const isFinalStep = currentStep === exercises.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Volver al hub</span>
          </button>
          
          <div className="text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Bloque {sectionNumber}</div>
            <div className="font-bold text-foreground">{block.nombre}</div>
          </div>

          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Stepper */}
        <WizardStepper
          steps={exercises.map(e => ({ id: e.id, titulo: e.titulo }))}
          currentStep={currentStep}
          completedSteps={exercises.map((e, i) => {
            const exData = exercisesData[e.id];
            return !!exData && Object.values(exData).some(v => v && v.trim().length > 0);
          })}
          onStepClick={handleStepClick}
        />

        {/* Current Step Content */}
        <div className="mt-6">
          {!isFinalStep ? (
            <ExerciseStep
              exercise={exercises[currentStep]}
              exerciseNumber={currentStep + 1}
              totalExercises={exercises.length}
              initialData={exercisesData[exercises[currentStep].id] || {}}
              onSave={(data) => handleExerciseSave(exercises[currentStep].id, data)}
              onNext={handleNext}
              onBack={handlePrev}
              onSkipToFinal={handleSkipToFinal}
              isFirst={currentStep === 0}
              protagonistData={sectionNumber === 2 || sectionNumber === 9 ? {
                nombre: protagonistData.nombre,
                contexto: protagonistData.contexto || '',
                frustracion: protagonistData.frustracion || '',
              } : undefined}
            />
          ) : (
            <FinalBlockStep
              block={block}
              sectionNumber={sectionNumber}
              initialContent={blockContent}
              exercisesData={exercisesData}
              protagonistData={sectionNumber > 1 ? protagonistData : undefined}
              onSave={handleBlockSave}
              onSaveAndFinish={handleBlockSaveAndFinish}
              onSaveToPitchKit={handleSaveToPitchKit}
              onBack={handlePrev}
              isLastSection={sectionNumber === 9}
              isPitchKitSaved={pitchKitSaved}
            />
          )}
        </div>
      </div>
    </div>
  );
}
