function childrenFact(r) {
  const value = relChildrenRaw(r);
  if (!r.block && isContextPath(r.path)) {
    const kids = contextKids(r);
    return {key: "children", raw: "children:: " + value, save: () => {},
      pills: () => [factPill(kids.length ? kids.map(ctxName).join(", ") : "+ sub context",
        "fwant", "The contexts inside this one", () => relChildPicker(r))]};
  }
  if (!r.block && templateChoiceDirective(value)) return propFact(r.path, "children", value);
  return {
    key: "children", raw: "children:: " + value,
    save: text => {
      const raw = trim(String(text).replace(/^(?:children|parent_of)\s*::\s*/i, ""));
      const rows = linksIn(raw).map(ref => relResolve(ref, r.space));
      if (rows.some(x => !x)) { notify("Choose existing pages or tasks for children.", "warn"); return; }
      if (rows.some(x => relWouldCycle(r, x))) { notify("That would create a parent cycle.", "warn"); return; }
      inSpace(r.space, () => {
        const p = relProps(r);
        p.children = raw;
        delete p.parent_of;
        touch(r.path);
      });
    },
    pills: () => [factPill(value ? linkWords(value) : "+ choose children", "fwant",
      "Children, not dependencies", () => relChildPicker(r))],
  };
}
