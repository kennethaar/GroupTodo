/* Your own person page, so everybody else in the space can see you exist. */
function ensureMemberPage() {
  const me = whoAmI();
  if (!me) return null;
  const path = personPath(me);
  const page = V.pages.has(path) ? getPage(path) : {props: {title: me}, blocks: []};
  if (trim(String(page.props.member || "")) !== "true") {
    page.props.member = "true";
    putPage(path, page);
  }
  return path;
}
