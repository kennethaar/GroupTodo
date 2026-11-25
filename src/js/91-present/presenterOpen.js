/* P: the presenter window (#431). Put it on your own screen and the slides on
   the big one. It shows the slide, what comes next, the notes for the lit
   line, the time, and every slide to jump to. */
function presenterOpen() {
  if (!DECK) return;
  if (DECK.pw && !DECK.pw.closed) { DECK.pw.focus?.(); return; }
  const pw = window.open("", "gtd-presenter", "popup,width=960,height=640");
  if (!pw) { notify("Allow pop-ups for this page to open the presenter window.", "warn"); return; }
  DECK.pw = pw;
  const d = pw.document;
  d.title = "Presenter · " + pageTitle(DECK.path);
  d.head.replaceChildren(el("style", {}, PRESENTER_CSS));
  d.documentElement.lang = document.documentElement.lang || "en";
  d.addEventListener("keydown", presentKey);
  // Alt held there shows the boxes on the slides; let go there, they go (#487).
  d.addEventListener("keyup", slideArrKey);
  d.addEventListener("dblclick", slideEdit);    // a line in the Now list is edited there (#466)
  presenterDraw();
}
