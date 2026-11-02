const toldOn = (path, to) => {
  for (const [ref, at] of toldMap(path)) {
    const org = /^o\//i.test(ref);
    if (sameStake({name: ref.slice(2), org}, to)) return (at.match(/\d{4}-\d{2}-\d{2}/) || [])[0];
  }
  return null;
};
