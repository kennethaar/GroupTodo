function solShrink(box) {
  if (!box.dataset.grown) return;
  delete box.dataset.grown;
  Object.assign(box.style, {width: "", height: "", marginBottom: ""});
}
