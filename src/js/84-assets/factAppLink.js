/* A page fact that is an address: written with its scheme (mailto:, tel:,
   geo:, teams:, https:), or bare under a key that says what it is, the way
   email:: kari@cab.se, phone:: +47 99 88 77 66 and address:: Storgata 1, Oslo
   are usually written. */
function factAppLink(k, v) {
  const val = trim(String(v || ""));
  if (APP_LINK_RE.test(val)) return appLinkTarget(val);
  if (/^https?:\/\/\S+$/.test(val)) return val;
  const key = String(k || "").toLowerCase();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    if (/teams/.test(key)) return appLinkTarget("teams:" + val);
    if (/mail|epost/.test(key)) return "mailto:" + val;
  }
  if (/^(phone|tel|telephone|telefon|mobile|mobil|cell|sms)$/.test(key) && /^\+?\d[\d\s\-.()]{4,}\d$/.test(val))
    return appLinkTarget((key === "sms" ? "sms:" : "tel:") + val);
  if (/^(geo|location|coords|position|sted)$/.test(key) && /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(val))
    return geoToOSM(val.replace(/\s/g, ""));
  if (/^(address|adresse|adress|addr)$/.test(key) && /\p{L}/u.test(val)) return appLinkTarget("mapto:" + val);
  return null;
}
