/** Mantém só dígitos. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Formata telefone brasileiro enquanto digita: (11) 99999-9999 ou (11) 9999-9999. */
export function formatPhoneBR(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Normaliza uma ID de usuário: "@" único no início, minúsculas, só letras, números, "." e "_". */
export function formatUserId(value: string): string {
  const body = value
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/[^a-z0-9._]/g, '')
    .slice(0, 20);
  return body.length > 0 ? `@${body}` : value.startsWith('@') ? '@' : '';
}

/** Oculta o usuário do e-mail: "joao@email.com" → "jo***@email.com". */
export function maskEmail(email: string): string {
  const at = email.indexOf('@');
  if (at <= 0) return email;
  const user = email.slice(0, at);
  const visible = user.slice(0, Math.min(2, user.length));
  return `${visible}***${email.slice(at)}`;
}

/** Segundos → "mm:ss". */
export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}
