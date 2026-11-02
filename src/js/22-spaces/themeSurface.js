/* The surface a space's badge is drawn on, read from the live theme so the
   warning below follows whichever of dark and light is on. */
function themeSurface() {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--bg2");
    return normHex(v) || "#161920";
  } catch (_) { return "#161920"; }
}
