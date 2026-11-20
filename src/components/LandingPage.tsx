import { useState } from "react";
import { AuthShell } from "@/components/IsbnGate";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles, LogIn } from "lucide-react";

interface LandingPageProps {
  onStart: (userName: string, startupName: string) => void;
  isAuthenticated?: boolean;
}

export function LandingPage({ onStart, isAuthenticated = false }: LandingPageProps) {
  const [userName, setUserName] = useState("");
  const [startupName, setStartupName] = useState("");
  const [errors, setErrors] = useState<{ userName?: string; startupName?: string }>({});
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { userName?: string; startupName?: string } = {};

    if (!userName.trim()) {
      newErrors.userName = "Tu nombre es obligatorio";
    }
    if (!startupName.trim()) {
      newErrors.startupName = "El nombre de tu startup es obligatorio";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onStart(userName.trim(), startupName.trim());
  };

  // If not authenticated, show login/register buttons
  if (!isAuthenticated) {
    return (
      <AuthShell escena="Estreno" toma="01">
        <div className="pdp-auth-card">
          <div className="mb-8">
            <h2 className="text-3xl font-display font-black text-foreground mb-2 leading-tight">
              Construye tu pitch de inversión en <span className="marker">9 bloques</span>
            </h2>

            <p className="text-muted-foreground">Al terminar tendrás un guión de 4 a 5 minutos listo para presentar</p>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full btn-primary-gradient text-base h-12"
              onClick={() => navigate("/register")}
            >
              Crear cuenta gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button variant="outline" size="lg" className="w-full h-12" onClick={() => navigate("/login")}>
              <LogIn className="w-5 h-5 mr-2" />
              Ya tengo cuenta
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="pdp-creditos">
          <div className="space-y-1">
            <div className="pdp-creditos-n">9</div>
            <div className="text-xs text-muted-foreground">Bloques en tres actos</div>
          </div>
          <div className="space-y-1">
            <div className="pdp-creditos-n">20</div>
            <div className="text-xs text-muted-foreground">Minutos para escribirlo</div>
          </div>
          <div className="space-y-1">
            <div className="pdp-creditos-n">4 a 5</div>
            <div className="text-xs text-muted-foreground">Minutos de pitch</div>
          </div>
        </div>
      </AuthShell>
    );
  }

  // Authenticated user - show startup name form
  return (
    <AuthShell escena="Ficha" toma="02">
      <div className="pdp-auth-card">
        <div className="mb-8">
          <h2 className="text-3xl font-display font-black text-foreground mb-2 leading-tight">
            Construye tu pitch de inversión en <span className="marker">9 bloques</span>
          </h2>

          <p className="text-muted-foreground">Al terminar tendrás un guión de 4 a 5 minutos listo para presentar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-sm font-medium">
              Tu nombre
            </Label>
            <Input
              id="userName"
              type="text"
              placeholder="Ej: María García"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                if (errors.userName) setErrors({ ...errors, userName: undefined });
              }}
              className={errors.userName ? "border-destructive" : ""}
            />
            {errors.userName && <p className="text-sm text-destructive">{errors.userName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startupName" className="text-sm font-medium">
              Nombre de tu startup
            </Label>
            <Input
              id="startupName"
              type="text"
              placeholder="Ej: TécnicoYa"
              value={startupName}
              onChange={(e) => {
                setStartupName(e.target.value);
                if (errors.startupName) setErrors({ ...errors, startupName: undefined });
              }}
              className={errors.startupName ? "border-destructive" : ""}
            />
            {errors.startupName && <p className="text-sm text-destructive">{errors.startupName}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full btn-primary-gradient text-base h-12">
            Comenzar
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </div>

      {/* Features */}
      <div className="pdp-creditos">
        <div className="space-y-1">
          <div className="pdp-creditos-n">9</div>
          <div className="text-xs text-muted-foreground">Bloques en tres actos</div>
        </div>
        <div className="space-y-1">
          <div className="pdp-creditos-n">20</div>
          <div className="text-xs text-muted-foreground">Minutos para escribirlo</div>
        </div>
        <div className="space-y-1">
          <div className="pdp-creditos-n">4 a 5</div>
          <div className="text-xs text-muted-foreground">Minutos de pitch</div>
        </div>
      </div>
    </AuthShell>
  );
}
