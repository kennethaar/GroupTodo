/* A tap is the common thing, done; holding is the rest. A long press on a
   phone, a right-click on a computer -- and Android fires both for the one
   press, so whichever comes first opens the menu and the other is ignored. */
function holdable(btn, onTap, onHold) {
  let timer = null, held = 0;
  const hold = () => { if (Date.now() - held < 800) return; held = Date.now(); onHold(); };
  const cancel = () => { clearTimeout(timer); timer = null; };
  btn.addEventListener("pointerdown", e => { if (e.button) return; cancel(); timer = setTimeout(() => { timer = null; hold(); }, 450); });
  for (const ev of ["pointerup", "pointerleave", "pointercancel"]) btn.addEventListener(ev, cancel);
  btn.addEventListener("contextmenu", e => { e.preventDefault(); e.stopPropagation(); cancel(); hold(); });
  btn.addEventListener("click", e => { e.stopPropagation(); if (Date.now() - held < 800) return; onTap(); });
  return btn;
}
