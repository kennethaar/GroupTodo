function mergeColOrder(saved, natural) {
  const out = saved.slice();
  natural.forEach((k, i) => {
    if (!out.includes(k)) out.splice(i ? out.indexOf(natural[i - 1]) + 1 : 0, 0, k);
  });
  return out;
}
