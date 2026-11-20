import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  CONSENT_VERSION,
  ConsentRow,
  PRIVACY_CONTACT_EMAIL,
  fetchLatestConsent,
  isConsentActive,
  revokeConsent,
} from '@/lib/consent';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
  </section>
);

export default function Privacy() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [consent, setConsent] = useState<ConsentRow | null>(null);
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchLatestConsent(user.id).then(setConsent).catch(() => setConsent(null));
  }, [user]);

  const handleRevoke = async () => {
    if (!user) return;
    const ok = window.confirm(
      'Vamos a borrar la copia de tus datos en pitchdepelicula.com y cerrar tu sesión. Para volver a usar el constructor tendrás que aceptar de nuevo. ¿Continuar?',
    );
    if (!ok) return;
    setRevoking(true);
    try {
      await revokeConsent(user.id);
      toast({
        title: 'Consentimiento retirado',
        description: 'Borramos la copia de tus datos en pitchdepelicula.com.',
      });
      await signOut();
      navigate('/');
    } catch {
      toast({
        title: 'No pudimos retirar tu consentimiento',
        description: `Escríbenos a ${PRIVACY_CONTACT_EMAIL} y lo hacemos por ti.`,
        variant: 'destructive',
      });
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Link to="/" className="mb-10 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Film className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Pitch de Película</span>
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-foreground">Política de Privacidad</h1>
        <p className="mb-10 text-sm text-muted-foreground">Versión {CONSENT_VERSION}</p>

        <div className="space-y-8">
          <Section title="Quién trata tus datos">
            <p>
              El constructor de pitch de startupsdepelicula.com es parte de Pitch de Película, el
              libro y método de Sebastián Díaz Mesa publicado por Editorial Kamino 56. Para
              cualquier tema de datos personales escribe a{' '}
              <a href={`mailto:${PRIVACY_CONTACT_EMAIL}`} className="text-primary underline">
                {PRIVACY_CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="Qué datos guardamos">
            <p>
              Tu nombre y tu correo. Si entras con Google, el nombre y el correo de esa cuenta. El
              nombre de tu startup y todo lo que escribes en el constructor: los ejercicios, los
              nueve bloques y tu Pitch Kit. También la fecha en que aceptaste esta política y el
              navegador desde el que lo hiciste.
            </p>
          </Section>

          <Section title="Para qué los usamos">
            <p>
              Para darte acceso a tu cuenta y guardar tu pitch mientras lo construyes. Para tener
              una copia en la plataforma de Pitch de Película (pitchdepelicula.com), desde donde
              damos soporte a los lectores y mejoramos el método. Y solo si marcaste la casilla
              opcional, para enviarte novedades del libro por correo.
            </p>
            <p>
              La base es tu consentimiento. No vendemos tus datos ni los entregamos a otras
              empresas para que te contacten.
            </p>
          </Section>

          <Section title="Dónde quedan">
            <p>
              En la base de datos de startupsdepelicula.com y en la de pitchdepelicula.com. Ambas
              funcionan sobre Lovable Cloud, un servicio de infraestructura que puede alojar los
              datos en servidores fuera de Chile.
            </p>
          </Section>

          <Section title="Cuánto tiempo">
            <p>
              Mientras tengas tu cuenta. Si retiras tu consentimiento, la copia en
              pitchdepelicula.com se borra en ese momento. Si pides borrar tu cuenta, borramos
              todo.
            </p>
          </Section>

          <Section title="Tus derechos">
            <p>
              Puedes pedir acceso a tus datos, corregirlos, borrarlos, oponerte a que los usemos,
              recibirlos en un formato que puedas llevar a otro servicio o pedir que los
              bloqueemos mientras revisamos tu solicitud. Escribe a {PRIVACY_CONTACT_EMAIL} desde
              el correo de tu cuenta. Respondemos dentro de 30 días corridos y no cobramos nada.
            </p>
            <p>
              Puedes retirar tu consentimiento cuando quieras. Lo que hicimos antes de que lo
              retiraras sigue siendo válido. Si no quedas conforme con nuestra respuesta, puedes
              reclamar ante la Agencia de Protección de Datos Personales.
            </p>
          </Section>

          {user && (
            <section className="space-y-3 rounded-lg border border-border p-5">
              <h2 className="text-lg font-semibold text-foreground">Tu consentimiento</h2>
              {isConsentActive(consent) ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Lo diste el {new Date(consent!.accepted_at).toLocaleDateString('es-CL')}
                    {consent!.marketing_opt_in ? ', incluyendo novedades por correo.' : '.'}
                  </p>
                  <Button variant="outline" onClick={handleRevoke} disabled={revoking}>
                    {revoking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Retirar mi consentimiento'}
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No tienes un consentimiento vigente para esta versión.
                </p>
              )}
            </section>
          )}
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center">
        <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
          Volver al constructor
        </Link>
      </footer>
    </div>
  );
}
