function estTier(title) {
  const tags = tagsIn(title).map(t => t.toLowerCase());
  for (let n = 1; n < EST_TAGS.length; n++) if (tags.includes(EST_TAGS[n])) return n;
  return 0;
}
