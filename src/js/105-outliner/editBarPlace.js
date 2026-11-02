/* Above the on-screen keyboard, which shrinks the visual viewport, not the
   page, and under the page only, leaving the sidebar's foot alone. */
function editBarPlace() {
  const bar = $("#editBar"), vv = window.visualViewport, main = $("#main");
  if (!bar || bar.hidden) return;
  bar.style.bottom = (vv ? Math.max(0, innerHeight - vv.height - vv.offsetTop) : 0) + "px";
  bar.style.left = (main ? Math.max(0, main.getBoundingClientRect().left) : 0) + "px";
}
