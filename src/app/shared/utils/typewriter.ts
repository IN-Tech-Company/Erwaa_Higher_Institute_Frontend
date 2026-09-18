/**
 * Reveals `fullText` one character at a time via `onTick`, so a suggested
 * question reads as "being typed" instead of appearing instantly — the user
 * can still edit it before deciding to send. Returns a cancel function; call
 * it (or just call `typewriter` again) to stop an in-flight animation before
 * starting a new one.
 */
export function typewriter(
  fullText: string,
  onTick: (partial: string) => void,
  speedMs = 22
): () => void {
  let i = 0;
  onTick('');
  const handle = setInterval(() => {
    i++;
    onTick(fullText.slice(0, i));
    if (i >= fullText.length) clearInterval(handle);
  }, speedMs);
  return () => clearInterval(handle);
}
