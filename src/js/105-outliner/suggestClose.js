function suggestClose() {
  if (!SUGGEST) return;
  SUGGEST.box.remove();
  SUGGEST = null;
}
