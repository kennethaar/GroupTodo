/* The tag drawn as its dots, in front of the words. */
function estHtml(title) {
  const n = estTier(title);
  return n ? `<span class="est" data-est="${n}" title="${EST_LABEL[n]} (#${EST_TAGS[n]})">${EST_MARK[n]}</span> ` : "";
}
