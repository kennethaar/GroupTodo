/* Their address, from wherever email:: is written for them (#123): their
   page in this area, the same page written in another case, a context of
   their name (an agenda list for them), and, when this area has none, the
   same in the other areas you have open. Asking for an address you have
   already written down is the one thing it must not do. */
function emailOf(name, space) {
  if (!trim(name)) return "";
  const key = slugPerson(name).toLowerCase();
  const addrOn = path => {
    const props = V.pages.has(path) ? getPage(path).props || {} : {};
    return bareAddress(props[EMAIL_PROP] || props["e-mail"]);
  };
  const here = () => {
    const own = addrOn(personPath(name)) || addrOn(contextPath(name));
    if (own) return own;
    for (const path of allPages(p => p.startsWith(DIRS.people + "/") || p.startsWith(DIRS.contexts + "/")))
      if (slugPerson(baseName(path)).toLowerCase() === key && addrOn(path)) return addrOn(path);
    return "";
  };
  const first = inSpace(space, here);
  if (first) return first;
  for (const other of LOADED.keys()) {
    if (other === (space || V.space)) continue;
    const found = inSpace(other, here);
    if (found) return found;
  }
  return "";
}
