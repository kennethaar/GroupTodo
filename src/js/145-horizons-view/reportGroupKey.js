function reportGroupKey(r, by) {
  if (by === "project") return r.project || "No project";
  if (by === "person")  return r.who || "Nobody named";
  if (by === "month")   return String(r.when).slice(0, 7);
  return r.org || "No customer";
}
