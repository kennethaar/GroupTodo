/* The selected words become the link, where they stand (#335). A name picked
   by another spelling keeps the words as its text, [[p/John Smith][JS]]; a
   context is written by its own name, and the line's other context goes. */
function flyLinkSel(k, v) {
  const {path, block, sel} = FLY;
  const title = block.title;
  let from = title.slice(sel.from, sel.to) === sel.text ? sel.from : title.indexOf(sel.text);
  if (from < 0) return false;
  const prefix = TAG_SEL_PREFIX[k], name = trim(v);
  const same = name.toLowerCase() === sel.text.replace(/^@/, "").toLowerCase();
  const link = "[[" + prefix + "/" + name + (prefix === "c" || same ? "]]" : "][" + sel.text + "]]");
  let t = title.slice(0, from) + "\u0000" + title.slice(from + sel.text.length);
  if (prefix === "c") t = t.replace(/\[\[c\/[^\]]+\]\]/g, "");
  block.title = trim(t.replace("\u0000", link).replace(/\s{2,}/g, " "));
  FLY.sel = null;
  if (k !== "org") flyMakeTask(path, block);
  createLinkedPages(block.title);
  touch(path);
  return true;
}
