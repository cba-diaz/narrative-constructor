import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ConsentFields } from '@/components/ConsentFields';
import {
  CONSENT_VERSION,
  clearPendingConsent,
  fetchLatestConsent,
  isConsentActive,
  readPendingConsent,
  recordConsent,
} from '@/lib/consent';

type GateState = 'idle' | 'checking' | 'ok' | 'needs-consent';

// Rutas que se pueden ver sin haber aceptado
const OPEN_PATHS = ['/privacidad', '/login', '/register', '/forgot-password', '/reset-password'];

export function ConsentGate({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [state, setState] = useState<GateState>('idle');
  const [accepted, setAccepted] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setState('idle');
      return;
    }

    let cancelled = false;
    setState('checking');

    (async () => {
      try {
        const latest = await fetchLatestConsent(user.id);
        if (cancelled) return;
        if (isConsentActive(latest)) {
          clearPendingConsent();
          setState('ok');
          return;
        }

        // Consentimiento dado en el registro: en este navegador o guardado en la cuenta
        const pending = readPendingConsent();
        const meta = (user.user_metadata?.pdp_consent ?? null) as
          | { version?: string; marketing?: boolean }
          | null;
        const fromMeta = meta?.version === CONSENT_VERSION ? meta : null;
        const revokedBefore = !!latest?.revoked_at && latest.consent_version === CONSENT_VERSION;

        if (!revokedBefore && (pending || fromMeta)) {
          await recordConsent(
            user.id,
            pending?.marketing ?? fromMeta?.marketing ?? false,
            pending?.source ?? 'registro-email',
          );
          clearPendingConsent();
          if (!cancelled) setState('ok');
          return;
        }

        if (!cancelled) setState('needs-consent');
      } catch (e) {
        // Si no se puede leer el registro no se bloquea el uso: sin consentimiento
        // guardado no se envía nada a pitchdepelicula.com.
        console.warn('No se pudo verificar el consentimiento', e);
        if (!cancelled) setState('ok');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  const handleAccept = async () => {
    if (!user) return;
    if (!accepted) {
      setError('Para seguir necesitas aceptar la Política de Privacidad.');
      return;
    }
    setError(undefined);
    setSaving(true);
    try {
      await recordConsent(user.id, marketing, 'aviso-en-app');
      clearPendingConsent();
      setState('ok');
    } catch (e) {
      console.error(e);
      setError('No pudimos guardar tu respuesta. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const isOpenPath = OPEN_PATHS.includes(location.pathname);
  const open = !!user && state === 'needs-consent' && !isOpenPath;

  return (
    <>
      {children}
      <AlertDialog open={open}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <AlertDialogTitle className="text-center">Antes de seguir, tus datos</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Lo que escribes en el constructor queda guardado en tu cuenta y en la plataforma de
              Pitch de Película. Necesitamos tu autorización para hacerlo.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <ConsentFields
            accepted={accepted}
            marketing={marketing}
            onAcceptedChange={(v) => {
              setAccepted(v);
              if (v) setError(undefined);
            }}
            onMarketingChange={setMarketing}
            error={error}
            disabled={saving}
          />

          <AlertDialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => signOut()} disabled={saving}>
              Salir
            </Button>
            <Button onClick={handleAccept} disabled={saving} className="btn-primary-gradient">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aceptar y continuar'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
