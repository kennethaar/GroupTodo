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
  const snaps = chapterSnapshots(path);
  if (snaps.length) {
    const snap = snaps[snaps.length - 1], {gone, added} = sinceSnapshot(path, snap);
    box.append(el("div", {class: "revgroup revsnap"},
      el("div", {class: "revgh"}, "Since " + getPage(snap).props.stage + ", " + humanDate(String(getPage(snap).props.created).slice(0, 10)) +
        " · " + added.length + " new, " + gone.length + " gone"),
      ...gone.slice(0, 10).map(t => el("div", {class: "revdiff gone"}, "− " + t)),
      ...added.slice(0, 10).map(t => el("div", {class: "revdiff added"}, "+ " + t)),
      el("button", {class: "textbtn", onclick: () => openPage(snap)}, "Open the snapshot")));
  }
  if (!box.children.length) box.append(el("p", {class: "sub"}, "Nothing to look at again here."));
  return box;
}
