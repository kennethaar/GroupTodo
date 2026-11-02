/* ---------- wiki links are delegated, everywhere ----------
   On #content this caught the outline and the lists and nothing else, so the
   same pill drawn in a dialog, in the next-best-move nudge or in the
   surroundings grid either did nothing or jumped straight to the page. The
   document is the one container all of them are in. */
document.addEventListener("click", e => {
  // A dropped picture opens full size in a tab of its own, and clicking it
  // must not drop the caret into the line behind it.
  const img = e.target.closest("img.asset");
  if (img && img.src) { e.preventDefault(); e.stopPropagation(); window.open(img.src, "_blank", "noopener"); return; }
  const link = e.target.closest("[data-link]");
  if (!link) return;
  /* Taken on the way down and kept: a pill sitting inside a row that opens
     something -- a search hit, a board card, a line in the weeding list -- used
     to do both, because the row's own handler had already run by the time this
     one saw the click. The pill is the click. */
  e.stopPropagation();
  e.preventDefault();
  // A long press already opened it beside the view; letting go is not a click.
  if (LINK_HELD) { LINK_HELD = false; e.stopImmediatePropagation(); return; }
  const ref = link.dataset.link;
  // Shift-click on a person, organisation or place: its numbers and addresses as a QR code.
  if (e.shiftKey && !e.ctrlKey && !e.metaKey && !/^go\//.test(ref) && !link.classList.contains("tag")) {
    pagePhoneQR(ref, trim(link.textContent));
    return;
  }
  /* A normal click follows the link. Ctrl/Cmd-click opens the switch menu
     when the linked page has another compatible destination. */
  if (e.ctrlKey || e.metaKey) {
    if (!/^go\//.test(ref) && !link.classList.contains("tag") && linkKindOf(ref))
      openLinkMenu(link, ref);
    else followLink(ref);
    return;
  }
  followLink(ref);
}, true);

/* ---------- a long press opens the page beside the view ----------
   Held for half a second, a link to a page docks that page at the right
   instead of leaving the view -- by mouse, pen or finger alike. Only a link
   with a page behind it: go/ doors and pages not yet made are left to the
   click. A press that wanders is a drag or a selection, not a hold. */
const LINK_HOLD_MS = 500;
let LINK_HELD = false, LINK_HOLD = null;
