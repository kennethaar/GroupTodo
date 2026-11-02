document.addEventListener("pointerover", e => {
  if (e.pointerType !== "mouse") return;
  const t = e.target;
  if (ASK_CARD && (ASK_CARD.box.contains(t) || ASK_CARD.link.contains(t))) { clearTimeout(ASK_HIDE); return; }
  if (ASK_CARD) { clearTimeout(ASK_HIDE); ASK_HIDE = setTimeout(askCardHide, ASK_LEAVE_MS); }
  clearTimeout(ASK_SHOW);
  const link = t.closest && t.closest("[data-link]");
  const name = link && personOfLink(link);
  // Not with a button held, in a dialog or the line menu, or in the line being written.
  if (!name || e.buttons || samePerson(name, whoAmI()) || link.closest(".modal, .fly") ||
      (document.activeElement?.isContentEditable && document.activeElement.contains(link))) return;
  ASK_SHOW = setTimeout(() => askCardShow(link, name), ASK_HOVER_MS);
}, true);
document.addEventListener("pointerdown", e => {
  if (!ASK_CARD || !ASK_CARD.box.contains(e.target)) askCardHide();
}, true);
document.addEventListener("keydown", () => askCardHide(), true);
addEventListener("scroll", () => askCardHide(), true);
