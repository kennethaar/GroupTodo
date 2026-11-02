function goFromNav(view, btn) {
  if (view === state.view) { go(view); return; }
  const ticket = ++NAV_PENDING;
  for (const b of document.querySelectorAll("#nav .nav-item.active")) {
    b.classList.remove("active"); b.removeAttribute("aria-current");
  }
  if (btn) { btn.classList.add("active"); btn.setAttribute("aria-current", "page"); }
  // Where you were is kept now, before the placeholder scrolls it back to the top.
  captureScroll();
  delete $("#content").dataset.scrollView;
  showNavigationLoading((VIEW_TITLE[view] || "") + "...");
  requestAnimationFrame(() => setTimeout(() => { if (ticket === NAV_PENDING) go(view); }, 0));
}
