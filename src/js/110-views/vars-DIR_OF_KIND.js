/* The pages as cards, one column per kind. Dragging a card into another
   column changes what it is: the file moves into that kind's folder and every
   link to it is rewritten, exactly as the move dialog does it. A card dropped
   on a space tab moves into that space; hold ctrl to copy it there instead. */
const DIR_OF_KIND = {org: DIRS.orgs, person: DIRS.people, context: DIRS.contexts, zettel: DIRS.zettel, area: DIRS.areas};
const BOARD_KIND_COLUMNS = ["person", "org", "context", "area", "zettel"];
const dirPagesInVisible = kind =>
  acrossSpaces(() => allPages(q => pageKind(q) === kind).map(path => ({path, space: V.space})));
