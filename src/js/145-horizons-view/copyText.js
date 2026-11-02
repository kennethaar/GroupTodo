/* The same bargain for a block of text: the clipboard where the browser allows
   it, and a box you can select where it does not -- a report exists to be
   pasted somewhere else, so "it is on screen" is not finished. */
async function copyText(text, okMsg, title) {
  try {
    await navigator.clipboard.writeText(text);
    notify(okMsg || "Copied.");
    return true;
  } catch (_) {}
  const box = el("textarea", {readonly: "readonly",
    style: "width:100%;min-height:260px;font-family:var(--mono);font-size:12px"});
  box.value = text;
  modal({
    center: true, title: title || "Copy this",
    body: el("div", {}, el("div", {class: "field"}, box,
      el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
        "This browser would not let the app reach the clipboard, so select it and copy."))),
    foot: [el("button", {class: "btn primary", onclick: closeModal}, "Done")],
  });
  setTimeout(() => { box.focus(); box.select(); }, 40);
  return false;
}
