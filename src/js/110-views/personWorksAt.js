/* Where they work, said on their page and changed there. One their page's
   name or the organisation's own page gives them is shown without a cross:
   it is undone where it is written. And when somebody else has the same
   name, this says who, so the two are never taken for one. */
function personWorksAt(name, path) {
  const space = V.space;
  const own = linksWith(getPage(path)?.props, "o/").map(o => o.toLowerCase());
  const unlink = o => {
    const page = getPage(path);
    for (const k of Object.keys(page?.props || {}))
      if (linksWith({[k]: page.props[k]}, "o/").some(x => x.toLowerCase() === o.toLowerCase()))
        removeLinkFromProp(space, path, k.toLowerCase(), "o/" + o);
  };
  const orgs = personOrgs(name).map(o => {
    const mine = own.includes(o.toLowerCase());
    return el("span", {class: "stake", title: mine ? "" : "From the page's name or " + o + "'s own page"},
      el("span", {class: "odot sm"}, o[0]),
      el("span", {class: "wikilink", onclick: () => followLink("o/" + o)}, o),
      mine ? el("button", {"aria-label": "Not at " + o, title: "Not at " + o, onclick: () => unlink(o)}, "×") : null);
  });
  const add = el("button", {class: "textbtn", onclick: () => pickName({title: "Works at", items: allOrgNames(), prefix: "o",
    onPick: org => {
      const u = inSpace(space, () => pageLinkPropAdd(path, "organisation", "o/" + trim(org)));
      if (u) pushUndo({run: () => { inSpace(space, u); render(); return true; }});
      const many = !isCircleOrg(org) && manyOrgsWarning(name);
      if (many) notify(many, "warn");
      render();
    }})}, orgs.length ? "+ another" : "+ organisation");
  const same = namesakesOf(name), many = manyOrgsWarning(name);
  return el("div", {class: "section"},
    el("div", {class: "t-meta"}, el("span", {class: "plain"}, "Works at"), ...orgs, add),
    many ? el("p", {class: "hint warn"}, many + " Family, Relatives, Friends and Creators do not count.") : null,
    same.length ? el("p", {class: "hint"}, "Not the same person as ",
      ...same.flatMap((n, i) => [i ? ", " : "", el("span", {class: "wikilink", onclick: () => openPersonPage(n)}, personNameAt(n))]),
      ".") : null);
}
