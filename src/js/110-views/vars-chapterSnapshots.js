const chapterSnapshots = path => allPages(p => isSnapshotPath(p) && findExistingPage(namesIn(getPage(p)?.props?.of || "")[0] || "") === path)
  .sort((a, b) => String(getPage(a).props.created || "").localeCompare(String(getPage(b).props.created || "")));
