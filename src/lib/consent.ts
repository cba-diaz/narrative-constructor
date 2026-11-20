import { supabase } from '@/integrations/supabase/client';

// Cambia la versión cada vez que cambie el texto: todos tendrán que aceptar de nuevo.
export const CONSENT_VERSION = '2026-11-19';

export const CONSENT_REQUIRED_TEXT =
  'Leí la Política de Privacidad y autorizo que mi nombre, mi correo, el nombre de mi startup y todo lo que escriba en el constructor se usen para crear mi pitch y se guarden también en la plataforma de Pitch de Película (pitchdepelicula.com).';

export const CONSENT_MARKETING_TEXT =
  'Quiero recibir por correo novedades de Pitch de Película. Es opcional y puedo darme de baja cuando quiera.';

export const PRIVACY_CONTACT_EMAIL = 'hola@kamino.cl';

const PENDING_KEY = 'pdp_pending_consent';

export interface PendingConsent {
  version: string;
  marketing: boolean;
  source: string;
  at: string;
}

export function savePendingConsent(marketing: boolean, source: string) {
  const pending: PendingConsent = {
    version: CONSENT_VERSION,
    marketing,
    source,
    at: new Date().toISOString(),
  };
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  } catch {
    // Sin almacenamiento local: el aviso de consentimiento aparecerá al entrar.
  }
}

export function readPendingConsent(): PendingConsent | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingConsent;
    return parsed.version === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function clearPendingConsent() {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    // nada que limpiar
  }
}

export interface ConsentRow {
  id: string;
  consent_version: string;
  marketing_opt_in: boolean;
  accepted_at: string;
  revoked_at: string | null;
}

// La tabla data_consents se creó por SQL y no está en los tipos generados.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const consents = () => (supabase as any).from('data_consents');

export async function fetchLatestConsent(userId: string): Promise<ConsentRow | null> {
  const { data, error } = await consents()
    .select('id, consent_version, marketing_opt_in, accepted_at, revoked_at')
    .eq('user_id', userId)
    .order('accepted_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as ConsentRow) ?? null;
}

export function isConsentActive(row: ConsentRow | null) {
  return !!row && !row.revoked_at && row.consent_version === CONSENT_VERSION;
}

export async function recordConsent(userId: string, marketing: boolean, source: string) {
  const { error } = await consents().insert({
    user_id: userId,
    consent_version: CONSENT_VERSION,
    accepted_privacy: true,
    accepted_central_storage: true,
    marketing_opt_in: marketing,
    consent_text: marketing
      ? `${CONSENT_REQUIRED_TEXT}\n${CONSENT_MARKETING_TEXT}`
      : CONSENT_REQUIRED_TEXT,
    source,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 500) : null,
  });
  if (error) throw error;
}

export async function revokeConsent(userId: string) {
  const { error } = await consents()
    .update({ revoked_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('revoked_at', null);
  if (error) throw error;
}
