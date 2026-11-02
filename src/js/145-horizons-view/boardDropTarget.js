/* Anything a card can be dropped on: a column, or a pill standing in for a
   column that has nothing in it yet. */
function boardDropTarget(col, accepts, onDrop) {
  const takes = d => !!d && !!d.items && d.items.some(x => accepts(d.kind, x));
  col.addEventListener("dragover", e => {
    if (!takes(DRAGGED)) return;
    e.preventDefault();
    col.classList.add("over");
  });
  col.addEventListener("dragleave", () => col.classList.remove("over"));
  col.addEventListener("drop", e => {
    e.preventDefault();
    col.classList.remove("over");
    const d = DRAGGED;
    DRAGGED = null;
    if (!takes(d)) return;
    const moving = d.items.filter(x => accepts(d.kind, x));
    const many = moving.length > 1;
    boardSelClear();
    /* One redraw and one piece of news for the whole handful, and one ctrl-z:
       what a drag did in one go, undo takes back in one go. Each move hands
       back the way to reverse it -- a state to put back, a folder to move a
       file home to -- and they are run in reverse, so the board ends up where
       it started. */
    const back = [];
    holdRender(() => {
      NOTIFY_MUTE += many ? 1 : 0;
      try { moving.forEach(x => { const u = onDrop(x, many, d); if (u) back.push(u); }); }
      finally { if (many) NOTIFY_MUTE--; }
    });
    if (many) notify("Moved " + moving.length + " cards.");
    if (!back.length) return;
    pushUndo({run: () => {
      holdRender(() => {
        NOTIFY_MUTE++;
        try { back.slice().reverse().forEach(u => u()); }
        finally { NOTIFY_MUTE--; }
      });
      notify(back.length > 1 ? "Put " + back.length + " cards back." : "Put it back.");
      return true;
    }});
  });
  return col;
}
