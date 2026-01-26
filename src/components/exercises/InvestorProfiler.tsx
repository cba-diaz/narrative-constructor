import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, User, Building2, Link, Briefcase, MessageSquare, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvestorProfilerProps {
  data: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
}

interface Investor {
  id: number;
  nombre: string;
  fondo: string;
  linkedin: string;
  background: string;
  sectores: string;
  publicaciones: string;
  founders_tipo: string;
  vocabulario: string;
  arquetipo: string;
}

const ARQUETIPOS = [
  { 
    value: 'don_vito', 
    label: '🎬 Don Vito (Empresario tradicional)',
    valora: 'Respeto, tradición, resultados probados, relaciones de largo plazo',
    lenguaje: 'Usa lenguaje directo, evita anglicismos, habla de "negocios sólidos"',
    ejemplo: 'En lugar de "runway", di "meses de operación". En lugar de "pivot", di "ajuste estratégico".'
  },
  { 
    value: 'tony_stark', 
    label: '🚀 Tony Stark (VC institucional)',
    valora: 'Innovación, escalabilidad, métricas de crecimiento, visión global',
    lenguaje: 'Domina jerga de startups, habla de CAC/LTV, cohorts, unit economics',
    ejemplo: 'Enfatiza tu "growth rate", "network effects" y cómo te comparas con "benchmarks" del sector.'
  },
  { 
    value: 'padrino', 
    label: '👨‍👩‍👧‍👦 Padrino Financiero (Family Office)',
    valora: 'Preservación de capital, estabilidad, impacto familiar, valores',
    lenguaje: 'Balance entre tradición y modernidad, enfatiza sostenibilidad',
    ejemplo: 'Habla del "legado" que estás construyendo y cómo cuidas el capital que te confían.'
  },
  { 
    value: 'agent_smith', 
    label: '🏢 Agent Smith (Corporate VC)',
    valora: 'Sinergias con la corporación, roadmap claro, compliance, procesos',
    lenguaje: 'Formal, enfocado en partnership estratégico y "win-win"',
    ejemplo: 'Enfatiza cómo tu solución complementa su "core business" y acelera su "digital transformation".'
  }
];

const VOCABULARIOS = [
  { value: 'tecnico', label: 'Técnico' },
  { value: 'tradicional', label: 'Tradicional' },
  { value: 'social', label: 'Social' },
  { value: 'mixto', label: 'Mixto' }
];

const parseInvestors = (data: Record<string, string>): Investor[] => {
  const investors: Investor[] = [];
  for (let i = 1; i <= 3; i++) {
    if (data[`inv_${i}_nombre`] || i === 1) {
      investors.push({
        id: i,
        nombre: data[`inv_${i}_nombre`] || '',
        fondo: data[`inv_${i}_fondo`] || '',
        linkedin: data[`inv_${i}_linkedin`] || '',
        background: data[`inv_${i}_background`] || '',
        sectores: data[`inv_${i}_sectores`] || '',
        publicaciones: data[`inv_${i}_publicaciones`] || '',
        founders_tipo: data[`inv_${i}_founders_tipo`] || '',
        vocabulario: data[`inv_${i}_vocabulario`] || '',
        arquetipo: data[`inv_${i}_arquetipo`] || ''
      });
    }
  }
  return investors.length > 0 ? investors : [{ id: 1, nombre: '', fondo: '', linkedin: '', background: '', sectores: '', publicaciones: '', founders_tipo: '', vocabulario: '', arquetipo: '' }];
};

export function InvestorProfiler({ data, onChange }: InvestorProfilerProps) {
  const investors = parseInvestors(data);
  const [activeTab, setActiveTab] = useState('1');

  const handleFieldChange = (investorId: number, field: string, value: string) => {
    onChange(`inv_${investorId}_${field}`, value);
  };

  const addInvestor = () => {
    const newId = investors.length + 1;
    if (newId <= 3) {
      onChange(`inv_${newId}_nombre`, '');
      setActiveTab(String(newId));
    }
  };

  const removeInvestor = (id: number) => {
    if (investors.length > 1) {
      // Clear all fields for this investor
      ['nombre', 'fondo', 'linkedin', 'background', 'sectores', 'publicaciones', 'founders_tipo', 'vocabulario', 'arquetipo'].forEach(field => {
        onChange(`inv_${id}_${field}`, '');
      });
      setActiveTab('1');
    }
  };

  const getSelectedArquetipo = (arquetipo: string) => 
    ARQUETIPOS.find(a => a.value === arquetipo);

  const getCompletedInvestors = () => 
    investors.filter(inv => inv.nombre && inv.arquetipo);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-sm text-primary font-medium">
          👥 Perfilar a tus inversionistas te permite adaptar tu lenguaje y énfasis. Puedes agregar hasta 3 perfiles.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            {investors.map((inv, idx) => (
              <TabsTrigger 
                key={inv.id} 
                value={String(inv.id)}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                {inv.nombre || `Inversionista ${idx + 1}`}
              </TabsTrigger>
            ))}
          </TabsList>
          {investors.length < 3 && (
            <Button variant="outline" size="sm" onClick={addInvestor}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          )}
        </div>

        {investors.map((investor) => (
          <TabsContent key={investor.id} value={String(investor.id)} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Datos Básicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`nombre_${investor.id}`}>Nombre</Label>
                    <Input
                      id={`nombre_${investor.id}`}
                      value={investor.nombre}
                      onChange={(e) => handleFieldChange(investor.id, 'nombre', e.target.value)}
                      placeholder="Nombre del inversionista"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`fondo_${investor.id}`}>Fondo/Empresa</Label>
                    <Input
                      id={`fondo_${investor.id}`}
                      value={investor.fondo}
                      onChange={(e) => handleFieldChange(investor.id, 'fondo', e.target.value)}
                      placeholder="Nombre del fondo o empresa"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`linkedin_${investor.id}`} className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    LinkedIn URL
                  </Label>
                  <Input
                    id={`linkedin_${investor.id}`}
                    type="url"
                    value={investor.linkedin}
                    onChange={(e) => handleFieldChange(investor.id, 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Research */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Investigación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`background_${investor.id}`}>Background profesional</Label>
                  <Textarea
                    id={`background_${investor.id}`}
                    value={investor.background}
                    onChange={(e) => handleFieldChange(investor.id, 'background', e.target.value)}
                    placeholder="¿De dónde viene? ¿Qué hizo antes de invertir?"
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`sectores_${investor.id}`}>Sectores financiados últimos 2 años</Label>
                  <Textarea
                    id={`sectores_${investor.id}`}
                    value={investor.sectores}
                    onChange={(e) => handleFieldChange(investor.id, 'sectores', e.target.value)}
                    placeholder="Fintech, EdTech, HealthTech..."
                    className="min-h-[60px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`publicaciones_${investor.id}`}>Qué publica en LinkedIn</Label>
                  <Textarea
                    id={`publicaciones_${investor.id}`}
                    value={investor.publicaciones}
                    onChange={(e) => handleFieldChange(investor.id, 'publicaciones', e.target.value)}
                    placeholder="Temas recurrentes, artículos compartidos, opiniones..."
                    className="min-h-[60px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`founders_tipo_${investor.id}`}>Tipo de founders con quienes se fotografía</Label>
                  <Textarea
                    id={`founders_tipo_${investor.id}`}
                    value={investor.founders_tipo}
                    onChange={(e) => handleFieldChange(investor.id, 'founders_tipo', e.target.value)}
                    placeholder="Jóvenes técnicos, ejecutivos corporativos, impacto social..."
                    className="min-h-[60px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Classification */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Clasificación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Vocabulario que usa</Label>
                  <RadioGroup
                    value={investor.vocabulario}
                    onValueChange={(value) => handleFieldChange(investor.id, 'vocabulario', value)}
                    className="flex flex-wrap gap-4"
                  >
                    {VOCABULARIOS.map((voc) => (
                      <div key={voc.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={voc.value} id={`voc_${investor.id}_${voc.value}`} />
                        <Label htmlFor={`voc_${investor.id}_${voc.value}`} className="font-normal cursor-pointer">
                          {voc.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Arquetipo detectado</Label>
                  <Select
                    value={investor.arquetipo}
                    onValueChange={(value) => handleFieldChange(investor.id, 'arquetipo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un arquetipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {ARQUETIPOS.map((arq) => (
                        <SelectItem key={arq.value} value={arq.value}>
                          {arq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {investor.arquetipo && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
                    <h4 className="font-medium text-primary">
                      {getSelectedArquetipo(investor.arquetipo)?.label}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Qué valora:</strong> {getSelectedArquetipo(investor.arquetipo)?.valora}</p>
                      <p><strong>Cómo adaptar tu lenguaje:</strong> {getSelectedArquetipo(investor.arquetipo)?.lenguaje}</p>
                      <p className="text-muted-foreground italic">
                        💡 {getSelectedArquetipo(investor.arquetipo)?.ejemplo}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {investors.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeInvestor(investor.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar este perfil
              </Button>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Analysis Summary */}
      {getCompletedInvestors().length > 0 && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Análisis de tus perfiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">
              Basado en {getCompletedInvestors().length === 1 ? 'tu perfil' : 'tus perfiles'}, tu pitch debería enfatizar:
            </p>
            <ul className="mt-2 space-y-1">
              {getCompletedInvestors().map(inv => {
                const arq = getSelectedArquetipo(inv.arquetipo);
                return arq ? (
                  <li key={inv.id} className="text-sm text-muted-foreground">
                    • <strong>{inv.nombre}</strong> ({arq.label.split(' ')[0]}): {arq.valora.split(',')[0]}
                  </li>
                ) : null;
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
