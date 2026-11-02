/* ---------- a stencil is not work ----------
   A list is kept in order to be poured into a page later, so its own lines are
   what you WILL do, over and over, and never what anybody did. The screens
   that answer "what is happening" -- the report, the chart, the dated audit --
   would otherwise count the stencil alongside the copies taken from it, which
   is the same week of work reported twice. Verbs are not work either: they are
   the vocabulary. Both stay perfectly findable in search and on the map; they
   are only kept out of the counting. */
const isStencilPath = path => ["checklist", "verb"].includes(pageKind(path));

const baseName  = p => (p || "").split("/").pop().replace(/\.md$/i, "");
/* A stencil's title:: is a hole to be filled -- "%date%", "%title%" -- and not
   a name, so it is never shown as one: the file name is what it is called
   until something pours it into a page and fills the hole in. */
const pageTitle = p => {
  const t = getPage(p)?.props?.title;
  return (t && !/%\w+%/.test(t)) ? t : baseName(p);
};
