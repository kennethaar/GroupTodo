/* ← and → pick a side and ↓ skips the pair: arrows only, as letters never move
   or take anything. */
window.addEventListener("keydown", e => {
  if (state.view !== "review" || subNow() !== "projects" || !document.querySelector(".sdtable")) return;
  if ($("#modalRoot").firstChild || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
  const take = () => { e.preventDefault(); e.stopImmediatePropagation(); };
  if (e.key === "Backspace") { if (SD.last) { take(); sdUndo(); } return; }
  const pair = document.querySelector(".sdpair");
  if (!pair) return;
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    take();
    if (!e.repeat) pair.querySelector('.sdside[data-side="' + (e.key === "ArrowLeft" ? 0 : 1) + '"] > .btn')?.click();
  } else if (e.key === "ArrowDown") { take(); if (!e.repeat) document.querySelector(".sdskip")?.click(); }
}, true);

/* ---------- the loose actions pass ----------
   An action written on a day page under no project and no responsibility is
   thinking nobody filed: the same loose actions the review's checklist and the
   nudge count. Once the projects are gone through, each is dealt in turn with
   the projects and responsibilities of its own area, the likeliest first --
   the ones sharing its words, or the people and organisations it names.
   Picking one refiles it there, leaving the usual "Refiled" line on the day.
   Left on the day page, it comes round again next week. */
let LOOSE = {skipped: new Set(), filed: 0, q: ""};
const LOOSE_TOP = 8;
const looseKey = a => (a.space || "") + "|" + a.path + "|" + a.title;
