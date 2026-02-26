import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Search, MessageSquare, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

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


export function SuperpowerDetector({ data, onChange }: SuperpowerDetectorProps) {
  const [activeTab, setActiveTab] = useState('competidor');

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

  // Removed: generateSequence and copySequence (tab 4 eliminated)

  return (
    <div className="space-y-6">
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-sm text-primary font-medium">
          🛡️ Tu superpoder es lo que te hace diferente de verdad. Estos 3 módulos te ayudarán a encontrarlo y articularlo.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
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

      </Tabs>
    </div>
  );
}
