function pickChapterStage(path) {
  const stages = bookStages(), cur = chapterStage(path);
  listPicker({title: "Stage of " + pageTitle(path), items: stages, label: s => s.name,
    detail: s => s === cur ? "now" : null, start: stages.indexOf(cur), typeahead: true,
    onPick: s => setChapterStage(path, s.name)});
}
