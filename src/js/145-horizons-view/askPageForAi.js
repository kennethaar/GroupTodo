/* A project page as an AI should read it, for Let AI write it (#344): what
   the project is for and every line on it, in plain words, so it knows what
   the question is really about. The bookkeeping (ids, who added what and
   when) stays out: it costs the AI attention and says nothing about the work.
   marks: block -> item number, written after the lines the ask is about.
   A long page is cut at max characters. */
function askPageForAi(path, marks = new Map(), max = 6000) {
  const page = getPage(path);
  if (!page) return "";
  const out = [];
  for (const [k, v] of Object.entries(page.props || {})) {
    const t = trim(plainTitle(String(v || "")));
    if (t && !ASK_PAGE_SKIP.test(k) && !/^[\d\-T:.Z\s]+$/.test(t)) out.push(k + ": " + t);
  }
  const walk = (blocks, depth) => {
    for (const b of blocks || []) {
      const due = dueDate(b);
      const text = isMessage(b) ? msgAuthor(b) + " wrote: " + plainTitle(b.title)
        : (b.state ? "[" + b.state + "] " : "") + plainTitle(b.title) + (due ? " (due " + due + ")" : "");
      const pad = "  ".repeat(depth);
      if (trim(text)) out.push(pad + "- " + text + (marks.has(b) ? "   <- item " + marks.get(b) : ""));
      for (const l of b.body || []) if (trim(l)) out.push(pad + "  " + plainTitle(l));
      walk(b.children, depth + 1);
    }
  };
  walk(page.blocks, 0);
  const s = out.join("\n");
  return s.length > max ? s.slice(0, max) + "\n... (the rest of the page is left out)" : s;
}
