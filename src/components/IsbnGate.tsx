import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ShoppingCart, BookOpen, ChevronLeft } from "lucide-react";

const STORAGE_KEY = "pdp_isbn_unlocked";
const VALID_ISBN = "9789560309358";

const AMAZON_URL = "https://www.amazon.com/s?k=Pitch+de+Pel%C3%ADcula+Sebastian+Diaz";
const PREVENTA_URL = "https://pitchdepelicula.com";

export function isPitchUnlocked() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

interface IsbnGateProps {
  onUnlock: () => void;
  onBack?: () => void;
}

export function IsbnGate({ onUnlock, onBack }: IsbnGateProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = code.replace(/[^0-9Xx]/g, "").toUpperCase();

    if (!normalized) {
      setError("Ingresa el ISBN del libro");
      return;
    }

    if (normalized !== VALID_ISBN) {
      setError("Ese ISBN no es válido. Revisa la contraportada del libro.");
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore storage errors
    }
    onUnlock();
  };

  return (
    <AuthShell
      escena="Lectores"
      toma="00"
      antes={
        onBack && (
          <Button variant="ghost" size="sm" className="mb-4" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver
          </Button>
        )
      }
    >
      <div className="pdp-auth-card">
        <div className="mb-8">
          <div className="w-12 h-12 rounded-sm bg-foreground flex items-center justify-center mb-5">
            <Lock className="w-6 h-6 text-background" />
          </div>
          <h2 className="text-2xl font-display font-black text-foreground mb-2 leading-tight">
            Tu pitch completo está reservado para lectores del libro
          </h2>
          <p className="text-muted-foreground text-sm">
            Ingresa el ISBN del libro que adquiriste (está en la contraportada junto al código de barra)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="isbn" className="text-sm font-medium">
              ISBN
            </Label>
            <Input
              id="isbn"
              inputMode="numeric"
              autoComplete="off"
              placeholder="978-956-03-0935-8"
              value={code}
              maxLength={20}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(null);
              }}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full btn-primary-gradient text-base h-12">
            Desbloquear mi pitch
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border space-y-3">
          <p className="text-xs text-center text-muted-foreground">¿Todavía no tienes el libro?</p>
          <Button
            variant="outline"
            size="lg"
            className="w-full h-12"
            onClick={() => window.open(AMAZON_URL, "_blank", "noopener,noreferrer")}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Compra el libro en Amazon
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full h-12"
            onClick={() => window.open(PREVENTA_URL, "_blank", "noopener,noreferrer")}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Preventa en Chile
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}

const ACTOS = [
  { pista: "V1", nombre: "Emoción", bloques: ["El problema", "La solución", "El superpoder"] },
  { pista: "V2", nombre: "Razón", bloques: ["La tracción", "El mercado", "El modelo"] },
  { pista: "V3", nombre: "Emoción", bloques: ["La petición", "El equipo", "El cierre"] },
];

interface AuthShellProps {
  escena: string;
  toma: string;
  antes?: ReactNode;
  children: ReactNode;
}

// Marco común de las pantallas de acceso, con las piezas de pitchdepelicula.com.
export function AuthShell({ escena, toma, antes, children }: AuthShellProps) {
  const fecha = new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "2-digit" });
  return (
    <div className="pdp-auth">
      <aside className="pdp-auth-side">
        <div className="pdp-perfs" aria-hidden="true" />
        <div className="pdp-perfs der" aria-hidden="true" />
        <a href="https://pitchdepelicula.com" className="pdp-auth-logo">
          <span className="pdp-p">P</span>
          Pitch de Película
        </a>
        <div className="pdp-clap" aria-hidden="true">
          <div className="pdp-clap-stick" />
          <div className="pdp-clap-board">
            <div className="pdp-clap-row">
              <span>Prod.</span>
              <b>Startups de Película</b>
            </div>
            <div className="pdp-clap-grid">
              <div>
                <span>Escena</span>
                <b>{escena}</b>
              </div>
              <div>
                <span>Toma</span>
                <b>{toma}</b>
              </div>
              <div>
                <span>Fecha</span>
                <b>{fecha}</b>
              </div>
            </div>
          </div>
        </div>
        <h1 className="pdp-auth-title">
          Escribe tu pitch como se escribe una <span className="marker">película</span>.
        </h1>
        <p className="pdp-auth-lead">
          El constructor del libro Pitch de Película. Nueve bloques en tres actos y, al final, un Pitch Kit listo para
          presentar.
        </p>
        <div className="pdp-tracks" aria-hidden="true">
          {ACTOS.map((a, i) => (
            <div className="pdp-track" key={a.pista}>
              <span className="pdp-track-label">
                {a.pista} · {a.nombre}
              </span>
              <div className="pdp-track-clips">
                {a.bloques.map((b) => (
                  <span key={b} className={"pdp-clip c" + i}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="pdp-playhead" />
        </div>
        <p className="pdp-auth-script">Emoción, razón, emoción.</p>
      </aside>
      <main className="pdp-auth-main">
        <div className="pdp-auth-form animate-fade-in">
          {antes}
          <div className="pdp-ticket">
            <div className="pdp-ticket-head">
              <span>Admite uno</span>
              <span>
                Escena {escena} · Toma {toma}
              </span>
            </div>
            {children}
          </div>
        </div>
        <footer className="pdp-auth-foot">
          <a href="https://pitchdepelicula.com" target="_blank" rel="noopener noreferrer">
            pitchdepelicula.com
          </a>
          <Link to="/privacidad">Privacidad</Link>
        </footer>
      </main>
      <div className="pdp-grain" aria-hidden="true" />
    </div>
  );
}
