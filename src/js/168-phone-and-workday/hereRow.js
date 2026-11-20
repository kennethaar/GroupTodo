/* #408 One person and where they are: initials, "Name · page". With a page
   it is a button that opens it (after done(), which closes what holds it). */
function hereRow(space, o, done, attrs = {}) {
  const where = o.title || (o.page ? baseName(o.page) : "");
  const parts = [avatarNode(o.name, 22), el("span", {}, el("b", {}, o.name), where ? " · " + where : "")];
  if (!o.page) return el("div", {class: "hererow"}, ...parts);
  return el("button", Object.assign({type: "button", title: "Open " + where,
    onclick: () => { done(); openPageIn(space, o.page); }}, attrs), ...parts);
}
