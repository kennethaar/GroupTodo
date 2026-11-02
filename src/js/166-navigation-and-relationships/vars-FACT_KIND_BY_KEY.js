/* ============================================================
   166_NAVIGATION_AND_RELATIONSHIPS
   Filling in a page's empty values, turning a line or page into another
   kind with one key, the list of every page, and the board of what is a
   child of what.
   ============================================================ */

/* ---------- a value that is not there yet ----------
   An empty fact still gets a pill, and the pill asks for the value. Keys that
   name a kind of page -- a person, an organisation, a context, a project --
   offer the pages of that kind; anything else offers the values the vault
   already uses for that key, so a typo does not start a second spelling. */
const FACT_KIND_BY_KEY = {
  waiting_for: "person", "waiting-for": "person", assigned: "person", person: "person",
  people: "person", owner: "person", org: "org", organisation: "org", organization: "org",
  context: "context", project: "project", note: "zettel", zettel: "zettel",
};

/* An email, a phone number or an address belongs to the one page it is on,
   so another page's is never the right choice: these are written, not
   picked (#194). */
const OWN_VALUE_KEY_RE = /mail|epost|teams|^(phone|tel|telephone|telefon|mobile|mobil|cell|sms|address|adresse|adress|addr|geo|location|coords|position|sted|url|web|website|homepage|linkedin)$/;
