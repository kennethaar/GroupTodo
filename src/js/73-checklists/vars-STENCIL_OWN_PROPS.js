/* ---------- pouring a list into a page ----------
   One gesture, whatever the page was kept for: its fields, its lines and its
   todos all arrive on the page you pick. Which of the three you get is the
   list's business, not a setting -- it is what the list has.

     fields  the key:: value lines at its top become values of the target page,
             %vars% expanded. A value the page already has is left alone: the
             stencil is a starting point, never a correction.
     todos   a checklist's steps arrive as open actions, under one bullet
             naming the list so they can be told apart later and ticked off as
             a run of it.
     lines   a stencil that is not a checklist -- the ones that used to live in
             pages/templates/ -- arrives as it is written, headings and blank
             lines included, at the end of the document. A journal template is
             not a pile of things to do; it is the shape of the day.

   A step that already carries a state keeps it either way, so a list can hold
   a line that is a note rather than a task. */
const STENCIL_OWN_PROPS = new Set(["title", "type", "kind", "cadence", "created", "id", "outcome",
  "starts", "ends", "time", "runs", "last_run"]);

/* Steps or lines? What the file says: a list filed as a checklist is a list of
   things to do, and anything else is a page to copy out. */
const stencilMakesTodos = path => {
  const page = getPage(path); if (!page) return false;
  if (trim(page.props?.type || "").toLowerCase() === "checklist") return true;
  let any = false;
  walkBlocks(page.blocks, b => { if (b.state) any = true; });
  return any;
};
