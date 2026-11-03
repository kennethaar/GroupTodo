/* Nothing but the page: the sidebar and the top bar go until Esc or the button. */
function setWritingFocus(on) {
  document.body.classList.toggle("bookfocus", on);
  $("#focusLeave")?.remove();
  if (on) document.body.append(el("button", {id: "focusLeave", class: "btn sm ghost", title: "Back to the sidebar and the bar (Esc)",
    onclick: () => setWritingFocus(false)}, "Leave focus"));
}
