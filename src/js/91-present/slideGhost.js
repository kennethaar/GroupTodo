/* A title on its way to a new place (#431): its line breaks change, so each
   letter slides on its own from where it stood to where it will stand, the
   way text reflows when the editor is resized. One copy per letter, set off
   a little after the one before it; all land in 1 s. `title` (the real one,
   now in its place) shows as they land, so nothing fades (they end as
   faint as it is, so a quiet breadcrumb does not jump); without one the
   letters fade at the end and go. Returns the last letter's glide. */
function slideGhost(deck, from, to, title = null) {
  const a = from.letters || [], b = to.letters || [];
  if (!from.rect.width || !to.width || !deck.animate || !a.length) return null;
  const host = deck.getBoundingClientRect();
  const ghost = el("div", {class: "sghost", "aria-hidden": "true"});
  const n = Math.min(a.length, b.length);
  const step = n > 1 ? Math.min(10, 300 / (n - 1)) : 0, run = 1000 - (n - 1) * step;
  const keep = title ? parseFloat(getComputedStyle(title).opacity) : 1;
  const out = title ? [{opacity: 1}, {opacity: keep}] : [{opacity: 1}, {opacity: 1, offset: 0.7}, {opacity: 0}];
  const glides = [];
  for (let i = 0; i < n; i++) {
    const {ch, rect, size, font, color} = a[i], end = b[i];
    const span = el("span", {style: `left:${rect.left - host.left}px;top:${rect.top - host.top}px;` +
      `font:${font};font-size:${size}px;line-height:${rect.height}px;color:${color}`});
    span.textContent = ch;
    ghost.append(span);
    const move = `translate(${end.rect.left - rect.left}px, ${end.rect.top - rect.top}px) scale(${end.size / size})`;
    const keys = out.map((k, j) => ({...k, transform: j ? (j === out.length - 1 ? move : null) : "none"}));
    for (const k of keys) if (k.transform === null) delete k.transform;
    glides.push({span, keys, delay: i * step});
  }
  deck.append(ghost);
  const anims = glides.map(({span, keys, delay}) =>
    span.animate(keys, {duration: run, delay, easing: "ease-in-out", fill: "both"}));
  Promise.all(anims.map(x => x.finished)).then(() => ghost.remove(), () => ghost.remove());
  if (title) title.animate([{opacity: 0}, {opacity: 0, offset: 0.99}, {opacity: keep}], {duration: 1000, easing: "ease-in-out"});
  return anims[anims.length - 1];
}
