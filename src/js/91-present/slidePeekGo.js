/* Open the talk at the slide the preview shows (#465): a click on a choice,
   or Enter after ↑ ↓ (← → in the menu). */
function slidePeekGo() {
  const P = SLIDE_PEEK;
  if (!P) return;
  const c = P.choices[P.on];
  presentStart(P.path, {...c.start, step: c.at, win: true});
}
