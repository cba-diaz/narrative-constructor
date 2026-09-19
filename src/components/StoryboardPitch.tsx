import { Pencil } from 'lucide-react';
import { blocks } from '@/data/blocks';
import { Button } from '@/components/ui/button';

interface StoryboardPitchProps {
  blockContents: Record<number, string>;
  onEditBlock: (blockNumber: number) => void;
}

function simplifyContent(content: string, maxWords = 38) {
  const normalized = content.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';

  const firstSentences = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [normalized];
  const sentenceSummary = firstSentences.slice(0, 2).join(' ').trim();
  const words = sentenceSummary.split(' ');

  if (words.length <= maxWords) return sentenceSummary;
  return `${words.slice(0, maxWords).join(' ')}…`;
}

export function StoryboardPitch({ blockContents, onEditBlock }: StoryboardPitchProps) {
  return (
    <section aria-labelledby="storyboard-title" className="mb-14 animate-fade-in">
      <div className="mb-6 flex flex-col gap-2 border-b-2 border-foreground pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-primary">Storyboard de Pitch de Película</p>
          <h2 id="storyboard-title" className="mt-1 text-3xl text-foreground sm:text-4xl">
            Tu historia, cuadro a cuadro
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground sm:text-right">
          Una lectura visual y simplificada de los nueve momentos de tu pitch.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {blocks.map((block) => {
          const content = blockContents[block.numero] ?? '';
          const summary = simplifyContent(content);

          return (
            <article
              key={block.numero}
              className="group relative flex min-h-72 flex-col overflow-hidden border-2 border-foreground bg-foreground p-5 text-background shadow-lg"
            >
              <div className="pointer-events-none absolute inset-2 border border-background/25" aria-hidden="true" />
              <div className="relative z-[1] mb-8 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-background/60 font-mono text-sm font-bold">
                    {String(block.numero).padStart(2, '0')}
                  </span>
                  <p className="text-xs font-semibold uppercase text-background/70">
                    {block.nombre}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditBlock(block.numero)}
                  className="relative z-[2] h-9 w-9 shrink-0 text-background/70 hover:bg-background/10 hover:text-background"
                  aria-label={`Editar bloque ${block.numero}: ${block.nombre}`}
                  title={`Editar ${block.nombre}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative z-[1] flex flex-1 items-center">
                {summary ? (
                  <p className="text-lg font-medium leading-relaxed text-background sm:text-xl">
                    {summary}
                  </p>
                ) : (
                  <p className="text-base italic text-background/55">
                    Este cuadro espera su escena.
                  </p>
                )}
              </div>

              <div className="relative z-[1] mt-8 flex items-end justify-between gap-3">
                <span className="bg-background px-3 py-1.5 font-display text-lg font-bold italic text-foreground shadow-md">
                  bloque {block.numero}
                </span>
                <span className="font-mono text-xs text-background/45">PDP · {block.numero}/9</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}