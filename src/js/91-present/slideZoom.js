/* Into a bullet's own lines (#431): the bullet grows from its place on the
   slide before into the new slide's title, in 1 s. With `grow` false the
   title shrinks back into its bullet, and the bullet and the next one come
   once it has landed. A bullet with no place yet (the slide before was its
   title alone) grows out of the middle instead. */
function slideZoom(title, slot, grow) {
  if (!title || !slot || !title.animate || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const t = title.getBoundingClientRect(), b = slot.getBoundingClientRect();
  if (!t.width) return;
  const scale = parseFloat(getComputedStyle(slot).fontSize) / parseFloat(getComputedStyle(title).fontSize);
  const at = b.width
    ? {transformOrigin: "0 0", transform: `translate(${b.left - t.left}px, ${b.top - t.top}px) scale(${scale})`}
    : {transformOrigin: "50% 50%", transform: "scale(.4)", opacity: 0};
  const still = {transformOrigin: at.transformOrigin, transform: "none", opacity: 1};
  const time = {duration: 1000, easing: "ease-in-out"};
  if (grow) { title.animate([at, still], time); return; }
  title.animate([still, at], {...time, fill: "forwards"});
  // The bullet itself, and the one after it, wait for the title to land.
  const slide = slot.closest(".slide");
  for (const li of [slot, slide?.querySelector(".sbullets > .bullet.now, .part.now")]) {
    if (!li || li.classList.contains("later")) continue;
    const to = getComputedStyle(li).opacity;
    li.animate([{opacity: 0}, {opacity: 0, offset: 0.9}, {opacity: to}], {duration: 1100});
  }
}
