/* #408 The others, top right: their initials, one button that lists them.
   And under a page's title, quietly, who else has it open. */
function hereDraw() {
  const bar = $("#hereBar");
  if (!bar) return;
  bar.onclick = e => { e.stopPropagation(); openHereMenu(bar); };
  const all = [...HERE.others.entries()].flatMap(([space, list]) => list.map(o => Object.assign({space}, o)));
  bar.hidden = !all.length;
  bar.textContent = "";
  if (all.length) {
    const names = [...new Set(all.map(o => o.name))];
    bar.setAttribute("aria-label", "Also here: " + names.join(", "));
    bar.title = all.map(o => o.name + (o.title ? " · " + o.title : "")).join("\n");
    bar.append(...names.slice(0, 3).map(n => avatarNode(n, 26)),
      names.length > 3 ? el("span", {class: "heremore"}, "+" + (names.length - 3)) : "");
  }
  /* On a phone the bar has no room for them: a count on ☰ and a list at
     the top of the sidebar instead. CSS shows these only there. */
  const count = $("#hereCount"), side = $("#sideHere");
  if (count) {
    count.hidden = !all.length;
    count.textContent = all.length ? String(all.length) : "";
    $("#burger")?.setAttribute("aria-label", "Show the sidebar" + (all.length ? " · " + all.length + " also here" : ""));
  }
  if (side) {
    side.hidden = !all.length;
    side.textContent = "";
    if (all.length) side.append(el("div", {class: "sidehere-h"}, "Also here"),
      ...all.map(o => hereRow(o.space, o, () => document.body.classList.remove("nav-open"))));
  }
  for (const note of $$("#content .herenote")) {
    const who = (HERE.others.get(note.dataset.space) || []).filter(o => o.page === note.dataset.path).map(o => o.name);
    note.textContent = who.length ? "· " + who.join(", ") + (who.length > 1 ? " are" : " is") + " also here" : "";
  }
}
