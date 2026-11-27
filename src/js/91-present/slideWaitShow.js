/* Waiting slide n up (#486), with all its lines at once, and a link on it as
   a QR code, so people can sign up from their seats. The one before goes up
   and out as a slide does in the talk. */
function slideWaitShow(n) {
  const w = DECK?.wait;
  if (!w || !w.slides.length) return;
  w.n = ((n % w.slides.length) + w.slides.length) % w.slides.length;
  w.shown = Date.now();
  const {deck} = DECK, s = w.slides[w.n];
  const old = deck.querySelector(".slide.cur");
  deck.dataset.move = old ? "down" : "";
  for (const gone of deck.querySelectorAll(".slide.out")) gone.remove();
  if (old) { old.classList.replace("cur", "out"); setTimeout(() => old.remove(), 1100); }
  const slide = slideSection(s);
  slide.classList.add("waitall");
  const lines = [];
  walkBlocks(s.line || s.block ? [s.line || s.block] : [], b => { lines.push(b.title || "", ...(b.body || [])); });
  const url = (/https?:\/\/[^\s<>()\]]+[^\s<>()\].,;:!?]/.exec(lines.join("\n")) || [])[0];
  const qr = url && qrSVG(url);
  if (qr) { const box = el("div", {class: "waitqr", title: url}); box.innerHTML = qr; slide.append(box); }
  deck.insertBefore(slide, deck.querySelector(".waitband"));
  resolveAssets(slide);
  slideBullets(slide, {s, k: s.parts.length}, false);
  deck.querySelectorAll(".waitdots > span").forEach((d, i) => d.classList.toggle("on", i === w.n));
}
