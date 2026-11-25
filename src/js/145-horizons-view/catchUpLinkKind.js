/* What a catch-up source link opens (#516), said by its address: a chat, an
   email, a meeting, a document, or only a link. */
function catchUpLinkKind(url) {
  const u = String(url || "").toLowerCase();
  if (/teams\.microsoft\.com|teams\.live\.com|slack\.com|chat\.google\.com/.test(u)) return "Chat";
  if (/\/calendar\b|meetup-join|\/meet\b|zoom\.us|meet\.google\.com/.test(u)) return "Meeting";
  if (/outlook\.|mail\.google\.com|\/mail\b|\/owa\b/.test(u)) return "Email";
  if (/sharepoint\.com|onedrive|docs\.google\.com|drive\.google\.com|\.(?:docx?|xlsx?|pptx?|pdf)(?:[?#]|$)/.test(u)) return "Document";
  return "Link";
}
