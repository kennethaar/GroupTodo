/* Backspace at the very start of a line joins it onto the end of the line
   above, the one you can see -- the last line of the bullet before it, a body
   line or its parent -- with the caret where the two meet, the way every
   editor does it. The line's children stay where they were in the reading
   order: under the line it joined, or in its place when that is its parent. */
function focusLineAt(sel, offset) {
  requestAnimationFrame(() => {
    if ($("#modalRoot").firstChild) return;
    const node = $(sel);
    if (!node) return;
    node.focus();
    setHostText(node, node.textContent, offset);
  });
}
