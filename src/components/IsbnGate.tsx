import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ShoppingCart, BookOpen, ChevronLeft } from 'lucide-react';

const STORAGE_KEY = 'pdp_isbn_unlocked';
const VALID_ISBN = '9789560309358';

const AMAZON_URL = 'https://www.amazon.com/s?k=Pitch+de+Pel%C3%ADcula+Sebastian+Diaz';
const PREVENTA_URL = 'https://pitchdepelicula.com';

export function isPitchUnlocked() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

interface IsbnGateProps {
  onUnlock: () => void;
  onBack?: () => void;
}

export function IsbnGate({ onUnlock, onBack }: IsbnGateProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = code.replace(/[^0-9Xx]/g, '').toUpperCase();

    if (!normalized) {
      setError('Ingresa el ISBN del libro');
      return;
    }

    if (normalized !== VALID_ISBN) {
      setError('Ese ISBN no es válido. Revisa la contraportada del libro.');
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore storage errors
    }
    onUnlock();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          {onBack && (
            <Button variant="ghost" size="sm" className="mb-4" onClick={onBack}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Volver
            </Button>
          )}

          <div className="card-elevated p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-sm bg-foreground flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-background" />
              </div>
              <h1 className="text-2xl font-display font-black text-foreground mb-2 leading-tight">
                Tu pitch completo está reservado para lectores del libro
              </h1>
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
                  className={error ? 'border-destructive' : ''}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <Button type="submit" size="lg" className="w-full btn-primary-gradient text-base h-12">
                Desbloquear mi pitch
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border space-y-3">
              <p className="text-xs text-center text-muted-foreground">
                ¿Todavía no tienes el libro?
              </p>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12"
                onClick={() => window.open(AMAZON_URL, '_blank', 'noopener,noreferrer')}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Compra el libro en Amazon
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12"
                onClick={() => window.open(PREVENTA_URL, '_blank', 'noopener,noreferrer')}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Preventa en Chile
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
