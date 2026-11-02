/* Alt+arrows, so the chart is not drag-only. A plan you can only edit with a
   mouse is a plan half the people here cannot edit. */
function nudgeKeys(rowEl, shift) {
  rowEl.addEventListener("keydown", e => {
    if (!e.altKey || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    e.preventDefault();
    const step = (e.shiftKey ? 7 : 1) * (e.key === "ArrowLeft" ? -1 : 1);
    shift(step);
  });
}
