/* A project declares its area with  area:: [[a/Health]] */
function areaOfProject(path) {
  const m = /\[\[a\/([^\]]+)\]\]/.exec(getPage(path)?.props?.area || "");
  return m ? trim(m[1]) : null;
}
