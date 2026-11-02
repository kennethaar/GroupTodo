/* The words of a line, written back when you leave it. A name written out in
   full becomes a link, and on a task a date at the end of the line becomes
   its due date -- the line keeps reading as you wrote it. */
/* The people a line links to, as [[p/Name]], by the key names are compared on. */
const personLinksOf = title => new Set([...String(title || "").matchAll(/\[\[p\/([^\]]+?)(?:\]\[[^\]]*)?\]\]/g)]
  .map(m => slugPerson(m[1])));
