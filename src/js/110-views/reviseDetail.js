/* One chapter's findings, each sentence a click from its line. */
function reviseDetail(path, look) {
  const box = el("div", {class: "revdetail"});
  const find = text => { let hit = null; walkBlocks(getPage(path)?.blocks, b => { if (!hit && linkWords(b.title || "").includes(text.slice(0, 40))) hit = b; }); return hit; };
  const jump = text => { const b = find(text); openPage(path); if (b) focusBlock(b.id); };
  const group = (title, items, label) => items.length ? box.append(el("div", {class: "revgroup"}, el("div", {class: "revgh"}, title + " · " + items.length),
    ...items.slice(0, 20).map(x => el("button", {class: "revhit", onclick: () => jump(x.para || x.text)}, el("span", {class: "revlab"}, label(x)), el("span", {class: "sub"}, x.text))))) : null;
  group("Sentences over " + LONG_SENTENCE + " words", look.long, x => x.n + " words");
  group("Telling, not showing", look.filters, x => x.word);
  group("Adverbs", look.adverbs, x => x.word);
  group("The same word twice, close", look.repeats, x => x.word);
  if (!box.children.length) box.append(el("p", {class: "sub"}, "Nothing to look at again here."));
  return box;
}
