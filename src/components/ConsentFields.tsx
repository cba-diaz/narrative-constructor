import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { CONSENT_MARKETING_TEXT } from '@/lib/consent';

interface ConsentFieldsProps {
  accepted: boolean;
  marketing: boolean;
  onAcceptedChange: (value: boolean) => void;
  onMarketingChange: (value: boolean) => void;
  error?: string;
  disabled?: boolean;
}

export function ConsentFields({
  accepted,
  marketing,
  onAcceptedChange,
  onMarketingChange,
  error,
  disabled,
}: ConsentFieldsProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4 text-left">
      <div className="flex items-start gap-3">
        <Checkbox
          id="consent-required"
          checked={accepted}
          onCheckedChange={(v) => onAcceptedChange(v === true)}
          disabled={disabled}
          aria-invalid={!!error}
          className="mt-0.5"
        />
        <label htmlFor="consent-required" className="text-sm leading-snug text-foreground">
          Leí la{' '}
          <Link to="/privacidad" target="_blank" className="text-primary underline underline-offset-2">
            Política de Privacidad
          </Link>{' '}
          y autorizo que mi nombre, mi correo, el nombre de mi startup y todo lo que escriba en el
          constructor se usen para crear mi pitch y se guarden también en la plataforma de Pitch de
          Película (pitchdepelicula.com). <span className="text-muted-foreground">Obligatorio.</span>
        </label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-start gap-3">
        <Checkbox
          id="consent-marketing"
          checked={marketing}
          onCheckedChange={(v) => onMarketingChange(v === true)}
          disabled={disabled}
          className="mt-0.5"
        />
        <label htmlFor="consent-marketing" className="text-sm leading-snug text-muted-foreground">
          {CONSENT_MARKETING_TEXT}
        </label>
      </div>
    </div>
  );
}

export const CONSENT_REQUIRED_ERROR =
  'Para crear tu cuenta necesitas aceptar la Política de Privacidad.';
