/* Cheap "did anything change" check, so a quiet re-read stays quiet. */
function pageSignature(rec) {
  const parts = [];
  for (const path of Array.from(rec.pages.keys()).sort())
    parts.push(path + "@" + (rec.pages.get(path).props?.updated || ""));
  return parts.join("|");
}
