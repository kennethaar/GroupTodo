/* ⏱ Count down… in the presenter window (#489): the same times as ▶ Present
   ▾ (#486), picked here, as a menu on the big screen would not be seen.
   Another time is typed in a time field. */
function presenterTimes() {
  const path = DECK.path, {now, times} = presentWaitTimes(path);
  const pick = t => presentWaitSet(path, t);
  const field = el("input", {type: "time", "aria-label": "Another time"});
  const own = () => {
    const m = SLIDE_WAIT_TIME_RE.exec(field.value);
    if (m) pick((+m[1]) + ":" + m[2]);
  };
  field.onkeydown = e => { if (e.key === "Enter") { e.stopPropagation(); own(); } };
  return el("div", {class: "ptimes", role: "group", "aria-label": "Count down to the start"},
    el("span", {class: "plabel"}, "The talk starts at"),
    now ? el("button", {class: "ptime", title: "As set on this page", onclick: () => pick(now.text)}, "✓ " + now.text) : null,
    ...times.map(t => el("button", {class: "ptime", onclick: () => pick(t)}, t)),
    field,
    el("button", {class: "ptimeset", onclick: own}, "Count down"));
}
