/* A link waits for its page while the area is still coming in: its folder
   waiting or being read behind the browser copy, the first read, or the page
   still a stand-in. Opened sooner, the page was missing at the next draw and
   the screen fell back to the Journal without a word (#474). True once the
   page, and the line if it names one, is there; false when the area is in
   and it is not, or after ms. */
async function untilLinkReady(link, ms = 180000) {
  for (const end = performance.now() + ms; ;) {
    if (link.arrived || linkReadyNow(link)) return true;
    const rec = LOADED.get(V.space);
    const loading = SPACE_TRANSITION || folderWaiting(V.space) || (!!rec && (!!rec.dayOnly || !!rec.stubs));
    if (!loading || performance.now() > end) return false;
    const said = $("#content > .linkopening"), label = LINK_OPENING && linkOpeningLabel(LINK_OPENING);
    if (said && label && said.textContent !== label) said.textContent = label;
    await new Promise(r => setTimeout(r, 150));
  }
}
