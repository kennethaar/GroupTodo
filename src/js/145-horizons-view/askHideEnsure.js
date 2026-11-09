/* Hidden names in this area, made empty the first time it is needed. */
function askHideEnsure() {
  if (!V.pages.has(ASK_HIDE_PATH)) putPage(ASK_HIDE_PATH, {
    props: {title: "Hidden names", kind: "hidden names", created: todayStamp(),
      help: "One name a line: a product, a customer or anything else Let AI write it should not send. " +
            "People and organisations with a page are hidden already."},
    blocks: []});
  return ASK_HIDE_PATH;
}
