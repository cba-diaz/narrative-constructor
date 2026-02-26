import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Film, ArrowRight, Sparkles, LogIn } from 'lucide-react';

interface LandingPageProps {
  onStart: (userName: string, startupName: string) => void;
  isAuthenticated?: boolean;
}

export function LandingPage({ onStart, isAuthenticated = false }: LandingPageProps) {
  const [userName, setUserName] = useState('');
  const [startupName, setStartupName] = useState('');
  const [errors, setErrors] = useState<{ userName?: string; startupName?: string }>({});
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { userName?: string; startupName?: string } = {};
    
    if (!userName.trim()) {
      newErrors.userName = 'Tu nombre es obligatorio';
    }
    if (!startupName.trim()) {
      newErrors.startupName = 'El nombre de tu startup es obligatorio';
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
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md animate-fade-in">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Film className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Pitch de Película</h1>
            </div>

            {/* Main Card */}
            <div className="card-elevated p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  Constructor de Pitch
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Construye tu pitch de inversión en 9 bloques
                </h2>
                <p className="text-muted-foreground">
                  Al terminar tendrás un guión de 4-5 minutos listo para presentar
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  className="w-full btn-primary-gradient text-base h-12"
                  onClick={() => navigate('/register')}
                >
                  Crear cuenta gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-12"
                  onClick={() => navigate('/login')}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Ya tengo cuenta
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">9</div>
                <div className="text-xs text-muted-foreground">Bloques guiados</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">~20</div>
                <div className="text-xs text-muted-foreground">Min aprox</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">4-5</div>
                <div className="text-xs text-muted-foreground">Min de pitch</div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center border-t border-border">
          <a 
            href="https://pitchdepelicula.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            pitchdepelicula.com
          </a>
        </footer>
      </div>
    );
  }

  // Authenticated user - show startup name form
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Film className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Pitch de Película</h1>
          </div>

          {/* Main Card */}
          <div className="card-elevated p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Constructor de Pitch
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Construye tu pitch de inversión en 9 bloques
              </h2>
              <p className="text-muted-foreground">
                Al terminar tendrás un guión de 4-5 minutos listo para presentar
              </p>
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
                  className={errors.userName ? 'border-destructive' : ''}
                />
                {errors.userName && (
                  <p className="text-sm text-destructive">{errors.userName}</p>
                )}
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
                  className={errors.startupName ? 'border-destructive' : ''}
                />
                {errors.startupName && (
                  <p className="text-sm text-destructive">{errors.startupName}</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full btn-primary-gradient text-base h-12">
                Comenzar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">9</div>
              <div className="text-xs text-muted-foreground">Bloques guiados</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">~20</div>
              <div className="text-xs text-muted-foreground">Min aprox</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">4-5</div>
              <div className="text-xs text-muted-foreground">Min de pitch</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-border">
        <a 
          href="https://pitchdepelicula.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          pitchdepelicula.com
        </a>
      </footer>
    </div>
  );
}
