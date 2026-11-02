/* The keys, in the capture phase: the app's own single-letter shortcuts are on
   the document too, and while lines are picked these come first. */
document.addEventListener("keydown", e => {
  if (!LINE_SEL.ids.length) return;
  if ($("#modalRoot").firstChild) return;              // a dialog owns the keys
  const mod = e.ctrlKey || e.metaKey;
  /* Somebody typing in a box is typing in a box, whatever is picked behind
     them -- and what they are typing is not a command about these lines.
     Copy, cut and paste are the exception when nothing is selected in the
     line itself: the line the drag started in can still hold the focus, and
     letting go of the pick there copied that one line instead of the lot. */
  const typing = /^(INPUT|TEXTAREA)$/.test(e.target.tagName) || e.target.isContentEditable;
  if (typing && !(e.target.isContentEditable && mod && /^([cxv]|Enter)$/i.test(e.key) && lineSelOwnsClipboard())) {
    lineSelClear();
    return;
  }
  const stop = () => { e.preventDefault(); e.stopPropagation(); };
  if (e.key === "Escape") { stop(); lineSelClear(); return; }
  // AltGr+2 on most European layouts, which arrives as ctrl+alt.
  if (e.key === "@" && !e.metaKey) { stop(); lineSelContext(); return; }
  if (e.altKey && e.shiftKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
    stop();
    const got = lineSelBlocks();
    if (got && shiftBlocks(got.page, got.blocks, e.key === "ArrowUp" ? -1 : 1)) {
      touch(LINE_SEL.path); noteTodoTouched(); render(); paintLineSel();
    } else if (got && !got.blocks.every(b => siblingsOf(got.page, got.blocks[0]).includes(b))) {
      notify("Only lines side by side, at the same depth, move together.");
    }
    return;
  }
  if (e.key === "Tab" && !e.altKey && !mod) {
    stop();
    const got = lineSelBlocks();
    if (got && indentBlocks(got.page, got.blocks, e.shiftKey)) {
      touch(LINE_SEL.path); noteTodoTouched(); render(); paintLineSel();
    }
    return;
  }
  if (!e.altKey && !mod && (e.key === "ArrowUp" || e.key === "ArrowDown") && LINE_SEL.head) {
    stop(); lineSelMove(e.key === "ArrowUp" ? -1 : 1, e.shiftKey); return;
  }
  if (e.key === "Enter" && !e.altKey && !mod && !e.shiftKey && LINE_SEL.head) {
    stop(); const id = LINE_SEL.head; lineSelClear(); focusBlock(id); return;
  }
  if (mod && (e.key === "c" || e.key === "C")) { stop(); lineSelCopy(); return; }
  if (mod && (e.key === "x" || e.key === "X")) { stop(); lineSelCut(); return; }
  if (e.key === "Delete" || e.key === "Backspace") { stop(); lineSelDelete(); return; }
  if (e.key === "." && !mod && !e.altKey) { stop(); lineSelEst(); return; }
  if (e.key === "Enter" && mod && !e.altKey) { stop(); lineSelCycle(); return; }
  if (mod && (e.key === "v" || e.key === "V")) return;  // the paste event does it
  if (mod && (e.key === "z" || e.key === "Z")) { lineSelClear(); return; }
  // Anything else means the handful was not what you were after.
  if (e.key.length === 1 || e.key === "Enter") lineSelClear();
}, true);
