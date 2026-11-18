// Quote (#433): the words large in the middle, who said them, then the takeaways.
function drawQuote(s) {
  const {quote, author, takeaways} = s.hero;
  return el("div", {class: "hero"},
    slidePart(s.kids[0], "pq", el("blockquote", {class: "pquote"}, quote), author ? el("div", {class: "pauthor"}, author) : null),
    ...takeaways.map(b => slidePart(b, "ptake", slideWords(b))));
}
