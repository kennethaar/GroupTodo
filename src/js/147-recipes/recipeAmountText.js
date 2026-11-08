/* A scaled amount, written the way the line wrote it. places is the number
   of decimals for a metric unit; without it the amount is rounded to
   quarters, and shown as ½ ¼ ¾ unless the line used decimals. */
function recipeAmountText(v, {places, decimals, comma}) {
  const dec = (n, p) => {
    const s = String(Number(n.toFixed(p)));
    return comma ? s.replace(".", ",") : s;
  };
  if (places != null) return dec(v, places);
  const q = Math.round(v * 4) / 4;
  if (q === 0) return dec(v, 2);
  if (decimals) return dec(q, 2);
  const whole = Math.floor(q), part = q - whole;
  const glyph = {0.25: "¼", 0.5: "½", 0.75: "¾"}[part] || "";
  return (whole || !glyph ? String(whole) : "") + glyph;
}
