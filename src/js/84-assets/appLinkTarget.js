function appLinkTarget(raw) {
  const m = /^([a-z]+):(.*)$/i.exec(raw);
  let scheme = m[1].toLowerCase();
  let rest = m[2];
  if (scheme === "telto") scheme = "tel";
  if (scheme === "tel" || scheme === "sms") rest = rest.replace(/^\/\//, "").replace(/[\s\-().]/g, "");
  if (scheme === "mapto") {
    let place = rest.replace(/^\/\//, "");
    try { place = decodeURIComponent(place); } catch (_) {}
    place = trim(place);
    return geoToOSM(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(place) ? place.replace(/\s/g, "") : "0,0?q=" + encodeURIComponent(place));
  }
  if (scheme === "teams")
    return "https://teams.microsoft.com/l/chat/0/0?users=" + encodeURIComponent(rest.replace(/^\/\//, ""));
  if (scheme === "geo") return geoToOSM(rest);
  return scheme + ":" + rest;
}
