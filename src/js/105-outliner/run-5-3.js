/* The page scrolling moves the line, so the menu follows it. The menu's own
   scrolling does not: placing it clears its height to measure it, and for
   that moment it cannot scroll, so it would jump back to the top (#175). */
addEventListener("scroll", e => { if (!FLY || !FLY.box.contains(e.target)) flyPlace(); }, true);
addEventListener("resize", flyPlace);
// The keyboard coming up shrinks the visual viewport, not the window.
if (window.visualViewport) visualViewport.addEventListener("resize", flyPlace);
