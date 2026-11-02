/* One pass over the handful, one piece of news, one undo. */
function boardSelApply(items, word, step) {
  if (!items.length) { notify("Those cards are not on screen any more.", "warn"); return; }
  const back = [];
  let done = 0;
  boardSelClear();
  holdRender(() => {
    NOTIFY_MUTE++;
    try {
      for (const x of items) {
        const u = step(x);
        if (u) { back.push(u); done++; }
      }
    } finally { NOTIFY_MUTE--; }
  });
  if (!done) { notify("Nothing to change - they all said that already.", "warn"); return; }
  notify(word + " \u00B7 " + done + (done === 1 ? " card" : " cards") +
    (done < items.length ? " (" + (items.length - done) + " already said so)" : "") + ".");
  pushUndo({run: () => {
    holdRender(() => {
      NOTIFY_MUTE++;
      try { back.slice().reverse().forEach(u => u()); }
      finally { NOTIFY_MUTE--; }
    });
    notify(back.length === 1 ? "Put it back." : "Put " + back.length + " cards back.");
    return true;
  }});
}
