import { blocks } from "@/data/blocks";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Eye, RotateCcw, Package, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface HubPageProps {
  userName: string;
  startupName: string;
  completedBlocks: number[];
  currentBlock: number;
  pitchKitCount: number;
  pitchKitSavedBlocks: number[];
  blockContents: Record<number, string>;
  onSelectBlock: (blockNumber: number) => void;
  onViewPitch: () => void;
  onReset: () => void;
}

export function HubPage({
  userName,
  startupName,
  completedBlocks,
  currentBlock,
  pitchKitCount,
  pitchKitSavedBlocks,
  blockContents,
  onSelectBlock,
  onViewPitch,
  onReset,
}: HubPageProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const hasDraft = (blockNumber: number) => {
    return blockContents[blockNumber] && blockContents[blockNumber].trim().length > 0;
  };

  const getBlockStatus = (blockNumber: number) => {
    if (completedBlocks.includes(blockNumber)) return "completed";

    // Find the first incomplete block to highlight as "current"
    const firstIncomplete = blocks.find((b) => !completedBlocks.includes(b.numero))?.numero || 1;
    if (blockNumber === firstIncomplete) return "current";

    if (hasDraft(blockNumber)) return "draft";

    return "available";
  };

  const getNextBlock = () => {
    for (let i = 1; i <= 9; i++) {
      if (!completedBlocks.includes(i)) return i;
    }
    return null;
  };

  const handleBlockClick = (blockNumber: number) => {
    onSelectBlock(blockNumber);
  };

  const completionPercentage = (completedBlocks.length / 9) * 100;
  const nextBlock = getNextBlock();

  const ACTOS = [
    { titulo: "Acto I", tono: "Emoción", nums: [1, 2, 3], c: "c0" },
    { titulo: "Acto II", tono: "Razón", nums: [4, 5, 6], c: "c1" },
    { titulo: "Acto III", tono: "Emoción", nums: [7, 8, 9], c: "c2" },
  ];
  const actoDe = (n: number) => (n <= 3 ? "c0" : n <= 6 ? "c1" : "c2");
  const palabrasDe = (n: number) =>
    (blockContents[n] || "")
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
  const dos = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="pdp-hub">
      <div className="pdp-grain" aria-hidden="true" />
      <header className="pdp-hub-top">
        <a href="https://pitchdepelicula.com" className="pdp-hub-logo">
          <span className="pdp-p">P</span>
          Pitch de Película
        </a>
        <button onClick={handleSignOut} className="pdp-hub-salir">
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </header>

      <main className="pdp-hub-wrap animate-fade-in">
        <section className="pdp-clap pdp-hub-clap" aria-label="Ficha del pitch">
          <div className="pdp-clap-stick" />
          <div className="pdp-clap-board">
            <div className="pdp-clap-row">
              <span>Prod.</span>
              <b>{startupName || "Tu startup"}</b>
            </div>
            <div className="pdp-clap-grid cuatro">
              <div>
                <span>Director</span>
                <b>{userName}</b>
              </div>
              <div>
                <span>Escena</span>
                <b>{nextBlock ? "Bloque " + nextBlock : "Final"}</b>
              </div>
              <div>
                <span>Rodado</span>
                <b>{completedBlocks.length}/9</b>
              </div>
              <div>
                <span>Pitch Kit</span>
                <b>{pitchKitCount}/9</b>
              </div>
            </div>
          </div>
        </section>

        <p className="pdp-hub-nota">
          {completedBlocks.length === 9
            ? "Tu pitch está completo, " + userName + ". Léelo en voz alta antes de presentar."
            : completedBlocks.length > 0
              ? "Llevas " + completedBlocks.length + " de 9 bloques. Sigue con el bloque " + nextBlock + "."
              : "Empieza por el bloque 1. Son nueve bloques en tres actos."}
        </p>

        <div className="pdp-strip" aria-label={completedBlocks.length + " de 9 bloques escritos"}>
          {blocks.map((b) => {
            const st = getBlockStatus(b.numero);
            return (
              <button
                key={b.numero}
                onClick={() => handleBlockClick(b.numero)}
                title={b.nombre}
                className={cn(
                  "pdp-frame",
                  st === "completed" && actoDe(b.numero),
                  st === "current" && "actual",
                  st === "draft" && "borrador",
                )}
              >
                {dos(b.numero)}
              </button>
            );
          })}
        </div>

        {ACTOS.map((acto) => (
          <section key={acto.titulo} className="pdp-acto">
            <div className="pdp-acto-head">
              <span className={"pdp-acto-tag " + acto.c}>{acto.titulo}</span>
              <h2>{acto.tono}</h2>
              <span className="pdp-acto-rango">
                Bloques {acto.nums[0]} a {acto.nums[2]}
              </span>
            </div>
            <div className="pdp-paneles">
              {acto.nums.map((n) => {
                const block = blocks.find((b) => b.numero === n);
                if (!block) return null;
                const st = getBlockStatus(n);
                const pal = palabrasDe(n);
                const enRango = pal >= block.palabrasMin && pal <= block.palabrasMax;
                return (
                  <button key={n} onClick={() => handleBlockClick(n)} className={cn("pdp-panel", st, acto.c)}>
                    <span className="pdp-panel-top">
                      <span>Panel {dos(n)}</span>
                      {pitchKitSavedBlocks.includes(n) && <span className="pdp-panel-kit">En el Kit</span>}
                    </span>
                    <span className="pdp-panel-nombre">{block.nombre}</span>
                    <span className="pdp-panel-pregunta">{block.pregunta}</span>
                    <span className="pdp-panel-pie">
                      {st === "completed"
                        ? pal + " palabras"
                        : st === "draft"
                          ? "Borrador a medias"
                          : st === "current"
                            ? "Siguiente toma"
                            : block.palabrasMin + " a " + block.palabrasMax + " palabras"}
                    </span>
                    {st === "completed" && (
                      <span className={cn("pdp-sello", !enRango && "otra")}>
                        {enRango ? "Toma buena" : "Otra toma"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        <div className="pdp-hub-final">
          <section className="pdp-ticket pdp-kit">
            <div className="pdp-ticket-head">
              <span>Pitch Kit</span>
              <span>{pitchKitCount} de 9 guardados</span>
            </div>
            <div className="pdp-kit-body">
              <p>
                Guarda solo los bloques que confirmas con el botón "Guardar en Pitch Kit". Es independiente de tu avance
                en los ejercicios.
              </p>
              <div className="pdp-kit-slots">
                {blocks.map((b) => (
                  <span
                    key={b.numero}
                    className={cn(
                      "pdp-kit-slot",
                      pitchKitSavedBlocks.includes(b.numero) && "lleno " + actoDe(b.numero),
                    )}
                  >
                    {dos(b.numero)} {b.nombre.replace(/^(El|La|Los|Las) /, "")}
                  </span>
                ))}
              </div>
              <button className="pdp-btn" onClick={() => navigate("/pitch-kit")}>
                <Package className="w-4 h-4" />
                Ver Pitch Kit completo
              </button>
            </div>
          </section>

          <div className="pdp-hub-acciones">
            {nextBlock && (
              <button className="pdp-btn rojo grande" onClick={() => onSelectBlock(nextBlock)}>
                Seguir con el bloque {nextBlock}
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            {completedBlocks.length > 0 && (
              <button className="pdp-btn grande" onClick={onViewPitch}>
                <Eye className="w-5 h-5" />
                Ver mi pitch
              </button>
            )}
            <p className="pdp-hub-metodo">Emoción, razón, emoción.</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="pdp-hub-reset">
                  <RotateCcw className="w-4 h-4" />
                  Empezar de nuevo
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Empezar de nuevo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esto borrará todo tu progreso y no se puede deshacer. ¿Estás seguro?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onReset}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sí, empezar de nuevo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </main>
    </div>
  );
}
