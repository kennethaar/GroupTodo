/* A zoomed box reaches down to show all its options. Its height grows by what
   was hidden and a negative margin takes the same back, so the grid row and
   every other box stay exactly where they were. */
function solGrow(box) {
  if (box.dataset.grown) return;
  const need = box.scrollHeight - box.clientHeight;
  if (need <= 1) return;
  box.dataset.grown = "1";
  Object.assign(box.style, {width: box.offsetWidth + "px", height: box.offsetHeight + need + "px", marginBottom: -need + "px"});
}
