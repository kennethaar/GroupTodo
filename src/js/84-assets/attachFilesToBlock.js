/* Saving the files, then putting them in the line -- at the caret when you are
   typing in it, at the end of the line when you dropped them on it. */
async function attachFilesToBlock(path, b, files, txt) {
  const list = Array.from(files || []).filter(f => f && (f.size || f.type));
  if (!list.length) return false;
  if (!canKeepFiles()) { notify("This area has nowhere to keep files.", "warn"); return true; }

  /* ---------- holding the place while it saves ----------
     Saving a big file to a synced folder or a server takes a moment, and you
     go on typing. The link used to go wherever the caret had got to by the
     time the save finished, not where you pasted. So a marker goes in at
     once, where the paste happened, and is swapped for the link when the file
     is safe -- or taken out again if it could not be saved. */
  // No file names in it: leaving the line turns names into links, and a marker
  // that has been rewritten can no longer be found to swap.
  const token = "\u27E6uploading " + (list.length === 1 ? "file" : list.length + " files") +
                " \u00B7" + (++UPLOAD_SEQ) + "\u27E7";
  let held = false, caretBack = null;   // where to put the caret once the redraw is done
  if (txt && document.activeElement === txt) {
    const whole = lineText(txt);
    const [from, to] = caretOffsets(txt);
    const before = whole.slice(0, from), after = whole.slice(to);
    const lead = before && !/\s$/.test(before) ? " " : "", tail = after && !/^\s/.test(after) ? " " : "";
    setHostText(txt, before + lead + token + tail + after, (before + lead + token + tail).length);
    held = true;
  }
  /* Where the marker is now: in the line still being typed in, or -- once you
     have left it -- in the line's saved title. */
  const swapToken = text => {
    if (held && txt && txt.isConnected && document.activeElement === txt && lineText(txt).includes(token)) {
      const now = lineText(txt);
      const [caret] = caretOffsets(txt);
      const at = now.indexOf(token);
      const next = (text ? now.replace(token, text) : now.replace(token, "").replace(/ {2,}/g, " "));
      const shift = next.length - now.length;
      b.title = next;
      caretBack = caret > at ? caret + shift : caret;
      setHostText(txt, next, caretBack);
      return true;
    }
    if (b.title.includes(token)) {
      b.title = trim(text ? b.title.replace(token, text) : b.title.replace(token, "").replace(/ {2,}/g, " "));
      return true;
    }
    return false;
  };

  const marks = [];
  for (const f of list) {
    if (f.size > assetMax()) {
      notify("\u201C" + (f.name || "That file") + "\u201D is bigger than " +
             Math.round(assetMax() / 1024 / 1024) + " MB, so it stays where it is.", "warn");
      continue;
    }
    try { marks.push(assetMarkdown(f, await saveAsset(f))); }
    catch (e) { notify("Could not save " + (f.name || "that file") + ": " + (e.message || e), "warn"); }
  }
  if (!marks.length) {
    if (swapToken("")) {
      touch(path); render();
      if (caretBack != null) focusLineAt(`.blk[data-id="${b.id}"] .txt`, caretBack);
    }
    return true;
  }
  const addition = marks.join(" ");

  if (held && swapToken(addition)) {
    // Swapped where it was pasted.
  }
  /* Written straight into the line rather than left on screen for the blur
     handler to pick up: a drop does not necessarily come with the caret in the
     line, and the redraw below would throw an unsaved edit away. */
  else if (txt && document.activeElement === txt) {
    const whole = lineText(txt);
    const [from, to] = caretOffsets(txt);
    const before = whole.slice(0, from), after = whole.slice(to);
    b.title = before + (before && !/\s$/.test(before) ? " " : "") + addition +
              (after && !/^\s/.test(after) ? " " : "") + after;
    /* The line on screen is handed the same text before the redraw takes it
       away. Losing the focused element fires blur on the way out, and that
       handler saves what the line still said -- the text as it was before the
       paste -- which put the old line straight back over the one just
       written, so a pasted screenshot landed in assets/ and left no trace.
       Focus is asked back afterwards, because a paste comes mid-sentence. */
    txt.textContent = b.title;
    keepFocus(".txt", txt);
  } else {
    const cur = trim(b.title);
    b.title = cur ? cur + " " + addition : addition;
  }
  touch(path); noteTodoTouched();
  render();
  // Back where you were typing, after the link that just went in before it.
  if (caretBack != null) focusLineAt(`.blk[data-id="${b.id}"] .txt`, caretBack);
  const where = V.backend.kind === "fs" || V.backend.kind === "http"
    ? "saved in " + ASSET_DIR + "/"
    : "kept in this browser only - choose a folder to make them real files";
  notify(marks.length + (marks.length === 1 ? " file " : " files ") + where + ".");
  return true;
}
