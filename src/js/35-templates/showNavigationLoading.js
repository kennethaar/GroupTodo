function showNavigationLoading(label = 'Opening page...') {
  const content = $('#content');
  if (!content) return;
  content.replaceChildren(el('div',{class:'wrap',role:'status','aria-live':'polite',style:'padding:24px'},label));
  content.setAttribute('aria-busy','true');
}
