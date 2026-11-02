const flyOptsOf = r => {
  const q = trim(FLY.q || "").toLowerCase();
  return (r.opts || []).filter(([v, l]) => !q || l.toLowerCase().includes(q));
};
