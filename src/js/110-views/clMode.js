/* Clarify's two ways (#523): every answer at once, or Quick, which asks only
   to do or note. The pick is remembered. */
function clMode() {
  const quick = !!PREF.get("clarify.quick", "");
  const pick = on => { PREF.set("clarify.quick", on ? "1" : ""); CL.editing = null; render(); };
  return el("div", {class: "vseg clmode", role: "group", "aria-label": "Clarify with"},
    el("button", {"aria-pressed": String(!quick), onclick: () => pick(false)}, "All answers"),
    el("button", {"aria-pressed": String(quick), onclick: () => pick(true)}, "Quick"));
}
