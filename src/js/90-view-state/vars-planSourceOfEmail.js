const planSourceOfEmail = path =>
  ({space: V.space, kind: "email", path, ids: [], text: planEmailText(path), project: null});

/* Words of four letters or more, cut to their first six so "release" and
   "releases" -- or "forretningsenhet" and "forretningsenheten" -- meet. */
const PLAN_STOP = new Set(`with that this from have about what when will they them your their there been were which would
  could should into than then some more also just only like make need know here over thanks please regards dear
  skal være ikke også eller etter denne dette bare noen hvis hvor blir hadde sine sitt deres våre kommer gjøre
  takk hilsen vennlig`.split(/\s+/));
