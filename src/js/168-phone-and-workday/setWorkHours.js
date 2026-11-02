function setWorkHours(start, end) {
  const me = whoAmI();
  const val = start && end ? start + "-" + end : "";
  const old = workHours();
  const days = old && /[a-z]/i.test(old.raw) ? " " + old.raw.replace(/^[\d:\s-]+/, "") : "";
  const page = me && getPage(personPath(me));
  if (page) {
    if (val) page.props.work_hours = val + days;
    else delete page.props.work_hours;
    touch(personPath(me));
  } else PREF.set("work_hours", val);
}
