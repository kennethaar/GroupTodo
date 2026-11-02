function areaOfGoal(path) {
  const m = /\[\[a\/([^\]]+)\]\]/.exec(getPage(path)?.props?.area || "");
  return m ? trim(m[1]) : null;
}
