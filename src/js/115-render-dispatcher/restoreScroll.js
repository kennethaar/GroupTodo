function restoreScroll() {
  const c = $("#content");
  if (!c) return;
  const key = viewScrollKey(), was = VIEW_SCROLL.get(key);
  c.dataset.scrollView = key;
  c.scrollTop = was ? was.top : 0;
  c.scrollLeft = was ? was.left : 0;
  if (!was) return;
  for (const n of c.querySelectorAll("[data-keep-scroll]")) {
    const pos = was.at.get(n.dataset.keepScroll);
    if (pos) [n.scrollTop, n.scrollLeft] = pos;
  }
}
