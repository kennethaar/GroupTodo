function solKbTake(r) {
  const k = SOL_KB && SOL_KB.k, box = solBox(k), a = SOL_ACTS.get(k);
  SOL_KB = null; solUnpaint();
  if (!box) return;
  solTake(r, box);
  if (a && !a.stay) requestAnimationFrame(() => solCardEl()?.focus({preventScroll: true}));
}
