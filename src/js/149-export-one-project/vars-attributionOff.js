/* ============================================================
   149b_SPACE_ATTRIBUTION SWITCH
   Some spaces should not record who did what at all -- and that has to hold
   for everyone sharing them, so it lives in the space's own settings rather
   than on one device.
   ============================================================ */
const attributionOff = () => trim(getSetting("no_attribution") || "") === "true";

/* The name to stamp with: empty when the space says not to. */
const stampName = () => (attributionOff() ? "" : whoAmI());
