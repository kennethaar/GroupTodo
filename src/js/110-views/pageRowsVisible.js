function pageRowsVisible() {
  return memo("pageRows", () => {
    const degree = new Map();
    for (const nd of graphFull().nodes) degree.set(nd.key, nd.deg);
    return acrossSpaces(() => allPages(p => pageKind(p) !== "verb" && p !== SETTINGS_PATH).map(path => {
      const props = getPage(path)?.props || {};
      return {path, title: isJournalPath(path) ? pageRef(path) : pageTitle(path), kind: pageKind(path),
        // A day page is about its day, whenever it was last touched.
        edited: isJournalPath(path) ? journalDate(path) || "" : dateIn(props.updated || props.created || ""),
        links: degree.get((V.space || "") + "\u0000" + path) || 0};
    }));
  });
}
