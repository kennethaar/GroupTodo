function newsList(entries, max = 3) {
  const heads = newsHeads(entries);
  return el("ul", {class: "newslist"}, ...heads.slice(0, max).map(h => el("li", {}, h)),
    heads.length > max ? el("li", {class: "quiet"}, "and " + (heads.length - max) + " more") : null);
}
