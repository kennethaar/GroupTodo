function openDoneHistory() {
  const body = el("div", {});
  const draw = () => {
    body.textContent = "";
    const h = doneHistory();
    if (!h.length) {
      body.append(el("div", {class: "empty"},
        "Nothing finished on this device yet. Tick off a todo or complete a project and it shows up here."));
      return;
    }
    let day = null;
    for (const e of h) {
      if (e.day !== day) { day = e.day; body.append(el("div", {class: "msg-day"}, el("span", {}, humanDate(day)))); }
      const t = doneTarget(e);
      body.append(el("div", {class: "section", style: "padding:10px 12px;margin:0 0 8px"},
        el("div", {style: "display:flex;gap:8px;align-items:center;margin-bottom:6px"},
          el("span", {class: "chip"}, e.kind === "project" ? "Project" : "Todo"),
          multiSpace() && e.space ? spaceBadge(e.space) : null,
          t ? el("button", {style: "all:unset;flex:1;cursor:pointer;font-weight:600",
                onclick: () => { closeModal(); openPageIn(e.space, t.path); }}, e.label)
            : el("span", {style: "flex:1;color:var(--fg3)"}, e.label + " (no longer found)"),
          t && e.kind === "project" && stakeholdersOf(e.space, t.path).length
            ? el("button", {class: "btn sm ghost", onclick: () => { closeModal(); openDoneNote(e.space, t.path); }}, "Notify") : null),
        ...(t ? doneComments(t) : []).map(n =>
          el("div", {style: "font-size:13px;color:var(--fg2);margin:2px 0 4px 8px", translate: "no", html: renderInline(n.title)})),
        t ? doneCommentRow(e, draw) : null));
    }
  };
  draw();
  modal({title: "Recently done", hint: "g h", body});
}
