/* ---------- the wizard ----------
   Three questions, and the line it will write shown as you answer them, so
   the shorthand is learnt by watching it being made. */
const TRACKER_KINDS = [
  {id: "ks", label: "Weight and sets", hint: "kilos, then the reps in each set", sets: true, code: n => "k" + "r".repeat(n)},
  {id: "rs", label: "Sets of reps", hint: "no weight, just reps", sets: true, code: n => "r".repeat(n)},
  {id: "n", label: "A number", hint: "put the unit in the name, like water-glasses", code: () => "n"},
  {id: "m", label: "Minutes", hint: "how long", code: () => "m"},
  {id: "c", label: "Done or not", hint: "a box to tick", code: () => "c"},
  {id: "s", label: "Rating 1–10", hint: "ten stars", code: () => "s"},
  {id: "t", label: "Hours worked", hint: "start and end, like 07:12 - 10:00 -- one tracker per place, like office and home", code: () => "t"},
  {id: "a", label: "An amount", hint: "money spent or earned -- one tracker per kind, like food", code: () => "a"},
  {id: "q", label: "Stock", hint: "+3 in, -1 out, =12 counted -- one tracker per thing", code: () => "q"},
  {id: "i", label: "Tap to count", hint: "one tap per cup, glass or time", code: () => "i", icon: true},
];
const trackerSlug = s => String(s || "").toLowerCase().normalize("NFC").replace(/[\s_]+/g, "-")
  .replace(/[^\p{L}\p{N}-]/gu, "").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
