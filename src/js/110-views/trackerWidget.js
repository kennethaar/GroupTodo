function trackerWidget(t, save, opts = {}) {
  if (t.code === "i") return trackerTapWidget(t, save);
  if (wholeLineTracker(t.code)) return trackerLineWidget(t, save, opts);
  const vals = t.values.slice();
  const box = el("span", {class: "trkw", contenteditable: "false"});
  const write = () => save(trackerText(t, vals));
  const build = focusLast => {
    box.textContent = "";
    const slots = trackerSlots(t, vals.length);
    let set = 0, lastInput = null;
    slots.forEach((L, i) => {
      if (L === "c") {
        box.append(el("input", {type: "checkbox", class: "tchk", title: "Done",
          checked: TRACKER_DONE_RE.test(trim(vals[i] || "")) ? "" : null,
          onchange: e => { vals[i] = e.target.checked ? "x" : ""; write(); }}));
        return;
      }
      if (L === "s") {
        const cur = trackerNum(vals[i]) || 0;
        const stars = el("span", {class: "tstars", role: "radiogroup", "aria-label": "Rating 1 to 10"});
        for (let j = 1; j <= 10; j++) stars.append(el("button", {class: "tstar" + (j <= cur ? " on" : ""),
          type: "button", title: j + " of 10", "aria-label": j + " of 10",
          onclick: e => { e.stopPropagation(); vals[i] = cur === j ? "" : String(j); write(); build(); }}, "★"));
        box.append(stars);
        if (cur) box.append(el("span", {class: "tu"}, cur + "/10"));
        return;
      }
      if (L === "r") set++;
      const input = el("input", {class: "tv", type: "text", inputmode: "decimal", value: vals[i] || "",
        placeholder: L === "r" ? "set " + set : L === "k" ? "kg" : L === "m" ? "min" : "",
        title: L === "r" ? "Reps in set " + set : TRACKER_LETTERS[L].word,
        "aria-label": L === "r" ? "Reps in set " + set : TRACKER_LETTERS[L].word});
      input.addEventListener("keydown", e => {
        e.stopPropagation();
        if (e.key === "Enter" || e.key === "Escape") { e.preventDefault(); input.blur(); }
      });
      input.addEventListener("change", () => { vals[i] = trim(input.value).replace(",", "."); write(); });
      box.append(input);
      lastInput = input;
      if (TRACKER_LETTERS[L].unit) box.append(el("span", {class: "tu"}, TRACKER_LETTERS[L].unit));
    });
    if (trackerRepeats(t)) box.append(el("button", {class: "textbtn tadd", type: "button", title: "Another set",
      onclick: e => { e.stopPropagation(); while (vals.length < slots.length) vals.push(""); vals.push(""); build(true); }}, "+ set"));
    if (focusLast && lastInput) lastInput.focus();
  };
  box.addEventListener("mousedown", e => e.stopPropagation());
  build();
  return box;
}
