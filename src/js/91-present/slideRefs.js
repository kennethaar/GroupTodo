/* A line's text as a slide reads it (#470): a ((id)) is the words of the
   line it points to, as on the page, and a line that is only an
   {{embed ((id))}} is that line's text. One whose line is gone reads as
   nothing. A reference inside the line pointed to is left out, so two lines
   that point at each other stop. */
function slideRefs(title) {
  const t = String(title || "");
  const of = id => String(blockById(id)?.block.title || "").replace(SLIDE_REF_RE, "");
  const emb = SLIDE_EMBED_RE.exec(t);
  if (emb) return emb[1] ? of(emb[1]) : (p => p ? pageTitle(p) : "")(findExistingPage(emb[2]));
  if (!t.includes("((")) return t;
  return t.replace(SLIDE_REF_RE, (all, id) => slideWords({title: of(id)}, true)).replace(/ {2,}/g, " ");
}
