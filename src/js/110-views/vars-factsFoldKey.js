/* The values fold away under one line, so the page starts with its lines and
   not a screen of key:: value. Whether a kind of page starts folded is a
   setting (in Help); folding or unfolding one page is remembered, and every
   other page opens the same way after it, through a reload. */
const factsFoldKey = kind => "facts.fold." + kind;
const factsFoldedByDefault = kind => PREF.get(factsFoldKey(kind), "1") !== "0";
const factsFolded = path => factsFoldedByDefault(pageKind(path));
