/* ============================================================
   10_MARKDOWN -- parse / serialize
   The org outline (*, **, ***) becomes a markdown bullet outline.
   Org "#+key: value"  ->  "key:: value" page properties.
   Org "Added: [[d]]"  ->  "Added:: [[d]]" block property.
   ============================================================ */
// Any language's letters in a key, so tracker-knebøy:: is a value too.
const PROP_RE   = /^(\p{L}[\p{L}\p{N}_-]*)::\s*(.*)$/u;
// The text is optional: an empty line is saved as a bare "-", and has to read
// back as an empty line, not as a "-" in the note of the line above it.
const BULLET_RE = /^(\s*)[-*+](?:\s+(.*))?$/;
