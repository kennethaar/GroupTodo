/* Dragging a box over the cards picks out everything the box touches -- the way
   a file manager does it, and the quickest way to take a run of cards in one
   column. The box starts on the board's own background (the gap between the
   columns, the space under the last card) because a drag that starts on a card
   is that card being dragged somewhere. Hold shift and the box starts anywhere,
   cards included, for a column so full there is no background left to grab.

   Holding ctrl, cmd or shift adds what the box touches to what is already
   picked; without a modifier the box replaces the selection, and a click on the
   background with no drag in it lets everything go. */
function boardMarquee(host, kind) {
  host.addEventListener("mousedown", e => {
    if (e.button !== 0) return;
    const add = e.ctrlKey || e.metaKey || e.shiftKey;
    const onCard = !!e.target.closest(".bcard");
    // A plain press on a card is the card's drag; a press on a control -- show
    // more, the mode switch, Clear -- is that control's click.
    if (!e.shiftKey && (onCard || e.target.closest("button, a, input, textarea, select"))) return;
    // A press on a column head is that column being dragged somewhere else.
    if (e.target.closest(".bcol-head[draggable]")) return;
    // Stops the press from starting a native drag or a text selection instead.
    e.preventDefault();

    const x0 = e.clientX, y0 = e.clientY;
    const base = (add && BOARD_SEL.kind === kind) ? new Set(BOARD_SEL.ids) : new Set();
    const box = el("div", {class: "bmarquee"});
    let live = false;

    const cards = () => $$('.bcard[data-selkind="' + kind + '"]');
    const place = (x, y) => {
      const r = host.getBoundingClientRect();
      const l = Math.min(x0, x), t = Math.min(y0, y);
      box.style.left   = (l - r.left) + "px";
      box.style.top    = (t - r.top) + "px";
      box.style.width  = Math.abs(x - x0) + "px";
      box.style.height = Math.abs(y - y0) + "px";
      return {left: l, top: t, right: Math.max(x0, x), bottom: Math.max(y0, y)};
    };

    const move = ev => {
      const sel = place(ev.clientX, ev.clientY);
      if (!live && Math.abs(ev.clientX - x0) + Math.abs(ev.clientY - y0) < 5) return;
      if (!live) {
        live = true;
        host.append(box);
        document.body.classList.add("marquee");
      }
      const ids = new Set(base);
      for (const card of cards()) {
        const r = card.getBoundingClientRect();
        if (r.right < sel.left || r.left > sel.right || r.bottom < sel.top || r.top > sel.bottom) continue;
        // A card scrolled out of sight inside its column is not under the box,
        // whatever its coordinates say.
        const body = card.closest(".bcol-body");
        if (body) {
          const b = body.getBoundingClientRect();
          if (r.bottom < b.top || r.top > b.bottom) continue;
        }
        ids.add(card.dataset.selid);
      }
      BOARD_SEL.kind = ids.size ? kind : null;
      BOARD_SEL.ids = ids;
      paintBoardSel();
    };

    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      document.body.classList.remove("marquee");
      box.remove();
      // A click on the background, with no box drawn, is "never mind".
      if (!live && !add) { boardSelClear(); paintBoardSel(); }
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
  return host;
}
