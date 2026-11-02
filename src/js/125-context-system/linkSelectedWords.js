/* Words picked inside a line, and the key for a kind: just those words become
   the link, where they stand -- "ring Kari about [[1/Office move]] on Friday"
   -- and the page is started if it is not there yet. Alt-1/2/3 a project on
   that shelf, alt-8 a list, alt-z a zettel, alt-p a person, alt-o an
   organisation, alt-c a context. Without a selection the keys do what they
   always did with the whole line. */
function linkSelectedWords(e, kind) {
  const host = e.target.closest && e.target.closest(".blk .txt");
  if (!host || !host.isContentEditable) return false;
  const pfx = STATUS_DIRS[kind] && kind !== "-" || PREFIX_DIR[kind] ? kind + "/" : KIND_PREFIX[kind];
  if (!pfx) return false;
  const [from, to] = caretOffsets(host);
  const whole = lineText(host), picked = whole.slice(from, to), name = trim(picked);
  if (!name) return false;
  const hit = findBlock(host.closest(".blk").dataset.id);
  if (!hit) return false;
  e.preventDefault(); e.stopImmediatePropagation();
  const before = whole.slice(0, from);
  if (/\[\[|\]\]/.test(picked) || before.lastIndexOf("[[") > before.lastIndexOf("]]")) {
    notify("Those words are already part of a link."); return true;
  }
  if (pfx === "c/" && hasContextLink(whole)) { notify("Already has a context."); return true; }
  // A page of the same name already on another shelf of the same kind is the
  // page meant, so the link goes to it rather than starting a second one.
  const slug = slugify(name);
  const there = findExistingPage(pfx + slug);
  const ref = there && (pageRef(there).startsWith(pfx) || (/^\d\/$/.test(pfx) && statusDirOf(there)))
    ? pageRef(there) : pfx + slug;
  const lead = picked.length - picked.trimStart().length, tail = picked.length - picked.trimEnd().length;
  const link = "[[" + ref + (slug === name || pfx === "c/" ? "" : "][" + name) + "]]";
  const {path, block} = hit, was = block.title;
  block.title = before + picked.slice(0, lead) + link + picked.slice(picked.length - tail) + whole.slice(to);
  host.textContent = block.title;      // the blur the redraw causes writes this back
  createLinkedPages(block.title);
  touch(path); noteTodoTouched();
  render(); focusBlock(block.id);
  notify("Linked “" + name + "”.", "info",
    {label: "undo", run: () => { block.title = was; touch(path); render(); }});
  return true;
}
