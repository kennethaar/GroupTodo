/* Your open tasks that name them: [[p/Name]] for a person, [[o/Name]] for an
   organisation. */
function informAbout(to) {
  const want = (to.org ? "o/" : "p/");
  return myOpen().filter(a => linksIn(a.title || "").some(l => {
    const t = trim(l.split("][")[0]);
    if (t.slice(0, 2).toLowerCase() !== want) return false;
    return to.org ? t.slice(2).toLowerCase() === to.name.toLowerCase() : samePerson(t.slice(2), to.name);
  }));
}
