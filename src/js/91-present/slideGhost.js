/* A title on its way to the top (#431 follow-up): a copy of it as it stood,
   big and with its own line breaks, glides and shrinks to `to` in 1 s and
   fades there. Scaled, the real title would keep its new line breaks and
   run off the screen. `title` (the real one, now in its place) fades in as
   the copy lands; without one the copy just goes. */
function slideGhost(deck, from, to, title = null) {
  const {rect, html, size, align} = from;
  if (!rect.width || !to.width || !deck.animate) return null;
  const host = deck.getBoundingClientRect();
  const ghost = el("div", {class: "sghost", "aria-hidden": "true",
    style: `left:${rect.left - host.left}px;top:${rect.top - host.top}px;width:${rect.width + 1}px;font-size:${size}px;text-align:${align}`});
  ghost.innerHTML = html;
  deck.append(ghost);
  const scale = to.size / size;
  const time = {duration: 1000, easing: "ease-in-out"};
  const glide = ghost.animate([
    {transform: "none", opacity: 1},
    {opacity: 1, offset: 0.7},
    {transform: `translate(${to.left - rect.left}px, ${to.top - rect.top}px) scale(${scale})`, opacity: 0}],
    {...time, fill: "forwards"});
  glide.finished.then(() => ghost.remove(), () => ghost.remove());
  if (title) title.animate([{opacity: 0}, {opacity: 0, offset: 0.7}, {opacity: 1}], time);
  return glide;
}
