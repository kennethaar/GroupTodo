/* The tag drawn as its dots, in front of the words. */
function estHtml(title) {
  const n = estBand(title);
  return n ? `<span class="est" data-est="${n}" title="${EST_LABEL[n]} (#${estTagOf(title)})">${EST_MARK[n]}</span> ` : "";
}
