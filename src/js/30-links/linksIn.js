function linksIn(text) {
  const out = []; let m;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text || ""))) out.push(trim(m[1]));
  return out;
}
