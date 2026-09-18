/** Accepts: 5XXXXXXXX | 05XXXXXXXX | 966XXXXXXXXX | +966XXXXXXXXX */
export const SAUDI_PHONE = /^(5\d{8}|05\d{8}|(\+?966)5\d{8})$/;

/** Normalizes any accepted format to +9665XXXXXXXX */
export function normalizePhone(raw: string): string {
  if (raw.startsWith('+966')) return raw;
  if (raw.startsWith('966')) return '+' + raw;
  if (raw.startsWith('05')) return '+966' + raw.slice(1);
  if (raw.startsWith('5')) return '+966' + raw;
  return raw;
}
