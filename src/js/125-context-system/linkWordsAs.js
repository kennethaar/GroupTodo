/* Words already on a line become a link of a kind, where they stand (#367):
   "Lunch with [[p/Ola Hansen]] from CAB". Words inside a link, or not on the
   line at all, are left alone and false comes back. A context replaces the
   line's other context, as a line has one. */
function linkWordsAs(path, block, words, kind) {
  const text = trim(words || ""), pfx = LINK_WORD_KINDS[kind];
  if (!text || !pfx) return false;
  const title = block.title || "";
  // The first place the words stand outside a link.
  let at = -1;
  for (let i = title.indexOf(text); i >= 0; i = title.indexOf(text, i + 1)) {
    const before = title.slice(0, i);
    if (before.lastIndexOf("[[") <= before.lastIndexOf("]]")) { at = i; break; }
  }
  if (at < 0) return false;
  const slug = slugify(text);
  const there = findExistingPage(pfx + "/" + slug);
  const ref = there && linkKindOf(pageRef(there)) === kind ? pageRef(there) : pfx + "/" + slug;
  const link = "[[" + ref + (slug === text || pfx === "c" ? "" : "][" + text) + "]]";
  let t = title.slice(0, at) + "\u0000" + title.slice(at + text.length);
  if (pfx === "c") t = t.replace(/\[\[c\/[^\]]+\]\]/g, "");
  block.title = trim(t.replace("\u0000", link).replace(/\s{2,}/g, " "));
  createLinkedPages(block.title);
  touch(path);
  return true;
}
