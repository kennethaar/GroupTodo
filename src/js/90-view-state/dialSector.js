function dialSector(f, r = DIAL_R) {
  if (!(f > 0)) return "";
  if (f >= 0.9999) return `M${DIAL_C} ${DIAL_C - r}A${r} ${r} 0 1 0 ${DIAL_C} ${DIAL_C + r}A${r} ${r} 0 1 0 ${DIAL_C} ${DIAL_C - r}Z`;
  const a = f * 2 * Math.PI, x = DIAL_C - r * Math.sin(a), y = DIAL_C - r * Math.cos(a);
  return `M${DIAL_C} ${DIAL_C}L${DIAL_C} ${DIAL_C - r}A${r} ${r} 0 ${f > 0.5 ? 1 : 0} 0 ${x.toFixed(2)} ${y.toFixed(2)}Z`;
}
