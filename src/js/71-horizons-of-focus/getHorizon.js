function getHorizon(key) {
  const page = horizonPage(key, false);
  if (!page) return [];
  return (page.blocks || []).map(b => b.title).filter(t => trim(t));
}
