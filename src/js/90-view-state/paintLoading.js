function paintLoading() {
  if (LOADING_PAINT) return;
  LOADING_PAINT = requestAnimationFrame(() => {
    LOADING_PAINT = 0;
    const old = document.getElementById("navLoad"), node = navLoading();
    if (old) { if (node) old.replaceWith(node); else old.remove(); }
    else if (node && $("#nav")) renderNav();
  });
}
