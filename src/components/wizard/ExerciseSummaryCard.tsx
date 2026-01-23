import { useState } from 'react';
import { ExerciseData } from '@/hooks/usePitchStore';
import { ChevronDown, ChevronUp, User, Clock, BarChart3, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExerciseSummaryCardProps {
  sectionNumber: number;
  exercisesData: Record<string, ExerciseData>;
  protagonistData?: {
    nombre: string;
    edad: string;
    profesion: string;
    ciudad: string;
    contexto: string;
    aspiracion: string;
    frustracion: string;
  };
}

export function ExerciseSummaryCard({ sectionNumber, exercisesData, protagonistData }: ExerciseSummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get summary content based on section
  const getSummaryContent = () => {
    switch (sectionNumber) {
      case 1:
        const protagonista = exercisesData['1_2'] || {};
        const escena = exercisesData['1_3'] || {};
        const escala = exercisesData['1_4'] || {};
        return (
          <div className="space-y-4">
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

            {/* Scene Card */}
            {escena.timing && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="font-medium text-sm">La escena del crimen</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {escena.timing && <span className="font-medium text-foreground">{escena.timing}</span>}
                  {escena.trigger && ` - ${escena.trigger}`}
                </p>
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
              </div>
            )}
          </div>
        );

      case 2:
        const solucion = exercisesData['2_1'] || {};
        const antesDesp = exercisesData['2_2'] || {};
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
            {solucion.solucion_oracion && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-success" />
                  <span className="font-medium text-sm">Tu solución en una oración</span>
                </div>
                <p className="text-sm text-muted-foreground">{solucion.solucion_oracion}</p>
              </div>
            )}
            {(antesDesp.antes || antesDesp.despues) && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="font-medium text-sm">Antes y después</span>
                </div>
                {antesDesp.antes && (
                  <p className="text-sm text-muted-foreground mb-1">
                    <span className="text-destructive font-medium">Antes:</span> {antesDesp.antes}
                  </p>
                )}
                {antesDesp.despues && (
                  <p className="text-sm text-muted-foreground">
                    <span className="text-success font-medium">Después:</span> {antesDesp.despues}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      // Add more section-specific summaries...
      default:
        // Generic summary for other sections
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
