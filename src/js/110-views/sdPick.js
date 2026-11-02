// The one picked stays where it lies; the other slides off the table.
function sdPick(space, w, l, side) {
  if (SD.going) return;
  SD.keep = {slug: sdSlug(w), side};
  const pair = document.querySelector(".sdpair");
  if (!pair || solReduced()) return sdChoose(space, w, l);
  SD.going = true;
  pair.querySelector('.sdside[data-side="' + side + '"]')?.classList.add("won");
  pair.querySelector('.sdside[data-side="' + (1 - side) + '"]')?.classList.add("gone");
  setTimeout(() => { SD.going = false; sdChoose(space, w, l); }, 200);
}
