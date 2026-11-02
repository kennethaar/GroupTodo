/* Shift-click on [[p/Kari Berg]], [[o/Nordlys]] or [[c/Office]]: the phone
   numbers and addresses its page keeps (phone::, address::, geo::, tel:...),
   as the same QR code a Shift-click on the number itself gives. One goes
   straight to its code; several are asked between. */
function pagePhoneQR(ref, name) {
  const path = linkPagePath(ref);
  const props = (path && getPage(path)?.props) || {};
  const ways = [];
  for (const [k, v] of Object.entries(props)) {
    const app = factAppLink(k, v);
    if (app && phoneUriOf(app)) ways.push({k, v, app});
  }
  name = name || trim(ref);
  if (!ways.length) return notify(name + " has no phone number or address on its page.", "warn");
  if (ways.length === 1) return phoneQR(ways[0].app, phoneUriOf(ways[0].app));
  chipMenu(name, "a QR code for your phone",
    lettered(ways.map(w => [w.k, w.v, () => phoneQR(w.app, phoneUriOf(w.app))])));
}
