// addr arrives escaped, label escaped and ready to show.
function appLinkHTML(addr, label) {
  const target = appLinkTarget(unesc(addr));
  const tip = unesc(addr) + (phoneUriOf(target) ? "  (Shift-click: " + (qrFirst() ? "on this PC" : "QR code for your phone") + ")" : "");
  return `<a class="applink" href="${esc(target)}" title="${esc(tip)}">${label}</a>`;
}
