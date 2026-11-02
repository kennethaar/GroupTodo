function addStakeholder(path, to) {
  const page = getPage(path);
  const key = Object.keys(page?.props || {}).find(k => STAKE_PROPS.includes(k.toLowerCase())) || "stakeholder";
  return pageLinkPropAdd(path, key, stakeRef(to));
}
