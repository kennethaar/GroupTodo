/* Alt held on a slide (#487): what can move gets a dashed outline, and
   ↺ Reset slide shows top-right. Top-left, the talk's time (a click starts
   it again) and the camera's switch, so neither needs the presenter window
   (#485). on=false takes them away. */
function slideArrShow(on) {
  const deck = DECK?.deck;
  if (!deck || DECK.wait) return;
  deck.classList.toggle("arranging", on);
  deck.querySelector(".arrreset")?.remove();
  deck.querySelector(".arrtools")?.remove();
  if (!on) return;
  const keep = e => e.stopPropagation();     // a press here is not an Alt+drag on the slide
  deck.append(el("button", {class: "arrreset", type: "button", title: "Take every move on this slide off",
    onpointerdown: keep, onclick: () => slideArrReset()}, "↺ Reset slide"));
  const camOn = !!DECK.cam;
  deck.append(el("div", {class: "arrtools"},
    el("button", {class: "arrtime", type: "button", title: "Time since you started. Click to start again", onpointerdown: keep,
      onclick: () => { if (DECK) { DECK.t0 = Date.now(); presenterTick(); } }}, "⏱ " + slideTalkTime()),
    el("button", {class: "arrcam", type: "button", "aria-pressed": String(camOn), title: "Your camera over the talk (Shift+C)", onpointerdown: keep,
      onclick: async () => {
        await slideCamToggle();
        if (DECK?.deck.classList.contains("arranging")) slideArrShow(true);
      }}, camOn ? "◉ Camera on" : "◉ Camera off")));
}
