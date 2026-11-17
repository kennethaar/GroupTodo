/* Draws the tip's example state (#427) into its box: the lines the way a day
   page writes them, states and links bold, a caret on the line being typed
   while it plays, the popup under it, and the caption strip with its dots. */
function meetingTipDraw(host, s) {
  const out = [];
  s.lines.forEach((l, i) => {
    if (i) out.push("\n");
    const row = el("span", {class: "coach-dl"}, "  ".repeat(l.ind));
    if (l.st) row.append(el("b", {}, l.st), " ");
    for (const part of l.text.split(/(\[\[[^\]]*\]\])/)) if (part) row.append(/^\[\[/.test(part) ? el("b", {}, part) : part);
    if (!s.done && i === s.lines.length - 1) row.append(el("span", {class: "coach-caret", "aria-hidden": "true"}));
    out.push(row);
  });
  host.replaceChildren(...out);
  const wrap = host.parentNode;
  if (!wrap) return;
  wrap.querySelector(":scope > .coach-pop")?.remove();
  const caret = host.querySelector(".coach-caret");
  if (s.popup && caret) {
    const pop = el("div", {class: "coach-pop", "aria-hidden": "true"},
      ...s.popup.map((r, i) => el("div", {class: i ? "" : "on"}, r)));
    pop.style.left = Math.max(0, caret.offsetLeft - host.scrollLeft - 40) + "px";
    pop.style.top = caret.offsetTop + caret.offsetHeight + 4 + "px";
    wrap.append(pop);
  }
  const cap = wrap.querySelector(":scope > .coach-cap");
  if (cap) {
    const caps = MEETING_DEMO.filter(op => op.cap), op = caps[s.n - 1];
    cap.replaceChildren(
      el("span", {class: "coach-captext"}, op ? [op.key ? el("kbd", {}, op.key) : null, op.key ? " " : null, op.cap] : null),
      el("span", {class: "coach-dots", "aria-hidden": "true"},
        ...caps.map((_, i) => el("i", {class: i < s.n ? "on" : ""}))));
  }
}
