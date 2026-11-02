function helpFlash(target, say) {
  const n = typeof target === "string" ? helpFind(target) : target;
  for (const old of document.querySelectorAll(".helpsay")) old.remove();
  if (!n) { notify("That is not on the screen just now."); return; }
  n.scrollIntoView({block: "nearest", inline: "nearest"});
  n.classList.add("helplit");
  setTimeout(() => n.classList.remove("helplit"), 1600);
  if (!say) return;
  const r = n.getBoundingClientRect();
  const bubble = el("div", {class: "helpsay", role: "status"}, say);
  bubble.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 300)) + "px";
  bubble.style.top = (r.bottom + 8 + 40 > window.innerHeight ? Math.max(8, r.top - 44) : r.bottom + 8) + "px";
  document.body.append(bubble);
  setTimeout(() => bubble.remove(), 4000);
}
