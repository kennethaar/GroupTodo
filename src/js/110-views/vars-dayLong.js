/* Numbers and letters only aim, the way the solitaire's do; Enter, or the
   same number again, takes the answer. */
window.addEventListener("keydown", e => {
  if (state.view !== "review" || subNow() !== "days" || !CL.shown) return;
  const quick = !!document.querySelector(".clquick");
  if (!quick && !document.querySelector(".clarify")) return;
  if ($("#modalRoot").firstChild || e.ctrlKey || e.metaKey || e.altKey) return;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
  const stop = () => { e.preventDefault(); e.stopImmediatePropagation(); };
  // Quick (#523): T or → something to do, N or ← a note, Space skips, E edits.
  if (quick) {
    const k = e.key.length === 1 ? e.key.toLocaleLowerCase() : e.key;
    const act = {t: "todo", ArrowRight: "todo", n: "note", ArrowLeft: "note", " ": "skip"}[k];
    if (act) { stop(); if (!e.repeat) qcTake(act); }
    else if (k === "e") { stop(); CL.editing = CL.shown.block.id; render(); }
    else if (k === "Backspace" && CL.undos.length) { stop(); clUndo(); }
    return;
  }
  const max = CL_ANSWERS.length;
  if (/^[1-9]$/.test(e.key) && +e.key <= max) {
    stop();
    if (CL.aim === +e.key - 1 && !e.repeat) { clAnswer(CL.shown, CL_ANSWERS[CL.aim]); return; }
    CL.aim = +e.key - 1;
  } else if (e.key === "Enter") {
    stop();
    if (!e.repeat) clAnswer(CL.shown, CL_ANSWERS[CL.aim]);
    return;
  } else if (/^Arrow(Up|Down|Left|Right)$/.test(e.key)) {
    stop();
    CL.aim = (CL.aim + (/Down|Right/.test(e.key) ? 1 : -1) + max) % max;
  } else if (e.key === "Backspace" && CL.undos.length) {
    stop(); clUndo(); return;
  } else if (e.key.length === 1 && /\p{L}/u.test(e.key)) {
    const ch = e.key.toLocaleLowerCase();
    const hits = CL_ANSWERS.map((a, i) => i).filter(i => CL_ANSWERS[i].label.toLocaleLowerCase().startsWith(ch));
    if (!hits.length) return;
    stop();
    CL.aim = hits[(hits.indexOf(CL.aim) + 1) % hits.length];
  } else return;
  clPaint();
}, true);
const dayLong = iso => capitalise(parseISO(iso).toLocaleDateString(undefined, {weekday: "long", day: "numeric", month: "long"}));

/* ---------- reflect: toward and away from your intentions (#185) ----------
   A bullet journal starts with what it is for, and once a week you look back:
   what moved you toward that, and what moved you away? The intentions are a
   horizon page, pages/_/Intentions.md, one per top-level line. The week is
   read off your own day pages of the last seven days: each event with what
   is under it, a feeling on its own, and a line with a feeling under it.

   A pick is written on the week page, under one line per
   week -- "#reflection Week 44" -- as toward:: ((id)) or away:: ((id)), so it
   points back at the line it is about. A second ((id)) is the intention it
   moved (#210); the score is counted from these, never stored. What you write under that line is an
   ordinary note or to do: there is no plan of its own beside the to dos. */
const INTENTIONS_PATH = join(DIR_HORIZONS, "Intentions.md");
const REFLECT_DAYS = 7;
const REFLECTION_RE = /^#reflection\b/i;
const PICK_RE = /^(toward|away)::\s*\(\(([A-Za-z0-9_-]{4,64})\)\)(?:\s*\(\(([A-Za-z0-9_-]{4,64})\)\))?/i;
const intentionBlocks = () => V.pages.has(INTENTIONS_PATH)
  ? getPage(INTENTIONS_PATH).blocks.filter(b => trim(b.title || "")) : [];
const intentions = () => intentionBlocks().map(b => trim(b.title));
