/* A picture name an AI cannot match to a slide (#483): no word in it, only
   numbers or a camera code (PrintP1230617.jpg, IMG_0042.jpg, 7.png). A word
   is two letters or more on their own; "Harbour 2.jpg" has one. */
function slideAiUnreadable(name) {
  const stem = String(name || "").replace(/\.[^.]+$/, "");
  return !stem.split(/[\s_\-.,()+&]+/).some(t => /^\p{L}{2,}$/u.test(t) && !SLIDE_AI_CAMERA.has(t.toLowerCase()));
}
