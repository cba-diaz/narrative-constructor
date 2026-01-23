import { useMemo } from 'react';
import { blocks } from '@/data/blocks';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Copy, 
  Download, 
  Pencil, 
  Clock,
  FileText,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface PitchViewProps {
  userName: string;
  startupName: string;
  blockContents: Record<number, string>;
  onBack: () => void;
  onEditBlock: (blockNumber: number) => void;
}

export function PitchView({ 
  userName, 
  startupName, 
  blockContents, 
  onBack, 
  onEditBlock 
}: PitchViewProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const totalWords = useMemo(() => {
    return Object.values(blockContents)
      .join(' ')
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
  }, [blockContents]);

  const readingTime = useMemo(() => {
    return Math.ceil(totalWords / 150);
  }, [totalWords]);

  const completedBlocksCount = Object.values(blockContents).filter(c => c && c.trim().length > 0).length;

  const generatePlainText = () => {
    let text = `${startupName.toUpperCase()}\n\n`;
    
    blocks.forEach((block) => {
      const content = blockContents[block.numero];
      if (content && content.trim()) {
        text += `${content.trim()}\n\n`;
      }
    });
    
    text += `---\nCreado con Pitch de Película\npitchdepelicula.com`;
    
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatePlainText());
      setCopied(true);
      toast({
        title: "✓ Copiado al portapapeles",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Error al copiar",
        description: "Intenta de nuevo",
        variant: "destructive",
      });
    }
  };

  const handleDownloadTXT = () => {
    const text = generatePlainText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${startupName.toLowerCase().replace(/\s+/g, '-')}-pitch.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "✓ Descargado",
      description: `${startupName}-pitch.txt`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Volver al hub</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadTXT}>
              <Download className="w-4 h-4 mr-2" />
              TXT
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tu Pitch Completo</h1>
          <p className="text-lg text-muted-foreground mb-4">
            {startupName} — {userName}
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>~{totalWords} palabras</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min de lectura</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="w-4 h-4" />
              <span>{completedBlocksCount}/9 bloques</span>
            </div>
          </div>
        </div>

        {/* Pitch Content */}
        <div className="space-y-6">
          {blocks.map((block) => {
            const content = blockContents[block.numero];
            const hasContent = content && content.trim().length > 0;
            
            return (
              <div 
                key={block.numero} 
                className="card-elevated p-6 animate-fade-in group"
                style={{ animationDelay: `${block.numero * 50}ms` }}
              >
                {/* Block Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {block.numero}. {block.nombre}
                    </span>
                  </div>
                  <button 
                    onClick={() => onEditBlock(block.numero)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted rounded-lg"
                    title="Editar bloque"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                
                {/* Content */}
                {hasContent ? (
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {content}
                  </p>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-muted-foreground italic mb-3">
                      Este bloque aún no está completo
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditBlock(block.numero)}
                    >
                      Completar bloque
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center card-elevated p-8">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Tu pitch está {completedBlocksCount === 9 ? 'listo' : 'casi listo'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {completedBlocksCount === 9 
              ? "Léelo en voz alta. Practica hasta que fluya."
              : `Te faltan ${9 - completedBlocksCount} bloques por completar.`
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              size="lg" 
              className="btn-primary-gradient"
              onClick={handleCopy}
            >
              <Copy className="w-5 h-5 mr-2" />
              Copiar al portapapeles
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleDownloadTXT}
            >
              <Download className="w-5 h-5 mr-2" />
              Descargar como TXT
            </Button>
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-8 text-center">
          <a 
            href="https://pitchdepelicula.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Creado con Pitch de Película — pitchdepelicula.com
          </a>
        </div>
      </main>
    </div>
  );
}
