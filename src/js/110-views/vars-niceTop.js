const niceTop = x => {
  const p = Math.pow(10, Math.floor(Math.log10(x)));
  return [1, 2, 2.5, 5, 10].map(m => m * p).find(v => v >= x);
};
