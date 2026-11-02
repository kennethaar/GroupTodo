function closeDoneToast() {
  const T = DONE_TOAST;
  clearTimeout(T.timer);
  if (T.el) T.el.remove();
  T.el = null;
}
