export const translateAuthError = (message: string): string => {
  const errors: Record<string, string> = {
    'Invalid login credentials': 'Email o contraseña incorrectos',
    'Email not confirmed': 'Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.',
    'User already registered': 'Ya existe una cuenta con este email',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    'Unable to validate email address: invalid format': 'El formato del email no es válido',
    'Email rate limit exceeded': 'Demasiados intentos. Espera unos minutos antes de intentar de nuevo.',
    'over_email_send_rate_limit': 'Demasiados intentos. Espera unos minutos antes de intentar de nuevo.',
  };
  return errors[message] || message;
};
