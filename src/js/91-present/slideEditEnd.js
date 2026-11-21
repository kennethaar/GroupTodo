/* Close the line being edited on a slide (#466). With `save` the new text
   goes to the page, one Ctrl+Z takes it back, and the slide is drawn again
   on the same step with the new words. Else the words come back as they were. */
function slideEditEnd(save) {
  const ed = DECK?.edit;
  if (!ed) return;
  DECK.edit = null;
  const val = trim(ed.field.value);
  if (!save || !val || val === (ed.b.title || "")) {
    ed.at.replaceChildren(...ed.was);
    ed.at.classList.remove("editing");
    DECK.deck.focus({preventScroll: true});
    return;
  }
  const path = DECK.path, space = V.space, snapshot = structuredClone(getPage(path));
  pushUndo({run: () => {
    if (V.space !== space || !getPage(path)) return false;
    Object.assign(getPage(path), structuredClone(snapshot));
    touch(path); render();
    return true;
  }});
  ed.b.title = val;
  createLinkedPages(val);
  touch(path); render();
  Object.assign(DECK, deckSteps(path, DECK.root, DECK.on));
  const i = DECK.i;
  DECK.i = -1;
  DECK.deck.querySelector(".slide.cur")?.remove();
  presentGo(i);
  DECK.deck.focus({preventScroll: true});
}
