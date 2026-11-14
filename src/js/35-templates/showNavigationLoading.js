function showNavigationLoading(label = 'Opening page...') {
  const content = $('#content');
  if (!content) return;
  journalPaper(false);   // the bar's buttons may stand in the Journal's heading (#395)
  content.replaceChildren(el('div',{class:'wrap',role:'status','aria-live':'polite',style:'padding:24px'},label));
  content.setAttribute('aria-busy','true');
}
