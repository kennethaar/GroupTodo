/* Numbers and letters only aim, the way the solitaire's do; Enter, or the
   same number again, takes the answer. The numbers are laid out like a
   numpad, as in Review actions: the line is 5, and 5 again skips it; 0, under
   the grid, leaves the whole branch as notes. Arrows move on that grid (#518). */
const CL_PAD = {7: [0, 0], 8: [0, 1], 9: [0, 2], 4: [1, 0], 5: [1, 1], 6: [1, 2], 1: [2, 0], 2: [2, 1], 3: [2, 2], 0: [3, 1]};
const clAimOf = k => k === 5 ? "line" : k === 0 ? (CL.allAns ? "all" : null) : CL_ANSWERS.findIndex(a => a.key === k);
const clKeyOf = aim => aim === "line" ? 5 : aim === "all" ? 0 : CL_ANSWERS[aim].key;
const clTake = () => CL.aim === "line" ? clSkip(CL.shown) : CL.aim === "all" ? clAnswer(CL.shown, CL.allAns)
  : clAnswer(CL.shown, CL_ANSWERS[CL.aim]);
window.addEventListener("keydown", e => {
  if (state.view !== "review" || subNow() !== "days" || !document.querySelector(".clarify") || !CL.shown) return;
  if ($("#modalRoot").firstChild || e.ctrlKey || e.metaKey || e.altKey) return;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
  const stop = () => { e.preventDefault(); e.stopImmediatePropagation(); };
  if (/^[0-9]$/.test(e.key) && clAimOf(+e.key) != null) {
    stop();
    const aim = clAimOf(+e.key);
    if (CL.aim === aim && !e.repeat) { clTake(); return; }
    CL.aim = aim;
  } else if (e.key === "Enter") {
    stop();
    if (!e.repeat) clTake();
    return;
  } else if (/^Arrow(Up|Down|Left|Right)$/.test(e.key)) {
    stop();
    const [row, col] = CL_PAD[clKeyOf(CL.aim)];
    const to = e.key === "ArrowUp" ? [row === 3 ? 2 : row - 1, col] : e.key === "ArrowDown" ? [row + 1, row === 2 ? 1 : col]
      : [row, col + (e.key === "ArrowRight" ? 1 : -1)];
    const k = Object.keys(CL_PAD).find(n => CL_PAD[n][0] === to[0] && CL_PAD[n][1] === to[1]);
    if (k != null && clAimOf(+k) != null) CL.aim = clAimOf(+k);
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
