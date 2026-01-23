import { useState, useEffect, useCallback, useMemo } from 'react';
import { Block, motivationalMessages } from '@/data/blocks';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  Save,
  Check,
  AlertTriangle,
  XCircle,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface BlockEditorProps {
  block: Block;
  initialContent: string;
  onSave: (content: string) => void;
  onSaveAndContinue: (content: string) => void;
  onBack: () => void;
  isLastBlock: boolean;
}

export function BlockEditor({ 
  block, 
  initialContent, 
  onSave, 
  onSaveAndContinue, 
  onBack,
  isLastBlock
}: BlockEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [showExample, setShowExample] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showMobileInstructions, setShowMobileInstructions] = useState(false);
  const { toast } = useToast();

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (content !== initialContent && content.trim().length > 0) {
        handleSave(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [content, initialContent]);

  // Word count calculation
  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, [content]);

  const getWordCountStatus = () => {
    if (wordCount < block.palabrasMin) return 'under';
    if (wordCount > block.palabrasMax) return 'over';
    return 'in-range';
  };

  const handleSave = useCallback((showToast = true) => {
    setSaveStatus('saving');
    onSave(content);
    setSaveStatus('saved');
    
    if (showToast) {
      toast({
        title: "✓ Guardado",
        duration: 2000,
      });
    }
    
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [content, onSave, toast]);

  const handleSaveAndContinue = () => {
    setSaveStatus('saving');
    onSaveAndContinue(content);
    
    if (isLastBlock && content.trim().length > 0) {
      toast({
        title: motivationalMessages[block.numero],
        description: "¡Pitch completo! Ahora a practicarlo.",
        duration: 4000,
      });
    } else if (content.trim().length > 0) {
      toast({
        title: motivationalMessages[block.numero],
        duration: 3000,
      });
    }
  };

  const wordCountStatus = getWordCountStatus();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Volver al hub</span>
          </button>
          
          <div className="flex items-center gap-2">
            {saveStatus === 'saved' && (
              <span className="text-sm text-success flex items-center gap-1 animate-fade-in">
                <Check className="w-4 h-4" />
                Guardado
              </span>
            )}
            {saveStatus === 'saving' && (
              <span className="text-sm text-muted-foreground">Guardando...</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Bloque</span>
            <span className="font-bold text-foreground">{block.numero}/9</span>
          </div>
        </div>
      </header>

      {/* Mobile Toggle */}
      <div className="lg:hidden border-b border-border">
        <button 
          onClick={() => setShowMobileInstructions(!showMobileInstructions)}
          className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium"
        >
          <span>{showMobileInstructions ? 'Ver editor' : 'Ver instrucciones'}</span>
          {showMobileInstructions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          
          {/* Instructions Panel */}
          <div className={cn(
            "lg:col-span-2 mb-6 lg:mb-0",
            !showMobileInstructions && "hidden lg:block"
          )}>
            <div className="card-elevated p-6 sticky top-24">
              {/* Block Header */}
              <div className="mb-6">
                <div className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                  BLOQUE {block.numero}
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">{block.nombre}</h1>
                <p className="text-lg text-muted-foreground">{block.pregunta}</p>
              </div>

              {/* Word Target */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 mb-6">
                <span className="text-sm text-muted-foreground">Objetivo:</span>
                <span className="font-mono font-medium text-foreground">
                  {block.palabrasMin}-{block.palabrasMax} palabras
                </span>
              </div>

              {/* Structure */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Estructura
                </h3>
                <div className="space-y-3">
                  {block.estructura.map((item, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-foreground">{item.titulo}</div>
                      <div className="text-muted-foreground mt-0.5">{item.descripcion}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restrictions */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Restricciones
                </h3>
                <ul className="space-y-2">
                  {block.restricciones.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-warning mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prohibited */}
              <div className="mb-6">
                <h3 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Prohibido
                </h3>
                <ul className="space-y-2">
                  {block.prohibido.map((item, index) => (
                    <li key={index} className="text-sm text-destructive/80 flex items-start gap-2">
                      <span className="mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Example */}
              <Collapsible open={showExample} onOpenChange={setShowExample}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Ver ejemplo (TécnicoYa)
                    {showExample ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground whitespace-pre-wrap">
                    {block.ejemplo}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          {/* Editor Panel */}
          <div className={cn(
            "lg:col-span-3",
            showMobileInstructions && "hidden lg:block"
          )}>
            <div className="card-elevated p-6">
              {/* Editor */}
              <div className="mb-4">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={block.placeholder}
                  className="min-h-[400px] resize-none text-base leading-relaxed"
                />
              </div>

              {/* Word Counter */}
              <div className="flex items-center justify-between mb-6">
                <div className={cn(
                  "font-mono text-sm font-medium",
                  wordCountStatus === 'under' && "word-count-under",
                  wordCountStatus === 'in-range' && "word-count-in-range",
                  wordCountStatus === 'over' && "word-count-over"
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

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full btn-primary-gradient h-12"
                  onClick={handleSaveAndContinue}
                >
                  {isLastBlock ? 'Guardar y terminar' : 'Guardar y continuar'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="flex-1 h-12"
                    onClick={() => handleSave(true)}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Guardar
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="flex-1 h-12"
                    onClick={onBack}
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Volver al hub
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
