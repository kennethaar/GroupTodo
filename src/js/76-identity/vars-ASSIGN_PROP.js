/* ============================================================
   WHO IS IT FOR
   Every task belongs to somebody, and by default that is you. The interesting
   case is handing one over, and there are two quite different handovers:

     to someone in this space   they own it now. It stays a live task, in
                                their name, and because you wrote it the item
                                turns up in your Waiting for -- the same row,
                                seen from your side, not a copy.

     to anyone else             they cannot see it and cannot tick it off, so
                                calling it a task would be a lie. It becomes a
                                WAIT: something you are waiting on a person for.

   A "member" is simply a person page marked member:: true. Naming yourself
   creates yours; opening a space somebody shared shows theirs.
   ============================================================ */
const ASSIGN_PROP = "assigned";
const samePerson = (a, b) => !!a && !!b && slugPerson(a) === slugPerson(b);

const personPath = name => join(DIRS.people, trim(name).replace(/[\/]/g, "-") + ".md");
const personName = path => baseName(path);
