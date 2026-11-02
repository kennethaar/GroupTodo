// While numbers are up, a click on what they name explains it instead.
document.addEventListener("click", e => {
  const id = HELP_MARKS && helpPaneTopic();
  if (!id || !helpOnScreen(id)) return;
  if (!e.target.closest || !e.target.closest("#content, header.top") || e.target.closest("#helpMarks, #btnHelp")) return;
  const legend = HELP[id].legend || [];
  let best = -1, size = Infinity;
  legend.forEach(([sel], i) => {
    const n = helpFind(sel);
    if (!n || !n.contains(e.target)) return;
    const r = n.getBoundingClientRect();
    if (r.width * r.height < size) { size = r.width * r.height; best = i; }
  });
  e.preventDefault(); e.stopPropagation();
  if (best >= 0) helpExplain(best);
  else helpFlash(e.target.closest("button, a, input, .chip, .card, div") || e.target, "No number here. Press Esc to stop Show me.");
}, true);
let HELP_MARKS_RAF = 0;
const helpMarksSoon = () => {
  if (!HELP_MARKS || HELP_MARKS_RAF) return;
  HELP_MARKS_RAF = requestAnimationFrame(() => { HELP_MARKS_RAF = 0; helpMarksDraw(); });
};
document.addEventListener("scroll", helpMarksSoon, true);
window.addEventListener("resize", helpMarksSoon);

/* ---------- first-visit notes ----------
   One line per screen, the first time you are on it on this device: what the
   screen is for, and the way to the rest. Never over the work, never twice;
   Settings > Help turns them off. Seen lives in this device's preferences,
   like the tour's, never in the shared files. */
const helpHintsOn = () => PREF.get("help.hints", "1") !== "0";
let HELP_HINT_NOW = null;
