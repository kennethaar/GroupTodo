/* An AI's recipe, read into {title, props, blocks}. Mended on the way in,
   because AIs answer in markdown rather than in an outline: the code fence
   goes, "## Ingredients" on a line of its own becomes a heading line with
   what follows under it, and "1. Brown the meat" a line without its number,
   since the outline keeps the order. Null when there is no name. */
function mendRecipeAnswer(text) {
  const lines = String(text || "").replace(/\r\n?/g, "\n").split("\n").filter(l => !/^\s*```/.test(l));
  let i = lines.findIndex(l => trim(l));
  if (i < 0) return null;
  const title = trim(lines[i].replace(/^\s*#{1,6}\s*/, "").replace(/^[-*]\s+/, ""));
  if (!title) return null;
  const props = {};
  for (i++; i < lines.length; i++) {
    const l = trim(lines[i]);
    if (!l) continue;
    const pm = PROP_RE.exec(l);
    if (!pm) break;
    const v = trim(pm[2]);
    if (v && !/^<.*>$/.test(v)) props[pm[1].toLowerCase()] = v;
  }
  const out = [];
  let under = "";                           // indent for lines under a heading written on its own
  for (const raw of lines.slice(i)) {
    if (!trim(raw)) continue;
    const bm = BULLET_RE.exec(raw);
    if (!bm && /^\s*#{1,6}\s+\S/.test(raw)) { out.push("- " + trim(raw)); under = "  "; continue; }
    if (bm && !bm[1] && /^#{1,6}\s/.test(trim(bm[2] || ""))) under = "";
    const num = /^(\s*)\d+[.)]\s+(.*)$/.exec(raw);
    if (num) { out.push(under + num[1] + "- " + num[2]); continue; }
    out.push(bm ? under + raw : under + "- " + trim(raw));
  }
  return {title, props, blocks: parseOutlineText(out.join("\n"))};
}
