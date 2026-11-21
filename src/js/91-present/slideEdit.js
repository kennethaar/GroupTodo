/* Double-click a line on a slide to edit it in place (#466): a bullet, a
   part of a drawing, or the slide's title when that is a line (the page's
   own title is not). The field holds the line as written, its links and
   tags too, where the words stood. Enter or Save writes it to the page, Esc
   or Cancel puts it back. While it is open, keys type in it and do not move
   the talk (presentKey lets them through). The presenter window's Now list
   is edited the same way, in that window. */
function slideEdit(e) {
  if (!DECK || DECK.edit) return;
  const spot = e.target.closest?.("[data-bid], .stitle");
  const onDeck = spot && DECK.deck.contains(spot) && spot.closest(".slide.cur");
  const onPresenter = spot && DECK.pw && !DECK.pw.closed && spot.ownerDocument === DECK.pw.document && spot.closest(".pnow");
  if (!onDeck && !onPresenter) return;
  let b = null;
  if (spot.matches(".stitle")) b = DECK.steps[DECK.i]?.s.block;
  else walkBlocks(getPage(DECK.path)?.blocks || [], x => { if (String(x.id) === spot.dataset.bid) b = x; });
  if (!b) return;
  e.preventDefault();
  // Where the words stand: in a drawing that is one box of the part, not its own lines.
  const own = [spot, ...spot.querySelectorAll("*")].filter(n => n === spot || n.closest("[data-bid]") === spot || spot.matches(".stitle"));
  const words = slideWords(b);
  const at = own.filter(n => n.textContent.trim() === words).pop()
    || own.filter(n => [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim())).pop() || spot;
  const field = el("input", {class: "sedit", type: "text", value: b.title || "", "aria-label": "Edit line",
    onkeydown: ev => {
      ev.stopPropagation();
      if (ev.key === "Enter") { ev.preventDefault(); slideEditEnd(true); }
      else if (ev.key === "Escape") { ev.preventDefault(); slideEditEnd(false); }
    }});
  const bar = el("span", {class: "seditbar"},
    el("button", {type: "button", class: "seditsave", onclick: () => slideEditEnd(true)}, "Save ", el("kbd", {}, "Enter")),
    el("button", {type: "button", onclick: () => slideEditEnd(false)}, "Cancel ", el("kbd", {}, "Esc")));
  DECK.edit = {b, at, field, was: [...at.childNodes]};
  at.replaceChildren(field, bar);
  at.classList.add("editing");
  field.focus({preventScroll: true});
  field.setSelectionRange(field.value.length, field.value.length);
}
