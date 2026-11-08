/* The contexts, unfolded under Next: each one opens Next narrowed to it, with
   what you can do there as its count, busiest first so the one worth picking
   is at the top. A context with nothing to do is left out. No context leads
   the list when anything has no context at all. */
function navContexts() {
  const acts = nextActions(), at = state.view === "next" ? state.ctxFilter : null;
  const none = acts.filter(a => !a.context).length;
  const counted = allContextNames().map(k => [k, acts.filter(a => inContext(a, k)).length])
    .filter(([, n]) => n);
  counted.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const row = (key, label, icon, n) => el("button", {
    class: "nav-item small nav-sub" + (at === key ? " active" : ""),
    "aria-current": at === key ? "page" : null,
    title: key === CTX_NONE ? "Next actions with no context" : "What you can do at @" + key,
    onclick: () => go("next", {sub: "list", ctxFilter: key}),
  },
    el("span", {class: "ic bw"}, icon),
    el("span", {class: "lbl"}, label),
    n ? el("span", {class: "cnt"}, String(n)) : null);
  return [
    ...(none ? [row(CTX_NONE, "No context", "–", none)] : []),
    ...counted.map(([k, n]) => row(k, k, contextIcon(k) || "@", n)),
  ];
}
