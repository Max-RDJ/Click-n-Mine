export function qs(sel) {
  const el = document.querySelector(sel);
  if (!el) console.warn("Missing element:", sel);
  return el;
}
