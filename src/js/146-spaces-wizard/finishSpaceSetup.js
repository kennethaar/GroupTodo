async function finishSpaceSetup(names) {
  names = Array.from(new Set(names));
  const fresh = names.filter(n => !Spaces.get(n));
  /* The area set up on the welcome screen keeps its folder, its pages and its
     place. Left off the list, it takes the first new name rather than being
     dropped and made again, so no answer given there is lost and no second
     area turns up beside it. Areas that are already there stay; removing one
     is done under Manage areas, where it is said what that costs. */
  const first = Spaces.get(Spaces.active);
  if (first && first.placeholder && fresh.length && !names.includes(first.name)) {
    const renamed = await Spaces.rename(first.name, fresh.shift());
    if (renamed) { renamed.named = true; await Spaces.save(); storeAreaName(renamed.name); }
  } else if (first && first.placeholder && names.includes(first.name)) {
    delete first.placeholder; first.named = true;
    await Spaces.save(); storeAreaName(first.name);
  }
  let made = 0;
  for (const n of fresh) if (await createSpace(n, "local")) made++;
  if (made) notify("Created " + made + " area" + (made > 1 ? "s" : "") + ".");
  render();
  openSpaceStorageSetup({firstRun: true});     // one folder each, asked straight away
}
