import { blocks } from '@/data/blocks';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, Eye, RotateCcw, Package, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { useAuth } from '@/hooks/useAuth';

interface HubPageProps {
  userName: string;
  startupName: string;
  completedBlocks: number[];
  currentBlock: number;
  pitchKitCount: number;
  pitchKitSavedBlocks: number[];
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
  pitchKitSavedBlocks,
  onSelectBlock, 
  onViewPitch,
  onReset
}: HubPageProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getBlockStatus = (blockNumber: number) => {
    if (completedBlocks.includes(blockNumber)) return 'completed';
    
    // Find the first incomplete block to highlight as "current"
    const firstIncomplete = blocks.find(b => !completedBlocks.includes(b.numero))?.numero || 1;
    if (blockNumber === firstIncomplete) return 'current';
    
    return 'available';
  };

  const getNextBlock = () => {
    for (let i = 1; i <= 9; i++) {
      if (!completedBlocks.includes(i)) return i;
    }
    return null;
  };

  const handleBlockClick = (blockNumber: number) => {
    onSelectBlock(blockNumber);
  };

  const completionPercentage = (completedBlocks.length / 9) * 100;
  const nextBlock = getNextBlock();

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Header with logout */}
        <div className="flex items-center justify-between mb-4">
          <div />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
        
        {/* Title */}
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
              <button
                key={block.numero}
                onClick={() => handleBlockClick(block.numero)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer",
                  status === 'completed' && "bg-success/5 border-success/30 hover:border-success",
                  status === 'current' && "bg-primary/5 border-primary/30 hover:border-primary ring-2 ring-primary/20",
                  status === 'available' && "bg-background border-border hover:border-muted-foreground"
                )}
              >
                {/* Status Icon */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  status === 'completed' && "bg-success text-success-foreground",
                  status === 'current' && "bg-primary text-primary-foreground",
                  status === 'available' && "bg-muted text-muted-foreground"
                )}>
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-bold">{block.numero}</span>
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
                <ChevronRight className={cn(
                  "w-5 h-5 flex-shrink-0",
                  status === 'completed' && "text-success",
                  status === 'current' && "text-primary",
                  status === 'available' && "text-muted-foreground"
                )} />
              </button>
            );
          })}
        </div>

        {/* Pitch Kit Section */}
        <div className="mb-8 p-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/20">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">🎬 TU PITCH KIT</h3>
                <p className="text-xs text-muted-foreground">Bloques listos para tu presentación</p>
                <p className="text-xs text-muted-foreground">El Pitch Kit guarda solo los bloques que confirmas con el botón 'Guardar en Pitch Kit'. Es independiente de tu progreso en los ejercicios.</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{pitchKitCount}/9</div>
              <div className="text-xs text-muted-foreground">guardados</div>
            </div>
          </div>
          
          {/* Progress bar for Pitch Kit */}
          <div className="h-3 bg-secondary rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(pitchKitCount / 9) * 100}%` }}
            />
          </div>

          {/* Block status grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {blocks.map((block) => {
              const isInKit = pitchKitSavedBlocks.includes(block.numero);
              return (
                <div key={block.numero} className="flex items-center gap-1.5 text-xs">
                  {isInKit ? (
                    <Check className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/50" />
                  )}
                  <span className={cn(
                    "truncate",
                    isInKit ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {block.nombre.split(' ')[1]}
                  </span>
                </div>
              );
            })}
          </div>
          
          <Button 
            className="w-full btn-primary-gradient"
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
