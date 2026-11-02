function navApply(snap) {
  NAV_JUMPING = true;
  const land = () => {
    for (const k of NAV_FIELDS) state[k] = snap[k];
    applyBranchSnap(snap.branch);
    document.body.classList.remove("nav-open");
    render();
    NAV_JUMPING = false;
    syncNavArrows();
  };
  if (snap.space && Spaces.active && snap.space !== Spaces.active) {
    openSpace(snap.space, snap).then(land, () => { NAV_JUMPING = false; syncNavArrows(); });
    return;
  }
  land();
}
