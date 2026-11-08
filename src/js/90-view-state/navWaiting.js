/* The people, unfolded under Waiting for: each one opens Waiting for narrowed
   to them, with how much they owe you as its count, most first. Nobody named
   leads the list when anything waits on no one: those still need sorting. */
function navWaiting() {
  const at = state.view === "waiting" ? state.waitWho : null;
  const by = new Map();
  for (const a of waitingRows().concat(mentionRows())) {
    const name = waitName(a), k = slugPerson(name);
    if (!by.has(k)) by.set(k, {name, n: 0});
    by.get(k).n++;
  }
  const none = slugPerson(WAIT_NOBODY);
  const people = Array.from(by, ([k, g]) => [k, g.name, g.n])
    .sort((x, y) => (x[0] === none ? 0 : 1) - (y[0] === none ? 0 : 1) || y[2] - x[2] || x[1].localeCompare(y[1]));
  return people.map(([k, name, n]) => el("button", {
    class: "nav-item small nav-sub" + (at === k ? " active" : ""),
    "aria-current": at === k ? "page" : null,
    title: k === none ? "Waiting on nobody named yet" : "What " + name + " owes you",
    onclick: () => go("waiting", {sub: "list", waitWho: k}),
  },
    k === none ? el("span", {class: "ic bw"}, "–") : el("span", {class: "ic"}, avatarNode(name, 18)),
    el("span", {class: "lbl"}, name),
    el("span", {class: "cnt"}, String(n))));
}
