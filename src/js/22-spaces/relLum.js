/* Relative luminance, WCAG's definition, for the two readability calls below. */
function relLum(hex) {
  const h = normHex(hex);
  if (!h) return 0;
  const lin = n => { const v = n / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * lin(parseInt(h.slice(1, 3), 16))
       + 0.7152 * lin(parseInt(h.slice(3, 5), 16))
       + 0.0722 * lin(parseInt(h.slice(5, 7), 16));
}
