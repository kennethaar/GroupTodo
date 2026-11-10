// The tip, for a Who are you waiting for dialog; null once it has been shown.
function waitTip() {
  if (PREF.get(WAIT_TIP_PREF, "") === "1") return null;
  PREF.set(WAIT_TIP_PREF, "1");
  return el("p", {class: "waittip", role: "note"},
    el("b", {}, "Best practice: "), "write it as ", el("code", {}, WAIT_TIP_EXAMPLE), " " + WAIT_TIP_WHY);
}
