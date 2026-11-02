document.addEventListener("click", e => {
  const ref = e.target.closest("[data-bref]");
  if (!ref) return;
  e.preventDefault(); e.stopPropagation();
  const host = ref.closest("[data-space]");
  const space = host?.dataset.space || V.space;
  const hit = inSpace(space, () => blockById(ref.dataset.bref));
  if (hit) openBlockAt(space, hit.path, hit.block);
  else notify("The line this pointed at has gone.", "warn");
}, true);

/* ---------- {{embed}} and {{query}} in a line ----------
   The line keeps its words: the macro reads as a small label where it was
   written, and what it shows is drawn under the line, live. Click the label
   to type the macro itself, the way any line is edited. */
const MACRO_RE = /\{\{\s*(embed|query)\s+([\s\S]*?)\s*\}\}/gi;
