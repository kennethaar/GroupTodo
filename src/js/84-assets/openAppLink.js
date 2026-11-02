/* A web page goes to a tab of its own; everything else goes through location,
   so the browser passes the intent to the app and the page stays put. A phone
   number or a place shows a QR code instead when this device is set to, or
   when the click says so: the PC's dialler only reaches the phone if the two
   are paired, and the camera on the phone always does. */
function openAppLink(target, flip = false) {
  const phone = phoneUriOf(target);
  if (phone && qrFirst() !== flip) return phoneQR(target, phone);
  openAppLinkHere(target);
}
