import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Block } from '@/data/blocks';
import { ExerciseData } from '@/hooks/usePitchStore';
import { ExerciseSummaryCard } from './ExerciseSummaryCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Save, Check, Lightbulb, AlertTriangle, XCircle, Package, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { generateBlockDraft } from '@/lib/generateBlockDraft';

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
  onSaveToPitchKit: (content: string) => void;
  onBack: () => void;
  isLastSection: boolean;
  isPitchKitSaved: boolean;
}

export function FinalBlockStep({
  block,
  sectionNumber,
  initialContent,
  exercisesData,
  protagonistData,
  onSave,
  onSaveAndFinish,
  onSaveToPitchKit,
  onBack,
  isLastSection,
  isPitchKitSaved
}: FinalBlockStepProps) {
  const [content, setContent] = useState(initialContent);
  const [showExample, setShowExample] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasChangesRef = useRef(false);

  // Generate draft from exercises if no content exists
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    } else {
      const draft = generateBlockDraft(sectionNumber, exercisesData, protagonistData);
      if (draft) {
        setContent(draft);
        // Auto-save the generated draft
        hasChangesRef.current = true;
      }
    }
  }, [initialContent, sectionNumber, exercisesData, protagonistData]);

  // Auto-save function
  const performSave = useCallback(() => {
    if (hasChangesRef.current && content.trim()) {
      setSaveStatus('saving');
      onSave(content);
      hasChangesRef.current = false;
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }, [content, onSave]);

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
      if (hasChangesRef.current && content.trim()) {
        onSave(content);
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, onSave]);

  // Word count
  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, [content]);

  const getWordCountStatus = () => {
    if (wordCount < block.palabrasMin) return 'under';
    if (wordCount > block.palabrasMax) return 'over';
    return 'in-range';
  };

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
    hasChangesRef.current = true;
    setSaveStatus('idle');
    
    // Debounced save after 3 seconds of no typing
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        setSaveStatus('saving');
        onSave(value);
        hasChangesRef.current = false;
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    }, 3000);
  }, [onSave]);

  const handleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setSaveStatus('saving');
    onSave(content);
    hasChangesRef.current = false;
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
        {/* Save Status Indicator */}
        <div className="flex items-center justify-end gap-1.5 text-xs mb-2">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">Guardando...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <Cloud className="w-3 h-3 text-success" />
              <span className="text-success">Guardado automáticamente</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <CloudOff className="w-3 h-3 text-destructive" />
              <span className="text-destructive">Error al guardar</span>
            </>
          )}
        </div>
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
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
        {/* Pitch Kit Button */}
        <Button 
          size="lg" 
          className={cn(
            "w-full h-12",
            isPitchKitSaved 
              ? "bg-success hover:bg-success/90 text-success-foreground" 
              : "bg-primary/10 border-2 border-primary text-primary hover:bg-primary/20"
          )}
          onClick={() => onSaveToPitchKit(content)}
        >
          <Package className="w-5 h-5 mr-2" />
          {isPitchKitSaved ? 'Guardado en Pitch Kit ✓' : `Guardar en Pitch Kit → Bloque ${sectionNumber}`}
        </Button>

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
