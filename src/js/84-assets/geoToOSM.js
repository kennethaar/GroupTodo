/* geo: opens OpenStreetMap, which works the same on every device, rather than
   whatever maps app the device may or may not have. geo:lat,lon pins the spot,
   ?z= sets the zoom, and geo:0,0?q=Karl Johans gate 1 searches for the place. */
function geoToOSM(rest) {
  const [where, query = ""] = rest.replace(/^\/\//, "").split("?");
  const params = new URLSearchParams(query);
  const q = params.get("q");
  const m = /^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(where);
  const zoom = /^\d{1,2}$/.test(params.get("z") || "") ? params.get("z") : "16";
  if (m && !(q && +m[1] === 0 && +m[2] === 0))
    return `https://www.openstreetmap.org/?mlat=${m[1]}&mlon=${m[2]}#map=${zoom}/${m[1]}/${m[2]}`;
  return "https://www.openstreetmap.org/search?query=" + encodeURIComponent(q || where);
}
