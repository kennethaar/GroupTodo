function chapterStage(path) {
  const stages = bookStages(), said = trim(String(getPage(path)?.props?.stage || "")).toLowerCase();
  return stages.find(s => s.name.toLowerCase() === said) || stages[0];
}
