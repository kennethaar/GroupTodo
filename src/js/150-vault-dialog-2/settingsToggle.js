/* A tick box as the action of a row. */
function settingsToggle(on, label, flip) {
  const box = el("button", {type: "button", role: "checkbox", "aria-checked": on ? "true" : "false",
    "aria-label": label, class: "spacetoggle" + (on ? " on" : ""), onclick: () => {
      on = !on;
      box.classList.toggle("on", on);
      box.textContent = on ? "✓" : "";
      box.setAttribute("aria-checked", on ? "true" : "false");
      flip(on);
    }}, on ? "✓" : "");
  return box;
}
