function roomCard(name, s, on, onclick) {
  const pct = s.pct ?? 100;
  return el("button", {class: "chorecard", "aria-pressed": String(on),
    title: on ? "Show every room again" : "Show only this room", onclick},
    el("div", {class: "chorecard-h"}, el("span", {class: "choreroom-n"}, name),
      el("span", {class: "choreroom-p"}, s.pct == null ? "–" : s.pct + "%")),
    el("span", {class: "freshbar"}, el("i", {style: "width:" + pct + "%;background:" + freshColor(pct)})),
    roomCounts(s),
    el("div", {class: "chorecard-t"}, dueTimeText(s) + (s.who && s.n ? " · " + s.who + " next" : "")));
}
