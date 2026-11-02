/* How long a task takes, as a filter: what fits in the time you have. "Fits in
   30 min" is everything under half an hour, the quick ones too -- you have
   half an hour, not exactly half an hour's work. It shows once a task in the
   list carries an estimate; a choice that can only find nothing is noise. */
const EST_FILTERS = [["", "Any length"], ["1", "Fits in 15 min"], ["2", "Fits in 30 min"],
  ["3", "Fits in 45 min"], ["4", "An hour or more"], ["-", "No estimate"]];
/* "I have half an hour": not everything that fits, but the most urgent ones
   that fit together, added up from their dots. Only on Next, where urgency
   is the order. */
const EST_PLANS = [["p20", "I have 20 min"], ["p30", "I have 30 min"], ["p60", "I have 1 hour"], ["p120", "I have 2 hours"]];
const estPlan = v => /^p\d+$/.test(v || "") ? +v.slice(1) : 0;
const estOfRow = a => estTier(a.block ? a.block.title : a.title);
const estFits = (v, n) => !v || (estPlan(v) ? n > 0 && n * 15 <= estPlan(v)
  : v === "-" ? !n : v === "4" ? n === 4 : n > 0 && n <= +v);
