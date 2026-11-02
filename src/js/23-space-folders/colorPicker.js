/* ---------- choosing a space's colour ----------
   One chooser, used by "New space", the space switcher and Vault & sync:
   twelve swatches, a native well for anything the palette does not hold, and
   the hex itself for a colour that has to match something exactly. It reports
   each choice through onPick and stores nothing; the caller decides whether and
   when a choice is committed. */
function colorPicker(initial, onPick) {
  let cur = normHex(initial) || SPACE_COLORS[0];
  const wrap = el("div", {class: "swatches"});
  const well = el("input", {type: "color", "aria-label": "Any other colour"});
  const wellBox = el("span", {class: "colorwell", title: "Any other colour"}, well);
  const hex = el("input", {class: "hexinput", "aria-label": "Colour as hex",
                           spellcheck: "false", maxlength: "7"});

  const paint = () => {
    for (const b of wrap.querySelectorAll(".swatch")) {
      const on = b.dataset.hex === cur;
      b.classList.toggle("on", on);
      b.textContent = on ? "\u2713" : "";
      b.style.color = on ? inkOn(cur) : "transparent";
    }
    wellBox.classList.toggle("on", !SPACE_PALETTE.some(c => c[0] === cur));
    well.value = cur;
    // Only rewrite what is being typed when it means a different colour, so
    // "#6aa" on the way to "#6aa3ff" is not snatched back mid-keystroke.
    if (normHex(hex.value) !== cur) hex.value = cur;
  };
  const choose = next => {
    const h = normHex(next);
    if (!h || h === cur) { paint(); return; }   // nonsense in the hex box snaps back
    cur = h;
    paint();
    onPick(cur);
  };

  for (const [c, label] of SPACE_PALETTE) {
    const b = el("button", {class: "swatch", title: label, "aria-label": label,
      style: "background:" + c, onclick: e => { e.preventDefault(); choose(c); }});
    b.dataset.hex = c;
    wrap.append(b);
  }
  well.addEventListener("input", () => choose(well.value));
  hex.addEventListener("input", () => { if (normHex(hex.value)) choose(hex.value); });
  hex.addEventListener("change", () => { choose(hex.value); hex.value = cur; });
  wrap.append(el("span", {class: "sep"}), wellBox, hex);
  paint();
  return wrap;
}
