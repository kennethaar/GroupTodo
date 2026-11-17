/* Nothing but the page: the sidebar and the top bar go until Esc or the button.
   On a computer it is a teleprompter too (#324): the paragraph you were at
   is brought to the middle, and stays where it was on the way out. */
function setWritingFocus(on) {
  // Focus in Next (#360) is one card, not text to follow.
  const box = $("#content"), tp = on && tpWanted() && !ENGAGE;
  const a = document.activeElement;
  const mid = box ? box.getBoundingClientRect().top + box.clientHeight / 2 : 0;
  const at = box && (a && a.isContentEditable && box.contains(a) && a.matches(TP_UNITS) ? a
    : box.querySelector(".tp-lit") || tpNearest(box, mid).node);
  /* The Journal keeps one column (#323): the area the caret is in, else the first. */
  const cards = box ? [...box.querySelectorAll(".jview .jgrid > .jcard:not(.trkcol)")] : [];
  const card = on && cards.length ? (a && a.closest && a.closest(".jcard")) || cards[0] : null;
  FOCUS_COL.space = card ? card.dataset.space || null : null;
  for (const c of cards) c.classList.toggle("focuscol", c === card);
  document.body.classList.toggle("bookfocus", on);
  document.body.classList.toggle("teleprompt", tp);
  $("#focusLeave")?.remove();
  // The way out sits where the way in was, at full strength, naming its key (#323).
  if (on) document.body.append(el("button", {id: "focusLeave", class: "btn sm", title: "Back to the sidebar and the bar (Esc)",
    onmousedown: e => e.preventDefault(), onclick: () => setWritingFocus(false)},
    el("span", {"aria-hidden": "true"}, "✕ "), "Leave focus ", el("kbd", {}, "Esc")));
  TELEPROMPT.obs?.disconnect();
  TELEPROMPT.obs = null;
  if (tp && box) {
    // A new page drawn while in Focus gets its light at once.
    TELEPROMPT.obs = new MutationObserver(tpSoon);
    TELEPROMPT.obs.observe(box, {childList: true});
    if (at) tpCentre(at, true);
    tpLight();
  } else {
    tpLight();
    if (at) at.scrollIntoView({block: "center"});
  }
  // Leaving Focus in Next brings the whole list back.
  if (!on && ENGAGE) { ENGAGE = null; render(); }
}
