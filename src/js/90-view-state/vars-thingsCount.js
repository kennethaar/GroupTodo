const thingsCount = entries => {
  const n = entries.reduce((s, e) => s + e.items.length, 0);
  return n === 1 ? "1 new thing" : n + " new things";
};
