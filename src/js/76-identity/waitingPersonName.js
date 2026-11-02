/* WAIT ownership: explicit properties first, then one unambiguous known person. */
function waitingPersonName(value) {
  const text = trim(value || "");
  if (!text || /^\+\s*(choose|write|value)\b/i.test(text)) return "";
  return text.replace(/^\[\[([^\]]+?)(?:\]\[[^\]]*)?\]\]$/, "$1").replace(/^p\//i, "");
}
