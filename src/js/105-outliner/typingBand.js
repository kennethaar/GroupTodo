/* The part of the page you can see while you type: under the top of the page
   and above the on-screen keyboard and the line toolbar. */
function typingBand(c) {
  const vv = window.visualViewport, cr = c.getBoundingClientRect(), bar = $("#editBar");
  return {
    top: Math.max(cr.top, vv ? vv.offsetTop : 0),
    bot: Math.min(cr.bottom, (vv ? vv.offsetTop + vv.height : innerHeight) - (bar && !bar.hidden ? bar.offsetHeight : 0)),
  };
}
