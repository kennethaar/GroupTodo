/* A phrase typed where only a date is meant -- the Tab menu, the time box --
   read by the same words as a line (#396), with by, on or this in front
   allowed. Sure that a date was meant, so "sat" and 3/4 count here. */
function dateFromWords(phrase) {
  const p = whenEnglish(trim(String(phrase || "")).toLowerCase())
    .replace(/^(on|by|due|until|before|starts?|from|this)\s+(?=\S)/, "");
  return p ? whenDay(p, todayISO(), 1) : null;
}
