const contextOf = text => {
  const m = /\[\[c\/([^\]]+)\]\]/.exec(text || "");
  return m ? trim(m[1]) : null;
};
const hasContextLink = text => /\[\[c\/[^\]]+\]\]/.test(text || "");
/* A context is also the folder of the ones under it: standing at @PC you can
   do what is @PC/email too, the same way c/PC.md holds c/PC/email.md, and
   what its children:: names. Its lists show them unless the Contexts inside
   chip takes them off; kids says which. */
const ctxKidsOn = () => PREF.get("ctx.kids", "") !== "0";
const inContext = (a, ctx, kids = ctxKidsOn()) => !!a.context && !!ctx &&
  (a.context === ctx || kids && (a.context.startsWith(ctx + "/") || ctxFamily(ctx).has(a.context)));
