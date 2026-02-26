import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface WizardStepperProps {
  steps: { id: string; titulo: string }[];
  currentStep: number;
  completedSteps?: boolean[];
  onStepClick?: (step: number) => void;
}

export function WizardStepper({ steps, currentStep, completedSteps, onStepClick }: WizardStepperProps) {
  // Add "Bloque Final" as the last step
  const allSteps = [
    ...steps.map(s => ({ id: s.id, titulo: s.titulo })),
    { id: 'final', titulo: 'Bloque Final' }
  ];

  return (
    <div className="flex items-center justify-between w-full mb-6 overflow-x-auto pb-2">
      {allSteps.map((step, index) => {
        const isCompleted = completedSteps ? (index < steps.length ? completedSteps[index] : index < currentStep) : index < currentStep;
        const isCurrent = index === currentStep;
        const isFuture = index > currentStep;
        const canClick = (isCompleted || index <= currentStep) && index !== currentStep && onStepClick;

        return (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            {/* Step indicator */}
            <button
              onClick={() => canClick && onStepClick(index)}
              disabled={!canClick}
              className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                isCompleted && "bg-success text-success-foreground cursor-pointer hover:bg-success/90",
                isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background",
                isFuture && "bg-muted text-muted-foreground",
                !canClick && "cursor-default"
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </button>

            {/* Step label - hidden on mobile for middle steps */}
            <span className={cn(
              "ml-2 text-xs font-medium truncate hidden sm:block max-w-[80px] lg:max-w-[120px]",
              isCompleted && "text-success",
              isCurrent && "text-primary",
              isFuture && "text-muted-foreground"
            )}>
              {index === allSteps.length - 1 ? 'Final' : (step.titulo?.split(' ').slice(0, 2).join(' ') || `Ej. ${index + 1}`)}
            </span>

            {/* Connector line */}
            {index < allSteps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2 transition-colors",
                index < currentStep ? "bg-success" : "bg-muted"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
