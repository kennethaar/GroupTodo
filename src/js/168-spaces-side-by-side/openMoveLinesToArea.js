/* The button on the picked-lines bar and the line toolbar: choose the area,
   then move the lines there. */
function openMoveLinesToArea(items) {
  const others = Spaces.list.filter(sp => sp.name !== items[0]?.space);
  if (!others.length) { notify("There is no other area to move to.", "warn"); return; }
  const body = el("div", {}, el("p", {}, (items.length === 1 ? "This line" : items.length + " lines") +
    " and the pages they link to move out of " + items[0].space + "."));
  for (const sp of others) body.append(el("button", {class: "pick", onclick: () => {
    closeModal();
    moveLinesToArea(items, sp.name).catch(e => notify("The move did not finish: " + e.message, "error"));
  }}, sp.name));
  modal({title: "Move to another area", body, foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel")]});
}
