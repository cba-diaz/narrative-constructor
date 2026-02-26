import { useState } from 'react';
import { ExerciseData } from '@/hooks/usePitchStore';
import { ChevronDown, ChevronUp, User, Pickaxe, BarChart3, FileText, Zap, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExerciseSummaryCardProps {
  sectionNumber: number;
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
}

export function ExerciseSummaryCard({ sectionNumber, exercisesData, protagonistData }: ExerciseSummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getSummaryContent = () => {
    switch (sectionNumber) {
      case 1: {
        const reduction = exercisesData['1_1'] || {};
        const digger = exercisesData['1_2'] || {};
        const protagonista = exercisesData['1_3'] || {};
        const escala = exercisesData['1_4'] || {};
        return (
          <div className="space-y-4">
            {/* 8-word phrase */}
            {reduction.frase_8 && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Tu frase de 8 palabras</span>
                </div>
                <p className="text-sm font-medium text-foreground italic">"{reduction.frase_8}"</p>
              </div>
            )}

            {/* Root problem from digger */}
            {digger.nivel_5 && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Pickaxe className="w-4 h-4 text-warning" />
                  <span className="font-medium text-sm">Problema raíz (Nivel 5)</span>
                </div>
                <p className="text-sm text-muted-foreground">{digger.nivel_5}</p>
              </div>
            )}

            {/* Protagonist Card */}
            {protagonista.nombre && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Tu protagonista</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{protagonista.nombre}</span>
                  {protagonista.edad && `, ${protagonista.edad} años`}
                  {protagonista.profesion && `, ${protagonista.profesion}`}
                  {protagonista.ciudad && ` en ${protagonista.ciudad}`}
                </p>
                {protagonista.aspiracion && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="text-primary">Quiere:</span> {protagonista.aspiracion}
                  </p>
                )}
              </div>
            )}

            {/* Scale Card */}
            {escala.cantidad && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-success" />
                  <span className="font-medium text-sm">La escala</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{escala.cantidad}</span>
                  {escala.frecuencia && ` ${escala.frecuencia}`}
                </p>
                {escala.tangible && (
                  <p className="text-sm text-muted-foreground mt-1 italic">{escala.tangible}</p>
                )}
              </div>
            )}
          </div>
        );
      }

      case 2: {
        const story = exercisesData['2_1'] || {};
        const pasos = exercisesData['2_2'] || {};
        return (
          <div className="space-y-4">
            {protagonistData?.nombre && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Tu protagonista (de Sección 1)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{protagonistData.nombre}</span>
                  {protagonistData.edad && `, ${protagonistData.edad} años`}
                  {protagonistData.profesion && `, ${protagonistData.profesion}`}
                </p>
              </div>
            )}
            {story.historia_generada && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-warning" />
                  <span className="font-medium text-sm">Historia de cliente</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{story.historia_generada}</p>
              </div>
            )}
            {(pasos.reveal || pasos.transformacion || pasos.vision) && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-success" />
                  <span className="font-medium text-sm">Los 3 pasos</span>
                </div>
                {pasos.reveal && (
                  <p className="text-sm text-muted-foreground mb-1">
                    <span className="text-primary font-medium">Reveal:</span> {pasos.reveal}
                  </p>
                )}
                {pasos.transformacion && (
                  <p className="text-sm text-muted-foreground mb-1">
                    <span className="text-success font-medium">Transformación:</span> {pasos.transformacion}
                  </p>
                )}
                {pasos.vision && (
                  <p className="text-sm text-muted-foreground">
                    <span className="text-warning font-medium">Visión:</span> {pasos.vision}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      }

      default: {
        const allData = Object.values(exercisesData).reduce((acc, data) => ({ ...acc, ...data }), {});
        const entries = Object.entries(allData).filter(([_, v]) => v && v.trim().length > 0);
        
        if (entries.length === 0) {
          return (
            <p className="text-sm text-muted-foreground italic">
              Completa los ejercicios anteriores para ver el resumen aquí.
            </p>
          );
        }

        return (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {entries.slice(0, 6).map(([key, value]) => (
              <div key={key} className="p-2 rounded bg-background border border-border">
                <p className="text-xs text-muted-foreground truncate">{value}</p>
              </div>
            ))}
            {entries.length > 6 && (
              <p className="text-xs text-muted-foreground">
                +{entries.length - 6} campos más...
              </p>
            )}
          </div>
        );
      }
    }
  };

  const hasData = Object.values(exercisesData).some(
    data => Object.values(data).some(v => v && v.trim().length > 0)
  );

  if (!hasData && !protagonistData?.nombre) {
    return null;
  }

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-primary/10 transition-colors"
      >
        <span className="font-medium text-sm flex items-center gap-2">
          📋 Usa lo que preparaste
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pb-4">
          {getSummaryContent()}
        </div>
      </div>
    </div>
  );
}
