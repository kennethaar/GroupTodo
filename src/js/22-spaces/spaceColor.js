/* The colour to draw a space in, including spaces saved before colours were
   chooseable: those fall back to their position in the cycle. */
function spaceColor(name) {
  const hex = normHex(Spaces.get(name)?.color);
  if (hex) return hex;
  const i = Spaces.list.findIndex(s => s.name === name);
  return SPACE_COLORS[(i < 0 ? 0 : i) % SPACE_COLORS.length];
}
