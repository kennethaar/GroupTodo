/* The day a someday or completed project was last really worked on.
   updated:: is a last resort: any edit, rename or sync moves it to today, so
   a project finished years ago would pass for one finished last week. */
function planProjectDay(path, code) {
  const page = getPage(path), props = page?.props || {};
  if (code === "0") {
    let last = dateIn(String(props.completed || "")) || "";
    if (!last) for (const b of flattenBlocks(page?.blocks || [])) {
      const d = b.state === "DONE" ? closedOn(b) : null;
      if (d && d > last) last = d;
    }
    return last || dateIn(String(props.reviewed || props.updated || "")) || "";
  }
  return dateIn(String(props.reviewed || props.created || props.updated || "")) || "";
}
