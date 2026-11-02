function stakeDueCard(due) {
  return el("div", {class: "section"},
    el("div", {class: "card", style: "padding:10px 14px"},
      el("div", {style: "font-weight:600;margin-bottom:4px"}, "Due an update on their responsibilities"),
      ...due.map(d => el("div", {style: "display:flex;gap:10px;align-items:center;margin:4px 0;flex-wrap:wrap"},
        el("span", {style: "flex:1;min-width:0"}, (d.org ? "\u{1F3E2} " : "") + d.name,
          el("span", {style: "color:var(--fg3);font-size:12.5px"}, " · " + d.areas.map(a => a.title + " " + toldWords(a.days)).join(", "))),
        el("button", {class: "btn sm ghost", onclick: () => openSendUpdate({name: d.name, org: d.org})}, "✉ Send an update")))));
}
