/* A line as a slide draws it (#477): slideWords(), with bold, italics,
   highlight and strike as they look in the outline. The marks themselves
   are left out, and \* is a plain star. */
function slideText(b) {
  const t = document.createElement("template");
  t.innerHTML = inlineMarks(esc(slideWords(b, true)).replace(/\\([*_=~`])/g, (all, c) => "&#" + c.charCodeAt(0) + ";"));
  return t.content;
}
