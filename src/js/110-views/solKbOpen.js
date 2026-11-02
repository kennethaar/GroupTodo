function solKbOpen(k) {
  const box = solBox(k);
  if (!box) return false;
  solOrigin(box, +box.dataset.dox, +box.dataset.doy);
  SOL_KB = {k, i: 0};
  solKbShow();
  return true;
}
