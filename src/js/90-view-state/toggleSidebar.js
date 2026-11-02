function toggleSidebar() {
  if (isNarrow()) document.body.classList.toggle("nav-open");
  else setSidebarHidden(!document.body.classList.contains("sidebar-hidden"));
}
