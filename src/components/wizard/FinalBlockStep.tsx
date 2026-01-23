import { useState, useEffect, useMemo, useCallback } from 'react';
import { Block } from '@/data/blocks';
import { ExerciseData } from '@/hooks/usePitchStore';
import { ExerciseSummaryCard } from './ExerciseSummaryCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Save, Check, Lightbulb, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FinalBlockStepProps {
  block: Block;
  sectionNumber: number;
  initialContent: string;
  exercisesData: Record<string, ExerciseData>;
  protagonistData?: {
    nombre: string;
    edad: string;
    profesion: string;
    ciudad: string;
    contexto?: string;
    aspiracion?: string;
    frustracion?: string;
  };
  onSave: (content: string) => void;
  onSaveAndFinish: (content: string) => void;
  onBack: () => void;
  isLastSection: boolean;
}

export function FinalBlockStep({
  block,
  sectionNumber,
  initialContent,
  exercisesData,
  protagonistData,
  onSave,
  onSaveAndFinish,
  onBack,
  isLastSection
}: FinalBlockStepProps) {
  const [content, setContent] = useState(initialContent);
  const [showExample, setShowExample] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Word count
  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, [content]);

  const getWordCountStatus = () => {
    if (wordCount < block.palabrasMin) return 'under';
    if (wordCount > block.palabrasMax) return 'over';
    return 'in-range';
  };

  const handleSave = useCallback(() => {
    setSaveStatus('saving');
    onSave(content);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [content, onSave]);

  const handleSaveAndFinish = () => {
    onSaveAndFinish(content);
  };

  const wordCountStatus = getWordCountStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-success/10">
            <Check className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="text-xs text-success uppercase tracking-wide mb-1 font-medium">
              Paso Final
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">Escribe el Bloque: {block.nombre}</h2>
            <p className="text-sm text-muted-foreground">{block.pregunta}</p>
          </div>
        </div>
      </div>

      {/* Exercise Summary */}
      <ExerciseSummaryCard
        sectionNumber={sectionNumber}
        exercisesData={exercisesData}
        protagonistData={protagonistData}
      />

      {/* Structure Guide */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between text-left">
            <span className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              Ver estructura recomendada
            </span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
            {block.estructura.map((item, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium text-foreground">{item.titulo}</div>
                <div className="text-muted-foreground mt-0.5">{item.descripcion}</div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Restrictions & Prohibited - Collapsed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between text-left h-auto py-2">
              <span className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Restricciones
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <ul className="space-y-1 px-2">
              {block.restricciones.map((item, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-warning mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between text-left h-auto py-2">
              <span className="flex items-center gap-2 text-sm">
                <XCircle className="w-4 h-4 text-destructive" />
                Prohibido
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <ul className="space-y-1 px-2">
              {block.prohibido.map((item, index) => (
                <li key={index} className="text-xs text-destructive/80 flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Editor */}
      <div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={block.placeholder}
          className="min-h-[250px] resize-none text-base leading-relaxed"
        />
        
        {/* Word Counter */}
        <div className="flex items-center justify-between mt-3">
          <div className={cn(
            "font-mono text-sm font-medium",
            wordCountStatus === 'under' && "text-destructive",
            wordCountStatus === 'in-range' && "text-success",
            wordCountStatus === 'over' && "text-warning"
          )}>
            {wordCount} / {block.palabrasMin}-{block.palabrasMax} palabras
          </div>
          
          {wordCountStatus === 'under' && wordCount > 0 && (
            <span className="text-xs text-muted-foreground">
              Faltan {block.palabrasMin - wordCount} palabras
            </span>
          )}
          {wordCountStatus === 'over' && (
            <span className="text-xs text-muted-foreground">
              Sobran {wordCount - block.palabrasMax} palabras
            </span>
          )}
        </div>
      </div>

      {/* Example */}
      <Collapsible open={showExample} onOpenChange={setShowExample}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Ver ejemplo (TécnicoYa)
            {showExample ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground whitespace-pre-wrap border border-border">
            {block.ejemplo}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Navigation */}
      <div className="space-y-3 pt-4 border-t border-border">
        <Button 
          size="lg" 
          className="w-full btn-primary-gradient h-12"
          onClick={handleSaveAndFinish}
        >
          {isLastSection ? 'Guardar y terminar' : 'Guardar y continuar'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-1 h-11"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
            {saveStatus === 'saved' && <Check className="w-4 h-4 ml-2 text-success" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg" 
            className="flex-1 h-11"
            onClick={onBack}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
        </div>
      </div>
    </div>
  );
}
