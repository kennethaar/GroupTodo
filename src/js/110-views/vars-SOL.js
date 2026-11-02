/* ============================================================
   REVIEWING PROJECTS, AS SOLITAIRE
   The weekly review's hardest step is the one people skip: look at every
   project and make sure it says what it is for, who is in it, what comes
   next and what it waits on. So it is dealt one card at a time, stalest
   first, and every field shows its options -- click one, or drag the card
   onto it. The options are the project's own space's, because an area or an
   organisation is a page in that space's folder.

   Everything a field sets is what the project page would say anyway:
   org:: and with:: links, area::, outcome::, deadline::, depends_on::, and
   the status folder. A card with every field answered is stamped reviewed::.
   "None" is an answer too; it is held for the week rather than written,
   because an empty value says the same thing. "Nothing comes first" is the
   exception: it is written as depends_on:: none, so it is asked only once.
   ============================================================ */
let SOL = {order: null, i: 0, focus: null, more: null};
/* What this week's review has answered, kept on this device for the week: a
   reload, or coming back to it the next day, carries on where you were
   instead of dealing every project again as if none had been looked at. */
const solWeek = () => { const d = new Date(); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return isoOf(d); };
const SOL_ANS = new Map((() => {
  try {
    const o = JSON.parse(PREF.get("sol.ans", "") || "null");
    return o && o.week === solWeek() && Array.isArray(o.ans) ? o.ans : [];
  } catch (_) { return []; }
})());
