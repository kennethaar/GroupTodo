function saveRoutineSchedule(path, {spec, starts, ends, time}) {
  const page = getPage(path); if (!page) return;
  const props = page.props;
  const drop = k => { for (const o of Object.keys(props)) if (o.toLowerCase() === k) delete props[o]; };
  const before = trim(props.ends || "");
  props.cadence = spec || "as needed";
  for (const k of ["starts", "ends", "time"]) drop(k);
  if (spec) {
    if (starts) props.starts = "[[" + starts + "]]";
    if (ends) props.ends = ends;
    if (time) props.time = time;
  }
  // "after 10 times" counts from when it was said.
  if (trim(props.ends || "") !== before) drop("runs");
  touch(path);
}
