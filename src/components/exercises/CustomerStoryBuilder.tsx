import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Zap, Sparkles, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CustomerStoryBuilderProps {
  data: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
  protagonistData?: {
    nombre: string;
    contexto: string;
    frustracion: string;
  };
}

const DIAS_SEMANA = [
  { value: 'lunes', label: 'Lunes' },
  { value: 'martes', label: 'Martes' },
  { value: 'miercoles', label: 'Miércoles' },
  { value: 'jueves', label: 'Jueves' },
  { value: 'viernes', label: 'Viernes' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
];


const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export function CustomerStoryBuilder({ data, onChange, protagonistData }: CustomerStoryBuilderProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Pre-fill protagonist data from Section 1 if available and fields are empty
  useEffect(() => {
    if (protagonistData?.nombre && !data['cliente_nombre']) {
      onChange('cliente_nombre', protagonistData.nombre);
    }
    if (protagonistData?.contexto && !data['cliente_contexto']) {
      onChange('cliente_contexto', protagonistData.contexto);
    }
    if (protagonistData?.frustracion && !data['cliente_problema']) {
      onChange('cliente_problema', protagonistData.frustracion);
    }
  }, [protagonistData]);

  const generateStory = () => {
    const parts: string[] = [];
    
    // Part 1: The client
    if (data['cliente_nombre']) {
      parts.push(`${data['cliente_nombre']}`);
      if (data['cliente_contexto']) {
        parts.push(`de ${data['cliente_contexto']}`);
      }
      if (data['cliente_problema']) {
        parts.push(`enfrentaba un problema grave: ${data['cliente_problema']}.`);
      }
    }

    // Part 2: The disaster
    if (data['dia_desastre'] && data['hora_desastre']) {
      const dia = DIAS_SEMANA.find(d => d.value === data['dia_desastre'])?.label || data['dia_desastre'];
      parts.push(`Un ${dia} a las ${data['hora_desastre']},`);
    }
    if (data['que_paso']) {
      parts.push(`${data['que_paso']}.`);
    }
    if (data['costo_incidente']) {
      parts.push(`Ese incidente le costó $${data['costo_incidente']}.`);
    }

    // Part 3: The transformation
    if (data['que_cambio']) {
      parts.push(`Hoy, con nuestra solución, ${data['que_cambio']}.`);
    }
    if (data['tiempo_ahorrado']) {
      parts.push(`Ahorra ${data['tiempo_ahorrado']} horas.`);
    }
    if (data['dinero_ahorrado']) {
      parts.push(`Y ha recuperado $${data['dinero_ahorrado']}.`);
    }

    const story = parts.join(' ').replace(/\s+/g, ' ').trim();
    onChange('historia_generada', story);
    
    toast({
      title: "Historia generada",
      description: `${countWords(story)} palabras`,
    });
  };

  const copyStory = () => {
    if (data['historia_generada']) {
      navigator.clipboard.writeText(data['historia_generada']);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copiado al portapapeles",
      });
    }
  };

  const wordCount = countWords(data['historia_generada'] || '');
  const isInRange = wordCount >= 80 && wordCount <= 120;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-sm text-primary font-medium">
          👤 Construye la historia de transformación de un cliente real. Los inversionistas recuerdan historias, no estadísticas.
        </p>
      </div>

      {/* PART 1: The Client */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            PARTE 1 — El Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente_nombre">Nombre del cliente</Label>
              <Input
                id="cliente_nombre"
                value={data['cliente_nombre'] || ''}
                onChange={(e) => onChange('cliente_nombre', e.target.value)}
                placeholder="María, Carlos, La Empresa X..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cliente_contexto">Empresa/Contexto</Label>
              <Input
                id="cliente_contexto"
                value={data['cliente_contexto'] || ''}
                onChange={(e) => onChange('cliente_contexto', e.target.value)}
                placeholder="Gerente de logística en Distribuidora XYZ"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cliente_problema">Su mayor problema antes de conocerte</Label>
            <Textarea
              id="cliente_problema"
              value={data['cliente_problema'] || ''}
              onChange={(e) => onChange('cliente_problema', e.target.value)}
              placeholder="Pasaba 4 horas diarias coordinando entregas manualmente..."
              className="min-h-[80px]"
            />
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-3">Cuantifica el dolor:</p>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input
                  type="text"
                  value={data['dinero_perdido'] || ''}
                  onChange={(e) => onChange('dinero_perdido', e.target.value)}
                  placeholder="1,800,000"
                  className="flex-1"
                />
                <Input
                  type="text"
                  value={data['unidad_dinero'] || ''}
                  onChange={(e) => onChange('unidad_dinero', e.target.value)}
                  placeholder="por startup, por mes, por cliente..."
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={data['tiempo_perdido'] || ''}
                  onChange={(e) => onChange('tiempo_perdido', e.target.value)}
                  placeholder="80"
                  className="w-24"
                />
                <Input
                  type="text"
                  value={data['unidad_tiempo'] || ''}
                  onChange={(e) => onChange('unidad_tiempo', e.target.value)}
                  placeholder="horas por ronda, minutos por día..."
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Usa cualquier unidad que tenga sentido: "por startup", "por ronda", "por cliente", etc.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PART 2: The Disaster Day */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-500" />
            PARTE 2 — El Día del Desastre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>¿Qué día de la semana?</Label>
              <Select
                value={data['dia_desastre'] || ''}
                onValueChange={(value) => onChange('dia_desastre', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un día" />
                </SelectTrigger>
                <SelectContent>
                  {DIAS_SEMANA.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora_desastre">¿A qué hora ocurrió?</Label>
              <Input
                id="hora_desastre"
                type="time"
                value={data['hora_desastre'] || ''}
                onChange={(e) => onChange('hora_desastre', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="que_paso">¿Qué pasó exactamente?</Label>
            <Textarea
              id="que_paso"
              value={data['que_paso'] || ''}
              onChange={(e) => onChange('que_paso', e.target.value)}
              placeholder="El sistema se cayó justo cuando tenía 50 entregas pendientes..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="costo_incidente">¿Cuánto costó ese incidente?</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">$</span>
              <Input
                id="costo_incidente"
                type="number"
                value={data['costo_incidente'] || ''}
                onChange={(e) => onChange('costo_incidente', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PART 3: The Perfect Day */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-500" />
            PARTE 3 — El Día Perfecto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="que_cambio">Mismo cliente, misma situación. ¿Qué cambió con tu producto?</Label>
            <Textarea
              id="que_cambio"
              value={data['que_cambio'] || ''}
              onChange={(e) => onChange('que_cambio', e.target.value)}
              placeholder="Ahora todo se coordina automáticamente. En 5 minutos tiene la ruta optimizada..."
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tiempo_ahorrado">Tiempo ahorrado</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="tiempo_ahorrado"
                  value={data['tiempo_ahorrado'] || ''}
                  onChange={(e) => onChange('tiempo_ahorrado', e.target.value)}
                  placeholder="3.5 horas/día"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dinero_ahorrado">Dinero ahorrado</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input
                  id="dinero_ahorrado"
                  value={data['dinero_ahorrado'] || ''}
                  onChange={(e) => onChange('dinero_ahorrado', e.target.value)}
                  placeholder="15,000/mes"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PART 4: The 3 Steps (Obi-Wan) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            PARTE 4 — Los 3 Pasos de Obi-Wan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Como Obi-Wan entrenando a Luke, tu solución debe mostrarse en progresión.
          </p>
          <div className="space-y-2">
            <Label htmlFor="reveal">EL REVEAL: ¿Cuál es el 'wow' inmediato?</Label>
            <Textarea
              id="reveal"
              value={data['reveal'] || ''}
              onChange={(e) => onChange('reveal', e.target.value)}
              placeholder="En 47 segundos tiene las 40 rutas optimizadas"
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transformacion">LA TRANSFORMACIÓN: ¿Qué experimenta paso a paso?</Label>
            <Textarea
              id="transformacion"
              value={data['transformacion'] || ''}
              onChange={(e) => onChange('transformacion', e.target.value)}
              placeholder="Primero elige su carrera, luego estudia módulos de 45 min, después hace prácticas reales..."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vision">LA VISIÓN: ¿Cómo se ve el futuro en 6-12-24 meses?</Label>
            <Textarea
              id="vision"
              value={data['vision'] || ''}
              onChange={(e) => onChange('vision', e.target.value)}
              placeholder="En 12 semanas tiene certificación, en 6 meses ya tiene experiencia, en 1 año está capacitando a otros"
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Generator */}
      <div className="space-y-4">
        <Button onClick={generateStory} className="w-full" size="lg">
          <Sparkles className="w-4 h-4 mr-2" />
          Generar historia para Pitch Kit
        </Button>

        {data['historia_generada'] && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-green-800 dark:text-green-200">
                  Tu historia generada
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded",
                    isInRange 
                      ? "bg-green-200 text-green-800" 
                      : "bg-yellow-200 text-yellow-800"
                  )}>
                    {wordCount} palabras
                  </span>
                  <Button variant="ghost" size="sm" onClick={copyStory}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={data['historia_generada']}
                onChange={(e) => onChange('historia_generada', e.target.value)}
                className="min-h-[120px] bg-white/50 dark:bg-background/50"
              />
              {!isInRange && (
                <p className="text-xs text-yellow-600 mt-2">
                  💡 El bloque ideal tiene entre 80-120 palabras. Puedes editar la historia arriba.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
