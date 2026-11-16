/* Parts (#420): the pages a page links to, in order, each with its stage, its
   tasks done and its words. Book's Chapters, for any page. */
function viewPageParts(c, path) {
  const parts = pageParts(path).map(p => {
    const tasks = flattenBlocks(getPage(p.path).blocks).filter(b => b.state);
    return {...p, stage: oneLine(getPage(p.path).props?.stage || ""), words: chapterWords(p.path),
      tasks: tasks.length, done: tasks.filter(isClosedLine).length};
  });
  if (!parts.length) { c.append(emptyCard("No parts yet. A line that is only a link to a page is a part.")); return; }
  const words = parts.reduce((n, p) => n + p.words, 0), tasks = parts.reduce((n, p) => n + p.tasks, 0);
  const done = parts.reduce((n, p) => n + p.done, 0);
  c.append(el("div", {class: "card partsum"},
    tasks ? el("span", {class: "pbar"}, el("i", {style: "width:" + Math.round(100 * done / tasks) + "%"})) : null,
    el("span", {class: "ratio"}, parts.length + " parts · " + fmtWords(words) + " words" + (tasks ? " · " + done + "/" + tasks + " tasks done" : ""))));
  c.append(el("div", {class: "card"}, ...parts.map((p, i) => el("div", {class: "prow partrow"},
    el("span", {class: "n"}, String(i + 1)),
    el("button", {class: "nm", title: "Open it", onclick: () => openPage(p.path)}, p.name),
    p.stage ? el("span", {class: "chip"}, p.stage) : null,
    p.tasks ? el("span", {class: "sub", title: "Tasks done"}, p.done + "/" + p.tasks) : null,
    el("span", {class: "sub wc"}, fmtWords(p.words) + " words")))));
}
