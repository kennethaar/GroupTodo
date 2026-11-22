async function followDeepLink(next) {
  // At start-up the first screens may have opened it already (startPlace, linkArrive).
  const same = LINK_OPENING && LINK_OPENING.path === next.path && LINK_OPENING.block === next.block &&
               LINK_OPENING.space === next.space;
  const link = same ? LINK_OPENING : next;
  const say = text => loadMark("link to " + link.path + (link.block ? ", line " + link.block : "") + ": " + text);
  let t = say(link.arrived ? "followed, already open" : "followed");
  if (link.arrived) { LINK_OPENING = null; return true; }
  LINK_OPENING = link;
  if (!SPACE_TRANSITION) render();             // where it goes, in the page's place
  let opened = false;
  try {
    if (link.space && link.space !== Spaces.active) {
      if (Spaces.get(link.space)) await openSpace(link.space);
      else {
        say("no area called " + link.space + " here");
        notify("That link is for an area called “" + link.space + "”, which is not on this device.", "warn");
        return false;
      }
    }
    const ready = await untilLinkReady(link);
    say(ready ? "page in" : "not found once the area was in", t);
    if (link.arrived) { opened = true; return true; }
    LINK_OPENING = null;
    if (!V.pages.has(link.path)) {
      notify("That link points at a page this vault does not have: " + link.path, "warn");
      return false;
    }
    opened = true;
    if (link.block && !linkedBlock(link)) notify("The page is here, but that particular item has gone.", "warn");
    else linkArrive(link);
    openPage(link.path);
    return true;
  } finally {
    LINK_OPENING = null;
    if (!opened && !SPACE_TRANSITION) render();
  }
}
