/* On hold is always until something: a day it comes back, or no date, until
   you take it off. So the moment a task goes on hold from a menu it asks
   which, the same choice as the panel's Hold until. Closed, it stays on hold
   with no day, as it would have from the panel. */
function askHoldUntil(a) {
  const input = el("input", {type: "date", "aria-label": "Hold until", min: todayISO(),
    value: (v => v && v !== HOLD_OPEN ? v : "")(holdValue(blockProp(a.block, "hold")))});
  const save = day => {
    closeModal();
    inSpace(a.space, () => {
      setBlockProp(a.block, "hold", day ? "[[" + day + "]]" : HOLD_OPEN);
      touch(a.path);
    });
    render();
  };
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); save(input.value); }
  });
  modal({
    center: true, title: "On hold until when?",
    body: el("div", {class: "field"}, el("label", {}, plainTitle(a.title)), input),
    foot: [el("button", {class: "btn ghost", onclick: () => save("")}, "No date"),
           el("button", {class: "btn primary", onclick: () => save(input.value)}, "Save")],
  });
  requestAnimationFrame(() => input.focus());
}
