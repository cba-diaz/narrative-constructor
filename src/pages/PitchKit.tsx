import { usePitchStore } from '@/hooks/usePitchStore';
import { blocks } from '@/data/blocks';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Copy, Check, FileText, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function PitchKit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, getPitchKitBlocks, getPitchKitCompletedCount, getPitchKitTotalWords } = usePitchStore();
  
  const pitchKitBlocks = getPitchKitBlocks();
  const completedCount = getPitchKitCompletedCount();
  const totalWords = getPitchKitTotalWords();
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);

  // Estimate reading time (150 words per minute)
  const readingTimeMinutes = Math.ceil(totalWords / 150);

  const handleCopyBlock = async (blockNumber: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedBlock(blockNumber);
      setTimeout(() => setCopiedBlock(null), 2000);
      toast({
        title: "Bloque copiado",
        description: `Bloque ${blockNumber} copiado al portapapeles`,
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    }
  };

  const handleCopyAll = async () => {
    const fullPitch = blocks
      .map(block => {
        const content = pitchKitBlocks[block.numero]?.content;
        if (!content) return null;
        return `## ${block.numero}. ${block.nombre}\n\n${content}`;
      })
      .filter(Boolean)
      .join('\n\n---\n\n');

    try {
      await navigator.clipboard.writeText(fullPitch);
      toast({
        title: "Pitch Kit copiado",
        description: "Todo el contenido copiado al portapapeles",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const fullPitch = blocks
      .map(block => {
        const content = pitchKitBlocks[block.numero]?.content;
        if (!content) return null;
        return `${block.numero}. ${block.nombre}\n${'='.repeat(30)}\n\n${content}`;
      })
      .filter(Boolean)
      .join('\n\n\n');

    const header = `PITCH KIT - ${data.startupName}\nCreado por: ${data.userName}\nFecha: ${new Date().toLocaleDateString()}\nPalabras totales: ${totalWords}\nTiempo estimado de lectura: ${readingTimeMinutes} minutos\n\n${'='.repeat(50)}\n\n`;

    const blob = new Blob([header + fullPitch], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pitch-kit-${data.startupName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Pitch Kit descargado",
      description: "Tu archivo se ha descargado correctamente",
    });
  };

  const getBlockStatus = (blockNumber: number) => {
    const block = pitchKitBlocks[blockNumber];
    if (!block?.content) return 'empty';
    
    const blockDef = blocks.find(b => b.numero === blockNumber);
    if (!blockDef) return 'empty';
    
    if (block.wordCount < blockDef.palabrasMin) return 'under';
    if (block.wordCount > blockDef.palabrasMax) return 'over';
    return 'valid';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Volver al hub</span>
          </button>
          
          <div className="text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Pitch Kit</div>
            <div className="font-bold text-foreground">{data.startupName}</div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyAll} disabled={completedCount === 0}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={completedCount === 0}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-muted/50 rounded-lg p-4 text-center border border-border">
            <div className="text-2xl font-bold text-foreground">{completedCount}/9</div>
            <div className="text-xs text-muted-foreground">Bloques completados</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center border border-border">
            <div className="text-2xl font-bold text-foreground">{totalWords}</div>
            <div className="text-xs text-muted-foreground">Palabras totales</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center border border-border">
            <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
              <Clock className="w-5 h-5" />
              {readingTimeMinutes}
            </div>
            <div className="text-xs text-muted-foreground">Minutos de lectura</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progreso del Pitch Kit</span>
            <span className="font-medium text-foreground">{Math.round((completedCount / 9) * 100)}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(completedCount / 9) * 100}%` }}
            />
          </div>
        </div>

        {/* Blocks */}
        <div className="space-y-6">
          {blocks.map(block => {
            const kitBlock = pitchKitBlocks[block.numero];
            const status = getBlockStatus(block.numero);
            const hasContent = !!kitBlock?.content;

            return (
              <div 
                key={block.numero}
                className={cn(
                  "rounded-xl border p-5",
                  hasContent ? "bg-card border-border" : "bg-muted/30 border-dashed border-muted-foreground/30"
                )}
              >
                {/* Block Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      hasContent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {block.numero}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{block.nombre}</h3>
                      <p className="text-xs text-muted-foreground">{block.palabrasMin}-{block.palabrasMax} palabras</p>
                    </div>
                  </div>

                  {hasContent && (
                    <div className="flex items-center gap-2">
                      {status === 'under' && (
                        <span className="text-xs text-destructive flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Faltan palabras
                        </span>
                      )}
                      {status === 'over' && (
                        <span className="text-xs text-warning flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Excede límite
                        </span>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCopyBlock(block.numero, kitBlock.content)}
                      >
                        {copiedBlock === block.numero ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Block Content */}
                {hasContent ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {kitBlock.content}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <span className={cn(
                        "text-xs font-mono",
                        status === 'valid' && "text-success",
                        status === 'under' && "text-destructive",
                        status === 'over' && "text-warning"
                      )}>
                        {kitBlock.wordCount} palabras
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Guardado: {new Date(kitBlock.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">
                      Completa la sección "{block.nombre}" y guárdala en el Pitch Kit
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {completedCount === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Tu Pitch Kit está vacío</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Completa los ejercicios de cada sección y usa el botón "Guardar en Pitch Kit" para ir construyendo tu pitch final.
            </p>
            <Button onClick={() => navigate('/')} className="btn-primary-gradient">
              Ir al Hub
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
