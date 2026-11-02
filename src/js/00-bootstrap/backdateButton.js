/* A date field behind a button, so the toast stays one line for the usual
   case of having finished it just now. */
function backdateButton(e, after) {
  const pick = el("input", {type: "date", max: todayISO(), value: e.day, "aria-label": "Done on",
    style: "display:none"});
  pick.addEventListener("change", () => {
    if (pick.value && pick.value !== e.day && backdateDone(e, pick.value)) after(pick.value);
  });
  const btn = el("button", {class: "btn sm ghost", title: "Finished on an earlier day", onclick: () => {
    btn.style.display = "none";
    pick.style.display = "";
    pick.focus();
    try { pick.showPicker(); } catch (_) {}
  }}, "Backdate");
  return [btn, pick];
}
