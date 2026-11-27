/* Shift+C, or Camera in the presenter window (#485): your webcam on or off
   for the talk. It opens once and stays one layer under the slides' words,
   so no slide asks again. Off stops it, and the camera's light goes out. */
async function slideCamToggle() {
  if (!DECK) return;
  if (DECK.cam) { slideCamOff(); presenterDraw(); return; }
  if (DECK.camOpening) return;
  const deck = DECK.deck;
  DECK.camOpening = true;
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false}); }
  catch (e) {
    if (DECK) DECK.camOpening = false;
    notify("No camera to show. Check that one is plugged in and allowed for this page.", "warn");
    return;
  }
  // The talk ended while the camera was opening: let it go again.
  if (!DECK || DECK.deck !== deck) { stream.getTracks().forEach(t => t.stop()); return; }
  DECK.camOpening = false;
  const video = el("video", {class: "cam", autoplay: "", playsinline: "", "aria-hidden": "true"});
  video.muted = true;
  video.srcObject = stream;
  deck.prepend(video);     // first, so every slide's words lie over it
  video.play?.()?.catch?.(() => {});
  DECK.cam = {stream, video, pick: null, auto: "bubble", mode: "bubble", pic: "", picAt: 0, timer: 0, pv: null};
  slideCamShow();
  presenterDraw();
}
