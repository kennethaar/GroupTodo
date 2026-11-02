// The context's page, made if it is new. Returns its name as a link writes it.
/* A context's name, each part of a folder made safe on its own: home/kitchen
   stays a kitchen inside home rather than one file called home-kitchen. */
/* A new one starts with a capital, each part of its folder too: phone is
   @Phone. One already there is written the way it is, whatever case you
   type, so home is the @home you have rather than a second @Home, and an
   alias is the context it belongs to: pc is @Computer. */
const ctxCap = s => s.charAt(0).toLocaleUpperCase() + s.slice(1);
const ctxSlug = name => {
  const aka = contextByAlias(name);
  if (aka && !contextList().some(c => c.toLowerCase() === trim(String(name)).replace(/^@/, "").toLowerCase())) return aka;
  const parts = String(name || "").replace(/^@/, "").split("/").map(trim).filter(Boolean).map(slugify);
  const have = new Map(contextList().map(c => [c.toLowerCase(), c]));
  return parts.reduce((at, p) => {
    const n = (at ? at + "/" : "") + p;
    return have.get(n.toLowerCase()) || (at ? at + "/" : "") + ctxCap(p);
  }, "");
};
