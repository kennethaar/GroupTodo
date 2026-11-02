function langObserve(on) {
  if (LANG.obs) { LANG.obs.disconnect(); LANG.obs = null; }
  if (!on || !document.body) return;
  LANG.obs = new MutationObserver(records => {
    for (const r of records) {
      if (r.type === "childList") r.addedNodes.forEach(langWalk);
      else if (r.type === "characterData") { if (!langSkipped(r.target.parentElement)) langText(r.target); }
      else if (!langSkipped(r.target)) langAttr(r.target, r.attributeName);
    }
    LANG.obs.takeRecords();                     // our own changes, already handled
  });
  LANG.obs.observe(document.body, {childList: true, subtree: true, characterData: true,
    attributes: true, attributeFilter: LANG_ATTRS});
}
