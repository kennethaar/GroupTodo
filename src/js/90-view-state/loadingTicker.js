function loadingTicker(record, total) {
  const st = {done: 0, total, last: []};
  LOADING.set(record.name, st);
  paintLoading();
  return path => {
    st.done++;
    st.last.unshift(path);
    if (st.last.length > 12) st.last.length = 12;
    paintLoading();
  };
}
