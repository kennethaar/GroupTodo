/* The presenter window's camera box (#485): you, mirrored as in a mirror, a
   light while the camera is on, and the Camera strip: Auto (saying what it
   picked) and the modes for this slide, then how long a picture shows first.
   The notes go right under it, so your eyes stay near the lens. The preview
   itself is put in by presenterDraw, once the box is in that window. */
function presenterCam() {
  const c = DECK.cam, wait = +PREF.get("present.campic", 10) || 0;
  const setWait = n => {
    PREF.set("present.campic", n);
    slideCamShow();
    presenterDraw();
  };
  return el("div", {class: "pcam"},
    el("div", {class: "pcamside"},
      el("div", {class: "ponair", role: "status"}, "● On air"),
      el("div", {class: "pcamstrip", role: "group", "aria-label": "Camera on this slide"},
        el("span", {class: "plabel"}, "Camera"),
        el("button", {class: "pcamauto", "aria-pressed": String(!c.pick), title: "Chosen by the slide",
          onclick: () => slideCamPick(null)}, "Auto (" + SLIDE_CAM_NAMES[c.auto] + ")"),
        ...SLIDE_CAM_MODES.map(m => el("button", {class: "pcammode", "aria-pressed": String(c.pick?.mode === m),
          title: "On this slide (C)", onclick: () => slideCamPick(m)}, SLIDE_CAM_NAMES[m]))),
      el("div", {class: "pcamwait", role: "group", "aria-label": "Picture first, then you"},
        el("span", {class: "plabel"}, "Picture first"),
        ...SLIDE_CAM_WAITS.map(n => el("button", {"aria-pressed": String(wait === n), onclick: () => setWait(n)},
          n ? n + " s" : "At once")))));
}
