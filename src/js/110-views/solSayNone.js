/* "None" for organisations or people, written on the project as key:: none
   once nothing else is left there, so it is asked once (#377). */
function solSayNone(r, prop) {
  inS(r, () => {
    const page = getPage(r.path);
    if (!page || linksIn(page.props[prop] || "").length) return;
    page.props[prop] = NOTHING_FIRST;
    touch(r.path);
  });
}
