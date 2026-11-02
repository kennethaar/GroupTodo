function setHorizon(key, lines) {
  const page = horizonPage(key, true);
  page.blocks = lines.filter(l => trim(l)).map(l => newBlock({title: trim(l)}));
  touch(horizonPath(key));
}
