function onConvertKey(e) {
  if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  if (e.code === "KeyI") {
    if ($("#modalRoot").firstChild) return;
    if (linkSelectedWords(e, "area")) return;
    if (onAreaKey(e)) { e.preventDefault(); e.stopImmediatePropagation(); }
    return;
  }
  const kind = CONVERT_KEYS[e.code];
  if (!kind) return;
  if (linkSelectedWords(e, kind)) return;
  if (e.target.closest && e.target.closest(".blk .txt") && FLY_KEYS[e.code]) return;
  const target = convertTarget(e);
  if (!target) return;
  const {r, host} = target;
  e.preventDefault();
  e.stopImmediatePropagation();
  const at = host && kind === "context" ? wordBeforeCaret(host) : null;
  if (host) host.blur();
  if (!r.block) { convertNodePage(r, KIND_PREFIX[kind] ? KIND_PREFIX[kind].slice(0, -1) : kind); return; }
  inSpace(r.space, () => {
    if (!STATUS_KEYS.includes(kind)) { makeFromLine(r.path, r.block, kind, at); return; }
    const linked = linksIn(r.block.title).map(findExistingPage)
      .find(p => p && (statusDirOf(p) || pageKind(p) === "checklist"));
    if (linked) { convertNodePage({path: linked, space: r.space}, kind); return; }
    const name = bareLineName(r.block);
    if (name) insertMakeLink(r.path, r.block, kind + "/" + slugify(name));
  });
}
