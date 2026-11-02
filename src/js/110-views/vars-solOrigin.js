const solOrigin = (box, fx, fy) => {
  box.dataset.ox = fx; box.dataset.oy = fy;
  box.style.transformOrigin = fx * 100 + "% " + fy * 100 + "%";
};
