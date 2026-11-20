/* The list goes to this device, for its order, and each loaded area's share
   of it to your person page there (#33). */
function setPins(list) {
  PREF.set("pins", JSON.stringify(list));
  for (const space of new Set([V.space || "", ...LOADED.keys()]))
    inSpace(space, () => {
      if (writeAreaPins(list.filter(p => (p.space || "") === space).map(p => p.path)))
        PREF.set("pinsMoved:" + space, "1");
    });
  renderNav();
}
