/* What the phone should get for a link: tel: and sms: as they are, and a map
   as geo:, which opens the phone's own maps app where the PC opened the
   OpenStreetMap page. Anything else has no business on the phone. */
function phoneUriOf(target) {
  const t = String(target || "");
  if (/^(tel|sms):\+?\d/i.test(t)) return t;
  const m = /^https:\/\/www\.openstreetmap\.org\/(?:\?mlat=(-?[\d.]+)&mlon=(-?[\d.]+)|search\?query=(.+))/.exec(t);
  if (!m) return null;
  return m[1] ? "geo:" + m[1] + "," + m[2] : "geo:0,0?q=" + m[3];
}
