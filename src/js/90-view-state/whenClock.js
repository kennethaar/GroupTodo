/* One phrase -> "HH:MM", or null. 14:00 is a time on its own; 2pm, at 2 and
   kl 14 are times because of the word that came with them, and so are kl 0843
   and at 1430: four digits alone are a year or a room as often as a time. */
function whenClock(p) {
  const m = /^(at|kl\.?|klokka|klokken)?\s*(?:(\d{1,2})(?:([:.])(\d{2}))?|(\d{1,2})(\d{2}))\s*(am|pm)?$/.exec(p);
  if (!m) return null;
  const [, kw, h2, s2, m2, h4, m4, ap] = m;
  if (h4 && !kw) return null;
  const hh = h4 || h2, mm = h4 ? m4 : m2, sep = h4 ? ":" : s2;
  if (!kw && !ap && !sep) return null;
  /* 14.30 is how a time is written here too. Only where it cannot be a day
     and a month -- 10.12 stays the 10th of December unless kl says otherwise --
     and on the five minutes, the way people say a time, so "Node 22.14" at the
     end of a line stays a version. */
  if (sep === "." && !/^kl/.test(kw || "") && !(Number(mm) > 12 && Number(mm) % 5 === 0)) return null;
  let h = Number(hh);
  const min = mm ? Number(mm) : 0;
  if (min > 59 || h > 23) return null;
  if (ap) { if (h < 1 || h > 12) return null; h = h % 12 + (ap === "pm" ? 12 : 0); }
  else if (kw === "at" && !mm && h >= 1 && h <= 7) h += 12;   // "at 3" is the afternoon
  return pad2(h) + ":" + pad2(min);
}
