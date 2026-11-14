function viewPeople() {
  const sub = subNow();
  const c = el("div", {class: "wrap" + (sub === "board" ? " wide" : " lwide")});
  c.append(vhead("People", "Who is carrying what",
    newBtn("person", () => pickName({title: "Person", items: [], prefix: "p",
      onPick: n => { if (n) openPersonPage(n); }})), viewSeg("people")));
  if (!whoAmI()) c.append(el("div", {class: "news"}, el("div", {},
    "Put your name in and you will show up here. ", el("button", {class: "textbtn", onclick: () => openVaultDialog()}, "Your name"))));
  const all = peopleRows();

  if (sub === "board") { c.append(peopleBoard(all)); return c; }

  const kind = PREF.get("people.kind", "all");
  const keep = r => kind === "all" || (kind === "in" ? r.member : !r.member);
  const rows = all.filter(keep);
  const card = r => el("div", {class: "cardbox", onclick: () => openPersonPage(r.name)},
    avatarNode(r.name, 36), el("h4", {}, personNameAt(r.name) + (r.me ? " (you)" : "")),
    el("p", {}, r.open.length + " open" + (r.late ? " · " + r.late + " late" : "") + " · " + r.seen),
    personAction(r));
  /* Whoever the open work names first, most-named on top; then everyone it
     does not name, under their own heading so the split is visible. */
  const list = (hits, q) => {
    const named = hits.filter(r => r.me || r.mentions), quiet = hits.filter(r => !r.me && !r.mentions);
    return [pagedCard(named, personRow, noMatch(q, quiet.length ? "Nobody is named in open work." : "Nobody here yet.")),
      quiet.length ? el("div", {class: "group"}, el("span", {class: "plain"}, "Not named in any open work")) : null,
      quiet.length ? pagedCard(quiet, personRow) : null];
  };
  const f = textFilter("people", "Filter people", rows, r => [r.name, ...r.aliases, r.seen, ...r.spaces, ...personOrgs(r.name)].join(" "),
    sub === "cards" ? (hits, q) => hits.length ? el("div", {class: "cardgrid"}, ...hits.map(card))
      : emptyCard(noMatch(q, "Nobody here yet.")) : list);
  c.append(fbar(f.input, fchip("Everyone", kind === "all", () => { PREF.set("people.kind", "all"); render(); }),
    fchip("In the area", kind === "in", () => { PREF.set("people.kind", "in"); render(); }),
    fchip("Outside it", kind === "out", () => { PREF.set("people.kind", "out"); render(); }),
    el("span", {class: "right"}, ...peopleContactActions(), ...replyActions())), f.host);
  loadSpacesForPeople();
  return c;
}
