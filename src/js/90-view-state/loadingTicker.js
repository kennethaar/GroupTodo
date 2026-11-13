function loadingTicker(record, total) {
  const st = {done: 0, total, last: []};
  LOADING.set(record.name, st);
  paintLoading();
  const tick = path => {
    st.done++;
    st.last.unshift(path);
    if (st.last.length > 12) st.last.length = 12;
    paintLoading();
  };
  // More files found to read after it started: the day folders listed late.
  tick.add = n => { st.total += n; paintLoading(); };
  return tick;
}
