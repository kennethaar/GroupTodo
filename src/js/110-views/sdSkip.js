function sdSkip(a, b) {
  SD.skipped.add(sdPairKey(sdSlug(a), sdSlug(b)));
  SD.keep = null;
  render();
}
