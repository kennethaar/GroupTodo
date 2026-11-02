/* One line somebody has to get out of the app and into a chat window: the
   clipboard where the browser allows it, and a box you can select where it
   does not. */
async function copyOneLine(text, say) {
  try {
    await navigator.clipboard.writeText(text);
    notify(say.ok);
    return true;
  } catch (_) {}
  const box = el("input", {value: text, readonly: "readonly", style: "font-family:var(--mono);font-size:12px"});
  modal({
    center: true, title: say.title,
    body: el("div", {}, el("div", {class: "field"}, box,
      el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"}, say.hint))),
    foot: [el("button", {class: "btn primary", onclick: closeModal}, "Done")],
  });
  setTimeout(() => { box.focus(); box.select(); }, 40);
  return false;
}
