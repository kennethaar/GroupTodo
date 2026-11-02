function orgRow(x) {
  return el("div", {class: "task", onclick: () => go("projects", {sub: "list", org: x.name})},
    el("span", {class: "odot"}, x.name[0]),
    el("div", {class: "t-body"}, el("div", {class: "t-title"}, el("b", {}, x.name)),
      el("div", {class: "t-meta"}, x.what ? el("span", {class: "chip"}, x.what) : null,
        el("span", {class: "chip"}, x.ps.length + (x.ps.length === 1 ? " project" : " projects")),
        el("span", {class: "chip"}, x.open.length + " open"), spaceTag(x.o.space))),
    el("div", {class: "avs"}, ...[...new Set(x.open.map(a => a.assignee).filter(Boolean))].slice(0, 4).map(n => avatarNode(n, 24))),
    el("button", {class: "textbtn", onclick: e => { e.stopPropagation(); previewPage(x.o.space, x.o.path); }}, "Page"));
}
