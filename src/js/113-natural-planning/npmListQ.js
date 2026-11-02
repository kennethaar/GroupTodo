/* A question answered a line at a time: Enter adds the line, Enter on an empty box moves on. */
function npmListQ(k) {
  const lines = NPM[k];
  const input = el("input", {class: "npmin", placeholder: lines.length ? "Another line, or Enter to go on" : "Type a line and press Enter",
    "aria-label": "A line"});
  const add = () => { const v = trim(input.value); if (!v) return false; lines.push(v); input.value = ""; npmSave(); render(); return true; };
  NPM_PENDING = () => { const v = trim(input.value); if (v) { lines.push(v); npmSave(); } };
  input.addEventListener("keydown", e => {
    if (e.key !== "Enter" || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    if (!add()) npmNext();
  });
  return [el("ul", {class: "npmlines"}, ...lines.map((l, n) => el("li", {},
      el("button", {class: "npmline", title: "Click to change it",
        onclick: () => { lines.splice(n, 1); npmSave(); render(); requestAnimationFrame(() => { const b = $(".npmin"); if (b) { b.value = l; b.focus(); } }); }}, "• " + l)))),
    input,
    el("div", {class: "npmsay"}, "Enter adds the line. Enter on an empty box goes on.")];
}
