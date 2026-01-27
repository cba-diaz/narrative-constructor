import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Film, ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().trim().email({ message: 'Introduce un email válido' }),
});

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    const { error: resetError } = await resetPassword(email.trim());
    setIsLoading(false);

    if (resetError) {
      toast({
        title: 'Error',
        description: resetError.message,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Film className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Pitch de Película</h1>
            </div>

            <div className="card-elevated p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Revisa tu email
              </h2>
              <p className="text-muted-foreground mb-6">
                Hemos enviado instrucciones para restablecer tu contraseña a{' '}
                <strong className="text-foreground">{email}</strong>
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a iniciar sesión
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Film className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Pitch de Película</h1>
          </div>

          <div className="card-elevated p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                ¿Olvidaste tu contraseña?
              </h2>
              <p className="text-muted-foreground">
                Introduce tu email y te enviaremos instrucciones para restablecerla
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={error ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full btn-primary-gradient text-base h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar instrucciones'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-muted-foreground hover:text-primary inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </main>

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
