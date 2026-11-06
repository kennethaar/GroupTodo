/* Above the on-screen keyboard, which shrinks the visual viewport, not the
   page, and under the page only, leaving the sidebar's foot alone. */
function editBarPlace() {
  const bar = $("#editBar"), vv = window.visualViewport, main = $("#main");
  if (!bar || bar.hidden) return;
  const keyboardUp = vv && vv.height < innerHeight;
  bar.style.bottom = (vv ? Math.max(0, innerHeight - vv.height - vv.offsetTop) : 0) +
    (keyboardUp ? editBarIOSChromeGap() : 0) + "px";
  bar.style.left = (main ? Math.max(0, main.getBoundingClientRect().left) : 0) + "px";
}

/* iOS Safari (and other iOS browsers, same WebKit keyboard) floats its
   accessory bar and compact address pill over the page instead of shrinking
   the visual viewport for them, so a bar placed flush with the viewport's
   reported bottom still ends up underneath both. Reserve extra room for
   them there; an installed home-screen app has no address pill to clear. */
function editBarIOSChromeGap() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) && !navigator.standalone ? 56 : 0;
}
