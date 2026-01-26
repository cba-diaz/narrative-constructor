import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Heart, Brain, Zap, GripVertical, ArrowDown } from 'lucide-react';

interface ThreeActsExerciseProps {
  data: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
}

const EMOCIONES_INICIO = [
  { value: 'frustracion', label: 'Frustración', emoji: '😤' },
  { value: 'indignacion', label: 'Indignación', emoji: '😠' },
  { value: 'urgencia', label: 'Urgencia', emoji: '⏰' },
  { value: 'tristeza', label: 'Tristeza', emoji: '😢' },
  { value: 'miedo', label: 'Miedo', emoji: '😨' },
];

const EMOCIONES_FINAL = [
  { value: 'esperanza', label: 'Esperanza', emoji: '🌟' },
  { value: 'urgencia', label: 'Urgencia', emoji: '⚡' },
  { value: 'pertenencia', label: 'Pertenencia', emoji: '🤝' },
  { value: 'oportunidad', label: 'Oportunidad', emoji: '🚀' },
];

const PREGUNTAS_ACTO2 = [
  { id: 'traccion', label: '¿Funciona? (Tracción)' },
  { id: 'mercado', label: '¿Es grande? (Mercado)' },
  { id: 'competencia', label: '¿Es diferente? (Competencia)' },
  { id: 'modelo', label: '¿Gana dinero? (Modelo)' },
  { id: 'equipo', label: '¿Pueden ejecutar? (Equipo)' },
];

const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export function ThreeActsExercise({ data, onChange }: ThreeActsExerciseProps) {
  const selectedQuestions = (data['preguntas_acto2'] || '').split(',').filter(Boolean);
  const orderedQuestions = (data['orden_preguntas'] || '').split(',').filter(Boolean);

  const handleQuestionToggle = (questionId: string, checked: boolean) => {
    let newSelected = [...selectedQuestions];
    if (checked) {
      newSelected.push(questionId);
    } else {
      newSelected = newSelected.filter(q => q !== questionId);
    }
    onChange('preguntas_acto2', newSelected.join(','));
    
    // Update order to only include selected questions
    const newOrder = orderedQuestions.filter(q => newSelected.includes(q));
    if (checked && !newOrder.includes(questionId)) {
      newOrder.push(questionId);
    }
    onChange('orden_preguntas', newOrder.join(','));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...orderedQuestions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newOrder.length) {
      [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
      onChange('orden_preguntas', newOrder.join(','));
    }
  };

  const getSelectedEmocionInicio = EMOCIONES_INICIO.find(e => e.value === data['emocion_inicio']);
  const getSelectedEmocionFinal = EMOCIONES_FINAL.find(e => e.value === data['emocion_final']);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-sm text-primary font-medium">
          🎭 Todo gran pitch tiene tres actos: atrapar emocionalmente, convencer racionalmente, y mover a la acción.
        </p>
      </div>

      {/* ACTO I - EMOCIÓN */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span>ACTO I — EMOCIÓN</span>
            <span className="text-xs text-muted-foreground font-normal">(El gancho)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>¿Qué emoción quieres despertar?</Label>
            <Select
              value={data['emocion_inicio'] || ''}
              onValueChange={(value) => onChange('emocion_inicio', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una emoción" />
              </SelectTrigger>
              <SelectContent>
                {EMOCIONES_INICIO.map((emocion) => (
                  <SelectItem key={emocion.value} value={emocion.value}>
                    {emocion.emoji} {emocion.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="gancho_emocional">Escribe en una oración tu gancho emocional</Label>
              <span className={cn(
                "text-xs",
                countWords(data['gancho_emocional'] || '') > 50 ? "text-red-600" : "text-muted-foreground"
              )}>
                {countWords(data['gancho_emocional'] || '')}/50 palabras
              </span>
            </div>
            <Textarea
              id="gancho_emocional"
              value={data['gancho_emocional'] || ''}
              onChange={(e) => onChange('gancho_emocional', e.target.value)}
              placeholder="La oración que hará que el inversionista deje el celular..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>

      {/* ACTO II - RAZÓN */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            <span>ACTO II — RAZÓN</span>
            <span className="text-xs text-muted-foreground font-normal">(La lógica)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>¿Qué preguntas debe responder tu pitch?</Label>
            <div className="space-y-2">
              {PREGUNTAS_ACTO2.map((pregunta) => (
                <div key={pregunta.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={pregunta.id}
                    checked={selectedQuestions.includes(pregunta.id)}
                    onCheckedChange={(checked) => handleQuestionToggle(pregunta.id, checked as boolean)}
                  />
                  <Label htmlFor={pregunta.id} className="font-normal cursor-pointer">
                    {pregunta.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {orderedQuestions.length > 1 && (
            <div className="space-y-3">
              <Label>Ordena por importancia para TU pitch</Label>
              <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                {orderedQuestions.map((qId, index) => {
                  const question = PREGUNTAS_ACTO2.find(q => q.id === qId);
                  return question ? (
                    <div
                      key={qId}
                      className="flex items-center gap-3 p-2 bg-background rounded border"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-primary">{index + 1}.</span>
                      <span className="text-sm flex-1">{question.label}</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveQuestion(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveQuestion(index, 'down')}
                          disabled={index === orderedQuestions.length - 1}
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>

      {/* ACTO III - ACCIÓN */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>ACTO III — ACCIÓN</span>
            <span className="text-xs text-muted-foreground font-normal">(El cierre)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accion_provocar">¿Qué acción quieres provocar?</Label>
            <Textarea
              id="accion_provocar"
              value={data['accion_provocar'] || ''}
              onChange={(e) => onChange('accion_provocar', e.target.value)}
              placeholder="Agendar una segunda reunión, revisar el deck, presentarme a otro socio..."
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <Label>¿Qué emoción final quieres dejar?</Label>
            <Select
              value={data['emocion_final'] || ''}
              onValueChange={(value) => onChange('emocion_final', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una emoción" />
              </SelectTrigger>
              <SelectContent>
                {EMOCIONES_FINAL.map((emocion) => (
                  <SelectItem key={emocion.value} value={emocion.value}>
                    {emocion.emoji} {emocion.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Visual Arc Map */}
      {data['emocion_inicio'] && data['emocion_final'] && orderedQuestions.length > 0 && (
        <Card className="bg-gradient-to-r from-red-50 via-blue-50 to-yellow-50 dark:from-red-950/20 dark:via-blue-950/20 dark:to-yellow-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-center">Tu Arco Narrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              {/* Act I */}
              <div className="flex-1 text-center">
                <div className="text-2xl mb-1">{getSelectedEmocionInicio?.emoji}</div>
                <div className="text-xs font-medium text-red-600">ACTO I</div>
                <div className="text-xs text-muted-foreground">{getSelectedEmocionInicio?.label}</div>
              </div>
              
              <ArrowDown className="w-4 h-4 text-muted-foreground -rotate-90" />
              
              {/* Act II */}
              <div className="flex-1 text-center">
                <div className="text-2xl mb-1">🧠</div>
                <div className="text-xs font-medium text-blue-600">ACTO II</div>
                <div className="text-xs text-muted-foreground">{orderedQuestions.length} bloques</div>
              </div>
              
              <ArrowDown className="w-4 h-4 text-muted-foreground -rotate-90" />
              
              {/* Act III */}
              <div className="flex-1 text-center">
                <div className="text-2xl mb-1">{getSelectedEmocionFinal?.emoji}</div>
                <div className="text-xs font-medium text-yellow-600">ACTO III</div>
                <div className="text-xs text-muted-foreground">{getSelectedEmocionFinal?.label}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
