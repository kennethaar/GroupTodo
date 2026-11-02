function askAfterModal(fn) {
  if ($("#modalRoot").textContent === "" && !$("#modalRoot").firstChild) fn();
  else MODAL_AFTER = fn;
}
