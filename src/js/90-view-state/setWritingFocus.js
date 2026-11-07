/* Nothing but the page: the sidebar and the top bar go until Esc or the button.
   On a computer it is a teleprompter too (#324): the paragraph you were at
   is brought to the middle, and stays where it was on the way out. */
function setWritingFocus(on) {
  const box = $("#content"), tp = on && tpWanted();
  const a = document.activeElement;
  const mid = box ? box.getBoundingClientRect().top + box.clientHeight / 2 : 0;
  const at = box && (a && a.isContentEditable && box.contains(a) && a.matches(TP_UNITS) ? a
    : box.querySelector(".tp-lit") || tpNearest(box, mid).node);
  document.body.classList.toggle("bookfocus", on);
  document.body.classList.toggle("teleprompt", tp);
  $("#focusLeave")?.remove();
  if (on) document.body.append(el("button", {id: "focusLeave", class: "btn sm ghost", title: "Back to the sidebar and the bar (Esc)",
    onclick: () => setWritingFocus(false)}, "Leave focus"));
  TELEPROMPT.obs?.disconnect();
  TELEPROMPT.obs = null;
  if (tp && box) {
    // A new page drawn while in Focus gets its light at once.
    TELEPROMPT.obs = new MutationObserver(tpSoon);
    TELEPROMPT.obs.observe(box, {childList: true});
    if (at) tpCentre(at);
    tpLight();
  } else {
    tpLight();
    if (at) at.scrollIntoView({block: "center"});
  }
}
