function areaFact(path) {
  const area = areaOfProject(path);
  return {
    key: "area", raw: "area:: " + (area ? "[[a/" + area + "]]" : ""),
    save: v => {
      const m = /::\s*([\s\S]*)$/.exec(v);
      const text = trim(m ? m[1] : v);
      const link = factLinkTarget(text);
      const name = link ? trim(link.replace(/^a\//, "")) : text;
      if (!name) { setAreaOfProject(path, null); notify("Responsibility taken off."); return; }
      setAreaOfProject(path, baseName(createArea(name)));
    },
    pills: () => [area
      ? factPill(area, "farea", "the responsibility this serves", () => chipMenu(area, "the responsibility this serves", [
          ["a", "Go to " + area, "the responsibility page", () => followLink("a/" + area)],
          ["b", "Change the responsibility", null, () => openAreaPicker(path)],
          ["c", "Take it off", "the project stays where it is", () => { setAreaOfProject(path, null); render(); notify("Responsibility taken off."); }],
        ]))
      : factPill("no responsibility", "fwant", "A project nothing serves is a project nobody misses",
          () => openAreaPicker(path))],
  };
}
