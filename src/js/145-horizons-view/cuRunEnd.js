// The mini review over: back to where it was started (#516 follow-up).
function cuRunEnd() {
  const from = CU_RUN ? CU_RUN.from : null;
  CU_RUN = null;
  if (!from) { render(); return; }
  go(from.view, Object.fromEntries(Object.entries({sub: from.sub, pagePath: from.pagePath}).filter(([, v]) => v)));
}
