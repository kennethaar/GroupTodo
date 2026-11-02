/* The one accessor every surface asks for a horizon's wording: the base row with
   this space's profile laid over it, `wiz` merged rather than replaced so an
   override only has to say the parts that differ. */
function horizonMeta(key) {
  const base = HORIZON_BY_KEY[key];
  if (!base) return null;
  const over = base.by?.[horizonProfile().key];
  if (!over) return base;
  return Object.assign({}, base, over, {wiz: Object.assign({}, base.wiz, over.wiz)});
}
