/* Focus (#244, #323): one button wherever you read or write, the same words
   everywhere. what is what stays: "page", "book", "day". */
function focusButton(what, cls = "textbtn") {
  return el("button", {class: cls + " focusbtn", title: "Only the " + what + ": no sidebar, no bar (Esc leaves)",
    // The click must not take the caret out of the line: Focus keeps the column it is in (#323).
    onmousedown: e => e.preventDefault(), onclick: () => setWritingFocus(true)}, "Focus");
}
