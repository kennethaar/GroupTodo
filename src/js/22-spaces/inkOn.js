/* Dark or light ink to put on top of a colour. Once any hex can be chosen the
   letter in the avatar has to follow the background, or a navy space loses it.
   Measured rather than guessed at a brightness cutoff: mid colours like violet
   sit close enough to the middle that only the two ratios settle it. */
function inkOn(hex) {
  const h = normHex(hex);
  if (!h) return "var(--accent-fg)";
  return contrast(h, "#06101f") >= contrast(h, "#ffffff") ? "#06101f" : "#ffffff";
}
