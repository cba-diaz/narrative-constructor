import { blocks } from '@/data/blocks';
import { Button } from '@/components/ui/button';
import { Check, Circle, ChevronRight, Eye, RotateCcw, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';

interface HubPageProps {
  userName: string;
  startupName: string;
  completedBlocks: number[];
  currentBlock: number;
  pitchKitCount: number;
  onSelectBlock: (blockNumber: number) => void;
  onViewPitch: () => void;
  onReset: () => void;
}

export function HubPage({ 
  userName, 
  startupName, 
  completedBlocks, 
  currentBlock,
  pitchKitCount,
  onSelectBlock, 
  onViewPitch,
  onReset
}: HubPageProps) {
  const navigate = useNavigate();
  const getBlockStatus = (blockNumber: number) => {
    if (completedBlocks.includes(blockNumber)) return 'completed';
    
    // Find the first incomplete block
    const firstIncomplete = blocks.find(b => !completedBlocks.includes(b.numero))?.numero || 1;
    if (blockNumber === firstIncomplete) return 'current';
    
    return 'pending';
  };

  const getNextBlock = () => {
    for (let i = 1; i <= 9; i++) {
      if (!completedBlocks.includes(i)) return i;
    }
    return null;
  };

  const handleBlockClick = (blockNumber: number) => {
    const status = getBlockStatus(blockNumber);
    if (status === 'pending') return;
    onSelectBlock(blockNumber);
  };

  const completionPercentage = (completedBlocks.length / 9) * 100;
  const nextBlock = getNextBlock();

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">{startupName}</h1>
          <p className="text-muted-foreground">Pitch de {userName}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium text-foreground">{completedBlocks.length}/9 bloques</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Blocks Grid */}
        <div className="space-y-3 mb-8">
          {blocks.map((block) => {
            const status = getBlockStatus(block.numero);
            
            return (
              <Tooltip key={block.numero}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleBlockClick(block.numero)}
                    disabled={status === 'pending'}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                      status === 'completed' && "bg-success/5 border-success/30 hover:border-success cursor-pointer",
                      status === 'current' && "bg-primary/5 border-primary/30 hover:border-primary cursor-pointer ring-2 ring-primary/20",
                      status === 'pending' && "bg-muted/50 border-border cursor-not-allowed opacity-60"
                    )}
                  >
                    {/* Status Icon */}
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      status === 'completed' && "bg-success text-success-foreground",
                      status === 'current' && "bg-primary text-primary-foreground",
                      status === 'pending' && "bg-muted text-muted-foreground"
                    )}>
                      {status === 'completed' ? (
                        <Check className="w-5 h-5" />
                      ) : status === 'current' ? (
                        <span className="font-bold">{block.numero}</span>
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>

                    {/* Block Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          BLOQUE {block.numero}
                        </span>
                        {status === 'current' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            En progreso
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground">{block.nombre}</h3>
                      <p className="text-sm text-muted-foreground">{block.pregunta}</p>
                    </div>

                    {/* Arrow */}
                    {status !== 'pending' && (
                      <ChevronRight className={cn(
                        "w-5 h-5 flex-shrink-0",
                        status === 'completed' && "text-success",
                        status === 'current' && "text-primary"
                      )} />
                    )}
                  </button>
                </TooltipTrigger>
                {status === 'pending' && (
                  <TooltipContent>
                    <p>Completa los bloques anteriores primero</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>

        {/* Pitch Kit Section */}
        <div className="mb-8 p-4 rounded-xl bg-primary/5 border-2 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Tu Pitch Kit</h3>
                <p className="text-xs text-muted-foreground">Bloques listos para tu presentación</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{pitchKitCount}/9</div>
              <div className="text-xs text-muted-foreground">guardados</div>
            </div>
          </div>
          
          {/* Progress bar for Pitch Kit */}
          <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(pitchKitCount / 9) * 100}%` }}
            />
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/pitch-kit')}
          >
            <Package className="w-4 h-4 mr-2" />
            Ver Pitch Kit completo
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {nextBlock && (
            <Button 
              size="lg" 
              className="w-full btn-primary-gradient h-12"
              onClick={() => onSelectBlock(nextBlock)}
            >
              Continuar con Bloque {nextBlock}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}

          {completedBlocks.length > 0 && (
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full h-12"
              onClick={onViewPitch}
            >
              <Eye className="w-5 h-5 mr-2" />
              Ver mi pitch
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-muted-foreground hover:text-destructive"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Empezar de nuevo
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Empezar de nuevo?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esto borrará todo tu progreso y no se puede deshacer. ¿Estás seguro?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Sí, empezar de nuevo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
