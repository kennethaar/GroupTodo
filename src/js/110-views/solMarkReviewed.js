function solMarkReviewed(r, quiet = false) {
  if (r.block || solAns(r).reviewed) return;     // a line is not stamped reviewed::
  solAns(r).reviewed = true;
  inS(r, () => {
    const page = getPage(r.path);
    runTemplateRules(page, "review", null);
    page.props.reviewed = todayStamp();
    touch(r.path);
  });
  if (!quiet) notify(inS(r, () => pageTitle(r.path)) + " reviewed. reviewed:: " + todayISO() + " is on its page.");
}
