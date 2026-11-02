// "wifi", "cellular" or "none"; "" when the browser does not say.
function senseNetwork() {
  if (navigator.onLine === false) return "none";
  const t = navigator.connection && navigator.connection.type;
  if (t === "wifi" || t === "ethernet") return "wifi";
  return t === "cellular" || t === "none" ? t : "";
}
