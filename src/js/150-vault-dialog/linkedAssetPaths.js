function linkedAssetPaths() {
  const out = new Set(), re = /\]\((assets\/[^)\s]+)\)/g;
  for (const path of V.pages.keys()) {
    const text = serializePage(getPage(path));
    let m;
    while ((m = re.exec(text))) out.add(m[1]);
  }
  return [...out].sort();
}
