// An address as written, without a mailto: or mailto:// in front (#354).
function bareAddress(s) {
  return trim(String(s || "")).replace(/^mailto:(\/\/)?/i, "");
}
