function setSidebarHidden(hidden) {
  document.body.classList.toggle("sidebar-hidden", hidden);
  safeLS.set("gtd.sidebarHidden", hidden ? "1" : "0");
}
