/* Hours, an amount or stock: one box for the line as it is said, and on
   today's page Start and Stop, which write the clock now into it. */
function trackerLineWidget(t, save, {date = null} = {}) {
  const L = t.code;
  const box = el("span", {class: "trkw", contenteditable: "false"});
  const input = el("input", {class: "tv tvw", type: "text", inputmode: L === "t" ? "text" : "decimal", value: t.raw,
    placeholder: L === "t" ? "07:12 - 10:00, 10:30 - 12:30" : L === "a" ? "129.50 + 45" : "+3, -1 or =12",
    title: TRACKER_LETTERS[L].word, "aria-label": TRACKER_LETTERS[L].word});
  input.addEventListener("keydown", e => {
    e.stopPropagation();
    if (e.key === "Enter" || e.key === "Escape") { e.preventDefault(); input.blur(); }
  });
  input.addEventListener("change", () => save(trackerText(t, [trim(input.value)])));
  box.append(input);
  if (L === "t") {
    const v = lineValue("t", t.raw, date);
    if (v.value || v.open) box.append(el("span", {class: "tu"}, fmtMinutes(v.value)));
    if (v.stale) box.append(el("span", {class: "chip late", title: "A stretch with no end counts nothing"}, "no end"));
    if (date && date === todayISO()) box.append(el("button", {class: "textbtn tadd", type: "button",
      onclick: e => { e.stopPropagation(); save(trackerText(t, [v.open ? stopClock(t.raw) : startClock(t.raw)])); render(); }},
      svgIcon(v.open ? ICON_STOP : ICON_PLAY), v.open ? " Stop" : " Start"));
  }
  box.addEventListener("mousedown", e => e.stopPropagation());
  return box;
}
