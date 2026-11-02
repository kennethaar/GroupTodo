function installCaptureBox() {
  const input = $("#cap");
  attachSuggest(input, {dates: true});
  input.addEventListener("keydown", e => {
    if (suggestKey(e)) return;
    if (e.key === "Enter") { e.preventDefault(); captureFromBox(input); }
    else if (e.key === "Escape") { input.value = ""; input.blur(); }
  });
  /* A list is one task per line. A long one can be a page instead, and an
     email made a page still wants following up, so its line is a task. */
  input.addEventListener("paste", e => {
    const raw = e.clipboardData && e.clipboardData.getData("text/plain");
    if (raw == null) return;
    const lines = raw.replace(/\r\n?/g, "\n").split("\n").filter(l => trim(l) !== "");
    if (lines.length < 2) return;
    e.preventDefault();
    const put = pasteAsTasks(raw);
    if (!put) return;
    const said = put.n + " tasks added from what you pasted.";
    if (lines.length < PASTE_AS_LINES) { notify(said); return; }
    offerPasteAs(raw, said + " Make a page of them instead:", pasteSwapper(put.path, put.roots, (kind, link) => {
      if (kind !== "email") return newBlock({title: link}, false);
      let title = "Follow up " + link;
      if (state.context) title += " [[c/" + state.context + "]]";
      return stampAuthor(newBlock({state: "TODO", title, props: {}}));
    }));
  });
}
