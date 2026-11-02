const effStatus = r => autoWaiting(r) ? "3" : inSpace(r.space, () => statusDirOf(r.path));
const linksWith = (props, pfx) => linksIn(Object.values(props || {}).join(" "))
  .map(l => trim(l.split("][")[0])).filter(l => l.startsWith(pfx)).map(l => l.slice(pfx.length));
const projectOrgs = r => inSpace(r.space, () => [...new Set([...linksWith(getPage(r.path)?.props, "o/"),
  ...areaOrgsOf(r.path)])]);
/* An organisation dragged onto an area is whose work everything in that area is,
   so every project in the area counts as theirs without saying so itself. */
const areaOrgsOf = path => { const a = areaOfProject(path);
  return a ? linksWith(areaClientProps(getPage(join(DIRS.areas, slugify(a) + ".md"))?.props), "o/") : []; };
/* ---------- client or supplier ----------
   An organisation says once, on its own page, what it is to you: role:: client
   or role:: supplier. Without one it is a client, as every org was before, so
   org:: on a project stays the one key and only the suppliers drop out of the
   time sheet. share:: 60 on a client makes it a standard one: every new
   project is given it, and its time is split by those shares. */
const orgProp = (name, key) => { const p = findExistingPage("o/" + name);
  return p ? trim(String(getPage(p)?.props?.[key] || "")) : ""; };
const isSupplier = name => orgProp(name, "role").toLowerCase() === "supplier";
const orgShare = name => numIn(orgProp(name, "share")) || 0;
const projectClients = r => inSpace(r.space, () => projectOrgs(r).filter(o => !isSupplier(o)));
const defaultClients = () => allPages(q => pageKind(q) === "org").map(baseName)
  .filter(o => orgShare(o) > 0 && !isSupplier(o));
