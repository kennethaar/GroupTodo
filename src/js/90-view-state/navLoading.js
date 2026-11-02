function navLoading() {
  if (!LOADING.size) return null;
  let done = 0, total = 0;
  for (const st of LOADING.values()) { done += st.done; total += st.total; }
  const pct = total ? Math.floor(done * 100 / total) : 0;
  const many = LOADING.size > 1;
  const last = [...LOADING].flatMap(([name, st]) => st.last.map(p => [name, p])).slice(0, 12);
  return el("div", {id: "navLoad", class: "nav-load"},
    el("button", {class: "nav-item small nav-sub", "aria-expanded": String(LOADING_OPEN),
      title: "Reading pages: " + done + " of " + total + ". Click to see each file.",
      onclick: () => { LOADING_OPEN = !LOADING_OPEN; paintLoading(); }},
      el("span", {class: "pbar"}, el("i", {style: "width:" + pct + "%"})),
      el("span", {class: "cnt"}, pct + "%")),
    LOADING_OPEN ? el("div", {class: "nav-load-list", role: "status"},
      el("div", {class: "nav-load-n"}, done + " of " + total + " files"),
      last.map(([name, p]) => el("div", {class: "nav-load-file", title: p},
        (many ? name + " · " : "") + p.split("/").slice(-2).join("/").replace(/\.md$/i, "")))) : null);
}
