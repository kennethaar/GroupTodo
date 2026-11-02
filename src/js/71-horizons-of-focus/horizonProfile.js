/* Falls back to the full ladder rather than to nothing, so a hand-edited or
   half-synced GTD.md can never leave somebody looking at an empty Horizons. */
function horizonProfile() {
  return HORIZON_PROFILES[trim(getSetting("horizon_profile") || "")]
      || HORIZON_PROFILES[DEFAULT_HORIZON_PROFILE];
}
