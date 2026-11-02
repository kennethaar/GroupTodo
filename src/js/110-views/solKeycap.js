/* The box's numpad key written on it, so the keys are learnt by looking. */
function solKeycap(k) {
  const n = k === "CARD" ? "5" : k;
  return el("kbd", {class: "solkey", title: "Numpad " + n + (k === "CARD" ? ": back to the project, twice to skip it" : ": aim at this answer, again to take it"),
    "aria-hidden": "true"}, n);
}
