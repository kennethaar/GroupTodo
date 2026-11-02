/* ============================================================
   40_VERBS -- the Phys-Viz rule
   Port of: init.lua 50_VERB_SYSTEM
   pages/verbs/<lang>/<canonical>.md holds lines "synonym = canonical".
   A next action must START with a physical, visible verb.
   ============================================================ */
let VERB_LOOKUP = {};      // synonym -> canonical
let VERB_CANON  = {};      // canonical -> {lang, path, synonyms[]}
