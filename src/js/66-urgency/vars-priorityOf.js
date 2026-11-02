const priorityOf = b => {
  const v = trim(blockProp(b, "priority") || "").toUpperCase();
  return /^(H|HIGH|HØY)$/.test(v) ? "H" : /^(M|MED|MEDIUM|MIDDELS)$/.test(v) ? "M" : /^(L|LOW|LAV)$/.test(v) ? "L" : null;
};
