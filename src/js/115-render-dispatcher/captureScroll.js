function captureScroll() {
  const c = $("#content");
  if (!c || !c.dataset.scrollView) return;
  const at = new Map();
  for (const n of c.querySelectorAll("[data-keep-scroll]"))
    at.set(n.dataset.keepScroll, [n.scrollTop, n.scrollLeft]);
  VIEW_SCROLL.set(c.dataset.scrollView, {top: c.scrollTop, left: c.scrollLeft, at});
}
