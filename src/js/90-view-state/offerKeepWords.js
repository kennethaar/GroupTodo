function offerKeepWords(undo, path) {
  if (!undo.length) return;
  const msg = undo.length === 1
    ? "“" + plainTitle(undo[0].w.title) + "”: " + whenSays(undo[0].w) + "."
    : "Dates read from " + undo.length + " lines.";
  notify(msg, "info", {label: "Keep the words", run: () => {
    for (const {block, w, keys} of undo) {
      block.title = block.title.replace(w.title, trim(w.source));
      for (const k of keys) for (const real of Object.keys(block.props))
        if (real.toLowerCase() === k.toLowerCase()) delete block.props[real];
    }
    touch(path); render();
  }});
}
