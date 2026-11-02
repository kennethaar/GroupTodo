/* ---------- writing back ----------
   mailto: carries to, subject and body and nothing else: it cannot thread the
   mail or bring its attachments, so a reply is a new mail with "Re:" and the
   words quoted, which most mail programs put with the first one anyway. */
function emailPageMail(path) {
  const page = getPage(path) || {props: {}, blocks: []};
  const props = page.props || {};
  const name = trim(String(props.from || "").replace(/^\[\[p\/(.*)\]\]$/, "$1"));
  const body = [];
  walkBlocks(page.blocks, b => { if (b.title) body.push(b.title); });
  return {
    subject: trim(props.title || pageTitle(path)), name,
    email: trim(props[EMAIL_PROP] || "") || emailOf(name, Spaces.active || ""),
    to: trim(props.to || ""), sent: trim(String(props.sent || "").replace(/^\[\[(.*)\]\]$/, "$1")), body,
  };
}
