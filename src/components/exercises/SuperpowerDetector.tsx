import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Search, MessageSquare, Wand2, AlertTriangle, Copy, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SuperpowerDetectorProps {
  data: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
}

const FRASES_FALSAS = [
  { id: 'baratos', label: '"Somos más baratos"', warning: 'El precio se copia en una semana' },
  { id: 'ia', label: '"Usamos IA"', warning: 'También Netflix y el filtro de spam' },
  { id: 'servicio', label: '"Mejor servicio al cliente"', warning: 'Todos dicen eso' },
  { id: 'rapidos', label: '"Somos más rápidos"', warning: '¿Cuánto más? ¿Por qué no te alcanzan?' },
  { id: 'tecnologia', label: '"Tecnología superior"', warning: 'Demuéstralo con resultados' },
];

const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export function SuperpowerDetector({ data, onChange }: SuperpowerDetectorProps) {
  const [activeTab, setActiveTab] = useState('competidor');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const selectedFrases = (data['frases_falsas'] || '').split(',').filter(Boolean);

  const handleFraseToggle = (fraseId: string, checked: boolean) => {
    let newSelected = [...selectedFrases];
    if (checked) {
      newSelected.push(fraseId);
    } else {
      newSelected = newSelected.filter(f => f !== fraseId);
    }
    onChange('frases_falsas', newSelected.join(','));
  };

  const runCompetitorTest = () => {
    const diff = data['diferenciacion'] || '';
    const comp = data['competidor_nombre'] || '[COMPETIDOR]';
    const result = diff.replace(/nosotros|nuestra empresa|nuestro producto/gi, comp);
    onChange('test_resultado', result);
  };

  const generateSequence = () => {
    const tipo_cliente = data['seq_tipo_cliente'] || '[tipo de cliente]';
    const resultado = data['seq_resultado'] || '[resultado]';
    const obstaculo = data['seq_obstaculo'] || '[obstáculo]';
    const comp1 = data['seq_competidor_1'] || '[competidor 1]';
    const comp1_falla = data['seq_comp1_falla'] || '[razón]';
    const comp2 = data['seq_competidor_2'] || '[competidor 2]';
    const comp2_falla = data['seq_comp2_falla'] || '[razón]';
    const accion = data['seq_accion'] || '[acción]';
    const recurso = data['seq_recurso'] || '[recurso único]';
    const resultado_esp = data['seq_resultado_esp'] || '[resultado específico]';
    const metrica = data['seq_metrica'] || '[métrica]';
    const benchmark = data['seq_benchmark'] || '[benchmark]';

    const sequence = `Mis ${tipo_cliente} necesitan ${resultado} pero actualmente ${obstaculo}.

La opción A (${comp1}) falla porque ${comp1_falla}. La opción B (${comp2}) falla porque ${comp2_falla}.

Nosotros ${accion} usando ${recurso} que ${resultado_esp}.

Esto se traduce en ${metrica} versus ${benchmark}.`;

    onChange('secuencia_generada', sequence);
    toast({
      title: "Secuencia generada",
      description: `${countWords(sequence)} palabras`,
    });
  };

  const copySequence = () => {
    if (data['secuencia_generada']) {
      navigator.clipboard.writeText(data['secuencia_generada']);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-sm text-primary font-medium">
          🛡️ Tu superpoder es lo que te hace diferente de verdad. Estos 4 módulos te ayudarán a encontrarlo y articularlo.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="competidor" className="text-xs">
            <Shield className="w-4 h-4 mr-1 hidden sm:inline" />
            Test
          </TabsTrigger>
          <TabsTrigger value="frases" className="text-xs">
            <Search className="w-4 h-4 mr-1 hidden sm:inline" />
            Frases
          </TabsTrigger>
          <TabsTrigger value="porques" className="text-xs">
            <MessageSquare className="w-4 h-4 mr-1 hidden sm:inline" />
            3 Por Qués
          </TabsTrigger>
          <TabsTrigger value="secuencia" className="text-xs">
            <Wand2 className="w-4 h-4 mr-1 hidden sm:inline" />
            Generador
          </TabsTrigger>
        </TabsList>

        {/* MODULE 1: Competitor Test */}
        <TabsContent value="competidor" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Test del Competidor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Si intercambias tu nombre por el de un competidor y la frase sigue teniendo sentido, tu diferenciación es genérica.
              </p>

              <div className="space-y-2">
                <Label htmlFor="diferenciacion">Tu diferenciación actual</Label>
                <Textarea
                  id="diferenciacion"
                  value={data['diferenciacion'] || ''}
                  onChange={(e) => onChange('diferenciacion', e.target.value)}
                  placeholder="Nosotros somos los únicos que..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competidor_nombre">Nombre de tu competidor principal</Label>
                <Input
                  id="competidor_nombre"
                  value={data['competidor_nombre'] || ''}
                  onChange={(e) => onChange('competidor_nombre', e.target.value)}
                  placeholder="Coursera, Rappi, etc."
                />
              </div>

              <Button onClick={runCompetitorTest} variant="outline" className="w-full">
                Ejecutar test
              </Button>

              {data['test_resultado'] && (
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Tu frase con nombre intercambiado:</p>
                    <p className="text-sm italic">"{data['test_resultado']}"</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Veredicto:</Label>
                    <div className="flex gap-3">
                      <Button
                        variant={data['test_veredicto'] === 'generica' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onChange('test_veredicto', 'generica')}
                        className={data['test_veredicto'] === 'generica' ? 'bg-red-500 hover:bg-red-600' : ''}
                      >
                        Genérica
                      </Button>
                      <Button
                        variant={data['test_veredicto'] === 'diferenciada' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onChange('test_veredicto', 'diferenciada')}
                        className={data['test_veredicto'] === 'diferenciada' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        Diferenciada
                      </Button>
                    </div>
                  </div>

                  {data['test_veredicto'] === 'generica' && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Si un competidor puede decir lo mismo, no es una diferenciación real. Profundiza en los otros módulos.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* MODULE 2: False Phrases */}
        <TabsContent value="frases" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="w-5 h-5 text-yellow-500" />
                Detector de Frases Falsas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Marca las frases que usas o has considerado usar. Si marcas alguna, justifica por qué no te copiarían.
              </p>

              <div className="space-y-4">
                {FRASES_FALSAS.map((frase) => {
                  const isChecked = selectedFrases.includes(frase.id);
                  return (
                    <div key={frase.id} className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={frase.id}
                          checked={isChecked}
                          onCheckedChange={(checked) => handleFraseToggle(frase.id, checked as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor={frase.id} className="font-normal cursor-pointer">
                            {frase.label}
                          </Label>
                          {isChecked && (
                            <p className="text-xs text-red-600">⚠️ {frase.warning}</p>
                          )}
                        </div>
                      </div>
                      {isChecked && (
                        <Textarea
                          value={data[`frase_${frase.id}_justif`] || ''}
                          onChange={(e) => onChange(`frase_${frase.id}_justif`, e.target.value)}
                          placeholder="¿Por qué no te copian en 6 meses?"
                          className="ml-6 min-h-[60px]"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MODULE 3: 3 Client Whys */}
        <TabsContent value="porques" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" />
                Los 3 Por Qués del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Profundiza en lo que dicen tus clientes para encontrar tu diferenciación real.
              </p>

              {[1, 2, 3].map((num) => (
                <div key={num} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor={`cliente_dice_${num}`}>Lo que dice el cliente #{num}</Label>
                    <Input
                      id={`cliente_dice_${num}`}
                      value={data[`cliente_dice_${num}`] || ''}
                      onChange={(e) => onChange(`cliente_dice_${num}`, e.target.value)}
                      placeholder='"Me ahorra mucho tiempo"'
                    />
                  </div>
                  <div className="ml-4 space-y-2 border-l-2 border-primary/30 pl-4">
                    <div className="space-y-1">
                      <Label htmlFor={`pq_${num}_1`} className="text-xs text-muted-foreground">¿Por qué importa?</Label>
                      <Input
                        id={`pq_${num}_1`}
                        value={data[`pq_${num}_1`] || ''}
                        onChange={(e) => onChange(`pq_${num}_1`, e.target.value)}
                        placeholder="Porque puedo hacer más entregas"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`pq_${num}_2`} className="text-xs text-muted-foreground">¿Por qué importa eso?</Label>
                      <Input
                        id={`pq_${num}_2`}
                        value={data[`pq_${num}_2`] || ''}
                        onChange={(e) => onChange(`pq_${num}_2`, e.target.value)}
                        placeholder="Porque gano más dinero"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`pq_${num}_3`} className="text-xs text-muted-foreground flex items-center gap-2">
                        ¿Por qué importa eso?
                        <span className="text-primary font-medium">← Tu diferenciación real</span>
                      </Label>
                      <Input
                        id={`pq_${num}_3`}
                        value={data[`pq_${num}_3`] || ''}
                        onChange={(e) => onChange(`pq_${num}_3`, e.target.value)}
                        placeholder="Porque puedo mantener a mi familia"
                        className="text-sm border-primary/50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* MODULE 4: Sequence Generator */}
        <TabsContent value="secuencia" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-500" />
                Generador de Secuencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Completa el mad-lib para generar tu párrafo de superpoder.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seq_tipo_cliente">Mis...</Label>
                  <Input
                    id="seq_tipo_cliente"
                    value={data['seq_tipo_cliente'] || ''}
                    onChange={(e) => onChange('seq_tipo_cliente', e.target.value)}
                    placeholder="tipo de cliente"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seq_resultado">...necesitan</Label>
                  <Input
                    id="seq_resultado"
                    value={data['seq_resultado'] || ''}
                    onChange={(e) => onChange('seq_resultado', e.target.value)}
                    placeholder="resultado que buscan"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seq_obstaculo">...pero actualmente</Label>
                <Input
                  id="seq_obstaculo"
                  value={data['seq_obstaculo'] || ''}
                  onChange={(e) => onChange('seq_obstaculo', e.target.value)}
                  placeholder="obstáculo principal"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seq_competidor_1">La opción A</Label>
                  <Input
                    id="seq_competidor_1"
                    value={data['seq_competidor_1'] || ''}
                    onChange={(e) => onChange('seq_competidor_1', e.target.value)}
                    placeholder="Competidor 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seq_comp1_falla">...falla porque</Label>
                  <Input
                    id="seq_comp1_falla"
                    value={data['seq_comp1_falla'] || ''}
                    onChange={(e) => onChange('seq_comp1_falla', e.target.value)}
                    placeholder="razón"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seq_competidor_2">La opción B</Label>
                  <Input
                    id="seq_competidor_2"
                    value={data['seq_competidor_2'] || ''}
                    onChange={(e) => onChange('seq_competidor_2', e.target.value)}
                    placeholder="Competidor 2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seq_comp2_falla">...falla porque</Label>
                  <Input
                    id="seq_comp2_falla"
                    value={data['seq_comp2_falla'] || ''}
                    onChange={(e) => onChange('seq_comp2_falla', e.target.value)}
                    placeholder="razón"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seq_accion">Nosotros</Label>
                  <Input
                    id="seq_accion"
                    value={data['seq_accion'] || ''}
                    onChange={(e) => onChange('seq_accion', e.target.value)}
                    placeholder="acción que hacemos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seq_recurso">...usando</Label>
                  <Input
                    id="seq_recurso"
                    value={data['seq_recurso'] || ''}
                    onChange={(e) => onChange('seq_recurso', e.target.value)}
                    placeholder="recurso único"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seq_resultado_esp">...que</Label>
                <Input
                  id="seq_resultado_esp"
                  value={data['seq_resultado_esp'] || ''}
                  onChange={(e) => onChange('seq_resultado_esp', e.target.value)}
                  placeholder="resultado específico"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seq_metrica">Esto se traduce en</Label>
                  <Input
                    id="seq_metrica"
                    value={data['seq_metrica'] || ''}
                    onChange={(e) => onChange('seq_metrica', e.target.value)}
                    placeholder="tu métrica"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seq_benchmark">...versus</Label>
                  <Input
                    id="seq_benchmark"
                    value={data['seq_benchmark'] || ''}
                    onChange={(e) => onChange('seq_benchmark', e.target.value)}
                    placeholder="benchmark/comparación"
                  />
                </div>
              </div>

              <Button onClick={generateSequence} className="w-full" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Generar párrafo
              </Button>

              {data['secuencia_generada'] && (
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-purple-800 dark:text-purple-200">
                        Tu secuencia de superpoder
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={copySequence}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={data['secuencia_generada']}
                      onChange={(e) => onChange('secuencia_generada', e.target.value)}
                      className="min-h-[120px] bg-white/50 dark:bg-background/50"
                    />
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
