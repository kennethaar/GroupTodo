function macroChipHTML(kind, arg) {
  if (kind === "query")
    return `<span class="macro query" title="A live list of the lines this finds. Click to edit the query">\u{1F50D} ${esc(arg)}</span>`;
  const id = /^\(\(([A-Za-z0-9_-]{4,64})\)\)$/.exec(arg);
  const page = /^\[\[([^\]]+?)(?:\]\[[^\]]*)?\]\]$/.exec(arg);
  const what = id ? "a line" : page ? linkWords("[[" + page[1] + "]]") : arg;
  return `<span class="macro embed" title="Shows ${esc(id ? "that line" : "that page")} here, live. Click to edit">⧉ ${esc(what)}</span>`;
}
