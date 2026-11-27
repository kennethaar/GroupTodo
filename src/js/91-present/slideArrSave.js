/* Keep places on the slide (#487): each change is [owner, value], written
   at once and taken back together by one Ctrl+Z. The slide on screen is
   drawn with them straight away. */
function slideArrSave(changes, said = "") {
  const live = changes.filter(([o]) => o);
  if (!live.length) return;
  const old = live.map(([o]) => [o, o.get()]);
  for (const [o, v] of live) o.set(v);
  slideArrRedraw();
  pushUndo({run: () => {
    for (const [o, v] of old) o.set(v);
    slideArrRedraw();
    notify("Put back.");
    return true;
  }});
  if (said) notify(said);
}
