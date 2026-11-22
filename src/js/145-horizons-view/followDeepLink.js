async function followDeepLink(link) {
  const say = text => loadMark("link to " + link.path + (link.block ? ", line " + link.block : "") + ": " + text);
  let t = say("followed");
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
    LINK_OPENING = null;
    if (!V.pages.has(link.path)) {
      notify("That link points at a page this vault does not have: " + link.path, "warn");
      return false;
    }
    opened = true;
    if (link.block) {
      const found = linkedBlock(link);
      if (found) {
        openPage(link.path);
        state.selected = found.id;
        setTimeout(() => openTaskDetail(link.path, found), 120);
        say("opened at the line");
        return true;
      }
      notify("The page is here, but that particular item has gone.", "warn");
    }
    openPage(link.path);
    say("opened");
    return true;
  } finally {
    LINK_OPENING = null;
    if (!opened && !SPACE_TRANSITION) render();
  }
}
