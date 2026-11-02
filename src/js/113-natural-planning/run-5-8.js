/* Ctrl+Enter goes on, PgUp and PgDn a whole step, Esc closes; on the table the numbers are the boxes. */
window.addEventListener("keydown", e => {
  if (state.view !== "plan" || !NPM || $("#modalRoot").firstChild) return;
  const take = () => { e.preventDefault(); e.stopImmediatePropagation(); };
  if (e.key === "Escape") {
    if (SUGGEST || HELP_MARKS || helpOpen()) return;
    take();
    if (NPM.naming) { NPM.naming = false; render(); } else npmClose();
    return;
  }
  if (npmLocked()) return;
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { take(); npmNext(); return; }
  if ((e.key === "PageDown" || e.key === "PageUp") && !e.ctrlKey && !e.altKey) {
    take(); npmCommit(); npmGo(NPM.step + (e.key === "PageDown" ? 1 : -1)); return;
  }
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
  const m = /^(?:Numpad|Digit)([1-9])$/.exec(e.code), k = NPM_STEPS[NPM.step].k;
  if (k === "organise" && npmQ().k === "sort") {
    if (e.key === "Backspace") { take(); npmUndoSort(); return; }
    const b = m && npmSortBoxes().get(m[1]);
    if (b) { take(); if (!e.repeat) npmSortTake(b.to); }
    return;
  }
  if (k === "focus" && m && ["8", "6", "2"].includes(m[1])) {
    take();
    if (!e.repeat) document.querySelector('.npmbox[data-key="' + m[1] + '"]')?.click();
  }
}, true);
