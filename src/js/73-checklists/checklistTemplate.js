/* ============================================================
   73_CHECKLISTS -- the MS To Do half: a reusable list you run again
   and again (weekly shop, trip packing, release steps).
   ============================================================ */
/* The "k" template may not name kind:: or cadence::, so they are set here: a
   project template is kind:: project, and a routine has a cadence. */
function checklistTemplate(title, kind, cadence) {
  const page=pageFromTemplate("k",title,{kind:kind || "",cadence:cadence || "as needed"});
  if (kind === "project") page.props.kind = "project";
  if (kind === "routine") page.props.cadence = cadence || "as needed";
  return page;
}
