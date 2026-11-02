document.addEventListener("keydown", e => {
  if (MODAL_KEYS && MODAL_KEYS(e)) { e.preventDefault(); return; }
  if (e.key === "Escape") {
    resetChord();
    if (HELP_MARKS) { helpMarks(false); return; }
    if (helpOpen()) { setHelp(false); return; }
    if (!$("#spop").hidden) { closeSpacesMenu(); return; }
    if (!$("#modalRoot").firstChild && !e.aroundLeft) {
      const grid = $(".around");
      if (grid && !grid.classList.contains("picking") && aroundSelect(grid)) return;
    }
    closeModal();
    return;
  }
  const typing = /^(INPUT|TEXTAREA)$/.test(e.target.tagName) || e.target.isContentEditable;
  // Ctrl-Z outside a text box is the app's undo; inside one it is the
  // browser's, which is what anybody typing actually wants.
  if (!typing && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
    e.preventDefault(); undoLast(); return;
  }
  /* alt and an arrow is what the browser itself uses, so it is the one pair of
     keys nobody has to be told. It works while typing too: the caret being in
     a line is no reason for Back to stop meaning back. */
  if ((e.altKey || e.metaKey) && !e.ctrlKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    e.preventDefault(); navGo(e.key === "ArrowLeft" ? -1 : 1); return;
  }
  /* @@ opens the context picker. @ because a context reads as @phone
     everywhere else in this app, and twice because once is a key that does
     nothing most of the time and then swallows a keystroke the one time the
     caret was not quite where you thought it was. The first press arms the
     same chord HUD that g and v use, so it is visible rather than silent, and
     anything other than a second @ calls it off.

     Taken before the modifier bail-out below: on Norwegian, German and most
     other European layouts @ is AltGr+2, and AltGr arrives as ctrl+alt, so
     bailing out on those modifiers first would mean this never worked at all
     for the people it is written for. */
  if (!typing && e.key === "@" && !e.metaKey && !$("#modalRoot").firstChild) {
    e.preventDefault();
    const armed = chordBuf === "@";
    resetChord();
    if (armed) { openContextPicker("Where are you now?", surfaceContext); return; }
    chordBuf = "@";
    showChord("@ ... again for context");
    chordTimer = setTimeout(resetChord, 1500);
    return;
  }
  if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
  if ($("#modalRoot").firstChild) return;

  if (chordBuf) {
    const key = chordBuf + " " + e.key;
    resetChord();
    if (CHORDS[key]) { e.preventDefault(); CHORDS[key](); }
    return;
  }
  if ("gfzhwv".includes(e.key)) {
    chordBuf = e.key; showChord(e.key + " ...");
    chordTimer = setTimeout(resetChord, 1500);
    e.preventDefault(); return;
  }
  const single = {
    n: () => focusCapture(),
    c: () => focusCapture(),
    "/": () => goSearch(),
    "?": () => setHelp(!helpOpen()),
    s: () => helpMarks(!HELP_MARKS),
    "\\": () => toggleSidebar(),
    t: () => go("today"),
  };
  if (single[e.key]) { e.preventDefault(); single[e.key](); }
});
