/* The steps of a start that matter for how soon you can write in today's
   page, kept per area for the top of the saved log (#181): when each was
   done, how long it took, and what it was made of. Each also goes to the
   log as it happens (loadMark). */
const LOAD_STEPS = new Map();
const READ_TIMING = new Map();          // area -> the timing of its last full read (noteFileSigs)
function loadStep(area, text, since = null, detail = "") {
  const at = loadMark("“" + area + "”: " + text + (detail ? " (" + detail + ")" : ""), since);
  if (!LOAD_STEPS.has(area)) LOAD_STEPS.set(area, []);
  LOAD_STEPS.get(area).push({at, text, took: since != null ? at - since : null, detail});
  return at;
}
/* What the next draw shows, said once it is on screen (render). */
let DRAW_NOTE = "today's page";
let AWAY_SAID = false;
/* The summary at the top of the saved log. */
function startupText(area) {
  const steps = LOAD_STEPS.get(area);
  if (!steps || !steps.length) return "";
  const span = ms => ms < 1000 ? Math.round(ms) + " ms" : (ms / 1000).toFixed(1) + " s";
  return ["Start-up of “" + area + "” (seconds since the app started; the goal is today's page within 5 s):",
    ...steps.map(s => (s.at / 1000).toFixed(1).padStart(7) + "  " + s.text +
      (s.took != null ? "  [" + span(s.took) + "]" : "") + (s.detail ? "  " + s.detail : ""))].join("\n");
}
