/* The whole book as one markdown file: a heading per chapter, its words as paragraphs. */
function bookManuscript() {
  const {name, subtitle} = bookInfo(), out = name ? ["# " + name, "", ...(subtitle ? [subtitle, ""] : [])] : [];
  for (const ch of bookChapters()) {
    out.push("## " + (ch.path ? pageTitle(ch.path) : ch.name), "");
    (ch.path ? chapterScenes(ch.path) : []).forEach((s, i) => {
      if (i) out.push("* * *", "");
      out.push(...proseOf(s.lines).flatMap(t => [t, ""]));
    });
  }
  return out.join("\n").replace(/\n+$/, "\n");
}
