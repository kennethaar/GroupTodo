/* Where the first screens of an area open: the page a link points at, so it
   shows as soon as it is read, not once the whole folder is listed (#474).
   Once it is there, the screen stays where it is. Else startView. */
function startPlace() {
  const link = LINK_OPENING;
  if (link && (!link.space || link.space === Spaces.active)) {
    if (link.arrived) return {view: state.view, pagePath: state.pagePath};
    return {view: "page", pagePath: link.path};
  }
  return {view: startView(), pagePath: null};
}
