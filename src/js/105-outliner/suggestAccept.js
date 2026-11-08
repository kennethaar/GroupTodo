function suggestAccept(n) {
  if (!SUGGEST) return;
  const {host, at, rows, opts} = SUGGEST;
  const r = rows[n == null ? SUGGEST.i : n];
  if (!r) { suggestClose(); return; }
  const text = hostText(host);
  const before = textBeforeCaret(host) || "";
  const after = text.slice(before.length);
  suggestClose();
  SUGGEST_DISMISSED = "";
  if (r.accept === "wizard") { if (opts.onTrackerWizard) opts.onTrackerWizard(); return; }
  if (r.accept === "command") {
    // The "/wait" that was typed has done its job: it goes, and so does the
    // space before it when it was the end of the line, or every trip through
    // the menu would leave one more behind. A command that writes into the
    // sentence (inline) keeps the space: it is the sentence's.
    const cut = !r.inline && !trim(after) && at > 0 && /\s/.test(text[at - 1]) ? at - 1 : at;
    setHostText(host, text.slice(0, cut) + after, cut);
    if (opts.onCommand) opts.onCommand(r.id);
    return;
  }
  if (r.accept === "tracker") {
    const insert = r.key + ":: ";
    setHostText(host, insert + after.replace(/^[\p{L}\p{N}_-]*(::)?\s*/u, ""), insert.length);
    host.dispatchEvent(new Event("input", {bubbles: true}));
    return;
  }
  if (r.accept === "word") {
    // The word takes the place of what was typed; input then offers the next ring.
    setHostText(host, text.slice(0, at) + r.title + after, at + r.title.length);
    host.dispatchEvent(new Event("input", {bubbles: true}));
    return;
  }
  if (r.accept === "date") {
    // The words stay where the hand wrote them in a box that reads them on
    // Enter; on a line they become the line's due date and leave the words.
    if (opts.onDate) {
      const kept = trim(text.slice(0, at)).replace(/\s+(on|by|due|until)$/i, "");
      const rest = after.replace(/^\s+/, "");
      const next = kept + (kept && rest ? " " : "") + rest;
      setHostText(host, next, kept.length);
      opts.onDate(r.iso, r.title, r);
    } else {
      const insert = r.title + (/^\s/.test(after) ? "" : " ");
      setHostText(host, text.slice(0, at) + insert + after, at + insert.length);
      host.dataset.due = r.iso;
    }
    host.dispatchEvent(new Event("input", {bubbles: true}));
    return;
  }
  const space = host.isContentEditable ? "\u00A0" : " ";
  const insert = "[[" + r.ref + (r.label ? "][" + r.label : "") + "]]" +
    (/^\s/.test(after) || SUGGEST_MODE_KEEP_TIGHT(after) ? "" : space);
  setHostText(host, text.slice(0, at) + insert + after, at + insert.length);
  host.dispatchEvent(new Event("input", {bubbles: true}));
}
