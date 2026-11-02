function deferPageSection(host, build) {
  const pages=V.pages, path=state.pagePath, space=V.space;
  requestAnimationFrame(()=>setTimeout(()=>{
    if (!host.isConnected) return;
    // In the side panel the page is not the one on screen, so it is read in its own area.
    const side = !host.closest("#content");
    if (side ? inSpace(space, ()=>V.pages!==pages) : (V.pages!==pages || state.pagePath!==path || state.view!=='page')) return;
    try { const section=side ? inSpace(space, build) : build(); if(section) {host.replaceChildren(section);resolveAssets(host);} else host.remove(); }
    catch(error) { host.textContent='This section could not be loaded.'; console.error(error); }
  },0));
}
