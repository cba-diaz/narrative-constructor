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
            {reduction.max_8 && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Tu frase de 8 palabras</span>
                </div>
                <p className="text-sm font-medium text-foreground italic">"{reduction.max_8}"</p>
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
            {(story.que_cambio || story.primer_momento) && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-success" />
                  <span className="font-medium text-sm">La transformación</span>
                </div>
                {story.que_cambio && (
                  <p className="text-sm text-muted-foreground mb-1 line-clamp-2">
                    <span className="text-success font-medium">Después:</span> {story.que_cambio}
                  </p>
                )}
                {story.primer_momento && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    <span className="text-primary font-medium">Primer uso:</span> {story.primer_momento}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      }

      case 3: {
        const superpower = exercisesData['3_1'] || {};
        return (
          <div className="space-y-3">
            {superpower.diferenciacion && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-xs font-medium text-foreground mb-1">Tu diferenciación</p>
                <p className="text-sm text-muted-foreground italic line-clamp-3">"{superpower.diferenciacion}"</p>
                {superpower.test_veredicto === 'diferenciada' && (
                  <p className="text-xs text-success font-medium mt-2">✓ Pasó el test del competidor</p>
                )}
              </div>
            )}
            {superpower.competidor_nombre && (
              <div className="p-2 rounded bg-background border border-border">
                <p className="text-xs font-medium text-foreground">Tu competidor principal</p>
                <p className="text-xs text-muted-foreground mt-0.5">{superpower.competidor_nombre}</p>
              </div>
            )}
          </div>
        );
      }

      case 4: {
        const traccion = exercisesData['4_1'] || {};
        return (
          <div className="space-y-3">
            {traccion.numero_hoy && (
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-2xl font-bold text-primary">{traccion.numero_hoy}</p>
                <p className="text-xs text-muted-foreground mt-1">{traccion.tipo_metrica || 'métrica principal'} hoy</p>
                {traccion.crecimiento && <p className="text-sm font-medium text-success mt-1">↑ {traccion.crecimiento} de crecimiento</p>}
              </div>
            )}
            {['hito_1','hito_2','hito_3'].map((h) => traccion[`${h}_fecha`] ? (
              <div key={h} className="p-2 rounded bg-background border border-border">
                <p className="text-xs font-medium text-foreground">{traccion[`${h}_fecha`]} · {traccion[`${h}_metrica`]}</p>
                {traccion[`${h}_contexto`] && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{traccion[`${h}_contexto`]}</p>}
              </div>
            ) : null)}
          </div>
        );
      }

      case 5: {
        const mercado = exercisesData['5_1'] || {};
        const competencia = exercisesData['5_2'] || {};
        return (
          <div className="space-y-3">
            {[
              { label: '🎯 Donde operas', value: mercado.circulo_1 },
              { label: '📈 Próxima expansión', value: mercado.circulo_2 },
              { label: '🌎 Visión regional', value: mercado.circulo_3 },
            ].filter(c => c.value).map((c) => (
              <div key={c.label} className="p-2 rounded bg-background border border-border">
                <p className="text-xs font-medium text-foreground">{c.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.value}</p>
              </div>
            ))}
            {competencia.competidor_principal && (
              <div className="p-2 rounded bg-background border border-border">
                <p className="text-xs font-medium text-foreground">⚔️ Vs. {competencia.competidor_principal}</p>
                {competencia.tu_ventaja && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{competencia.tu_ventaja}</p>}
              </div>
            )}
          </div>
        );
      }

      case 6: {
        const modelo = exercisesData['6_1'] || {};
        const unitEcon = exercisesData['6_2'] || {};
        return (
          <div className="space-y-3">
            {(modelo.cliente || modelo.precio) && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-xs font-medium text-foreground mb-1">Tu mecanismo básico</p>
                {modelo.cliente && <p className="text-xs text-muted-foreground">Paga: {modelo.cliente}</p>}
                {modelo.precio && <p className="text-xs text-muted-foreground">Precio: {modelo.precio} · {modelo.frecuencia}</p>}
              </div>
            )}
            {unitEcon.ratio && (
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-2xl font-bold text-primary">{unitEcon.ratio}</p>
                <p className="text-xs text-muted-foreground mt-1">ratio LTV/CAC</p>
                {unitEcon.ratio_contexto && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{unitEcon.ratio_contexto}</p>
                )}
              </div>
            )}
            {unitEcon.escala_sin_costo && (
              <div className="p-2 rounded bg-background border border-border">
                <p className="text-xs font-medium text-foreground">Escalabilidad</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{unitEcon.escala_sin_costo}</p>
              </div>
            )}
          </div>
        );
      }

      case 7: {
        const peticion = exercisesData['7_1'] || {};
        return (
          <div className="space-y-3">
            {peticion.monto && (
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-2xl font-bold text-primary">{peticion.monto}</p>
                <p className="text-xs text-muted-foreground mt-1">levantamiento</p>
              </div>
            )}
            {['cat_1','cat_2','cat_3'].map((c) => peticion[`${c}_nombre`] ? (
              <div key={c} className="p-2 rounded bg-background border border-border flex items-center justify-between">
                <p className="text-xs text-foreground">{peticion[`${c}_nombre`]}</p>
                <p className="text-xs font-bold text-primary">{peticion[`${c}_porcentaje`]}</p>
              </div>
            ) : null)}
            {peticion.metrica_1 && (
              <div className="p-2 rounded bg-background border border-border">
                <p className="text-xs font-medium text-foreground">En 18 meses</p>
                {['metrica_1','metrica_2','metrica_3'].filter(m => peticion[m]).map(m => (
                  <p key={m} className="text-xs text-muted-foreground">· {peticion[m]}</p>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 8: {
        const equipo = exercisesData['8_1'] || {};
        const complemento = exercisesData['8_2'] || {};
        return (
          <div className="space-y-3">
            {[
              { nombre: equipo.fundador_1_nombre, rol: equipo.fundador_1_rol, habilidad: equipo.fundador_1_superpoder },
              { nombre: equipo.fundador_2_nombre, rol: equipo.fundador_2_rol, habilidad: equipo.fundador_2_superpoder },
              { nombre: equipo.fundador_3_nombre, rol: equipo.fundador_3_rol, habilidad: equipo.fundador_3_superpoder },
            ].filter(f => f.nombre).map((f, i) => (
              <div key={i} className="p-2 rounded bg-background border border-border">
                <p className="text-xs font-medium text-foreground">{f.nombre} · {f.rol}</p>
                {f.habilidad && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{f.habilidad}</p>}
              </div>
            ))}
            {complemento.complementariedad && (
              <div className="p-2 rounded bg-background border border-border">
                <p className="text-xs font-medium text-foreground">Por qué funcionan juntos</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{complemento.complementariedad}</p>
              </div>
            )}
          </div>
        );
      }

      case 9: {
        const cierre = exercisesData['9_1'] || {};
        return (
          <div className="space-y-3">
            {protagonistData?.nombre && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-xs font-medium text-foreground">Tu protagonista</p>
                <p className="text-sm font-bold text-primary mt-1">{protagonistData.nombre}</p>
                {cierre.protagonista_hoy && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cierre.protagonista_hoy}</p>}
              </div>
            )}
            {cierre.mundo_diferente && (
              <div className="p-2 rounded bg-background border border-border">
                <p className="text-xs font-medium text-foreground">Tu visión del mundo</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-3">{cierre.mundo_diferente}</p>
              </div>
            )}
            {cierre.siguiente_paso && (
              <div className="p-2 rounded bg-background border border-border">
                <p className="text-xs font-medium text-foreground">Llamado a la acción</p>
                <p className="text-xs text-muted-foreground mt-0.5">{cierre.siguiente_paso}</p>
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
            <p className="text-xs text-muted-foreground mb-3">Lo que preparaste en los ejercicios:</p>
            {entries.slice(0, 6).map(([key, value]) => (
              <div key={key} className="p-2 rounded bg-background border border-border">
                <p className="text-xs text-foreground line-clamp-2">{value}</p>
              </div>
            ))}
            {entries.length > 6 && (
              <p className="text-xs text-muted-foreground">
                +{entries.length - 6} respuestas más guardadas
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
