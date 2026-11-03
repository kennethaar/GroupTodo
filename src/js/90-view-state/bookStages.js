function bookStages() {
  const list = bookStageList();
  const stages = list ? stagesOf(list)
    : byPlace(String(bookProps().stages || "").split(",").map(trim).filter(Boolean));
  return stages.length >= 2 ? stages : byPlace(BOOK_STAGES);
}
