function timeLogProjectRef(name) {
  const p = timeLogProjectPath(name);
  return p ? pageRef(p) : "1/" + name.replace(/[\/]/g, "-");
}
