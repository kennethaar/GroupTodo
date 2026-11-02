/* What a field says right now, in a few words, or null when it is not set. */
function projectFieldText(r, f) {
  if (!f.filled(r)) return null;
  if (f.text) return f.text(r);
  if (f.k === "orgs" || f.k === "people") return f.cur(r).join(", ") || f.none;
  if (f.k === "area") return f.cur(r);
  if (f.k === "after") {
    const d = inS(r, () => dependsOn(r.path)[0]);
    return d ? "after " + inS(r, () => pageTitle(d)) : "nothing first";
  }
  if (f.k === "status") return STATUS_LABEL[inS(r, () => statusDirOf(r.path))];
  return f.val ? f.val(r) : "";
}
