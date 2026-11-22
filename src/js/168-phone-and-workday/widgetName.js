/* A context's widget file and heading: @Home.md, "# @Home"; a sub context
   @Home - Kitchen.md, "# @Home › Kitchen" (#474). */
function widgetName(ctx) {
  const segs = String(ctx).split("/");
  return {file: join(WIDGET_DIR, "@" + segs.join(" - ") + ".md"), head: "# @" + segs.join(" › ")};
}
