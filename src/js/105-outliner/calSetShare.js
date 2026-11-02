/* One meeting, shown where these areas say from now on. */
function calSetShare(b, areas, also) {
  const same = areas.length === also.length && areas.every(n => also.includes(n));
  setOrDropProp(b, "cal_share", same ? "" : areas.length ? areas.join(", ") : "-");
}
