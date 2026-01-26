import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Pickaxe, ArrowDown, AlertTriangle, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProblemDiggerExerciseProps {
  data: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
}

const LEVELS = [
  { id: 'nivel_0', label: 'Mi startup resuelve:', placeholder: 'Describe el problema que tu startup resuelve...', depth: 0 },
  { id: 'nivel_1', label: '¿Por qué existe ese problema?', placeholder: 'Primer nivel: ¿Por qué ocurre esto?', depth: 1 },
  { id: 'nivel_2', label: '¿Por qué ocurre eso?', placeholder: 'Segundo nivel: Profundiza más...', depth: 2 },
  { id: 'nivel_3', label: '¿Por qué sucede eso?', placeholder: 'Tercer nivel: ¿Cuál es la causa?', depth: 3 },
  { id: 'nivel_4', label: '¿Por qué pasa eso?', placeholder: 'Cuarto nivel: Sigue excavando...', depth: 4 },
  { id: 'nivel_5', label: '¿Por qué es así?', placeholder: 'Quinto nivel: La raíz del problema...', depth: 5 },
];

export function ProblemDiggerExercise({ data, onChange }: ProblemDiggerExerciseProps) {
  const [dynamicLabels, setDynamicLabels] = useState<Record<string, string>>({});
  const [loadingLevels, setLoadingLevels] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const allLevelsFilled = LEVELS.every(level => data[level.id]?.trim());

  // Generate dynamic question for next level
  const generateDynamicQuestion = useCallback(async (levelId: string, previousAnswer: string, levelNumber: number) => {
    if (!previousAnswer.trim() || levelNumber === 0) return;

    setLoadingLevels(prev => ({ ...prev, [levelId]: true }));

    try {
      const { data: responseData, error } = await supabase.functions.invoke('generate-why-question', {
        body: {
          previousAnswer: previousAnswer.trim(),
          questionNumber: levelNumber,
        },
      });

      if (error) {
        console.error('Error generating question:', error);
        return;
      }

      if (responseData?.question) {
        setDynamicLabels(prev => ({ ...prev, [levelId]: responseData.question }));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingLevels(prev => ({ ...prev, [levelId]: false }));
    }
  }, []);

  // Handle blur to trigger generation for next level
  const handleFieldBlur = (levelId: string, depth: number) => {
    const value = data[levelId];
    const nextLevel = LEVELS.find(l => l.depth === depth + 1);
    
    if (nextLevel && value && value.trim().length > 5) {
      generateDynamicQuestion(nextLevel.id, value, depth + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start gap-3">
          <Pickaxe className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-primary font-medium">
              Excava hasta encontrar la raíz del problema
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Cada "¿Por qué?" te lleva más profundo. El Nivel 5 es tu problema real.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Funnel */}
      <div className="space-y-3">
        {LEVELS.map((level, index) => {
          const prevLevel = index > 0 ? LEVELS[index - 1] : null;
          const prevHasContent = prevLevel ? !!data[prevLevel.id]?.trim() : true;
          const isDisabled = !prevHasContent;
          const hasContent = !!data[level.id]?.trim();
          const isLoading = loadingLevels[level.id];
          const dynamicLabel = dynamicLabels[level.id];

          return (
            <div key={level.id}>
              {index > 0 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="w-5 h-5 text-primary/50" />
                </div>
              )}
              <div
                className={cn(
                  "relative transition-all",
                  isDisabled && "opacity-50"
                )}
                style={{
                  marginLeft: `${level.depth * 8}px`,
                  marginRight: `${level.depth * 8}px`,
                }}
              >
                <div className={cn(
                  "p-4 rounded-lg border-2 transition-colors",
                  level.depth === 0 && "bg-muted/30 border-muted-foreground/20",
                  level.depth === 5 && hasContent && "bg-primary/10 border-primary",
                  level.depth > 0 && level.depth < 5 && "bg-background border-border",
                  hasContent && level.depth < 5 && "border-green-500/50"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <Label 
                      htmlFor={level.id} 
                      className={cn(
                        "text-sm font-medium flex items-center gap-2",
                        level.depth === 5 && "text-primary"
                      )}
                    >
                      {isLoading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                      {dynamicLabel && <Sparkles className="w-3 h-3 text-primary" />}
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">
                        Nivel {level.depth}
                      </span>
                      <span className={dynamicLabel ? "text-primary" : ""}>
                        {dynamicLabel || level.label}
                      </span>
                    </Label>
                    {hasContent && level.depth < 5 && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <Textarea
                    id={level.id}
                    value={data[level.id] || ''}
                    onChange={(e) => onChange(level.id, e.target.value)}
                    onBlur={() => handleFieldBlur(level.id, level.depth)}
                    placeholder={level.placeholder}
                    disabled={isDisabled}
                    className={cn(
                      "min-h-[80px] resize-none",
                      level.depth === 5 && "border-primary/50"
                    )}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analysis Card */}
      {allLevelsFilled && (
        <Card className="border-2 border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Pickaxe className="w-5 h-5 text-primary" />
              Análisis de tu excavación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Problema superficial (Nivel 1)
                </div>
                <p className="text-sm font-medium">{data['nivel_1']}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                <div className="text-xs uppercase tracking-wide text-primary mb-1">
                  Problema REAL (Nivel 5)
                </div>
                <p className="text-sm font-medium text-primary">{data['nivel_5']}</p>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="space-y-3 flex-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    ⚠️ Pregunta clave: ¿Tu solución ataca el Nivel 1 o el Nivel 5?
                  </p>
                  <RadioGroup
                    value={data['nivel_ataque'] || ''}
                    onValueChange={(value) => onChange('nivel_ataque', value)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nivel_1" id="ataque_n1" />
                      <Label htmlFor="ataque_n1" className="font-normal cursor-pointer">Nivel 1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nivel_5" id="ataque_n5" />
                      <Label htmlFor="ataque_n5" className="font-normal cursor-pointer">Nivel 5</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {data['nivel_ataque'] === 'nivel_1' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>⚠️ Estás poniendo curitas.</strong> Considera reformular tu solución para atacar la raíz del problema (Nivel 5). Las soluciones superficiales son más fáciles de copiar y menos valiosas.
                </AlertDescription>
              </Alert>
            )}

            {data['nivel_ataque'] === 'nivel_5' && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>✅ Excelente.</strong> Tu solución ataca la causa raíz. Esto crea una ventaja más difícil de replicar.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
