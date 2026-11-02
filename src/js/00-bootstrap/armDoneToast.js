function armDoneToast() {
  const T = DONE_TOAST;
  clearTimeout(T.timer);
  if (!T.el || !T.el.isConnected) return;
  if (T.el.contains(document.activeElement) || [...T.el.querySelectorAll("input")].some(i => trim(i.value))) return;
  T.timer = setTimeout(closeDoneToast, Math.max(30000, 5000 * T.n));
}
