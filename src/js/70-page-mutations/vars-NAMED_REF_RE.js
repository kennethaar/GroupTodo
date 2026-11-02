/* ============================================================
   70_PAGE_MUTATIONS
   Port of: init.lua 65_PROJECT_STATUS_MOVE + 75_REFILE_AND_TELEPORT
   ============================================================ */
/* Point every reference to oldRef at newRef. A reference is a wiki link in
   any of its spellings -- [[x]], [[x][label]], [[x|label]], [[x#heading]],
   [[x#^task]] -- or a #tag. The label and the fragment are kept; only the
   page part changes. Whole links are consumed first, so a #word inside a
   link's label is never mistaken for a tag. */
const NAMED_REF_RE = /\[\[([^\]]+)\](?:\[([^\]]*)\])?\]|(^|[\s(])#([\p{L}\p{N}_\-/]+)/gu;
const BARE_TAG_RE = /^[\p{L}\p{N}_\-/]+$/u;
