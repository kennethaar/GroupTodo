const ctxHasKids = ctx => ctxFamily(ctx).size > 1 || allContextNames().some(k => k.startsWith(ctx + "/"));
// The one chip for all of a context's lists: with the contexts inside it, or only its own.
const ctxKidsChip = n => fchip("Contexts inside", ctxKidsOn(), () => {
  PREF.set("ctx.kids", ctxKidsOn() ? "0" : ""); clearMemo(); render();
}, n);
/* A context made a child of another goes into its folder, links and all:
   @kitchen under @home is @home/kitchen from then on. */
/* The page a context's folder belongs to: c/home.md for c/home/kitchen.md. */
const ctxParentPath = path => {
  const dir = String(path || "").replace(/\/[^/]+$/, "");
  return isContextPath(path) && dir !== DIRS.contexts ? dir + ".md" : null;
};
