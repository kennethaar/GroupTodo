function trackerTapWidget(t, save) {
  const icon = tapIcon(t);
  const box = el("span", {class: "trkw trktap", contenteditable: "false"});
  let raw = t.raw;
  const write = n => { raw = icon.repeat(Math.max(0, n)); save(trackerText(t, [raw])); build(); };
  const tap = (fn, attrs, ...kids) => el("button", Object.assign({type: "button",
    onclick: e => { e.stopPropagation(); fn(); }}, attrs), ...kids);
  function build() {
    const n = tapCount(raw);
    box.textContent = "";
    // The name is already beside it, on the line and among the page's values.
    box.append(tap(() => write(n + 1), {class: "tapadd", title: "One more " + trackerTitle(t.name)}, "+1"));
    if (n > 10) box.append(el("span", {class: "tapmany"}, icon + " \u00d7 " + n),
      tap(() => write(n - 1), {class: "textbtn", title: "One less"}, "\u22121"));
    else for (let i = 0; i < n; i++) box.append(tap(() => write(n - 1), {class: "tapicon", title: "Take one off"}, icon));
    if (n) box.append(tap(() => {
      const was = raw;
      write(0);
      notify(trackerTitle(t.name) + " is back to 0.", "info", {label: "Undo", run: () => { save(trackerText(t, [was])); render(); }});
    }, {class: "textbtn tapreset", title: "Back to 0"}, "\u21BA"));
  }
  box.addEventListener("mousedown", e => e.stopPropagation());
  build();
  return box;
}
