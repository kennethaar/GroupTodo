function dotsToEst(title) {
  const m = EST_DOTS_RE.exec(title || "");
  return m ? withEst(title.slice(m[0].length), m[1].length) : title;
}
