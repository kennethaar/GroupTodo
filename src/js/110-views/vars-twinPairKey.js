const twinPairKey = (a, b) => [twinNorm(a), twinNorm(b)].sort().join("\u0001");
const twinNotSame = () => { try { return new Set(JSON.parse(PREF.get("twins.not", "[]"))); } catch (_) { return new Set(); } };
/* Every name against every other is the slow part of drawing Projects, and it
   only depends on the names, so the answer is kept until one of them changes. */
let TWINS_KEPT = null;
